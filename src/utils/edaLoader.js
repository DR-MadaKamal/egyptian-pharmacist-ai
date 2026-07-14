let edaCache = null
let mohmedCache = null
let rawEdaJson = null
let rawMohmedJson = null

async function fetchJson(url) {
  try {
    const ctrl = new AbortController()
    const timer = setTimeout(() => ctrl.abort(), 15000)
    const res = await fetch(url, { signal: ctrl.signal })
    clearTimeout(timer)
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

export async function loadEdaDrugs() {
  if (edaCache) return edaCache
  const [list, mohmed] = await Promise.all([
    fetchJson(import.meta.env.BASE_URL + 'data/eda-drugs.json'),
    fetchJson(import.meta.env.BASE_URL + 'data/mohmed-supplement.json'),
  ])
  rawEdaJson = list || []
  rawMohmedJson = mohmed || []
  edaCache = rawEdaJson.map((item, i) => ({
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
    indicationEn: '',
    indicationAr: '',
    mechanismEn: '',
    mechanismAr: '',
    sideEffectsEn: '',
    sideEffectsAr: '',
    dosageEn: '',
    dosageAr: '',
    pregnancyEn: '',
    pregnancyAr: '',
    breastfeedingEn: '',
    breastfeedingAr: '',
    manufacturerEn: (item.m || [])[0] || 'غير متوفر',
    manufacturerAr: '',
    prices: (item.p || []).length >= 2
      ? [{ form: 'نطاق سعري', formEn: 'Price range', price: '' + item.p[0] + ' - ' + item.p[1], unit: 'EGP' }]
      : [],
    imageUrl: '',
    drugInteractions: [],
    diseaseInteractions: [],
    edaOnly: true,
    dataSource: 'EDA',
    edaBrands: item.b || [],
    edaMfrs: item.m || [],
    edaRoutes: item.r || [],
    edaRf: item.rf || null,
    edaPriceRange: item.p || [],
    constituents: item.c || [],
  }))

  mohmedCache = (mohmed || []).map((item, i) => ({
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
    indicationEn: '',
    indicationAr: '',
    mechanismEn: '',
    mechanismAr: '',
    sideEffectsEn: '',
    sideEffectsAr: '',
    dosageEn: '',
    dosageAr: '',
    pregnancyEn: '',
    pregnancyAr: '',
    breastfeedingEn: '',
    breastfeedingAr: '',
    manufacturerEn: (item.m || [])[0] || 'غير متوفر',
    manufacturerAr: '',
    prices: (item.p || []).length >= 2
      ? [{ form: 'نطاق سعري', formEn: 'Price range', price: '' + item.p[0] + ' - ' + item.p[1], unit: 'EGP' }]
      : [],
    imageUrl: '',
    drugInteractions: [],
    diseaseInteractions: [],
    edaOnly: true,
    dataSource: 'MOHMED',
    edaBrands: item.b || [],
    edaMfrs: item.m || [],
    edaRoutes: item.r || [],
    edaRf: item.rf || null,
    edaPriceRange: item.p || [],
    edaGroups: item.g || [],
    pharmacology: item.h || '',
    constituents: [],
  }))

  return [...edaCache, ...mohmedCache]
}

export function getEdaCache() {
  return edaCache
}

export function getMohmedCache() {
  return mohmedCache
}

export function searchEda(edaDrugs, query) {
  const q = query.toLowerCase().trim()
  if (!q) return edaDrugs || []
  return (edaDrugs || []).filter(d => {
    if (d.nameEn.toLowerCase().includes(q) || d.nameAr.includes(q)) return true
    if (d.edaBrands.some(b => b.toLowerCase().includes(q))) return true
    if (d.constituents && d.constituents.some(c => c.toLowerCase().includes(q))) return true
    if (d.edaGroups && d.edaGroups.some(g => g.toLowerCase().includes(q))) return true
    if (d.pharmacology && d.pharmacology.toLowerCase().includes(q)) return true
    if (d.edaRoutes && d.edaRoutes.some(r => r.toLowerCase().includes(q))) return true
    return false
  })
}

export function getRawEdaJson() { return rawEdaJson || [] }
export function getRawMohmedJson() { return rawMohmedJson || [] }
