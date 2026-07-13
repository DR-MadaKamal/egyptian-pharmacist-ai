import fs from 'fs'
import path from 'path'
import { normalizeManufacturer } from './data/normalize-manufacturers.mjs'

const EDA_URL = 'https://raw.githubusercontent.com/karem505/egyptian-drug-database/main/data/egyptian-drugs.json'
const EDA_FILE = process.argv[2] || resolveEdaPath()
const OUT_DIR = path.resolve('public/data')
const OUT_FILE = path.join(OUT_DIR, 'eda-drugs.json')

function resolveEdaPath() {
  const local = path.resolve('..', '..', 'C:\\Users\\mada_\\AppData\\Local\\Temp\\opencode\\egyptian-drugs.json')
  if (fs.existsSync(local)) return local
  return EDA_URL
}

const KNOWN_NON_DRUG_TYPES = ['SOAP', 'CREAM', 'GEL', 'LOTION', 'SHAMPOO', 'CONDITIONER', 'SERUM', 'TONER',
  'MASK', 'SUNSCREEN', 'OIL', 'SPRAY', 'WIPE', 'PATCH', 'BELT', 'MACHINE', 'DEVICE', 'TOOL',
  'LIP BALM', 'DEODORANT', 'MOUTHWASH', 'TOOTHPASTE', 'CONTACT LENS', 'SHOWER', 'BATH',
  'FOUNDATION', 'CONCEALER', 'LIPSTICK', 'LIP GLOSS', 'MASCARA', 'EYELINER', 'EYESHADOW',
  'NAIL POLISH', 'NAIL LACQUER', 'BLUSHER', 'BRONZER', 'HIGHLIGHTER', 'PRIMER',
  'HAIR DYE', 'HAIR COLOR', 'HAIR SPRAY', 'HAIR GEL', 'HAIR WAX', 'HAIR MOUSSE',
  'HAIR SERUM', 'HAIR TREATMENT', 'HAIR MASK', 'HAIR OIL', 'HAIR TONIC',
  'BODY LOTION', 'BODY BUTTER', 'BODY OIL', 'BODY SPRAY', 'BODY WASH',
  'FACE WASH', 'FACE SCRUB', 'FACE PEEL', 'FACE POWDER', 'FACE CREAM']

function isProductName(name) {
  const upper = name.toUpperCase()
  if (KNOWN_NON_DRUG_TYPES.some(t => upper.includes(t))) return true
  if (/\d+\s*(ML|GM|PC|PCS|TAB|CAP|MG)\b/i.test(name) && !upper.includes('+')) return true
  return false
}

function cleanManufacturer(mfr) {
  if (!mfr) return ''
  let name = mfr
    .replace(/-->/g, ' ')  // arrow indicators
    .replace(/\s*>\s*$/g, '')  // trailing >
    .replace(/\s*>\s+(?!\s)/g, ' > ')  // normalize > spacing
  if (name.includes(' > ')) {
    name = name.split(' > ').pop().trim()
  } else if (name.startsWith('>')) {
    name = name.replace(/^>\s*/, '').trim()
  }
  name = name.replace(/\s{2,}/g, ' ').replace(/\s*>\s*$/, '').trim()
  return normalizeManufacturer(name)
}

function normalizeKey(raw) {
  return raw.toUpperCase()
    .replace(/\s*\(.*?\)/g, '')    // strip parenthetical
    .replace(/\s+/g, ' ')          // collapse whitespace
    .replace(/[<>]/g, '')          // strip angle brackets
    .trim()
}

function extractConstituents(scientificName) {
  if (!scientificName) return []
  const isValidConstituent = (s) => {
    if (s.length < 2) return false
    if (/^[\d\s%./,\)\-(:]+$/.test(s)) return false
    if (/^\d/.test(s) && !/[A-Za-z]{4,}/.test(s)) return false
    if (/^(ORAL|TOPICAL|INJECTION|INTRAVENOUS|INTRAVENOUS|SOLUTION|SUSPENSION|TABLET|CAPSULE|CREAM|OINTMENT)$/i.test(s)) return false
    return true
  }
  return scientificName.split('+')
    .map(s => s.replace(/\s*\(.*?\)/g, '').trim())
    .filter(Boolean)
    .map(s => s.replace(/\b\d+[\d.,]*\s*(%|MG|MCG|GM|ML|IU|PC|TAB|CAP|AMP|VIAL|SYR|SUSP|UNITS|UNIT)\b/gi, '').trim())
    .map(s => s.replace(/\b\d[\d.]*\b/g, '').trim())
    .filter(s => isValidConstituent(s))
    .map(s => s.replace(/\s{2,}/g, ' ').trim())
}

async function main() {
  let eda
  if (EDA_FILE.startsWith('http')) {
    const res = await fetch(EDA_FILE)
    eda = await res.json()
  } else {
    eda = JSON.parse(fs.readFileSync(EDA_FILE, 'utf-8'))
  }

  const drugMap = new Map()   // key -> aggregated data
  const nonDrugMap = new Map() // cosmetics, devices, etc.
  let missingSciCount = 0

  for (const r of eda) {
    const hasSci = r.scientific_name && r.scientific_name.trim()
    const raw = hasSci ? r.scientific_name.trim() : (r.commercial_name_en || '').trim()
    if (!raw) continue

    const key = normalizeKey(raw)
    if (!key) continue

    const targetMap = (isProductName(raw) && !hasSci) ? nonDrugMap : drugMap

    if (!targetMap.has(key)) {
      targetMap.set(key, {
        s: hasSci ? r.scientific_name.trim() : null,
        brands: new Set(),
        mfrs: new Set(),
        prices: [],
        routes: new Set(),
        constituents: [],
      })
    }
    const d = targetMap.get(key)

    // Store the best scientific name available
    if (hasSci && (!d.s || d.s === raw)) {
      d.s = r.scientific_name.trim()
    } else if (!d.s) {
      d.s = raw
    }

    const brand = r.commercial_name_en.replace(/\s*\(.*?\)/g, '').trim()
    if (brand) d.brands.add(brand)
    if (r.manufacturer) d.mfrs.add(cleanManufacturer(r.manufacturer))
    if (r.price_egp) d.prices.push(r.price_egp)
    if (r.route && r.route !== 'UNKNOWN') d.routes.add(r.route)

    if (!hasSci) missingSciCount++

    // Extract constituents
    if (hasSci) {
      const parts = extractConstituents(r.scientific_name)
      if (parts.length > 0) {
        for (const p of parts) d.constituents.push(p)
      } else {
        const clean = r.scientific_name.replace(/\s*\(.*?\)/g, '').trim()
        if (clean && !/^\d/.test(clean) && clean.length > 2) {
          d.constituents.push(clean)
        }
      }
    }
  }

  function buildOutput(map, isNonDrug) {
    return Array.from(map.entries()).map(([key, d]) => {
      const brands = [...d.brands].filter(Boolean).sort((a, b) => a.length - b.length).slice(0, 15)
      const mfrs = [...new Set(d.mfrs)].filter(Boolean)
      const prices = d.prices.length > 0
        ? [Math.min(...d.prices), Math.max(...d.prices)]
        : []
      const routes = [...d.routes].filter(Boolean)
      const consts = [...new Set(d.constituents
        .map(s => s.replace(/\s*\(.*?\)/g, '').trim())
        .filter(Boolean)
      )].slice(0, 10)

      const o = { s: d.s || key }
      if (brands.length) o.b = brands
      if (mfrs.length) o.m = mfrs.slice(0, 3)
      if (prices.length) o.p = prices
      if (routes.length) o.r = routes
      if (consts.length) o.c = consts
      if (isNonDrug) o.t = 'non-drug'
      return o
    })
  }

  const drugs = buildOutput(drugMap, false)
  const nonDrugs = buildOutput(nonDrugMap, true)

  const out = [...drugs, ...nonDrugs]

  fs.mkdirSync(OUT_DIR, { recursive: true })
  fs.writeFileSync(OUT_FILE, JSON.stringify(out), 'utf-8')

  console.log(`Generated ${OUT_FILE}`)
  console.log(`Drug entries: ${drugs.length} (from ${eda.length} total records)`)
  console.log(`Non-drug entries (flagged): ${nonDrugs.length}`)
  console.log(`Missing scientific names: ${missingSciCount}`)
  const withConst = out.filter(o => o.c && o.c.length > 0).length
  console.log(`With constituents: ${withConst}`)

  // Stats
  const cleanMfrs = new Set()
  out.forEach(o => (o.m || []).forEach(m => cleanMfrs.add(m)))
  console.log(`Unique manufacturers (cleaned): ${cleanMfrs.size}`)
}

main().catch(console.error)
