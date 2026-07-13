import fs from 'fs'
import path from 'path'

const EDA_FILE = path.resolve('public/data/eda-drugs.json')
const RAW_FILE = process.argv[2] || path.resolve('C:\\Users\\mada_\\AppData\\Local\\Temp\\opencode\\egyptian-drugs.json')

async function main() {
  const data = JSON.parse(fs.readFileSync(EDA_FILE, 'utf-8'))
  const raw = fs.existsSync(RAW_FILE) ? JSON.parse(fs.readFileSync(RAW_FILE, 'utf-8')) : []

  const drugs = data.filter(d => d.t !== 'non-drug')
  const nonDrugs = data.filter(d => d.t === 'non-drug')

  // Build raw data maps for cross-referencing
  const brandToMfr = new Map()  // brand -> Set of manufacturers
  const brandToSci = new Map()  // brand -> Set of scientific names
  for (const r of raw) {
    const brand = (r.commercial_name_en || '').replace(/\s*\(.*?\)/g, '').trim()
    if (brand) {
      if (!brandToMfr.has(brand)) brandToMfr.set(brand, new Set())
      if (r.manufacturer && r.manufacturer.trim()) {
        brandToMfr.get(brand).add(r.manufacturer.trim())
      }
      if (r.scientific_name && r.scientific_name.trim()) {
        if (!brandToSci.has(brand)) brandToSci.set(brand, new Set())
        brandToSci.get(brand).add(r.scientific_name.trim())
      }
    }
  }

  let mfrFixed = 0
  let constFixed = 0

  for (const d of drugs) {
    // Enrich missing manufacturers by looking up brand names in raw data
    if (!d.m || d.m.length === 0) {
      const foundMfrs = new Set()
      for (const b of (d.b || [])) {
        const mfrs = brandToMfr.get(b)
        if (mfrs) {
          for (const m of mfrs) foundMfrs.add(m)
        }
      }
      if (foundMfrs.size > 0) {
        d.m = [...foundMfrs].slice(0, 3)
        mfrFixed++
      }
    }

    // Enrich missing constituents by checking raw data entries with same scientific name
    if (!d.c || d.c.length === 0) {
      const rawEntries = raw.filter(r => {
        const sci = (r.scientific_name || '').trim().toUpperCase()
        const key = d.s.toUpperCase()
        return sci === key || sci.startsWith(key) || key.startsWith(sci)
      })
      const consts = new Set()
      for (const r of rawEntries) {
        if (r.scientific_name && r.scientific_name.trim()) {
          const parts = r.scientific_name.split('+')
          for (const p of parts) {
            const clean = p.replace(/\s*\(.*?\)/g, '').trim()
            if (clean && clean.length > 2 && !/^\d/.test(clean)) {
              consts.add(clean)
            }
          }
        }
      }
      if (consts.size > 0) {
        d.c = [...consts].slice(0, 10)
        constFixed++
      }
    }
  }

  const out = [...drugs, ...nonDrugs]
  fs.writeFileSync(EDA_FILE, JSON.stringify(out), 'utf-8')

  console.log(`Enrichment complete:`)
  console.log(`  Manufacturers filled: ${mfrFixed}`)
  console.log(`  Constituents filled: ${constFixed}`)
  console.log(`  Total entries: ${out.length}`)
}

main().catch(err => {
  console.error('Enrichment failed:', err)
  process.exit(1)
})
