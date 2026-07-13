import { healthCheck } from '../utils/health-check.mjs'

export async function consumeHerbalMonograph(source) {
  const portal = await healthCheck(source.url, 'Herbal Monograph Portal', { timeout: 15000 })
  const pdf = source.pdfUrl ? await healthCheck(source.pdfUrl, 'Herbal Monograph PDF', { timeout: 30000 }) : null
  return {
    status: portal.reachable ? 'reachable' : 'unreachable',
    url: source.url,
    healthCheck: { portal, pdf },
    note: 'PDF download available at ' + source.pdfUrl + '. PDF text extraction needed for structured data.',
  }
}
