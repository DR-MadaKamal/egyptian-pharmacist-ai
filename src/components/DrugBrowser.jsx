import { useState, useMemo } from 'react'
import { drugCategories, drugCategoriesAr } from '../data/drugs.js'
import { edaSupplement } from '../data/eda-supplement.js'
import { searchEda } from '../utils/edaLoader.js'

const PAGE_SIZE = 50

const ROUTE_EMOJI = {
  'ORAL': '💊', 'TOPICAL': '🧴', 'INJECTION': '💉', 'SPRAY': '🌫️',
  'OPHTHALMIC': '👁️', 'OTIC': '👂', 'VAGINAL': '🩺', 'RECTAL': '🩺',
  'EFF': '💊', 'SOAP': '🧼',
}

const ROUTE_LABELS = {
  'ORAL': 'فموي / Oral', 'TOPICAL': 'موضعي / Topical', 'INJECTION': 'حقن / Injection',
  'SPRAY': 'رذاذ / Spray', 'OPHTHALMIC': 'عين / Ophthalmic', 'OTIC': 'أذن / Otic',
  'VAGINAL': 'مهبلي / Vaginal', 'RECTAL': 'شرجي / Rectal', 'EFF': 'فوار / Effervescent',
  'SOAP': 'صابون / Soap',
}

function getDrugRoutes(d) {
  if (d.edaRoutes && d.edaRoutes.length > 0) return d.edaRoutes
  if (d.edaRf) return d.edaRf.map(r => r[0] + '.' + r[1])
  if (d.prices) return d.prices.map(p => p.formEn || p.form)
  return []
}

function getDrugRouteNorm(d) {
  const routes = getDrugRoutes(d)
  const norm = new Set()
  for (const r of routes) {
    const parts = r.split('.')
    norm.add(parts[0])
  }
  return [...norm]
}

function getFormLabel(routeStr) {
  const parts = routeStr.split('.')
  if (parts.length === 2) {
    const base = ROUTE_LABELS[parts[0]] || parts[0]
    const form = parts[1]
    return form === parts[0] ? base : base + ' (' + form + ')'
  }
  return ROUTE_LABELS[routeStr] || routeStr
}

export default function DrugBrowser({ drugs, onViewDrug }) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [routeFilter, setRouteFilter] = useState('')
  const [page, setPage] = useState(1)
  const [showEda, setShowEda] = useState(false)

  const enriched = useMemo(() => drugs.filter(d => !d.edaOnly), [drugs])
  const edaOnly = useMemo(() => drugs.filter(d => d.edaOnly), [drugs])

  const allRoutes = useMemo(() => {
    const routes = new Set()
    drugs.forEach(d => getDrugRouteNorm(d).forEach(r => routes.add(r)))
    return [...routes].sort()
  }, [drugs])

  const filteredEnriched = useMemo(() => {
    const q = query.toLowerCase().trim()
    let result = enriched
    if (q) {
      result = enriched.filter(d => {
        if (d.nameEn.toLowerCase().includes(q) || d.nameAr.includes(q)) return true
        if (d.category.toLowerCase().includes(q) || d.categoryAr.includes(q)) return true
        if (d.scientificNameEn?.toLowerCase().includes(q) || d.scientificNameAr?.includes(q)) return true
        if (d.activeIngredientEn?.toLowerCase().includes(q) || d.activeIngredientAr?.includes(q)) return true
        if (d.scientificNameEn) {
          const parts = d.scientificNameEn.split('+').map(s => s.trim())
          if (parts.some(p => p.toLowerCase().includes(q))) return true
        }
        if ((edaSupplement.find(e => e.id === d.id)?.brandAliases || []).some(a =>
          (a.en || a.ar).toLowerCase().includes(q))) return true
        return false
      })
    }
    if (routeFilter) {
      result = result.filter(d => getDrugRouteNorm(d).includes(routeFilter))
    }
    return result
  }, [enriched, query, routeFilter])

  const filteredEda = useMemo(() => {
    if (!query.trim() && !routeFilter) return showEda ? edaOnly : []
    let result = query.trim() ? searchEda(edaOnly, query) : edaOnly
    if (routeFilter) {
      result = result.filter(d => getDrugRouteNorm(d).includes(routeFilter))
    }
    return showEda || query.trim() ? result : []
  }, [edaOnly, query, routeFilter, showEda])

  const allFiltered = useMemo(() => {
    let result = [...filteredEnriched, ...filteredEda]
    if (category) result = result.filter(d => d.category === category)
    return result
  }, [filteredEnriched, filteredEda, category])

  const totalPages = Math.ceil(allFiltered.length / PAGE_SIZE)
  const pageItems = useMemo(() => {
    return allFiltered.slice(0, page * PAGE_SIZE)
  }, [allFiltered, page])

  const handleLoadMore = () => setPage(p => p + 1)

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-nile">🔍 تصفح الأدوية / Drug Browser</h2>

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={query}
          onChange={e => { setQuery(e.target.value); setPage(1) }}
          placeholder="ابحث باسم الدواء (عربي/English)..."
          className="flex-1 px-4 py-2.5 border border-sand-dark rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-gold text-right"
          dir="auto"
        />
        <select
          value={category}
          onChange={e => { setCategory(e.target.value); setPage(1) }}
          className="px-4 py-2.5 border border-sand-dark rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-gold"
        >
          <option value="">كل التصنيفات / All Categories</option>
          {drugCategories.map((cat, i) => (
            <option key={cat} value={cat}>{cat} | {drugCategoriesAr[i]}</option>
          ))}
        </select>
        <select
          value={routeFilter}
          onChange={e => { setRouteFilter(e.target.value); setPage(1) }}
          className="px-4 py-2.5 border border-sand-dark rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-gold"
        >
          <option value="">كل طرق التعاطي / All Routes</option>
          {allRoutes.map(r => (
            <option key={r} value={r}>{ROUTE_LABELS[r] || r} {ROUTE_EMOJI[r] || ''}</option>
          ))}
        </select>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          {allFiltered.length} دواء / drugs found
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
          <input type="checkbox" checked={showEda} onChange={e => { setShowEda(e.target.checked); setPage(1) }} className="rounded" />
          عرض جميع الأدوية المسجلة / Show all EDA listed
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {pageItems.map(drug => (
          <div
            key={drug.id}
            onClick={() => onViewDrug(drug.id)}
            className={`bg-white border rounded-xl p-4 hover:shadow-md transition-all cursor-pointer ${drug.edaOnly ? 'border-gray-200 hover:border-gray-400' : 'border-sand-dark hover:border-gold'}`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="text-right flex-1">
                <div className={`font-bold text-nile ${drug.edaOnly ? 'text-base' : 'text-lg'}`}>
                  {drug.edaOnly ? drug.nameAr : drug.nameAr}
                </div>
                <div className="text-sm text-gray-500">{drug.nameEn}</div>
                <div className="flex items-center gap-1.5 mt-1">
                  {drug.edaOnly ? (
                    <span className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full">EDA Listed</span>
                  ) : (
                    <>
                      <span className="bg-sand text-nile text-xs px-2 py-0.5 rounded-full">{drug.categoryAr}</span>
                      <span className="text-[10px] text-gray-400">{drug.category}</span>
                    </>
                  )}
                  {!drug.edaOnly && edaSupplement.find(e => e.id === drug.id)?.verified && (
                    <span className="text-[10px] text-green-600 font-bold" title="Verified by EDA">✓ EDA</span>
                  )}
                </div>
              </div>
              <div className="text-3xl">{drug.formEmoji || '💊'}</div>
            </div>
            {drug.edaOnly ? (
              <div className="text-xs text-gray-500 mt-2">
                {drug.edaBrands && drug.edaBrands.length > 0 && (
                  <div>🏷 {drug.edaBrands.slice(0, 3).join(', ')}{drug.edaBrands.length > 3 ? ` +${drug.edaBrands.length - 3}` : ''}</div>
                )}
                {drug.edaMfrs && drug.edaMfrs.length > 0 && (
                  <div className="mt-1">🏭 {drug.edaMfrs.join(', ')}</div>
                )}
                {drug.edaRoutes && drug.edaRoutes.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {drug.edaRoutes.map(rt => (
                      <span key={rt} className="inline-block bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded text-[10px]">
                        {getFormLabel(rt)}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-gray-500 mt-2 line-clamp-2">{drug.description}</p>
            )}
            <div className="flex items-center justify-between mt-2">
              <div className="flex gap-2 text-xs">
                {!drug.edaOnly && drug.drugInteractions.length > 0 && (
                  <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded">
                    {drug.drugInteractions.length} تفاعل دوائي
                  </span>
                )}
                {!drug.edaOnly && drug.diseaseInteractions.length > 0 && (
                  <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                    {drug.diseaseInteractions.length} تفاعل مرضي
                  </span>
                )}
              </div>
              <span className="text-xs text-gray-400">{drug.manufacturerEn || ''}</span>
            </div>
            {drug.prices && drug.prices.length > 0 && (
              <div className="mt-1 text-xs text-gold-dark font-bold">
                {drug.edaOnly
                  ? `${Math.min(...drug.edaPriceRange)} - ${Math.max(...drug.edaPriceRange)} EGP`
                  : `${drug.prices[0].price} ${drug.prices[0].unit}${drug.prices.length > 1 ? ` (+${drug.prices.length - 1})` : ''}`}
              </div>
            )}
          </div>
        ))}
      </div>

      {pageItems.length < allFiltered.length && (
        <div className="text-center">
          <button
            onClick={handleLoadMore}
            className="px-6 py-2 bg-gold text-white rounded-xl hover:bg-gold-dark transition-colors"
          >
            عرض المزيد / Load More ({allFiltered.length - pageItems.length} متبقي)
          </button>
        </div>
      )}

      {allFiltered.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <div className="text-4xl mb-3">🔍</div>
          <p>لا توجد أدوية مطابقة للبحث / No drugs match your search</p>
          {!showEda && (
            <button onClick={() => setShowEda(true)} className="mt-3 text-sm text-blue-600 underline">
              ابحث في جميع الأدوية المسجلة / Search in all EDA listed drugs
            </button>
          )}
        </div>
      )}
    </div>
  )
}
