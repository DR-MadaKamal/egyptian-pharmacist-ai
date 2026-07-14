import { useState, useEffect, useRef, useMemo } from 'react'
import { severityConfig } from '../utils/interactions.js'
import { searchEda } from '../utils/edaLoader.js'

function AnimatedCounter({ end }) {
  const [val, setVal] = useState(0)
  const ref = useRef(null)
  const done = useRef(false)

  useEffect(() => {
    if (done.current) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        done.current = true
        let start = 0
        const step = Math.max(1, Math.floor(end / 30))
        const interval = setInterval(() => {
          start += step
          if (start >= end) { setVal(end); clearInterval(interval) }
          else setVal(start)
        }, 30)
        obs.disconnect()
      }
    }, { threshold: 0.5 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [end])

  return <span ref={ref}>{val}</span>
}

const ROUTE_EMOJI = {
  'ORAL': '💊', 'TOPICAL': '🧴', 'INJECTION': '💉', 'SPRAY': '🌫️',
  'OPHTHALMIC': '👁️', 'OTIC': '👂',
}

export default function Home({ drugs, diseases, recentlyViewed, onBrowse, onInterview, onPrices, onPharmacopeia, onViewDrug }) {
  const [query, setQuery] = useState('')
  const [searchMode, setSearchMode] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [tipDismissed, setTipDismissed] = useState(() => {
    try { return sessionStorage.getItem('tip-dismissed') === 'true' } catch { return false }
  })
  const [featuredDrugs, setFeaturedDrugs] = useState(() => {
    return [...drugs.filter(d => !d.edaOnly)].sort(() => Math.random() - 0.5).slice(0, 6)
  })
  const [expandedDrug, setExpandedDrug] = useState(null)

  const enriched = useMemo(() => drugs.filter(d => !d.edaOnly), [drugs])
  const edaOnlyDrugs = useMemo(() => drugs.filter(d => d.edaOnly), [drugs])

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q || q.length < 2) return []
    const fromEnriched = enriched.filter(d =>
      d.nameEn?.toLowerCase().includes(q) || d.nameAr?.includes(q) ||
      d.scientificNameEn?.toLowerCase().includes(q) || d.categoryAr?.includes(q) ||
      d.manufacturerEn?.toLowerCase().includes(q)
    ).slice(0, 4)
    const fromEda = searchEda(edaOnlyDrugs, q).slice(0, 4)
    return [...fromEnriched, ...fromEda]
  }, [query, enriched, edaOnlyDrugs])

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!searchMode || !q || q.length < 2) return []
    const fromEnriched = enriched.filter(d =>
      d.nameEn?.toLowerCase().includes(q) || d.nameAr?.includes(q) ||
      d.scientificNameEn?.toLowerCase().includes(q) || d.scientificNameAr?.includes(q) ||
      d.category?.toLowerCase().includes(q) || d.categoryAr?.includes(q) ||
      d.manufacturerEn?.toLowerCase().includes(q) || d.manufacturerAr?.includes(q) ||
      d.activeIngredientEn?.toLowerCase().includes(q) || d.activeIngredientAr?.includes(q)
    )
    const fromEda = searchEda(edaOnlyDrugs, q)
    return [...fromEnriched, ...fromEda].slice(0, 60)
  }, [query, searchMode, enriched, edaOnlyDrugs])

  const doSearch = (override) => {
    const q = (override || query).trim()
    if (!q || q.length < 2) return
    setQuery(q)
    setSearchMode(true)
    setShowSuggestions(false)
  }

  const clearSearch = () => {
    setQuery('')
    setSearchMode(false)
    setShowSuggestions(false)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setFeaturedDrugs([...enriched].sort(() => Math.random() - 0.5).slice(0, 6))
    }, 15000)
    return () => clearInterval(interval)
  }, [enriched])

  const totalInteractions = drugs.reduce((s, d) => s + d.drugInteractions.length + d.diseaseInteractions.length, 0)
  const contraindicated = drugs.reduce((s, d) =>
    s + d.drugInteractions.filter(i => i.severity === 'contraindicated').length +
    d.diseaseInteractions.filter(i => i.severity === 'contraindicated').length, 0
  )
  const severe = drugs.reduce((s, d) =>
    s + d.drugInteractions.filter(i => i.severity === 'severe').length +
    d.diseaseInteractions.filter(i => i.severity === 'severe').length, 0
  )
  const categories = [...new Set(drugs.map(d => d.category))].length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center py-4 md:py-6">
        <h1 className="text-3xl md:text-4xl font-bold text-nile mb-2">الصيدلي المصري الشامل</h1>
        <p className="text-gray-600 text-base md:text-lg">Complete Egyptian Pharmacist AI</p>
        <p className="text-gray-500 text-sm mt-2 max-w-xl mx-auto">
          مرجع ذكي شامل للتفاعلات الدوائية والدوائية-مرضية — {drugs.length.toLocaleString()} دواء / {drugs.length.toLocaleString()} drugs indexed
        </p>
      </div>

      {/* ========== SEARCH BAR ========== */}
      <div className="max-w-2xl mx-auto w-full relative">
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={e => { setQuery(e.target.value); setShowSuggestions(true); if (searchMode) setSearchMode(false) }}
            onFocus={() => { if (query.length >= 2) setShowSuggestions(true) }}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            onKeyDown={e => { if (e.key === 'Enter') doSearch() }}
            placeholder="🔍 ابحث عن أي دواء بالاسم، المادة الفعالة، أو الشركة... / Search by drug name, ingredient, or manufacturer..."
            className="flex-1 px-5 py-3.5 border-2 border-gold rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent text-right shadow-sm text-base"
            dir="auto"
          />
          <button onClick={() => doSearch()}
            className="px-6 py-3.5 bg-gold text-nile rounded-xl font-bold hover:bg-gold-light transition-colors shadow-sm text-base whitespace-nowrap">
            🔎 بحث
          </button>
          {searchMode && (
            <button onClick={clearSearch}
              className="px-4 py-3.5 bg-gray-100 text-gray-500 rounded-xl hover:bg-gray-200 transition-colors font-medium">
              ✕ مسح
            </button>
          )}
        </div>

        {/* Autocomplete suggestions */}
        {showSuggestions && !searchMode && query.length >= 2 && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-sand-dark rounded-xl shadow-lg z-20 overflow-hidden">
            {suggestions.map(d => (
              <button key={d.id}
                onMouseDown={() => { setQuery(d.nameAr || d.nameEn); doSearch(d.nameAr || d.nameEn) }}
                className="w-full text-right px-4 py-3 text-sm hover:bg-sand transition-colors border-b border-gray-50 last:border-b-0 flex items-center justify-between gap-2">
                <span className="text-gray-400 text-xs shrink-0">{d.nameEn}{d.edaOnly ? ' (EDA)' : ''}</span>
                <span className="flex items-center gap-2 flex-1 justify-end">
                  {!d.edaOnly && d.drugInteractions?.length > 0 && (
                    <span className="text-[10px] bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded-full">{d.drugInteractions.length} int.</span>
                  )}
                  <span className="font-medium text-nile">{d.nameAr}</span>
                  <span className="text-xl">{d.formEmoji || '💊'}</span>
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ========== SEARCH RESULTS ========== */}
      {searchMode && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-nile">🔍 نتائج البحث / Search Results</h2>
            <span className="text-sm text-gray-500">{searchResults.length} نتيجة / results for "{query}"</span>
          </div>
          {searchResults.length === 0 ? (
            <div className="text-center py-12 text-gray-400 bg-white border border-sand-dark rounded-xl">
              <div className="text-5xl mb-3">🔍</div>
              <p className="text-lg font-medium">لا توجد نتائج مطابقة / No matching results</p>
              <p className="text-sm mt-1">حاول البحث باسم آخر أو مادة فعالة / Try a different name or active ingredient</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {searchResults.map(drug => (
                <div key={drug.id}
                  onClick={() => onViewDrug(drug.id)}
                  className="bg-white border border-sand-dark rounded-xl p-4 hover:shadow-md hover:border-gold transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="text-right flex-1">
                      <div className="font-bold text-nile text-lg group-hover:text-gold-dark transition-colors">{drug.nameAr}</div>
                      <div className="text-sm text-gray-500">{drug.nameEn}</div>
                      <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                        {drug.edaOnly ? (
                          <span className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full">
                            {drug.dataSource === 'MOHMED' ? '📖 Drug Guide 2024' : '🏛 EDA Listed'}
                          </span>
                        ) : (
                          <>
                            <span className="bg-sand text-nile text-xs px-2 py-0.5 rounded-full">{drug.categoryAr}</span>
                            {drug.scientificNameEn && (
                              <span className="text-[10px] text-gray-400 italic">{drug.scientificNameEn}</span>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                    <div className="text-4xl">{drug.formEmoji || '💊'}</div>
                  </div>

                  {/* Detail chips */}
                  {drug.edaOnly ? (
                    <div className="text-xs text-gray-500 mt-2 space-y-0.5">
                      {drug.edaBrands?.length > 0 && (
                        <div>🏷 {drug.edaBrands.slice(0, 3).join(', ')}{drug.edaBrands.length > 3 ? ` +${drug.edaBrands.length - 3}` : ''}</div>
                      )}
                      {drug.manufacturerEn && <div>🏭 {drug.manufacturerEn}</div>}
                      {drug.edaRoutes?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {drug.edaRoutes.slice(0, 3).map(r => (
                            <span key={r} className="inline-block bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded text-[10px]">{r}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500 mt-2 line-clamp-2">{drug.description || drug.descriptionAr}</p>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                    <div className="flex gap-2 text-xs">
                      {!drug.edaOnly && drug.drugInteractions?.length > 0 && (
                        <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded">{drug.drugInteractions.length} تفاعل دوائي</span>
                      )}
                      {!drug.edaOnly && drug.diseaseInteractions?.length > 0 && (
                        <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded">{drug.diseaseInteractions.length} تفاعل مرضي</span>
                      )}
                    </div>
                    {drug.edaRf && drug.edaRf.length > 0 ? (
                      <span className="text-xs text-gold-dark font-bold">EGP {drug.edaRf[0][2]}</span>
                    ) : drug.prices?.length > 0 ? (
                      <span className="text-xs text-gold-dark font-bold">{drug.prices[0].price} {drug.prices[0].unit}</span>
                    ) : drug.edaPriceRange?.length > 0 ? (
                      <span className="text-xs text-gold-dark font-bold">EGP {drug.edaPriceRange[0]}</span>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========== HOME CONTENT (hidden during search) ========== */}
      {!searchMode && (
        <>
          {/* Stats counters */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {[
              { label: 'الأدوية', labelEn: 'Drugs', value: drugs.length, color: 'bg-nile', icon: '💊' },
              { label: 'الأمراض', labelEn: 'Diseases', value: diseases.length, color: 'bg-nile-light', icon: '🦠' },
              { label: 'التفاعلات', labelEn: 'Interactions', value: totalInteractions, color: 'bg-gold-dark', icon: '⚡' },
              { label: 'تصنيفات', labelEn: 'Categories', value: categories, color: 'bg-green-700', icon: '📊' },
            ].map(stat => (
              <div key={stat.labelEn} className={`${stat.color} text-white rounded-xl p-3 md:p-4 text-center`}>
                <div className="text-2xl md:text-3xl mb-1">{stat.icon}</div>
                <div className="text-xl md:text-2xl font-bold"><AnimatedCounter end={stat.value} /></div>
                <div className="text-xs md:text-sm text-white/80">{stat.label}</div>
                <div className="text-[10px] text-white/50">{stat.labelEn}</div>
              </div>
            ))}
          </div>

          {/* Seasonal tip */}
          {!tipDismissed && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 md:p-4 flex items-start gap-3">
              <span className="text-xl">☀️</span>
              <div>
                <p className="font-bold text-amber-800 text-sm">نصيحة موسمية / Seasonal Tip</p>
                <p className="text-amber-700 text-xs mt-1">
                  يُفضل تخزين الأدوية في مكان بارد وجاف بعيداً عن أشعة الشمس المباشرة. حرارة الصيف قد تؤثر على فاعلية بعض الأدوية.
                </p>
                <p className="text-amber-600 text-xs mt-0.5">
                  Store medicines in a cool, dry place away from direct sunlight. Summer heat can affect the effectiveness of some medications.
                </p>
              </div>
              <button onClick={() => { setTipDismissed(true); try { sessionStorage.setItem('tip-dismissed', 'true') } catch {} }} className="text-amber-400 hover:text-amber-600 shrink-0">✕</button>
            </div>
          )}

          {/* Severity summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 md:p-4">
              <div className="text-lg font-bold text-red-800">{severityConfig.contraindicated.emoji} ممنوع / Contraindicated</div>
              <div className="text-2xl font-bold text-red-700">{contraindicated}</div>
              <div className="text-sm text-red-600">تفاعل ممنوع</div>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 md:p-4">
              <div className="text-lg font-bold text-orange-800">{severityConfig.severe.emoji} شديد / Severe</div>
              <div className="text-2xl font-bold text-orange-700">{severe}</div>
              <div className="text-sm text-orange-600">تفاعل شديد</div>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 md:p-4">
              <div className="text-lg font-bold text-yellow-800">{severityConfig.moderate.emoji} متوسط / Moderate</div>
              <div className="text-2xl font-bold text-yellow-700">{totalInteractions - contraindicated - severe}</div>
              <div className="text-sm text-yellow-600">تفاعل متوسط أو بسيط</div>
            </div>
          </div>

          {/* Quick nav buttons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button onClick={onBrowse} className="bg-nile text-white py-3 rounded-xl font-bold hover:bg-nile-light transition-colors">
              💊 الأدوية / Drugs
            </button>
            <button onClick={onInterview} className="bg-gold text-nile py-3 rounded-xl font-bold hover:bg-gold-light transition-colors">
              🎓 المقابلة / Interview
            </button>
            <button onClick={onPharmacopeia} className="bg-green-700 text-white py-3 rounded-xl font-bold hover:bg-green-600 transition-colors">
              📋 الدستور / Pharmacopeia
            </button>
            <button onClick={onBrowse} className="bg-purple-700 text-white py-3 rounded-xl font-bold hover:bg-purple-600 transition-colors">
              💰 الأسعار / Prices
            </button>
          </div>

          {/* Recently viewed */}
          {recentlyViewed && recentlyViewed.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-nile mb-3">🕐 شوهدت مؤخراً / Recently Viewed</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {recentlyViewed.map(drug => (
                  <div key={drug.id}
                    onClick={() => onViewDrug(drug.id)}
                    className="bg-white border border-sand-dark rounded-xl p-3 text-center hover:shadow-md hover:border-gold transition-all cursor-pointer"
                  >
                    <div className="text-2xl mb-1">{drug.formEmoji || '💊'}</div>
                    <div className="font-bold text-nile text-sm">{drug.nameAr}</div>
                    <div className="text-xs text-gray-500">{drug.nameEn}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Featured drugs */}
          <div>
            <h2 className="text-lg font-bold text-nile mb-3">⭐ أدوية مختارة / Featured Drugs</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {featuredDrugs.map(drug => (
                <div key={drug.id}
                  onClick={() => setExpandedDrug(expandedDrug?.id === drug.id ? null : drug)}
                  className={`bg-white border rounded-xl p-3 text-center hover:shadow-md transition-all cursor-pointer ${
                    expandedDrug?.id === drug.id ? 'border-gold shadow-lg ring-2 ring-gold scale-105 z-10' : 'border-sand-dark'
                  }`}
                >
                  <div className="text-2xl mb-1">{drug.formEmoji || '💊'}</div>
                  <div className="font-bold text-nile text-sm">{drug.nameAr}</div>
                  <div className="text-xs text-gray-500">{drug.nameEn}</div>
                  <div className="text-[10px] text-gray-400 mt-1">{drug.categoryAr}</div>
                </div>
              ))}
            </div>

            {/* Expanded drug detail panel */}
            {expandedDrug && (
              <div className="mt-4 bg-white border border-gold rounded-xl p-5 shadow-lg">
                <div className="flex items-start justify-between mb-3">
                  <button onClick={() => setExpandedDrug(null)} className="text-gray-400 hover:text-gray-600 text-lg">✕</button>
                  <div className="text-right flex-1 mr-3">
                    <h3 className="text-xl font-bold text-nile">{expandedDrug.nameAr}</h3>
                    <p className="text-gray-500">{expandedDrug.nameEn}</p>
                  </div>
                  <div className="text-4xl">{expandedDrug.formEmoji || '💊'}</div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                  {expandedDrug.scientificNameAr && (
                    <div><span className="text-xs text-gray-400 block">الاسم العلمي / Scientific</span><span className="text-gray-700">{expandedDrug.scientificNameAr}</span></div>
                  )}
                  {expandedDrug.categoryAr && (
                    <div><span className="text-xs text-gray-400 block">التصنيف / Category</span><span className="text-gray-700">{expandedDrug.categoryAr}</span></div>
                  )}
                  {expandedDrug.manufacturerEn && (
                    <div><span className="text-xs text-gray-400 block">الشركة المصنعة / Manufacturer</span><span className="text-gray-700">{expandedDrug.manufacturerAr || expandedDrug.manufacturerEn}</span></div>
                  )}
                  {expandedDrug.activeIngredientAr && (
                    <div><span className="text-xs text-gray-400 block">المادة الفعالة / Active Ingredient</span><span className="text-gray-700">{expandedDrug.activeIngredientAr}</span></div>
                  )}
                  {expandedDrug.prices && expandedDrug.prices.length > 0 && (
                    <div><span className="text-xs text-gray-400 block">السعر / Price</span><span className="text-gold-dark font-bold">{expandedDrug.prices[0].price} {expandedDrug.prices[0].unit}</span></div>
                  )}
                  {expandedDrug.descriptionAr && (
                    <div className="col-span-full"><span className="text-xs text-gray-400 block">الوصف / Description</span><p className="text-gray-600 text-xs line-clamp-3">{expandedDrug.descriptionAr}</p></div>
                  )}
                  {expandedDrug.drugInteractions?.length > 0 && (
                    <div><span className="text-xs text-gray-400 block">تفاعلات دوائية / Drug Int.</span>
                      <span className="text-orange-600 font-bold">{expandedDrug.drugInteractions.length} تفاعل</span>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => onViewDrug(expandedDrug.id)}
                  className="mt-3 text-sm bg-nile text-white px-4 py-2 rounded-lg hover:bg-nile-light transition-colors"
                >
                  عرض التفاصيل الكاملة / View Full Details →
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
