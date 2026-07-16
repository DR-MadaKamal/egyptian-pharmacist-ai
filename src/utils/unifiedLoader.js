let unifiedCache = null

function normalize(text) {
  if (!text) return ''
  return text.toLowerCase().trim().replace(/[^a-z0-9\u0600-\u06FF]/g, '')
}

function tryLoadLocalCache() {
  try {
    const raw = localStorage.getItem('pharma_db_v2')
    if (!raw) return null
    const { timestamp, data } = JSON.parse(raw)
    if (Date.now() - timestamp > 7 * 24 * 60 * 60 * 1000) return null
    return data
  } catch {
    return null
  }
}

function saveLocalCache(data) {
  try {
    localStorage.setItem('pharma_db_v2', JSON.stringify({ timestamp: Date.now(), data }))
  } catch {}
}

function toComponentFormat(item) {
  if (!item) return null
  const hasPrices = item.prices?.length > 0
  const hasRf = item.routeFormPrices?.length > 0
  const priceRange = item.prices?.length >= 2
    ? [item.prices[0], item.prices[1]]
    : hasRf ? [] : []

  return {
    id: item.id || 'db_' + Math.random(),
    nameEn: item.nameEn || '',
    nameAr: item.nameAr || item.nameEn || '',
    scientificNameEn: item.scientificNameEn || '',
    scientificNameAr: item.scientificNameAr || item.scientificNameEn || '',
    activeIngredientEn: item.activeIngredientEn || '',
    activeIngredientAr: item.activeIngredientAr || item.activeIngredientEn || '',
    category: item.category || '',
    categoryAr: item.categoryAr || '',
    formEmoji: item.dataSource === 'enriched' ? '💎' : item.dataSource === 'eda_formulary' ? '📋' : '💊',
    description: item.description || '',
    descriptionAr: item.descriptionAr || item.description || '',
    indicationEn: item.indicationEn || '',
    indicationAr: item.indicationAr || '',
    mechanismEn: item.mechanismEn || '',
    mechanismAr: item.mechanismAr || '',
    sideEffectsEn: item.sideEffectsEn || '',
    sideEffectsAr: item.sideEffectsAr || '',
    dosageEn: item.dosageEn || '',
    dosageAr: item.dosageAr || '',
    pregnancyEn: item.pregnancyEn || '',
    pregnancyAr: item.pregnancyAr || '',
    breastfeedingEn: item.breastfeedingEn || '',
    breastfeedingAr: item.breastfeedingAr || '',
    manufacturerEn: item.manufacturerEn || '',
    manufacturerAr: item.manufacturerAr || item.manufacturerEn || '',
    prices: hasPrices
      ? [{ form: 'Price range', formEn: 'Price range', price: '' + item.prices[0] + ' - ' + item.prices[1], unit: 'EGP' }]
      : item.prices || [],
    imageUrl: item.imageUrl || '',
    drugInteractions: item.drugInteractions || [],
    diseaseInteractions: item.diseaseInteractions || [],
    route: item.route || '',
    drug_class: item.drug_class || item.category || '',
    price_egp: item.prices?.[0] || item.priceMin || null,
    edaOnly: item.dataSource !== 'enriched' && item.dataSource !== 'karem505',
    dataSource: item.dataSource || '',
    dataSources: item.dataSources || [item.dataSource || ''],
    edaBrands: item.brands || [],
    edaMfrs: item.manufacturers || [],
    edaRoutes: item.routes || [],
    edaRf: hasRf ? item.routeFormPrices.map(rf => [rf.route, rf.form, rf.priceMin, rf.priceMax]) : null,
    edaPriceRange: priceRange,
    edaGroups: item.edaGroups || [],
    constituents: item.constituents || [],
    pharmacology: item.pharmacology || '',
    atcCode: item.atcCode || '',
    dosageForms: item.dosageForms || '',
  }
}

export async function loadUnifiedDrugs(onProgress) {
  if (unifiedCache) return unifiedCache
  const emit = onProgress || (() => {})

  // Try local cache first
  const cached = tryLoadLocalCache()
  if (cached && cached.length > 0) {
    const formatted = cached.map(toComponentFormat).filter(Boolean)
    unifiedCache = formatted
    emit(formatted)
    return formatted
  }

  // Load from consolidated database
  let dbDrugs = []
  try {
    const res = await fetch(import.meta.env.BASE_URL + 'data/drugs-database.json', {
      signal: AbortSignal.timeout(30000),
    })
    if (res.ok) dbDrugs = await res.json()
  } catch {}

  if (dbDrugs.length > 0) {
    saveLocalCache(dbDrugs)
    const formatted = dbDrugs.map(toComponentFormat).filter(Boolean)
    unifiedCache = formatted
    emit(formatted)
    return formatted
  }

  // Fallback: load from bundled sources (for offline/dev mode)
  console.warn('Consolidated database unavailable, falling back to bundled sources')
  const { drugs: enrichedDrugs } = await import('../data/drugs.js')
  const { edaFormularyDrugs } = await import('../data/edaFormulary.js')
  const fallback = [
    ...(enrichedDrugs || []).map(d => ({
      ...d,
      dataSource: 'enriched',
      edaOnly: false,
      dataSources: ['enriched'],
      price_egp: d.prices?.length > 0 ? parseFloat(d.prices[0].price) || null : null,
    })),
    ...(edaFormularyDrugs || []).map((d, i) => ({
      id: 'form_' + i,
      nameEn: d.n || '',
      nameAr: d.n || '',
      scientificNameEn: d.n || '',
      activeIngredientEn: d.n || '',
      category: d.t === 'otc' ? 'OTC Medication' : (d.c || ''),
      description: d.t === 'otc' ? (d.o || '') : (d.i || d.c || ''),
      indicationEn: d.i || '',
      dosageEn: d.f || '',
      route: d.r || '',
      pharmacology: d.c || '',
      atcCode: d.a || '',
      dosageForms: d.f || '',
      dataSource: 'eda_formulary',
      edaOnly: true,
      dataSources: ['eda_formulary'],
      prices: [],
      drugInteractions: [],
      diseaseInteractions: [],
      edaBrands: [],
      edaMfrs: [],
      edaRoutes: d.r ? d.r.split(',').map(s => s.trim()) : [],
      edaRf: null,
      edaPriceRange: [],
      constituents: [],
    })),
  ]
  unifiedCache = fallback
  emit(fallback)
  return fallback
}

export function getUnifiedCache() {
  return unifiedCache
}
