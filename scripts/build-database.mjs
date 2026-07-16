import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const OUT_DIR = path.join(ROOT, 'public', 'data')
const OUT_FILE = path.join(OUT_DIR, 'drugs-database.json')

function normalize(text) {
  if (!text) return ''
  return text.toLowerCase().trim().replace(/[^a-z0-9\u0600-\u06FF]/g, '')
}

function cleanManufacturer(mfr) {
  if (!mfr) return ''
  return mfr
    .replace(/-->/g, ' ')
    .replace(/\s*>\s*$/g, '')
    .replace(/\s*>\s+(?!\s)/g, ' > ')
    .split(' > ').pop().trim()
    .replace(/\s{2,}/g, ' ')
    .trim()
}

function extractConstituents(scientificName) {
  if (!scientificName) return []
  return scientificName.split('+')
    .map(s => s.replace(/\s*\(.*?\)/g, '').trim())
    .filter(Boolean)
    .map(s => s.replace(/\b\d+[\d.,]*\s*(%|MG|MCG|GM|ML|IU|PC|TAB|CAP|AMP|VIAL|SYR|SUSP|UNITS|UNIT)\b/gi, '').trim())
    .map(s => s.replace(/\b\d[\d.]*\b/g, '').trim())
    .filter(s => s.length > 2 && !/^(ORAL|TOPICAL|INJECTION|SOLUTION|TABLET|CAPSULE|CREAM|OINTMENT)$/i.test(s))
}

function parseEdaRoute(routeStr) {
  const ROUTE_MAP = {
    'ORAL.SOLID': { route: 'Oral', form: 'Solid' },
    'ORAL.LIQUID': { route: 'Oral', form: 'Liquid' },
    'TOPICAL': { route: 'Topical', form: 'Topical' },
    'INJECTION': { route: 'Injection', form: 'Injection' },
    'EFF': { route: 'Oral', form: 'Effervescent' },
    'SPRAY': { route: 'Topical', form: 'Spray' },
    'EYE': { route: 'Ophthalmic', form: 'Eye' },
    'VAGINAL': { route: 'Vaginal', form: 'Vaginal' },
    'MOUTH': { route: 'Oral', form: 'Mouth' },
    'RECTAL': { route: 'Rectal', form: 'Rectal' },
    'SOAP': { route: 'Topical', form: 'Soap' },
    'EAR': { route: 'Otic', form: 'Ear' },
  }
  const u = routeStr.toUpperCase().trim()
  if (ROUTE_MAP[u]) return ROUTE_MAP[u]
  if (u.includes('.')) {
    const [r, f] = u.split('.', 2)
    return { route: r.charAt(0) + r.slice(1).toLowerCase(), form: f.charAt(0) + f.slice(1).toLowerCase() }
  }
  return { route: u.charAt(0) + u.slice(1).toLowerCase(), form: u.charAt(0) + u.slice(1).toLowerCase() }
}

// ─── Load all sources ────────────────────────────────────────────
function loadJson(filepath) {
  try {
    return JSON.parse(fs.readFileSync(filepath, 'utf8'))
  } catch {
    console.warn(`  ⚠ Could not load ${filepath}`)
    return []
  }
}

function loadJsExport(filepath, exportName) {
  try {
    const content = fs.readFileSync(filepath, 'utf8')
    const match = content.match(/export\s+const\s+\w+\s*=\s*(\[[\s\S]*?\])\s*\n/)
    if (match) {
      return JSON.parse(match[1])
    }
    // Fallback: require it
    delete require.cache[path.resolve(filepath)]
    const mod = require(path.resolve(filepath))
    return mod[exportName] || []
  } catch (e) {
    console.warn(`  ⚠ Could not load ${filepath}: ${e.message}`)
    return []
  }
}

// ─── Merge logic ─────────────────────────────────────────────────
const db = new Map() // normalized_name -> unified drug object

function makeKey(name) {
  return normalize(name)
}

function upsert(name, data) {
  const key = makeKey(name)
  if (!key) return
  if (db.has(key)) {
    mergeInto(db.get(key), data)
  } else {
    db.set(key, data)
  }
}

function mergeInto(target, source) {
  // Fill empty fields from source
  const simpleFields = [
    'nameEn', 'nameAr', 'scientificNameEn', 'scientificNameAr',
    'activeIngredientEn', 'category', 'categoryAr', 'description',
    'indicationEn', 'mechanismEn', 'sideEffectsEn', 'dosageEn',
    'pregnancyEn', 'breastfeedingEn', 'manufacturerEn', 'route',
    'drug_class', 'pharmacology', 'atcCode', 'dosageForms',
  ]
  for (const f of simpleFields) {
    if (source[f] && (!target[f] || target[f] === '' || target[f] === 'غير متوفر')) {
      target[f] = source[f]
    }
  }
  // Merge arrays (deduplicate)
  for (const f of ['brands', 'manufacturers', 'routes', 'constituents', 'dataSources']) {
    if (source[f]?.length > 0) {
      target[f] = [...new Set([...(target[f] || []), ...source[f]])]
    }
  }
  // Prices: prefer wider range
  if (source.priceMin != null && source.priceMax != null) {
    if (target.priceMin == null || source.priceMax > (target.priceMax || 0)) {
      target.priceMin = source.priceMin
      target.priceMax = source.priceMax
    }
  }
  // Route-form prices
  if (source.routeFormPrices?.length > 0) {
    if (!target.routeFormPrices) target.routeFormPrices = []
    for (const rf of source.routeFormPrices) {
      const existing = target.routeFormPrices.find(e => e[0] === rf[0] && e[1] === rf[1])
      if (existing) {
        existing[2] = Math.min(existing[2], rf[2])
        existing[3] = Math.max(existing[3], rf[3])
      } else {
        target.routeFormPrices.push(rf)
      }
    }
  }
  // Interactions
  if (source.drugInteractions?.length > 0 && (!target.drugInteractions || target.drugInteractions.length === 0)) {
    target.drugInteractions = source.drugInteractions
  }
  if (source.diseaseInteractions?.length > 0 && (!target.diseaseInteractions || target.diseaseInteractions.length === 0)) {
    target.diseaseInteractions = source.diseaseInteractions
  }
  // Prices array
  if (source.prices?.length > 0 && (!target.prices || target.prices.length === 0)) {
    target.prices = source.prices
  }
}

// ─── Step 1: EDA drugs (base - 10K+ entries) ────────────────────
console.log('Step 1: Loading EDA drugs...')
const edaDrugs = loadJson(path.join(ROOT, 'public', 'data', 'eda-drugs.json'))
console.log(`  Loaded ${edaDrugs.length} EDA entries`)

for (const d of edaDrugs) {
  if (!d.s || d.t === 'non-drug') continue
  const name = d.s
  const routes = (d.r || []).map(r => parseEdaRoute(r))
  const primaryRoute = routes[0]?.route || ''
  const routeFormPrices = (d.rf || []).map(([route, form, min, max]) => ({
    route, form, priceMin: min, priceMax: max,
  }))

  upsert(name, {
    nameEn: name,
    nameAr: name,
    scientificNameEn: name,
    activeIngredientEn: name,
    category: '',
    categoryAr: '',
    description: '',
    indicationEn: '',
    mechanismEn: '',
    sideEffectsEn: '',
    dosageEn: '',
    pregnancyEn: '',
    breastfeedingEn: '',
    manufacturerEn: (d.m || []).map(cleanManufacturer).filter(Boolean)[0] || '',
    route: primaryRoute,
    drug_class: '',
    pharmacology: '',
    atcCode: '',
    dosageForms: '',
    prices: [],
    priceMin: d.p?.[0] || null,
    priceMax: d.p?.[1] || null,
    brands: (d.b || []).slice(0, 15),
    manufacturers: (d.m || []).map(cleanManufacturer).filter(Boolean).slice(0, 3),
    routes: (d.r || []),
    constituents: (d.c || []).slice(0, 10),
    routeFormPrices,
    drugInteractions: [],
    diseaseInteractions: [],
    dataSource: 'eda',
    dataSources: ['eda'],
  })
}
console.log(`  Database after EDA: ${db.size} entries`)

// ─── Step 2: MOHMED supplement (pharmacology) ───────────────────
console.log('Step 2: Loading MOHMED supplement...')
const mohmedDrugs = loadJson(path.join(ROOT, 'public', 'data', 'mohmed-supplement.json'))
console.log(`  Loaded ${mohmedDrugs.length} MOHMED entries`)

for (const d of mohmedDrugs) {
  if (!d.s) continue
  const name = d.s
  upsert(name, {
    nameEn: name,
    nameAr: name,
    scientificNameEn: name,
    activeIngredientEn: name,
    category: '',
    pharmacology: d.h || '',
    description: d.h || '',
    manufacturerEn: (d.m || []).map(cleanManufacturer).filter(Boolean)[0] || '',
    brands: (d.b || []).slice(0, 15),
    manufacturers: (d.m || []).map(cleanManufacturer).filter(Boolean).slice(0, 3),
    routes: (d.r || []),
    constituents: (d.c || []).slice(0, 10),
    priceMin: d.p?.[0] || null,
    priceMax: d.p?.[1] || null,
    routeFormPrices: (d.rf || []).map(([route, form, min, max]) => ({ route, form, priceMin: min, priceMax: max })),
    dataSource: 'mohmed',
    dataSources: ['mohmed'],
  })
}
console.log(`  Database after MOHMED: ${db.size} entries`)

// ─── Step 3: Enriched drugs (clinical details) ──────────────────
console.log('Step 3: Loading enriched drugs...')
let enrichedDrugs = []
try {
  const mod = await import('file:///' + path.join(ROOT, 'src', 'data', 'drugs.js').replace(/\\/g, '/'))
  enrichedDrugs = mod.drugs || []
} catch (e) {
  // Fallback: use createRequire
  const { createRequire } = await import('module')
  const require = createRequire(import.meta.url)
  const mod = require(path.join(ROOT, 'src', 'data', 'drugs.js'))
  enrichedDrugs = mod.drugs || []
}
console.log(`  Loaded ${enrichedDrugs.length} enriched entries`)

for (const d of enrichedDrugs) {
  const name = d.nameEn || d.scientificNameEn || ''
  if (!name) continue

  upsert(name, {
    nameEn: d.nameEn || '',
    nameAr: d.nameAr || d.nameEn || '',
    scientificNameEn: d.scientificNameEn || d.nameEn || '',
    activeIngredientEn: d.activeIngredientEn || d.scientificNameEn || '',
    category: d.category || '',
    categoryAr: d.categoryAr || '',
    description: d.description || '',
    descriptionAr: d.descriptionAr || '',
    indicationEn: d.indicationEn || '',
    indicationAr: d.indicationAr || '',
    mechanismEn: d.mechanismEn || '',
    mechanismAr: d.mechanismAr || '',
    sideEffectsEn: d.sideEffectsEn || '',
    sideEffectsAr: d.sideEffectsAr || '',
    dosageEn: d.dosageEn || '',
    dosageAr: d.dosageAr || '',
    pregnancyEn: d.pregnancyEn || '',
    pregnancyAr: d.pregnancyAr || '',
    breastfeedingEn: d.breastfeedingEn || '',
    breastfeedingAr: d.breastfeedingAr || '',
    manufacturerEn: d.manufacturerEn || '',
    manufacturerAr: d.manufacturerAr || '',
    prices: d.prices || [],
    drugInteractions: (d.drugInteractions || []).map(i => typeof i === 'string' ? i : i.name || JSON.stringify(i)),
    diseaseInteractions: (d.diseaseInteractions || []).map(i => typeof i === 'string' ? i : i.name || JSON.stringify(i)),
    dataSource: 'enriched',
    dataSources: ['enriched'],
  })
}
console.log(`  Database after enriched: ${db.size} entries`)

// ─── Step 4: Formulary drugs (antimicrobials + OTC) ─────────────
console.log('Step 4: Loading formulary drugs...')
let formularyDrugs = []
try {
  const mod = await import('file:///' + path.join(ROOT, 'src', 'data', 'edaFormulary.js').replace(/\\/g, '/'))
  formularyDrugs = mod.edaFormularyDrugs || []
} catch {
  const { createRequire } = await import('module')
  const require = createRequire(import.meta.url)
  const mod = require(path.join(ROOT, 'src', 'data', 'edaFormulary.js'))
  formularyDrugs = mod.edaFormularyDrugs || []
}
console.log(`  Loaded ${formularyDrugs.length} formulary entries`)

for (const d of formularyDrugs) {
  const name = d.n
  if (!name) continue
  const isOtc = d.t === 'otc'

  upsert(name, {
    nameEn: name,
    nameAr: name,
    scientificNameEn: name,
    activeIngredientEn: name,
    category: isOtc ? 'OTC Medication' : (d.c || ''),
    categoryAr: isOtc ? 'دواء بدون وصفة طبية' : '',
    description: isOtc ? (d.o || 'Egyptian OTC medication') : (d.i || d.c || ''),
    indicationEn: d.i || '',
    dosageEn: d.f || '',
    route: d.r || '',
    pharmacology: d.c || '',
    atcCode: d.a || '',
    dosageForms: d.f || '',
    dataSource: 'eda_formulary',
    dataSources: ['eda_formulary'],
  })
}
console.log(`  Database after formulary: ${db.size} entries`)

// ─── Step 5: karem505 (commercial names + prices) ──────────────
console.log('Step 5: Loading karem505 database...')
const K505_URL = 'https://raw.githubusercontent.com/karem505/egyptian-drug-database/main/data/egyptian-drugs.json'
let k505 = []
try {
  const res = await fetch(K505_URL, { signal: AbortSignal.timeout(30000) })
  if (res.ok) k505 = await res.json()
} catch (e) {
  console.warn(`  ⚠ Could not fetch karem505: ${e.message}`)
  // Try local cache
  try {
    const cached = JSON.parse(fs.readFileSync(path.join(ROOT, 'temp', 'k505-cache.json'), 'utf8'))
    k505 = cached
    console.log('  Using local cache instead')
  } catch {}
}
console.log(`  Loaded ${k505.length} karem505 entries`)

for (const d of k505) {
  const sciName = d.scientific_name || ''
  const commercialName = d.commercial_name_en || ''
  if (!sciName && !commercialName) continue

  // Use scientific name as primary key, commercial name as secondary
  const primaryName = sciName || commercialName
  const commercialClean = commercialName.replace(/\s*\(.*?\)/g, '').trim()

  upsert(primaryName, {
    nameEn: primaryName,
    nameAr: d.commercial_name_ar || primaryName,
    scientificNameEn: sciName || '',
    activeIngredientEn: sciName || '',
    category: d.drug_class || '',
    manufacturerEn: d.manufacturer || '',
    route: d.route || '',
    drug_class: d.drug_class || '',
    priceMin: d.price_egp || null,
    priceMax: d.price_egp || null,
    prices: d.price_egp != null
      ? [{ form: 'Retail', formEn: 'Retail', price: '' + d.price_egp, unit: 'EGP' }]
      : [],
    brands: commercialClean ? [commercialClean] : [],
    manufacturers: d.manufacturer ? [d.manufacturer] : [],
    dataSource: 'karem505',
    dataSources: ['karem505'],
  })

  // Also index by commercial name if different
  if (commercialClean && normalize(commercialClean) !== normalize(primaryName)) {
    upsert(commercialClean, {
      nameEn: commercialClean,
      nameAr: d.commercial_name_ar || commercialClean,
      scientificNameEn: sciName || commercialClean,
      activeIngredientEn: sciName || '',
      category: d.drug_class || '',
      manufacturerEn: d.manufacturer || '',
      route: d.route || '',
      drug_class: d.drug_class || '',
      priceMin: d.price_egp || null,
      priceMax: d.price_egp || null,
      prices: d.price_egp != null
        ? [{ form: 'Retail', formEn: 'Retail', price: '' + d.price_egp, unit: 'EGP' }]
        : [],
      dataSource: 'karem505',
      dataSources: ['karem505'],
    })
  }
}
console.log(`  Database after karem505: ${db.size} entries`)

// ─── Finalize ────────────────────────────────────────────────────
console.log('\nFinalizing...')
const finalList = [...db.values()].map((d, i) => ({
  id: 'db_' + i,
  ...d,
  // Clean up: remove internal merge fields
  priceMin: undefined,
  priceMax: undefined,
})).filter(d => d.nameEn)

// Stats
const withPrices = finalList.filter(d => d.prices?.length > 0 || (d.priceMin != null)).length
const withIndications = finalList.filter(d => d.indicationEn).length
const withPharmacology = finalList.filter(d => d.pharmacology).length
const withBrands = finalList.filter(d => d.brands?.length > 0).length
const sources = {}
for (const d of finalList) {
  for (const s of (d.dataSources || [])) {
    sources[s] = (sources[s] || 0) + 1
  }
}

console.log(`\n═══ Database Build Complete ═══`)
console.log(`Total drugs: ${finalList.length}`)
console.log(`With prices: ${withPrices}`)
console.log(`With indications: ${withIndications}`)
console.log(`With pharmacology: ${withPharmacology}`)
console.log(`With brands: ${withBrands}`)
console.log(`Sources:`, sources)

// Write output
fs.mkdirSync(OUT_DIR, { recursive: true })
fs.writeFileSync(OUT_FILE, JSON.stringify(finalList), 'utf-8')
const sizeKB = Math.round(fs.statSync(OUT_FILE).size / 1024)
console.log(`\nWrote ${OUT_FILE} (${sizeKB} KB)`)

// Write metadata
const meta = {
  version: new Date().toISOString(),
  totalDrugs: finalList.length,
  withPrices,
  withIndications,
  withPharmacology,
  withBrands,
  sources,
}
fs.writeFileSync(path.join(OUT_DIR, 'drugs-database-meta.json'), JSON.stringify(meta, null, 2))
console.log('Wrote metadata')
