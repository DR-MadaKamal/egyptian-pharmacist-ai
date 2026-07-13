import { useState, useMemo } from 'react'
import { drugCategories, drugCategoriesAr } from '../data/drugs.js'
import { edaSupplement } from '../data/eda-supplement.js'
import { searchEda } from '../utils/edaLoader.js'

const PAGE_SIZE = 50

export default function DrugBrowser({ drugs, onViewDrug }) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [page, setPage] = useState(1)
  const [showEda, setShowEda] = useState(false)

  const enriched = useMemo(() => drugs.filter(d => !d.edaOnly), [drugs])
  const edaOnly = useMemo(() => drugs.filter(d => d.edaOnly), [drugs])

  const filteredEnriched = useMemo(() => {
    const q = query.toLowerCase().trim()
    if (!q) return enriched
    return enriched.filter(d =>
      d.nameEn.toLowerCase().includes(q) ||
      d.nameAr.includes(q) ||
      d.category.toLowerCase().includes(q) ||
      d.categoryAr.includes(q) ||
      (edaSupplement.find(e => e.id === d.id)?.brandAliases || []).some(a =>
        (a.en || a.ar).toLowerCase().includes(q))
    )
  }, [enriched, query])

  const filteredEda = useMemo(() => {
    if (!query.trim()) return showEda ? edaOnly : []
    return searchEda(edaOnly, query)
  }, [edaOnly, query, showEda])

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
