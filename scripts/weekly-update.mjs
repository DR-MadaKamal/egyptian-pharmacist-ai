#!/usr/bin/env node
// Weekly database update script
// Usage: node scripts/weekly-update.mjs [--force]

import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const DB_FILE = path.join(ROOT, 'public', 'data', 'drugs-database.json')
const META_FILE = path.join(ROOT, 'public', 'data', 'drugs-database-meta.json')
const FORCE = process.argv.includes('--force')

function log(msg) {
  console.log(`[${new Date().toISOString()}] ${msg}`)
}

function getGitStatus() {
  try {
    return execSync('git status --porcelain', { cwd: ROOT, encoding: 'utf8' }).trim()
  } catch {
    return ''
  }
}

function gitCommit(msg) {
  try {
    execSync('git add public/data/drugs-database.json public/data/drugs-database-meta.json', { cwd: ROOT })
    execSync(`git commit -m "${msg}"`, { cwd: ROOT })
    log('Committed: ' + msg)
    return true
  } catch (e) {
    log('Commit failed: ' + e.message)
    return false
  }
}

function gitPush() {
  try {
    execSync('git push origin main', { cwd: ROOT, timeout: 60000 })
    log('Pushed to origin/main')
    return true
  } catch (e) {
    log('Push failed (will retry): ' + e.message)
    return false
  }
}

async function main() {
  log('═══ Weekly Database Update Started ═══')

  // Check if database exists
  if (!fs.existsSync(DB_FILE) && !FORCE) {
    log('No existing database found. Run build-database.mjs first.')
    process.exit(1)
  }

  // Get current stats before update
  let oldMeta = {}
  try {
    oldMeta = JSON.parse(fs.readFileSync(META_FILE, 'utf8'))
  } catch {}
  const oldCount = oldMeta.totalDrugs || 0
  const oldVersion = oldMeta.version || 'unknown'
  log(`Previous database: ${oldCount} drugs, version ${oldVersion}`)

  // Check for uncommitted changes
  const status = getGitStatus()
  if (status && !FORCE) {
    log('Warning: Uncommitted changes detected. Use --force to proceed anyway.')
    // Continue anyway for automated runs
  }

  // Run the build script
  log('Running build-database.mjs...')
  try {
    execSync('node scripts/build-database.mjs', {
      cwd: ROOT,
      stdio: 'inherit',
      timeout: 120000,
    })
  } catch (e) {
    log('Build failed: ' + e.message)
    process.exit(1)
  }

  // Compare results
  let newMeta = {}
  try {
    newMeta = JSON.parse(fs.readFileSync(META_FILE, 'utf8'))
  } catch {}
  const newCount = newMeta.totalDrugs || 0
  const priceChange = (newMeta.withPrices || 0) - (oldMeta.withPrices || 0)
  const drugChange = newCount - oldCount

  log(`\n═══ Update Results ═══`)
  log(`Drugs: ${oldCount} → ${newCount} (${drugChange >= 0 ? '+' : ''}${drugChange})`)
  log(`With prices: ${newMeta.withPrices || 0} (${priceChange >= 0 ? '+' : ''}${priceChange})`)
  log(`With indications: ${newMeta.withIndications || 0}`)
  log(`With pharmacology: ${newMeta.withPharmacology || 0}`)

  // Only commit if there are changes
  const newStatus = getGitStatus()
  if (!newStatus) {
    log('No changes detected. Database is up to date.')
    return
  }

  // Commit
  const date = new Date().toISOString().split('T')[0]
  const commitMsg = `chore: weekly database update ${date}\n\n- Total drugs: ${newCount} (${drugChange >= 0 ? '+' : ''}${drugChange})\n- With prices: ${newMeta.withPrices || 0}\n- Updated from karem505 + EDA sources`
  
  if (gitCommit(commitMsg)) {
    // Try to push
    if (!gitPush()) {
      log('Push will be handled by GitHub Actions or manual push.')
    }
  }

  log('\n═══ Weekly Update Complete ═══')
}

main().catch(e => {
  log('Fatal error: ' + e.message)
  process.exit(1)
})
