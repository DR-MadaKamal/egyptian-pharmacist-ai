let edaCache = null
let mohmedCache = null

async function fetchJson(url) {
  const res = await fetch(url)
  if (!res.ok) return []
  return res.json()
}

export async function loadEdaDrugs() {
  if (edaCache) return edaCache
  const [list, mohmed] = await Promise.all([
    fetchJson('/egyptian-pharmacist-ai/data/eda-drugs.json'),
    fetchJson('/egyptian-pharmacist-ai/data/mohmed-supplement.json'),
  ])
  edaCache = (list || []).map((item, i) => ({
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
    manufacturerEn: (item.m || [])[0] || '',
    manufacturerAr: '',
    prices: (item.p || []).map(p => ({ form: 'أقراص', formEn: 'Tablets', price: p, unit: 'EGP' })),
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
