let unifiedCache = null

function normalize(text) {
  if (!text) return ''
  return text.toLowerCase().trim().replace(/[^a-z0-9\u0600-\u06FF]/g, '')
}

function extractIngredients(text) {
  if (!text) return []
  const normalized = text.toLowerCase()
    .replace(/\([^)]*\)/g, ' ')
    .replace(/\+/g, ' ')
    .replace(/[,;/]/g, ' ')
  return normalized.split(/\s+/).filter(w => w.length >= 3)
}

function mergeDrug(existing, newData, source) {
  if (!existing || !newData) return existing || newData
  const merged = { ...existing, dataSources: [...(existing.dataSources || []), source] }

  const simpleFields = [
    'nameEn', 'nameAr', 'scientificNameEn', 'scientificNameAr',
    'activeIngredientEn', 'activeIngredientAr', 'category', 'categoryAr',
    'manufacturerEn', 'manufacturerAr', 'description', 'descriptionAr',
    'indicationEn', 'indicationAr', 'mechanismEn', 'mechanismAr',
    'sideEffectsEn', 'sideEffectsAr', 'dosageEn', 'dosageAr',
    'pregnancyEn', 'pregnancyAr', 'breastfeedingEn', 'breastfeedingAr',
    'formEmoji', 'imageUrl', 'pharmacology', 'route', 'drug_class',
  ]

  for (const key of simpleFields) {
    const v = newData[key]
    if (v && (!merged[key] || merged[key] === '' || merged[key] === 'غير متوفر')) {
      merged[key] = v
    }
  }

  if (newData.drugInteractions?.length > 0 && (!merged.drugInteractions || merged.drugInteractions.length === 0)) {
    merged.drugInteractions = newData.drugInteractions
  }
  if (newData.diseaseInteractions?.length > 0 && (!merged.diseaseInteractions || merged.diseaseInteractions.length === 0)) {
    merged.diseaseInteractions = newData.diseaseInteractions
  }

  if (newData.prices?.length > 0 && (!merged.prices || merged.prices.length === 0)) {
    merged.prices = newData.prices
  }
  if (newData.edaRf && (!merged.edaRf || merged.edaRf.length === 0)) {
    merged.edaRf = newData.edaRf
  }
  if (newData.edaPriceRange?.length > 0 && (!merged.edaPriceRange || merged.edaPriceRange.length === 0)) {
    merged.edaPriceRange = newData.edaPriceRange
  }
  if (newData.price_egp != null && merged.price_egp == null) {
    merged.price_egp = newData.price_egp
  }

  const arrayFields = ['edaBrands', 'edaMfrs', 'edaRoutes', 'edaGroups', 'constituents']
  for (const f of arrayFields) {
    if (newData[f]?.length > 0) {
      const existing = merged[f] || []
      merged[f] = [...new Set([...existing, ...newData[f]])]
    }
  }

  if (source === 'karem505') {
    merged.karem505 = newData.karem505
    if (newData.nameEn) merged.nameEn = newData.nameEn
    if (newData.nameAr) merged.nameAr = newData.nameAr
    if (newData.scientificNameEn) merged.scientificNameEn = newData.scientificNameEn
    if (newData.manufacturerEn) merged.manufacturerEn = newData.manufacturerEn
  }

  return merged
}

function toUnifiedKarem505(item) {
  if (!item) return null
  return {
    id: 'k505_' + (item.commercial_name_en || Math.random()),
    nameEn: item.commercial_name_en || '',
    nameAr: item.commercial_name_ar || item.commercial_name_en || '',
    scientificNameEn: item.scientific_name || '',
    scientificNameAr: item.scientific_name || '',
    activeIngredientEn: item.scientific_name || '',
    activeIngredientAr: item.scientific_name || '',
    category: item.drug_class || '',
    categoryAr: item.drug_class || '',
    formEmoji: '💊',
    description: item.drug_class || '',
    descriptionAr: item.drug_class || '',
    indicationEn: '', indicationAr: '',
    mechanismEn: '', mechanismAr: '',
    sideEffectsEn: '', sideEffectsAr: '',
    dosageEn: '', dosageAr: '',
    pregnancyEn: '', pregnancyAr: '',
    breastfeedingEn: '', breastfeedingAr: '',
    manufacturerEn: item.manufacturer || '',
    manufacturerAr: item.manufacturer || '',
    prices: item.price_egp != null
      ? [{ form: 'Retail', formEn: 'Retail', price: '' + item.price_egp, unit: 'EGP' }]
      : [],
    imageUrl: '',
    drugInteractions: [],
    diseaseInteractions: [],
    route: item.route || '',
    drug_class: item.drug_class || '',
    price_egp: item.price_egp,
    edaBrands: [],
    edaMfrs: item.manufacturer ? [item.manufacturer] : [],
    edaRoutes: item.route ? [item.route] : [],
    edaRf: null,
    edaPriceRange: item.price_egp != null ? [item.price_egp] : [],
    edaGroups: [],
    constituents: [],
    pharmacology: '',
    dataSource: 'unified',
    edaOnly: false,
    dataSources: ['karem505'],
    karem505: {
      commercial_name_en: item.commercial_name_en,
      commercial_name_ar: item.commercial_name_ar,
      scientific_name: item.scientific_name,
      manufacturer: item.manufacturer,
      drug_class: item.drug_class,
      route: item.route,
      price_egp: item.price_egp,
    },
  }
}

function toUnifiedEnriched(drug) {
  if (!drug) return null
  return {
    ...drug,
    dataSource: 'enriched',
    edaOnly: false,
    dataSources: ['enriched'],
    price_egp: drug.prices?.length > 0 ? parseFloat(drug.prices[0].price) || null : null,
  }
}

function toUnifiedEda(item, i) {
  if (!item) return null
  return {
    id: 'eda_' + i,
    nameEn: item.s || '',
    nameAr: item.s || '',
    scientificNameEn: item.s || '',
    scientificNameAr: item.s || '',
    activeIngredientEn: item.s || '',
    activeIngredientAr: item.s || '',
    category: 'EDA Listed',
    categoryAr: 'مسجل بهيئة الدواء المصرية',
    formEmoji: '💊',
    description: 'Registered in the Egyptian Drug Authority database',
    descriptionAr: 'مسجل في قاعدة بيانات هيئة الدواء المصرية',
    indicationEn: '', indicationAr: '',
    mechanismEn: '', mechanismAr: '',
    sideEffectsEn: '', sideEffectsAr: '',
    dosageEn: '', dosageAr: '',
    pregnancyEn: '', pregnancyAr: '',
    breastfeedingEn: '', breastfeedingAr: '',
    manufacturerEn: (item.m || [])[0] || '',
    manufacturerAr: '',
    prices: (item.p || []).length >= 2
      ? [{ form: 'Price range', formEn: 'Price range', price: '' + item.p[0] + ' - ' + item.p[1], unit: 'EGP' }]
      : [],
    imageUrl: '',
    drugInteractions: [],
    diseaseInteractions: [],
    edaOnly: false,
    dataSource: 'unified',
    dataSources: ['eda'],
    edaBrands: item.b || [],
    edaMfrs: item.m || [],
    edaRoutes: item.r || [],
    edaRf: item.rf || null,
    edaPriceRange: item.p || [],
    constituents: item.c || [],
    route: '',
    drug_class: '',
    price_egp: item.p?.[0] || null,
  }
}

function toUnifiedMohmed(item, i) {
  if (!item) return null
  return {
    id: 'moh_' + i,
    nameEn: item.s || '',
    nameAr: item.s || '',
    scientificNameEn: item.s || '',
    scientificNameAr: item.s || '',
    activeIngredientEn: item.s || '',
    activeIngredientAr: item.s || '',
    category: 'Drug Guide 2024',
    categoryAr: 'دليل الأدوية 2024',
    formEmoji: '💊',
    description: item.h || 'Listed in Egypt Drugs Guide (2024 prices)',
    descriptionAr: item.h ? item.h.slice(0, 100) : 'مسجل في دليل الأدوية المصري',
    indicationEn: '', indicationAr: '',
    mechanismEn: '', mechanismAr: '',
    sideEffectsEn: '', sideEffectsAr: '',
    dosageEn: '', dosageAr: '',
    pregnancyEn: '', pregnancyAr: '',
    breastfeedingEn: '', breastfeedingAr: '',
    manufacturerEn: (item.m || [])[0] || '',
    manufacturerAr: '',
    prices: (item.p || []).length >= 2
      ? [{ form: 'Price range', formEn: 'Price range', price: '' + item.p[0] + ' - ' + item.p[1], unit: 'EGP' }]
      : [],
    imageUrl: '',
    drugInteractions: [],
    diseaseInteractions: [],
    edaOnly: false,
    dataSource: 'unified',
    dataSources: ['mohmed'],
    edaBrands: item.b || [],
    edaMfrs: item.m || [],
    edaRoutes: item.r || [],
    edaRf: item.rf || null,
    edaPriceRange: item.p || [],
    edaGroups: item.g || [],
    pharmacology: item.h || '',
    constituents: [],
    route: '',
    drug_class: '',
    price_egp: item.p?.[0] || null,
  }
}

function ingestList(unifiedMap, list, toUnifiedFn, source) {
  for (let i = 0; i < list.length; i++) {
    try {
      const entry = toUnifiedFn(list[i], i)
      if (!entry) continue
      const keys = [
        normalize(entry.nameEn),
        normalize(entry.nameAr),
        normalize(entry.scientificNameEn || ''),
        ...(entry.constituents || []).map(c => normalize(c)),
        ...(entry.edaGroups || []).map(g => normalize(g)),
      ].filter(Boolean)

      const primary = keys[0] || entry.id
      if (unifiedMap.has(primary)) {
        unifiedMap.set(primary, mergeDrug(unifiedMap.get(primary), entry, source))
      } else {
        unifiedMap.set(primary, entry)
      }
      for (const k of keys) {
        if (!unifiedMap.has(k)) unifiedMap.set(k, entry)
      }
    } catch {
      // skip individual broken entries
    }
  }
}

export async function loadUnifiedDrugs() {
  if (unifiedCache) return unifiedCache

  let enrichedDrugs = []
  let edaList = []
  let mohmedList = []
  let karem505Raw = []

  try {
    const mod = await import('../data/drugs.js')
    enrichedDrugs = mod.drugs || []
  } catch {
    // enriched drugs failed — continue with empty
  }

  try {
    const { loadEdaDrugs, getRawEdaJson, getRawMohmedJson } = await import('./edaLoader.js')
    await loadEdaDrugs()
    edaList = getRawEdaJson() || []
    mohmedList = getRawMohmedJson() || []
  } catch {
    // EDA/MOHMED failed — continue with empty
  }

  try {
    const { loadEgyptianDrugs } = await import('./egyptianDbLoader.js')
    karem505Raw = await loadEgyptianDrugs()
  } catch {
    // karem505 failed — continue with empty
  }

  const unifiedMap = new Map()

  ingestList(unifiedMap, enrichedDrugs, toUnifiedEnriched, 'enriched')
  ingestList(unifiedMap, edaList, toUnifiedEda, 'eda')
  ingestList(unifiedMap, mohmedList, toUnifiedMohmed, 'mohmed')
  ingestList(unifiedMap, karem505Raw, toUnifiedKarem505, 'karem505')

  const finalList = [...unifiedMap.values()]

  unifiedCache = finalList
  return finalList
}

export function getUnifiedCache() {
  return unifiedCache
}
