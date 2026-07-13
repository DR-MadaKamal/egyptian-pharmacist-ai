import fs from 'fs'
import path from 'path'
import { createRequire } from 'module'

const DRUGS_FILE = path.resolve('src/data/drugs.js')
const SUPP_OUT = path.resolve('src/data/eda-supplement.js')

const EDA_INDEX_FILE = process.argv[2] || path.resolve('public/data/eda-drugs.json')
const MOHMED_FILE = process.argv[3] || null

const norm = s => s?.toLowerCase().replace(/[^a-z0-9+\s]/g, '').trim().replace(/\s+/g, ' ') || ''

async function main() {
  // Read enriched drugs
  const drugsJs = fs.readFileSync(DRUGS_FILE, 'utf-8')
  const match = drugsJs.match(/export\s+const\s+drugs\s*=\s*(\[[\s\S]*?\]);/)
  if (!match) { console.error('Could not parse drugs.js'); process.exit(1) }
  const drugs = JSON.parse(match[1])

  // Read EDA index (already deduplicated with brands)
  const edaIndex = JSON.parse(fs.readFileSync(EDA_INDEX_FILE, 'utf-8'))

  // Index EDA index by scientific name (normalized)
  const edaBySci = {}
  for (const entry of edaIndex) {
    const key = norm(entry.s)
    if (key) edaBySci[key] = entry
  }

  // Also load raw EDA data for fallback matching
  let rawEda = []
  const rawEdaFile = process.argv[3] || path.resolve('..', '..', 'C:\\Users\\mada_\\AppData\\Local\\Temp\\opencode\\egyptian-drugs.json')
  if (fs.existsSync(rawEdaFile)) {
    rawEda = JSON.parse(fs.readFileSync(rawEdaFile, 'utf-8'))
  }

  // Index raw EDA by scientific name for rich matching
  const rawBySci = {}
  for (const r of rawEda) {
    const key = norm(r.scientific_name || '')
    if (key) {
      if (!rawBySci[key]) rawBySci[key] = []
      rawBySci[key].push(r)
    }
  }

  const supplement = []

  for (const drug of drugs) {
    const entry = {
      id: drug.id,
      nameEn: drug.nameEn,
      nameAr: drug.nameAr,
      prices: drug.prices || [],
      brandAliases: [],
      edaPrices: [],
      edaManufacturers: [],
      verified: false,
    }

    const nameKey = norm(drug.nameEn)

    // Strategy 1: Match by scientific name in EDA index
    let matchedSciKeys = Object.keys(edaBySci).filter(k => k.includes(nameKey) || nameKey.includes(k))

    // Strategy 2: Match by scientific name in raw EDA
    if (matchedSciKeys.length === 0) {
      matchedSciKeys = Object.keys(rawBySci).filter(k => k.includes(nameKey) || nameKey.includes(k))
    }

    // Strategy 3: Search EDA brand names for the drug name (catches trade names like Augmentin)
    if (matchedSciKeys.length === 0) {
      matchedSciKeys = Object.keys(edaBySci).filter(k => {
        const entry = edaBySci[k]
        return entry.b && entry.b.some(b => {
          const clean = b.replace(/\s*\(.*?\)/g, '').trim().toLowerCase()
          return clean === nameKey || clean.includes(nameKey) || nameKey.includes(clean)
        })
      })
    }

    if (matchedSciKeys.length > 0) {
      entry.verified = true
      const seenBrands = new Set()

      // Collect brands from EDA index
      for (const sciKey of matchedSciKeys) {
        const idxEntry = edaBySci[sciKey]
        if (idxEntry?.b) {
          for (const brand of idxEntry.b) {
            const clean = brand.replace(/\s*\(.*?\)/g, '').trim()
            if (clean && !seenBrands.has(clean)) {
              seenBrands.add(clean)
              entry.brandAliases.push({ en: clean, ar: '' })
            }
          }
        }
      }

      // Also collect from raw EDA for extra brands
      if (matchedSciKeys.length > 0) {
        for (const sciKey of matchedSciKeys) {
          const records = rawBySci[sciKey] || []
          for (const r of records) {
            const be = (r.commercial_name_en || '').replace(/\s*\(.*?\)/g, '').trim()
            if (be && !seenBrands.has(be)) {
              seenBrands.add(be)
              entry.brandAliases.push({ en: be, ar: (r.commercial_name_ar || '').trim() })
            }
          }
        }
      }

      // Collect prices and manufacturers
      const allPrices = []
      const allMfrs = new Set()
      for (const sciKey of matchedSciKeys) {
        const records = rawBySci[sciKey] || []
        for (const r of records) {
          if (r.price_egp) allPrices.push(r.price_egp)
          if (r.manufacturer) allMfrs.add(r.manufacturer)
        }
      }
      entry.edaPrices = [...new Set(allPrices)].sort((a, b) => a - b)
      entry.edaManufacturers = [...allMfrs]
    }

    // Limit brand aliases to 50 most relevant (prioritize shorter names)
    entry.brandAliases = entry.brandAliases
      .sort((a, b) => a.en.length - b.en.length)
      .slice(0, 50)
    supplement.push(entry)
  }

  const verified = supplement.filter(e => e.verified).length
  const totalAliases = supplement.reduce((s, e) => s + e.brandAliases.length, 0)
  console.log(`Supplement: ${verified}/${supplement.length} matched, ${totalAliases} total brand aliases`)

  // Show some stats per drug
  const withMany = supplement.filter(e => e.brandAliases.length > 5).sort((a, b) => b.brandAliases.length - a.brandAliases.length)
  console.log('Top 10 drugs by brand aliases:')
  withMany.slice(0, 10).forEach(e => console.log(`  ${e.nameEn}: ${e.brandAliases.length} aliases`))

  const out = `// Auto-generated from Egyptian Drug Authority (EDA) database
// Source: https://github.com/karem505/egyptian-drug-database
// Last updated: ${new Date().toISOString().split('T')[0]}

export const edaSupplement = ${JSON.stringify(supplement, null, 2)};
`
  fs.writeFileSync(SUPP_OUT, out, 'utf-8')
  console.log(`Written ${SUPP_OUT}`)
}

main().catch(console.error)
