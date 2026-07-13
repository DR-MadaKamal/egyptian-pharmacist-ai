import fs from 'fs'
import path from 'path'

const EDA_URL = 'https://raw.githubusercontent.com/karem505/egyptian-drug-database/main/data/egyptian-drugs.json'
const EDA_FILE = process.argv[2] || resolveEdaPath()
const OUT_DIR = path.resolve('public/data')
const OUT_FILE = path.join(OUT_DIR, 'eda-drugs.json')

function resolveEdaPath() {
  const local = path.resolve('..', '..', 'C:\\Users\\mada_\\AppData\\Local\\Temp\\opencode\\egyptian-drugs.json')
  if (fs.existsSync(local)) return local
  return EDA_URL
}

async function main() {
  let eda
  if (EDA_FILE.startsWith('http')) {
    const res = await fetch(EDA_FILE)
    eda = await res.json()
  } else {
    eda = JSON.parse(fs.readFileSync(EDA_FILE, 'utf-8'))
  }

  const map = new Map()
  for (const r of eda) {
    // Use scientific_name if available, fall back to commercial_name_en
    const raw = (r.scientific_name || r.commercial_name_en || '').trim()
    const key = raw.toUpperCase().replace(/\s+/g, ' ').trim()
    if (!key) continue

    if (!map.has(key)) {
      map.set(key, { brands: new Set(), mfrs: new Set(), prices: [], routes: new Set(), constituents: [] })
    }
    const d = map.get(key)
    const brand = r.commercial_name_en.replace(/\s*\(.*?\)/g, '').trim()
    if (brand) d.brands.add(brand)
    if (r.manufacturer) d.mfrs.add(r.manufacturer)
    if (r.price_egp) d.prices.push(r.price_egp)
    if (r.route) d.routes.add(r.route)

    // Extract individual constituents from scientific_name (for multi-ingredient drugs)
    if (r.scientific_name) {
      const parts = r.scientific_name.split('+').map(s => s.replace(/\s*\(.*?\)/g, '').trim()).filter(Boolean)
      for (const p of parts) d.constituents.push(p)
    }
  }

  const out = Array.from(map.entries()).map(([key, d]) => {
    const brands = [...d.brands].filter(b => b).sort((a, b) => a.length - b.length).slice(0, 15)
    const mfrs = [...d.mfrs].filter(Boolean).slice(0, 3)
    const prices = d.prices.length > 0 ? [Math.min(...d.prices), Math.max(...d.prices)] : []
    const routes = [...d.routes].filter(Boolean)
    // Constituents (unique, cleaned)
    const consts = [...new Set(d.constituents.map(s => s.replace(/\s*\(.*?\)/g, '').trim()).filter(Boolean))].slice(0, 10)
    const o = { s: key }
    if (brands.length) o.b = brands
    if (mfrs.length) o.m = mfrs
    if (prices.length) o.p = prices
    if (routes.length) o.r = routes
    if (consts.length) o.c = consts
    return o
  })

  fs.mkdirSync(OUT_DIR, { recursive: true })
  fs.writeFileSync(OUT_FILE, JSON.stringify(out), 'utf-8')
  console.log(`Generated ${OUT_FILE}: ${out.length} drugs (${Math.round(Buffer.byteLength(JSON.stringify(out), 'utf-8') / 1024)} KB)`)
  console.log(`Covered: ${out.length} unique entries from ${eda.length} total records`)
  const withConst = out.filter(o => o.c && o.c.length > 0).length
  console.log(`Combination drugs (with constituents): ${withConst}`)
}

main().catch(console.error)
