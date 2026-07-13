import { consumeAllSources } from './consumers/index.mjs'
import { dataSources } from '../src/config/data-sources.js'
import fs from 'fs'
import path from 'path'

async function main() {
  console.log('=== Consumer All Data Sources ===\n')
  const results = await consumeAllSources()

  console.log(`\n--- Summary ---`)
  const ok = results.filter(r => r.status === 'ok' || r.status === 'reachable')
  const failed = results.filter(r => r.status === 'error' || r.status === 'unreachable')
  console.log(`OK: ${ok.length}/${results.length}, Failed: ${failed.length}/${results.length}`)

  if (failed.length > 0) {
    console.log(`Failed sources:`)
    failed.forEach(r => console.log(`  [${r.sourceId}] ${r.status}${r.error ? ' - ' + r.error : ''}`))
  }

  // Update sync manifest
  const manifestPath = path.resolve('public/data/sync-manifest.json')
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'))
  for (const r of results) {
    if (r.healthCheck) {
      manifest.sources[r.sourceId] = {
        ...manifest.sources[r.sourceId],
        lastSync: r.timestamp,
        reachable: r.healthCheck.reachable ?? (r.status === 'ok'),
        status: r.status,
      }
    } else {
      manifest.sources[r.sourceId] = {
        ...manifest.sources[r.sourceId],
        lastSync: r.timestamp,
        status: r.status,
      }
    }
  }
  manifest.lastSync = new Date().toISOString()
  manifest.summary.totalSources = dataSources.length
  manifest.summary.ok = ok.length
  manifest.summary.failed = failed.length
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8')
  console.log(`\nManifest updated: ${manifestPath}`)
}

main().catch(err => {
  console.error('Consume all sources failed:', err)
  process.exit(1)
})
