let unifiedCache = null

function normalize(text) {
  if (!text) return ''
  return text.toLowerCase().trim().replace(/[^a-z0-9\u0600-\u06FF]/g, '')
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

  for (const f of ['edaBrands', 'edaMfrs', 'edaRoutes', 'edaGroups', 'constituents']) {
    if (newData[f]?.length > 0) {
      merged[f] = [...new Set([...(merged[f] || []), ...newData[f]])]
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
    edaOnly: true,
    dataSource: 'eda',
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
    edaOnly: true,
    dataSource: 'MOHMED',
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

function toUnifiedFormulary(item, i) {
  if (!item) return null
  const isOtc = item.t === 'otc'
  return {
    id: 'form_' + i,
    nameEn: item.n || '',
    nameAr: item.n || '',
    scientificNameEn: item.n || '',
    scientificNameAr: item.n || '',
    activeIngredientEn: item.n || '',
    activeIngredientAr: item.n || '',
    category: isOtc ? 'OTC Medication' : (item.c || 'Antimicrobial'),
    categoryAr: isOtc ? 'دواء بدون وصفة طبية' : (item.c || 'مضاد ميكروبي'),
    formEmoji: isOtc ? '🏪' : '💉',
    description: isOtc ? (item.o || 'Egyptian OTC medication') : (item.i || item.c || 'Egyptian EDA Formulary drug'),
    descriptionAr: isOtc ? 'دواء بدون وصفة طبية مسجل بهيئة الدواء المصرية' : 'مضاد ميكروبي مسجل في الدليل المصري 2023',
    indicationEn: item.i || '',
    indicationAr: '',
    mechanismEn: '',
    mechanismAr: '',
    sideEffectsEn: '',
    sideEffectsAr: '',
    dosageEn: item.f || '',
    dosageAr: '',
    pregnancyEn: '',
    pregnancyAr: '',
    breastfeedingEn: '',
    breastfeedingAr: '',
    manufacturerEn: '',
    manufacturerAr: '',
    prices: [],
    imageUrl: '',
    drugInteractions: [],
    diseaseInteractions: [],
    route: item.r || '',
    drug_class: item.c || '',
    price_egp: null,
    edaBrands: [],
    edaMfrs: [],
    edaRoutes: item.r ? item.r.split(',').map(s => s.trim()) : [],
    edaRf: null,
    edaPriceRange: [],
    edaGroups: [],
    constituents: [],
    pharmacology: item.c || '',
    atcCode: item.a || '',
    dosageForms: item.f || '',
    dataSource: 'eda_formulary',
    edaOnly: true,
    dataSources: ['eda_formulary'],
  }
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

function ingestList(map, list, toFn, source) {
  for (let i = 0; i < list.length; i++) {
    try {
      const entry = toFn(list[i], i)
      if (!entry) continue
      const keys = [
        normalize(entry.nameEn),
        normalize(entry.nameAr),
        normalize(entry.scientificNameEn || ''),
        ...(entry.constituents || []).map(c => normalize(c)),
        ...(entry.edaGroups || []).map(g => normalize(g)),
      ].filter(Boolean)
      const primary = keys[0] || entry.id
      if (map.has(primary)) {
        map.set(primary, mergeDrug(map.get(primary), entry, source))
      } else {
        map.set(primary, entry)
      }
      for (const k of keys) {
        if (!map.has(k)) map.set(k, entry)
      }
    } catch {}
  }
}

function mergeIntoUnified(base, newMap) {
  for (const [key, entry] of newMap) {
    if (base.has(key)) {
      base.set(key, mergeDrug(base.get(key), entry, entry.dataSources?.[0] || 'unknown'))
    } else {
      base.set(key, entry)
    }
  }
}

function getKarem505Cache() {
  try {
    const raw = localStorage.getItem('egyptian_drug_db_v1')
    if (!raw) return null
    const { timestamp, data } = JSON.parse(raw)
    if (Date.now() - timestamp > 24 * 60 * 60 * 1000) return null
    return data
  } catch {
    return null
  }
}

function saveKarem505Cache(data) {
  try {
    localStorage.setItem('egyptian_drug_db_v1', JSON.stringify({ timestamp: Date.now(), data }))
  } catch {}
}

export async function loadUnifiedDrugs(onProgress) {
  if (unifiedCache) return unifiedCache
  const emit = onProgress || (() => {})
  const unifiedMap = new Map()

  const { drugs: enrichedDrugs } = await import('../data/drugs.js')
  ingestList(unifiedMap, enrichedDrugs || [], toUnifiedEnriched, 'enriched')

  const { edaFormularyDrugs } = await import('../data/edaFormulary.js')
  ingestList(unifiedMap, edaFormularyDrugs || [], toUnifiedFormulary, 'eda_formulary')
  emit([...unifiedMap.values()])

  const karem505Cache = getKarem505Cache()

  const [edaMohmedResult, karem505Result] = await Promise.allSettled([
    import('./edaLoader.js').then(m => m.loadRawEdaMohmed()),
    karem505Cache
      ? Promise.resolve(karem505Cache)
      : import('./egyptianDbLoader.js').then(m => m.loadEgyptianDrugs()),
  ])

  if (edaMohmedResult.status === 'fulfilled') {
    const { eda, mohmed } = edaMohmedResult.value
    ingestList(unifiedMap, eda || [], toUnifiedEda, 'eda')
    ingestList(unifiedMap, mohmed || [], toUnifiedMohmed, 'mohmed')
  }

  if (karem505Result.status === 'fulfilled') {
    const karem505Raw = karem505Result.value || []
    ingestList(unifiedMap, karem505Raw, toUnifiedKarem505, 'karem505')
    if (!karem505Cache && karem505Raw.length > 0) {
      saveKarem505Cache(karem505Raw)
    }
  }

  const finalList = [...unifiedMap.values()]
  unifiedCache = finalList
  emit(finalList)
  return finalList
}

export function getUnifiedCache() {
  return unifiedCache
}
