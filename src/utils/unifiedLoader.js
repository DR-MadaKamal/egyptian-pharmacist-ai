let unifiedCache = null

function normalize(text) {
  if (!text) return ''
  return text.toLowerCase().trim().replace(/[^a-z0-9\u0600-\u06FF]/g, '')
}

function buildKey(nameEn, nameAr, sciName) {
  const candidates = [nameEn, nameAr, sciName].filter(Boolean)
  return candidates.map(normalize).filter(Boolean)
}

function matchScore(a, b) {
  if (!a || !b) return 0
  const na = normalize(a)
  const nb = normalize(b)
  if (na === nb) return 100
  if (na.includes(nb) || nb.includes(na)) return 80
  return 0
}

function mergeDrug(existing, newData, source) {
  if (!existing || !newData) return existing
  const merged = { ...existing, dataSources: [...(existing.dataSources || []), source] }

  const fields = {
    nameEn: 'nameEn', nameAr: 'nameAr',
    scientificNameEn: 'scientificNameEn', scientificNameAr: 'scientificNameAr',
    activeIngredientEn: 'activeIngredientEn', activeIngredientAr: 'activeIngredientAr',
    category: 'category', categoryAr: 'categoryAr',
    manufacturerEn: 'manufacturerEn', manufacturerAr: 'manufacturerAr',
    description: 'description', descriptionAr: 'descriptionAr',
    indicationEn: 'indicationEn', indicationAr: 'indicationAr',
    mechanismEn: 'mechanismEn', mechanismAr: 'mechanismAr',
    sideEffectsEn: 'sideEffectsEn', sideEffectsAr: 'sideEffectsAr',
    dosageEn: 'dosageEn', dosageAr: 'dosageAr',
    pregnancyEn: 'pregnancyEn', pregnancyAr: 'pregnancyAr',
    breastfeedingEn: 'breastfeedingEn', breastfeedingAr: 'breastfeedingAr',
    formEmoji: 'formEmoji', imageUrl: 'imageUrl',
    pharmacology: 'pharmacology',
  }

  for (const [key, target] of Object.entries(fields)) {
    const newVal = newData[key]
    if (newVal && (!merged[target] || merged[target] === '' || merged[target] === 'غير متوفر')) {
      merged[target] = newVal
    }
  }

  if (newData.drugInteractions?.length > 0 && merged.drugInteractions?.length === 0) {
    merged.drugInteractions = newData.drugInteractions
  }
  if (newData.diseaseInteractions?.length > 0 && merged.diseaseInteractions?.length === 0) {
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

  if (newData.edaBrands?.length > 0) {
    const existing = merged.edaBrands || []
    merged.edaBrands = [...new Set([...existing, ...newData.edaBrands])]
  }
  if (newData.edaMfrs?.length > 0) {
    const existing = merged.edaMfrs || []
    merged.edaMfrs = [...new Set([...existing, ...newData.edaMfrs])]
  }
  if (newData.edaRoutes?.length > 0) {
    const existing = merged.edaRoutes || []
    merged.edaRoutes = [...new Set([...existing, ...newData.edaRoutes])]
  }
  if (newData.edaGroups?.length > 0) {
    const existing = merged.edaGroups || []
    merged.edaGroups = [...new Set([...existing, ...newData.edaGroups])]
  }
  if (newData.constituents?.length > 0) {
    const existing = merged.constituents || []
    merged.constituents = [...new Set([...existing, ...newData.constituents])]
  }

  if (newData.route && !merged.route) merged.route = newData.route
  if (newData.drug_class && !merged.drug_class) merged.drug_class = newData.drug_class

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
  return {
    id: 'k505_' + item.commercial_name_en,
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
  return {
    ...drug,
    dataSource: 'enriched',
    edaOnly: false,
    dataSources: ['enriched'],
    price_egp: drug.prices?.length > 0 ? parseFloat(drug.prices[0].price) || null : null,
  }
}

function toUnifiedEda(item, i) {
  return {
    id: 'eda_' + i,
    nameEn: item.s,
    nameAr: item.s,
    scientificNameEn: item.s,
    scientificNameAr: item.s,
    activeIngredientEn: item.s,
    activeIngredientAr: item.s,
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
    manufacturerEn: (item.m || [])[0] || 'غير متوفر',
    manufacturerAr: '',
    prices: (item.p || []).length >= 2
      ? [{ form: 'نطاق سعري', formEn: 'Price range', price: '' + item.p[0] + ' - ' + item.p[1], unit: 'EGP' }]
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
  return {
    id: 'moh_' + i,
    nameEn: item.s,
    nameAr: item.s,
    scientificNameEn: item.s,
    scientificNameAr: item.s,
    activeIngredientEn: item.s,
    activeIngredientAr: item.s,
    category: 'Drug Guide 2024',
    categoryAr: 'دليل الأدوية 2024',
    formEmoji: '💊',
    description: item.h || 'Listed in Egypt Drugs Guide (2024 prices)',
    descriptionAr: item.h ? item.h.slice(0, 100) : 'مسجل في دليل الأدوية المصري (أسعار 2024)',
    indicationEn: '', indicationAr: '',
    mechanismEn: '', mechanismAr: '',
    sideEffectsEn: '', sideEffectsAr: '',
    dosageEn: '', dosageAr: '',
    pregnancyEn: '', pregnancyAr: '',
    breastfeedingEn: '', breastfeedingAr: '',
    manufacturerEn: (item.m || [])[0] || 'غير متوفر',
    manufacturerAr: '',
    prices: (item.p || []).length >= 2
      ? [{ form: 'نطاق سعري', formEn: 'Price range', price: '' + item.p[0] + ' - ' + item.p[1], unit: 'EGP' }]
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

function mergeByKeys(existing, candidates, keyFn, source) {
  let merged = { ...existing }
  const matchKeys = keyFn(merged)

  for (const candidate of candidates) {
    const candKeys = keyFn(candidate)
    let matched = false
    for (const mk of matchKeys) {
      for (const ck of candKeys) {
        if (mk && ck && mk === ck) { matched = true; break }
      }
      if (matched) break
    }
    if (!matched) {
      for (const mk of matchKeys) {
        for (const ck of candKeys) {
          if (mk && ck && (mk.includes(ck) || ck.includes(mk)) && mk.length >= 3 && ck.length >= 3) {
            matched = true; break
          }
        }
        if (matched) break
      }
    }
    if (matched) {
      merged = mergeDrug(merged, candidate, source)
    }
  }
  return merged
}

export async function loadUnifiedDrugs() {
  if (unifiedCache) return unifiedCache

  const { drugs: enrichedDrugs } = await import(/* @vite-ignore */ '../data/drugs.js')
  const { loadEdaDrugs, getEdaCache, getMohmedCache } = await import('./edaLoader.js')
  const { loadEgyptianDrugs } = await import('./egyptianDbLoader.js')

  const [edaMohmed, karem505Raw] = await Promise.all([
    loadEdaDrugs(),
    loadEgyptianDrugs(),
  ])

  const edaList = getEdaCache() || []
  const mohmedList = getMohmedCache() || []

  const unifiedMap = new Map()

  for (const d of enrichedDrugs) {
    const entry = toUnifiedEnriched(d)
    const keys = [normalize(d.nameEn), normalize(d.nameAr), normalize(d.scientificNameEn)].filter(Boolean)
    let merged = entry
    for (const k of keys) {
      if (!unifiedMap.has(k)) unifiedMap.set(k, merged)
    }
    const primary = keys[0] || keys[1] || keys[2] || entry.id
    if (unifiedMap.has(primary)) {
      unifiedMap.set(primary, mergeDrug(unifiedMap.get(primary), entry, 'enriched'))
    } else {
      unifiedMap.set(primary, merged)
    }
  }

  for (let i = 0; i < edaList.length; i++) {
    const entry = toUnifiedEda(edaList[i], i)
    const keys = [normalize(entry.nameEn), normalize(entry.nameAr), ...entry.constituents.map(c => normalize(c))].filter(Boolean)
    let merged = entry
    for (const k of keys) {
      if (!unifiedMap.has(k)) unifiedMap.set(k, merged)
    }
    const primary = keys[0] || entry.id
    if (unifiedMap.has(primary)) {
      unifiedMap.set(primary, mergeDrug(unifiedMap.get(primary), entry, 'eda'))
    } else {
      unifiedMap.set(primary, merged)
    }
  }

  for (let i = 0; i < mohmedList.length; i++) {
    const entry = toUnifiedMohmed(mohmedList[i], i)
    const keys = [normalize(entry.nameEn), normalize(entry.nameAr), ...(entry.edaGroups || []).map(g => normalize(g))].filter(Boolean)
    let merged = entry
    for (const k of keys) {
      if (!unifiedMap.has(k)) unifiedMap.set(k, merged)
    }
    const primary = keys[0] || entry.id
    if (unifiedMap.has(primary)) {
      unifiedMap.set(primary, mergeDrug(unifiedMap.get(primary), entry, 'mohmed'))
    } else {
      unifiedMap.set(primary, merged)
    }
  }

  for (let i = 0; i < karem505Raw.length; i++) {
    const item = karem505Raw[i]
    const entry = toUnifiedKarem505(item)
    const keys = [
      normalize(item.commercial_name_en),
      normalize(item.commercial_name_ar),
      normalize(item.scientific_name),
    ].filter(Boolean)
    let merged = entry
    for (const k of keys) {
      if (!unifiedMap.has(k)) unifiedMap.set(k, merged)
    }
    const primary = keys[0] || entry.id
    if (unifiedMap.has(primary)) {
      unifiedMap.set(primary, mergeDrug(unifiedMap.get(primary), entry, 'karem505'))
    } else {
      unifiedMap.set(primary, merged)
    }
  }

  const finalList = [...unifiedMap.values()]

  unifiedCache = finalList
  return finalList
}

export function getUnifiedCache() {
  return unifiedCache
}
