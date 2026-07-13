import { healthCheck } from '../utils/health-check.mjs'

export async function consumeSearchLicenses(source) {
  const result = await healthCheck(source.url, 'Search Licenses Database', { timeout: 15000 })
  return {
    status: result.reachable ? 'reachable' : 'unreachable',
    url: source.url,
    healthCheck: result,
    note: 'Web search only; no machine-readable API available.',
  }
}
