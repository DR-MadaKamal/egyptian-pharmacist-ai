import fs from 'fs'
import path from 'path'
import { normalizeManufacturer, NORMALIZE_ROUTE } from './data/normalize-manufacturers.mjs'

const ROUTE_FORM_MAP = {
  'ORAL.SOLID': { r: 'ORAL', f: 'SOLID' },
  'ORAL.LIQUID': { r: 'ORAL', f: 'LIQUID' },
  'TOPICAL': { r: 'TOPICAL', f: 'TOPICAL' },
  'INJECTION': { r: 'INJECTION', f: 'INJECTION' },
  'EFF': { r: 'ORAL', f: 'EFF' },
  'SPRAY': { r: 'SPRAY', f: 'SPRAY' },
  'EYE': { r: 'OPHTHALMIC', f: 'EYE' },
  'VAGINAL': { r: 'VAGINAL', f: 'VAGINAL' },
  'MOUTH': { r: 'ORAL', f: 'MOUTH' },
  'RECTAL': { r: 'RECTAL', f: 'RECTAL' },
  'SOAP': { r: 'TOPICAL', f: 'SOAP' },
  'EAR': { r: 'OTIC', f: 'EAR' },
}

function parseRoute(routeStr) {
  const u = routeStr.toUpperCase().trim()
  if (ROUTE_FORM_MAP[u]) return ROUTE_FORM_MAP[u]
  if (u.includes('.')) {
    const [rr, ff] = u.split('.', 2)
    return { r: rr, f: ff }
  }
  return { r: u, f: u }
}

function normalizeRoute(routeStr) {
  const p = parseRoute(routeStr)
  return NORMALIZE_ROUTE[p.r] || p.r
}

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
        routePrices: {},   // { "ORAL.SOLID": [p1, p2, ...], ... }
        routeForms: {},    // { "ORAL.SOLID": "ORAL", ... }
        routeRaw: {},      // { "ORAL.SOLID": { r: "ORAL", f: "SOLID" }, ... }
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
    if (r.route && r.route !== 'UNKNOWN') {
      const rt = r.route.trim()
      d.routes.add(rt)
      if (r.price_egp) {
        if (!d.routePrices[rt]) d.routePrices[rt] = []
        d.routePrices[rt].push(r.price_egp)
      }
      if (!d.routeRaw[rt]) {
        const parsed = parseRoute(rt)
        d.routeRaw[rt] = parsed
        d.routeForms[rt] = normalizeRoute(rt)
      }
    }

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

      // Per-route/form prices
      if (d.routes.size > 1 || Object.keys(d.routePrices).length > 0) {
        const rfMap = new Map()
        for (const rt of d.routes) {
          const prs = d.routePrices[rt]
          if (prs && prs.length > 0) {
            const parsed = d.routeRaw[rt] || parseRoute(rt)
            const k = parsed.r + '.' + parsed.f
            const rp = [Math.min(...prs), Math.max(...prs)]
            if (!rfMap.has(k)) {
              rfMap.set(k, [parsed.r, parsed.f, rp[0], rp[1]])
            } else {
              const e = rfMap.get(k)
              e[2] = Math.min(e[2], rp[0])
              e[3] = Math.max(e[3], rp[1])
            }
          } else if (prices.length >= 2) {
            // Route exists but no per-route prices; use global
            const parsed = d.routeRaw[rt] || parseRoute(rt)
            const k = parsed.r + '.' + parsed.f
            if (!rfMap.has(k)) {
              rfMap.set(k, [parsed.r, parsed.f, prices[0], prices[1]])
            }
          }
        }
        if (rfMap.size > 1) {
          o.rf = [...rfMap.values()]
        } else if (rfMap.size === 1) {
          const only = [...rfMap.values()][0]
          if (prices.length >= 2 && (only[2] !== prices[0] || only[3] !== prices[1])) {
            o.rf = [only]
          }
        }
      }
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
