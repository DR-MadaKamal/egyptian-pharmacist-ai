import { dataSources } from '../../src/config/data-sources.js'
import { consumeEddb } from './eddb.mjs'
import { consumeReleasedBatches } from './released-batches.mjs'
import { consumeHerbalMonograph } from './herbal-monograph.mjs'
import { consumeSearchLicenses } from './search-licenses.mjs'
import { consumeSimilars } from './similars.mjs'
import { consumeWebPortal } from './web-portal.mjs'

const consumers = {
  'eddb': consumeEddb,
  'released-batches': consumeReleasedBatches,
  'herbal-monograph': consumeHerbalMonograph,
  'search-licenses': consumeSearchLicenses,
  'similars': consumeSimilars,
  'service-portal': () => consumeWebPortal('service-portal'),
  'public-identity': () => consumeWebPortal('public-identity'),
  'variation-tool': () => consumeWebPortal('variation-tool'),
  'api-search': () => consumeWebPortal('api-search'),
  'egyptian-pharmacopoeia': () => consumeWebPortal('egyptian-pharmacopoeia'),
  'cosmetics-egycosma': () => consumeWebPortal('cosmetics-egycosma'),
  'medical-device': () => consumeWebPortal('medical-device'),
  'track-and-trace': () => consumeWebPortal('track-and-trace'),
  'pricing-submission': () => consumeWebPortal('pricing-submission'),
  'naming-checker': () => consumeWebPortal('naming-checker'),
}

export async function consumeSource(sourceId) {
  const source = dataSources.find(s => s.id === sourceId)
  if (!source) throw new Error(`Unknown source: ${sourceId}`)
  const consumer = consumers[sourceId]
  if (!consumer) throw new Error(`No consumer for source: ${sourceId}`)
  const result = await consumer(source)
  return { sourceId, ...result, timestamp: new Date().toISOString() }
}

export async function consumeAllSources() {
  const results = []
  for (const source of dataSources) {
    try {
      const result = await consumeSource(source.id)
      results.push(result)
      console.log(`[${source.id}] OK - ${result.status}`)
    } catch (err) {
      results.push({ sourceId: source.id, status: 'error', error: err.message, timestamp: new Date().toISOString() })
      console.error(`[${source.id}] FAIL - ${err.message}`)
    }
  }
  return results
}
