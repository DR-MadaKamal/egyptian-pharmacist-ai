let edaCache = null

export async function loadEdaDrugs() {
  if (edaCache) return edaCache
  const res = await fetch('/egyptian-pharmacist-ai/data/eda-drugs.json')
  const list = await res.json()
  edaCache = list.map((item, i) => ({
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
    manufacturerEn: (item.m || [])[0] || '',
    manufacturerAr: '',
    prices: (item.p || []).map(p => ({ form: 'أقراص', formEn: 'Tablets', price: p, unit: 'EGP' })),
    imageUrl: '',
    drugInteractions: [],
    diseaseInteractions: [],
    edaOnly: true,
    edaBrands: item.b || [],
    edaMfrs: item.m || [],
    edaRoutes: item.r || [],
    edaPriceRange: item.p || [],
    constituents: item.c || [],
  }))
  return edaCache
}

export function getEdaCache() {
  return edaCache
}

export function searchEda(edaDrugs, query) {
  const q = query.toLowerCase().trim()
  if (!q) return edaDrugs || []
  return (edaDrugs || []).filter(d => {
    if (d.nameEn.toLowerCase().includes(q) || d.nameAr.includes(q)) return true
    if (d.edaBrands.some(b => b.toLowerCase().includes(q))) return true
    if (d.constituents && d.constituents.some(c => c.toLowerCase().includes(q))) return true
    return false
  })
}
