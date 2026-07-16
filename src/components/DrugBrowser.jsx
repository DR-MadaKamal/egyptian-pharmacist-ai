import { useState, useMemo, useEffect, useRef } from 'react'
import { drugCategories, drugCategoriesAr } from '../data/drugs.js'
import { edaSupplement } from '../data/eda-supplement.js'
import Highlight from './Highlight.jsx'

const MFR_ICONS = new Map([
  ['glaxo', '🧬'], ['gsk', '🧬'], ['pfizer', '🔵'], ['novartis', '🔴'], ['sanofi', '🟦'],
  ['bayer', '➕'], ['roche', '🔬'], ['johnson', '🤱'], ['abbott', '🅰️'], ['merck', '⬇️'],
  ['novo nordisk', '🩸'], ['astrazeneca', '🟢'], ['takeda', '🔶'], ['lilly', '💉'],
  ['boehringer', '🫁'], ['sandoz', '🟣'], ['tev', '💊'], ['hikma', '🔷'], ['eipico', '🇪🇬'],
  ['alexandria', '🏛️'], ['misr', '🇪🇬'], ['sigma', 'Σ'], ['memphis', '🏺'],
  ['arabic', '🌙'], ['pharco', '🔺'], ['amoun', '🟠'],
])

const getMfrIcon = (name) => {
  if (!name) return '🏭'
  const n = name.toLowerCase()
  for (const [key, icon] of MFR_ICONS) {
    if (n.includes(key)) return icon
  }
  return '🏭'
}

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
  const [query, setQuery] = useState(() => {
    try { return sessionStorage.getItem('home-search') || '' } catch { return '' }
  })

  useEffect(() => {
    try { sessionStorage.removeItem('home-search') } catch {}
  }, [])
  const [category, setCategory] = useState('')
  const [routeFilter, setRouteFilter] = useState('')
  const [mfrFilter, setMfrFilter] = useState('')
  const [page, setPage] = useState(1)
  const [showEda, setShowEda] = useState(false)
  const [focused, setFocused] = useState(false)
  const [catFocused, setCatFocused] = useState(false)

  const enriched = useMemo(() => drugs.filter(d => !d.edaOnly), [drugs])
  const edaOnly = useMemo(() => drugs.filter(d => d.edaOnly), [drugs])

  const allRoutes = useMemo(() => {
    const routes = new Set()
    drugs.forEach(d => getDrugRouteNorm(d).forEach(r => routes.add(r)))
    return [...routes].sort()
  }, [drugs])

  const allManufacturers = useMemo(() => {
    const mfrs = new Set()
    drugs.forEach(d => {
      if (d.manufacturerEn) mfrs.add(d.manufacturerEn)
      if (d.manufacturerAr) mfrs.add(d.manufacturerAr)
    })
    return [...mfrs].sort()
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
    if (mfrFilter) {
      result = result.filter(d => d.manufacturerEn === mfrFilter || d.manufacturerAr === mfrFilter)
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

  const suggestions = useMemo(() => {
    const q = query.toLowerCase().trim()
    if (!q || q.length < 2) return []
    const matches = drugs.filter(d => {
      if (d.nameEn?.toLowerCase().includes(q)) return true
      if (d.nameAr?.includes(q)) return true
      if (d.scientificNameEn?.toLowerCase().includes(q)) return true
      if (d.scientificNameAr?.includes(q)) return true
      return false
    })
    return matches.slice(0, 5)
  }, [drugs, query])

  const handleLoadMore = () => setPage(p => p + 1)

  const sentinelRef = useRef(null)
  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && pageItems.length < allFiltered.length) {
        handleLoadMore()
      }
    }, { rootMargin: '200px' })
    obs.observe(el)
    return () => obs.disconnect()
  }, [pageItems.length, allFiltered.length])

  const handleSuggestionClick = (name) => {
    setQuery(name)
    setFocused(false)
    setPage(1)
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-nile">🔍 تصفح الأدوية / Drug Browser</h2>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={e => { setQuery(e.target.value); setPage(1) }}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 200)}
            placeholder="ابحث باسم الدواء (عربي/English)..."
            className="w-full px-4 py-2.5 border border-sand-dark rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-gold text-right"
            dir="auto"
          />
          {focused && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-sand-dark rounded-xl shadow-lg z-10 overflow-hidden">
              {suggestions.map(d => (
                <button
                  key={d.id}
                  onMouseDown={() => handleSuggestionClick(d.nameAr || d.nameEn)}
                  className="w-full text-right px-4 py-2.5 text-sm hover:bg-sand transition-colors border-b border-gray-100 last:border-b-0"
                >
                  <span className="text-gray-800">{d.nameAr}</span>
                  <span className="text-gray-400 mr-2 text-xs">{d.nameEn}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="relative">
          <input
            type="text"
            value={category}
            onChange={e => { setCategory(e.target.value); setPage(1) }}
            onFocus={() => setCatFocused(true)}
            onBlur={() => setTimeout(() => setCatFocused(false), 200)}
            placeholder="التصنيف / Category..."
            className="w-full px-4 py-2.5 border border-sand-dark rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-gold"
          />
          {catFocused && (category ? drugCategories.filter(c => c.toLowerCase().includes(category.toLowerCase())).length > 0 : true) && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-sand-dark rounded-xl shadow-lg z-10 overflow-hidden max-h-48 overflow-y-auto">
              {(category ? drugCategories.filter(c => c.toLowerCase().includes(category.toLowerCase())) : drugCategories).map((cat, i) => (
                <button
                  key={cat}
                  onMouseDown={() => { setCategory(cat); setPage(1) }}
                  className="w-full text-right px-4 py-2 text-sm hover:bg-sand transition-colors border-b border-gray-100 last:border-b-0"
                >
                  {cat} | {drugCategoriesAr[i]}
                </button>
              ))}
            </div>
          )}
        </div>
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
        <select
          value={mfrFilter}
          onChange={e => { setMfrFilter(e.target.value); setPage(1) }}
          className="px-4 py-2.5 border border-sand-dark rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-gold"
        >
          <option value="">كل الشركات / All Manufacturers</option>
          {allManufacturers.map(m => (
            <option key={m} value={m}>{m}</option>
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
        {pageItems.map((drug, i) => (
          <div
            key={drug.id}
            onClick={() => onViewDrug(drug.id)}
            style={{ animationDelay: `${i * 30}ms` }}
            className={`animate-[fade-in_0.4s_ease-out_both] bg-white border rounded-xl p-4 hover:shadow-md transition-all cursor-pointer ${drug.edaOnly ? 'border-gray-200 hover:border-gray-400' : 'border-sand-dark hover:border-gold'}`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="text-right flex-1">
                <div className={`font-bold text-nile ${drug.edaOnly ? 'text-base' : 'text-lg'}`}>
                  <Highlight text={drug.edaBrands?.[0] || drug.nameAr} query={query} />
                </div>
                {drug.edaBrands?.[0] && drug.edaBrands[0] !== drug.nameAr && (
                  <div className="text-sm text-gray-500"><Highlight text={drug.nameAr} query={query} /></div>
                )}
                {!drug.edaBrands?.[0] && drug.nameEn !== drug.nameAr && (
                  <div className="text-sm text-gray-500"><Highlight text={drug.nameEn} query={query} /></div>
                )}
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
                <div>🏷 {(drug.edaBrands && drug.edaBrands.length > 0) ? drug.edaBrands.slice(0, 3).join(', ') + (drug.edaBrands.length > 3 ? ` +${drug.edaBrands.length - 3}` : '') : 'غير متوفر'}</div>
                <div className="mt-1">🏭 {(drug.edaMfrs && drug.edaMfrs.length > 0) ? drug.edaMfrs.join(', ') : 'غير متوفر'}</div>
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
                {!drug.edaOnly && (drug.drugInteractions || []).length > 0 && (
                  <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded">
                    {(drug.drugInteractions || []).length} تفاعل دوائي
                  </span>
                )}
                {!drug.edaOnly && (drug.diseaseInteractions || []).length > 0 && (
                  <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                    {(drug.diseaseInteractions || []).length} تفاعل مرضي
                  </span>
                )}
              </div>
              <span className="text-xs text-gray-400">{getMfrIcon(drug.manufacturerEn)} {drug.manufacturerEn || ''}</span>
            </div>
            {drug.edaOnly ? (
              drug.edaRf && drug.edaRf.length > 0 ? (
                <div className="mt-1 space-y-0.5">
                  {drug.edaRf.map(([route, _form, pmin, pmax], i) => (
                    <div key={i}>
                      <div className="text-[10px] text-gold-dark font-bold">
                        EGP {pmin}{pmin !== pmax ? `-${pmax}` : ''} | {route}
                      </div>
                      {pmin && pmax && pmin !== pmax && (
                        <div className="w-full h-1 bg-gray-100 rounded-full mt-0.5 overflow-hidden">
                          <div className="h-full bg-gold rounded-full" style={{ width: `${Math.min(100, (pmax / 200) * 100)}%` }} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : drug.edaPriceRange && drug.edaPriceRange.length > 0 ? (
                <div className="mt-1">
                  <div className="text-xs text-gold-dark font-bold">
                    EGP {drug.edaPriceRange[0]} – {drug.edaPriceRange[1]}
                  </div>
                  <div className="w-full h-1 bg-gray-100 rounded-full mt-0.5 overflow-hidden">
                    <div className="h-full bg-gold rounded-full" style={{ width: `${Math.min(100, (drug.edaPriceRange[1] / 200) * 100)}%` }} />
                  </div>
                </div>
              ) : null
            ) : (
              drug.prices && drug.prices.length > 0 && (
                <div className="mt-1">
                  <div className="text-xs text-gold-dark font-bold">
                    {drug.prices[0].price} {drug.prices[0].unit}{drug.prices.length > 1 ? ` (+${drug.prices.length - 1})` : ''}
                  </div>
                  <div className="w-full h-1 bg-gray-100 rounded-full mt-0.5 overflow-hidden">
                    <div className="h-full bg-gold rounded-full" style={{ width: `${Math.min(100, (drug.prices[0].price / 200) * 100)}%` }} />
                  </div>
                </div>
              )
            )}
          </div>
        ))}
      </div>

      {(query || category || routeFilter || mfrFilter) && (
        <div className="flex flex-wrap gap-1.5 items-center">
          {query && (
            <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs">
              بحث: {query}
              <button onClick={() => { setQuery(''); setPage(1) }} className="hover:text-blue-900">✕</button>
            </span>
          )}
          {category && (
            <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-full text-xs">
              {category}
              <button onClick={() => { setCategory(''); setPage(1) }} className="hover:text-green-900">✕</button>
            </span>
          )}
          {routeFilter && (
            <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 px-2 py-1 rounded-full text-xs">
              {ROUTE_LABELS[routeFilter] || routeFilter}
              <button onClick={() => { setRouteFilter(''); setPage(1) }} className="hover:text-purple-900">✕</button>
            </span>
          )}
          {mfrFilter && (
            <span className="inline-flex items-center gap-1 bg-orange-50 text-orange-700 px-2 py-1 rounded-full text-xs">
              {mfrFilter}
              <button onClick={() => { setMfrFilter(''); setPage(1) }} className="hover:text-orange-900">✕</button>
            </span>
          )}
          <button
            onClick={() => { setQuery(''); setCategory(''); setRouteFilter(''); setMfrFilter(''); setShowEda(false); setPage(1) }}
            className="text-xs text-red-500 hover:text-red-700 mr-2"
          >
            مسح الكل / Clear all
          </button>
        </div>
      )}

      {pageItems.length < allFiltered.length && (
        <div ref={sentinelRef} className="text-center py-4">
          <div className="inline-block w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-gray-400 mt-2">جاري تحميل المزيد... / Loading more...</p>
        </div>
      )}

      {allFiltered.length > PAGE_SIZE && (
        <div className="text-center">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-xs text-gray-400 hover:text-gray-600"
          >
            ↑ العودة للأعلى / Back to top
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
