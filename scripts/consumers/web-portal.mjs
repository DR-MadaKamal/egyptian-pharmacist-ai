import { healthCheck } from '../utils/health-check.mjs'

export async function consumeWebPortal(sourceId) {
  const { dataSources } = await import('../../src/config/data-sources.js')
  const source = dataSources.find(s => s.id === sourceId)
  if (!source) throw new Error(`Unknown source: ${sourceId}`)
  const result = await healthCheck(source.url, source.nameEn, { timeout: 15000 })
  return {
    status: result.reachable ? 'reachable' : 'unreachable',
    url: source.url,
    healthCheck: result,
    note: `Web portal (${source.type}). Requires authenticated session or browser automation for structured data.`,
  }
}
