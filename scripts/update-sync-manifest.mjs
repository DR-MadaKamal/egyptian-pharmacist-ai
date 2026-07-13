import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const MANIFEST_FILE = path.resolve(__dirname, '..', 'public/data/sync-manifest.json')

async function main() {
  const { dataSources } = await import('../src/config/data-sources.js')

  const sources = {}
  for (const s of dataSources) {
    sources[s.id] = {
      id: s.id,
      nameEn: s.nameEn,
      nameAr: s.nameAr,
      url: s.url,
      type: s.type,
      status: s.status,
      syncFrequency: s.syncFrequency,
      currentlyConsumed: s.currentlyConsumed,
      lastSync: s.currentlyConsumed ? new Date().toISOString() : s.lastSync,
      dataFields: s.dataFields,
      reachable: null,
    }
  }

  const manifest = {
    lastSync: new Date().toISOString(),
    sources,
    summary: {
      totalSources: dataSources.length,
      active: dataSources.filter(s => s.status === 'active').length,
      consumed: dataSources.filter(s => s.currentlyConsumed).length,
      pending: dataSources.filter(s => s.status === 'active' && !s.currentlyConsumed).length,
      ok: 0,
      failed: 0,
    },
  }

  fs.mkdirSync(path.dirname(MANIFEST_FILE), { recursive: true })
  fs.writeFileSync(MANIFEST_FILE, JSON.stringify(manifest, null, 2))
  console.log(`Sync manifest written to ${MANIFEST_FILE}`)
  console.log(`Total sources: ${manifest.summary.totalSources}`)
  console.log(`Active: ${manifest.summary.active}`)
  console.log(`Currently consumed: ${manifest.summary.consumed}`)
  console.log(`Pending integration: ${manifest.summary.pending}`)
}

main().catch(console.error)
