import { healthCheck } from '../utils/health-check.mjs'

export async function consumeSimilars(source) {
  const result = await healthCheck(source.url, 'EDA Similars Database', { timeout: 15000 })
  return {
    status: result.reachable ? 'reachable' : 'unreachable',
    url: source.url,
    healthCheck: result,
    note: 'Web search only. Could supplement eda-drugs.json with alternative product suggestions.',
  }
}
