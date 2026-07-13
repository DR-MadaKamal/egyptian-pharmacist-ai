import fs from 'fs'
import path from 'path'

const DRUGS_FILE = path.resolve('src/data/drugs.js')
const EDA_FILE = process.argv[2] || path.resolve('..', '..', 'C:\\Users\\mada_\\AppData\\Local\\Temp\\opencode\\egyptian-drugs.json')
const OUT_FILE = path.resolve('src/data/eda-supplement.js')

const norm = s => s?.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim().replace(/\s+/g, ' ') || ''

async function main() {
  // Read drugs from JS module
  const drugsJs = fs.readFileSync(DRUGS_FILE, 'utf-8')
  const match = drugsJs.match(/export\s+const\s+drugs\s*=\s*(\[[\s\S]*?\]);/)
  if (!match) { console.error('Could not parse drugs.js'); process.exit(1) }
  const drugs = JSON.parse(match[1])

  // Read EDA data
  let eda
  if (EDA_FILE.startsWith('http')) {
    const res = await fetch(EDA_FILE)
    eda = await res.json()
  } else {
    eda = JSON.parse(fs.readFileSync(EDA_FILE, 'utf-8'))
  }

  // Index EDA data
  const edaByName = {}
  const edaBySci = {}
  for (const r of eda) {
    const sci = norm(r.scientific_name || '')
    if (sci) {
      if (!edaBySci[sci]) edaBySci[sci] = []
      edaBySci[sci].push(r)
    }
    for (const field of ['commercial_name_en', 'commercial_name_ar']) {
      const parts = (r[field] || '').split(/\s+/)
      for (let i = 0; i < Math.min(parts.length, 3); i++) {
        const key = norm(parts.slice(0, i + 1).join(' '))
        if (key && key.length >= 3) {
          if (!edaByName[key]) edaByName[key] = []
          edaByName[key].push(r)
        }
      }
    }
  }

  // Cross-reference each drug
  const supplement = []
  for (const drug of drugs) {
    const entry = {
      id: drug.id, nameEn: drug.nameEn, nameAr: drug.nameAr,
      prices: drug.prices || [],
      brandAliases: [], edaPrices: [], edaManufacturers: [], verified: false
    }

    const nameKey = norm(drug.nameEn)
    let matches = []
    const firstWord = nameKey.split(/\s+/)[0]
    if (firstWord && firstWord.length >= 3) matches = edaByName[firstWord] || []

    if (matches.length === 0) {
      const words = nameKey.split(/\s+/)
      for (let len = Math.min(words.length, 3); len >= 2; len--) {
        const combo = norm(words.slice(0, len).join(' '))
        if (combo.length >= 4) {
          matches = edaByName[combo] || []
          if (matches.length > 0) break
        }
      }
    }

    if (matches.length > 5) {
      matches = matches.filter(m => {
        const mn = norm(m.commercial_name_en)
        return mn.includes(firstWord) || norm(m.commercial_name_ar).includes(firstWord)
      })
    }

    if (matches.length === 0) {
      const sciMatch = Object.entries(edaBySci).filter(([k]) => k.includes(nameKey))
      if (sciMatch.length > 0) {
        const seen = new Set()
        matches = sciMatch.flatMap(([, v]) => v).filter(m => {
          const key = m.commercial_name_en + m.manufacturer
          return seen.has(key) ? false : (seen.add(key), true)
        })
      }
    }

    if (matches.length > 0) {
      entry.verified = true
      const seen = new Set()
      for (const m of matches) {
        const be = (m.commercial_name_en || '').trim()
        if (be && !seen.has(be)) {
          seen.add(be)
          entry.brandAliases.push({ en: be, ar: (m.commercial_name_ar || '').trim() })
        }
      }
      entry.edaPrices = [...new Set(matches.map(m => m.price_egp).filter(p => p != null))].sort((a, b) => a - b)
      entry.edaManufacturers = [...new Set(matches.map(m => m.manufacturer).filter(Boolean))]
    }
    supplement.push(entry)
  }

  const verified = supplement.filter(e => e.verified).length
  console.log(`Matched: ${verified}/${supplement.length}`)

  const out = `// Auto-generated from Egyptian Drug Authority (EDA) database
// Source: https://github.com/karem505/egyptian-drug-database
// Last updated: ${new Date().toISOString().split('T')[0]}

export const edaSupplement = ${JSON.stringify(supplement, null, 2)};
`

  fs.writeFileSync(OUT_FILE, out, 'utf-8')
  console.log(`Written ${OUT_FILE}`)
}

main().catch(console.error)
