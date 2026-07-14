import { useState, useMemo, useEffect } from 'react'
import { loadEgyptianDrugs, searchEgyptianDrugs, getEgyptianDrugClasses, getEgyptianManufacturers, getEgyptianRoutes } from '../utils/egyptianDbLoader.js'

const CLASS_COLORS = {
  'ANALGESIC': 'bg-red-100 text-red-700',
  'ANTIBIOTIC': 'bg-blue-100 text-blue-700',
  'ANTIBIOTIC.QUINOLONE': 'bg-blue-100 text-blue-700',
  'ANTIBIOTIC.CEPHALOSPORIN': 'bg-blue-100 text-blue-700',
  'ANTIBIOTIC.MACROLIDE': 'bg-blue-100 text-blue-700',
  'ANTIHYPERTENSIVE': 'bg-purple-100 text-purple-700',
  'ANTIDIABETIC': 'bg-amber-100 text-amber-700',
  'ANTIPYRETIC': 'bg-orange-100 text-orange-700',
  'ANTIDEPRESSANT': 'bg-indigo-100 text-indigo-700',
  'ANTIHISTAMINE': 'bg-teal-100 text-teal-700',
  'PEPTIC ULCER': 'bg-emerald-100 text-emerald-700',
  'NSAID': 'bg-rose-100 text-rose-700',
  'RESPIRATORY': 'bg-cyan-100 text-cyan-700',
  'VITAMIN': 'bg-yellow-100 text-yellow-700',
  'SUPPLEMENT': 'bg-lime-100 text-lime-700',
  'HORMONAL': 'bg-fuchsia-100 text-fuchsia-700',
  'ANTIFUNGAL': 'bg-green-100 text-green-700',
  'ANTIVIRAL': 'bg-violet-100 text-violet-700',
  'SKIN CARE': 'bg-pink-100 text-pink-700',
  'HAIR CARE': 'bg-pink-100 text-pink-700',
  'COLD PRODUCTS': 'bg-sky-100 text-sky-700',
  'COUGH PRODUCTS': 'bg-sky-100 text-sky-700',
  'CARDIOVASCULAR': 'bg-rose-100 text-rose-700',
  'PSYCHIATRIC': 'bg-indigo-100 text-indigo-700',
  'DIURETIC': 'bg-cyan-100 text-cyan-700',
  'MULTIVITAMIN': 'bg-yellow-100 text-yellow-700',
  'MULTIVITAMINS': 'bg-yellow-100 text-yellow-700',
  'MASSAGE CREAM': 'bg-pink-100 text-pink-700',
  'SUN BLOCK': 'bg-orange-100 text-orange-700',
  'SEXUAL TONIC': 'bg-rose-100 text-rose-700',
  'WEIGHT LOSS': 'bg-amber-100 text-amber-700',
  'ORAL CARE': 'bg-teal-100 text-teal-700',
  'GLUCOCORTICOID': 'bg-purple-100 text-purple-700',
}

function getClassColor(drugClass) {
  if (!drugClass) return 'bg-gray-100 text-gray-600'
  const upper = drugClass.toUpperCase()
  for (const [key, val] of Object.entries(CLASS_COLORS)) {
    if (upper.includes(key)) return val
  }
  return 'bg-gray-100 text-gray-600'
}

function getRouteBadge(route) {
  if (!route) return null
  const r = route.toUpperCase()
  if (r.includes('ORAL')) return 'bg-nile/10 text-nile border border-nile/20'
  if (r.includes('TOPICAL')) return 'bg-gold/20 text-gold-dark border border-gold/30'
  if (r.includes('INJECT')) return 'bg-red-50 text-red-600 border border-red-200'
  if (r.includes('EYE')) return 'bg-indigo-50 text-indigo-600 border border-indigo-200'
  if (r.includes('INHAL')) return 'bg-emerald-50 text-emerald-600 border border-emerald-200'
  if (r.includes('NASAL')) return 'bg-sky-50 text-sky-600 border border-sky-200'
  if (r.includes('RECTAL')) return 'bg-amber-50 text-amber-600 border border-amber-200'
  if (r.includes('VAGINAL')) return 'bg-rose-50 text-rose-600 border border-rose-200'
  return 'bg-gray-100 text-gray-600 border border-gray-200'
}

const ITEMS_PER_PAGE = 50

export default function DrugEncyclopedia({ onBack, onViewDrug, allDrugs }) {
  const [drugs, setDrugs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [query, setQuery] = useState('')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [drugClassFilter, setDrugClassFilter] = useState('')
  const [manufacturerFilter, setManufacturerFilter] = useState('')
  const [routeFilter, setRouteFilter] = useState('')
  const [priceMin, setPriceMin] = useState('')
  const [priceMax, setPriceMax] = useState('')
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE)
  const [drugClasses, setDrugClasses] = useState([])
  const [manufacturers, setManufacturers] = useState([])
  const [routes, setRoutes] = useState([])

  const loadDatabase = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await loadEgyptianDrugs()
      setDrugs(data)
      setDrugClasses(getEgyptianDrugClasses(data))
      setManufacturers(getEgyptianManufacturers(data))
      setRoutes(getEgyptianRoutes(data))
    } catch (err) {
      setError(err.message || 'فشل تحميل قاعدة البيانات / Failed to load database')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadDatabase() }, [])

  const filtered = useMemo(() => {
    const filters = {}
    if (drugClassFilter) filters.drugClass = drugClassFilter
    if (manufacturerFilter) filters.manufacturer = manufacturerFilter
    if (routeFilter) filters.route = routeFilter
    if (priceMin) filters.priceMin = parseFloat(priceMin)
    if (priceMax) filters.priceMax = parseFloat(priceMax)
    return searchEgyptianDrugs(drugs, query, filters)
  }, [drugs, query, drugClassFilter, manufacturerFilter, routeFilter, priceMin, priceMax])

  const visibleDrugs = useMemo(() => filtered.slice(0, visibleCount), [filtered, visibleCount])
  const hasMore = visibleCount < filtered.length

  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE)
  }, [query, drugClassFilter, manufacturerFilter, routeFilter, priceMin, priceMax])

  const activeFilterCount = [drugClassFilter, manufacturerFilter, routeFilter, priceMin, priceMax].filter(Boolean).length

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-nile">📖 الدليل الدواء المصري / Egyptian Drug Encyclopedia</h2>
          <button onClick={onBack} className="text-sm bg-gray-100 text-gray-500 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors">← العودة</button>
        </div>
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-sand rounded-full" />
            <div className="absolute inset-0 border-4 border-transparent border-t-gold rounded-full animate-spin" />
          </div>
          <div className="text-center">
            <p className="text-nile text-lg font-medium">جاري تحميل قاعدة البيانات...</p>
            <p className="text-gray-500 text-sm mt-1">Loading 25,070 Egyptian medicines</p>
            <p className="text-gray-400 text-xs mt-2">يتم التحميل من GitHub — يُخزّن مؤقتاً في المتصفح</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-nile">📖 الدليل الدواء المصري / Egyptian Drug Encyclopedia</h2>
          <button onClick={onBack} className="text-sm bg-gray-100 text-gray-500 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors">← العودة</button>
        </div>
        <div className="flex flex-col items-center justify-center py-24 gap-4 px-4">
          <div className="text-5xl">⚠️</div>
          <p className="text-red-500 text-lg text-center">{error}</p>
          <button onClick={loadDatabase} className="mt-2 px-6 py-2 bg-gold text-nile rounded-xl hover:bg-gold-light transition-colors font-bold">
            إعادة المحاولة / Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-nile">📖 الدليل الدواء المصري / Egyptian Drug Encyclopedia</h2>
        <button onClick={onBack} className="text-sm bg-gray-100 text-gray-500 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors">← العودة</button>
      </div>

      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="بحث بالاسم الإنجليزي أو العربي أو العلمي أو الشركة... / Search by English, Arabic, scientific name, or manufacturer..."
          dir="auto"
          className="w-full border border-sand-dark rounded-xl py-3 pl-10 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-nile focus:border-transparent transition-all"
        />
        {query && (
          <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">✕</button>
        )}
      </div>

      <div className="bg-white border border-sand-dark rounded-xl overflow-hidden">
        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className="w-full flex items-center justify-between px-4 py-3 text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <span className="flex items-center gap-2 text-sm">
            <span className={`transition-transform ${filtersOpen ? 'rotate-90' : ''}`}>▶</span>
            <span>الفلاتر / Filters</span>
            {activeFilterCount > 0 && (
              <span className="bg-gold text-nile text-xs px-2 py-0.5 rounded-full font-bold">{activeFilterCount}</span>
            )}
          </span>
          {activeFilterCount > 0 && (
            <button
              onClick={e => { e.stopPropagation(); setDrugClassFilter(''); setManufacturerFilter(''); setRouteFilter(''); setPriceMin(''); setPriceMax('') }}
              className="text-xs text-red-500 hover:text-red-700 transition-colors"
            >
              مسح الكل / Clear
            </button>
          )}
        </button>

        {filtersOpen && (
          <div className="px-4 pb-4 space-y-3 border-t border-gray-100 pt-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-gray-500 text-xs block mb-1">التصنيف الدوائي / Drug Class ({drugClasses.length})</label>
                <select value={drugClassFilter} onChange={e => setDrugClassFilter(e.target.value)}
                  className="w-full border border-sand-dark rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-nile appearance-none cursor-pointer bg-white">
                  <option value="">الكل / All</option>
                  {drugClasses.slice(0, 200).map(c => (
                    <option key={c.name} value={c.name}>{c.name} ({c.count})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-gray-500 text-xs block mb-1">الشركة المصنعة / Manufacturer ({manufacturers.length})</label>
                <select value={manufacturerFilter} onChange={e => setManufacturerFilter(e.target.value)}
                  className="w-full border border-sand-dark rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-nile appearance-none cursor-pointer bg-white">
                  <option value="">الكل / All</option>
                  {manufacturers.slice(0, 200).map(m => (
                    <option key={m.name} value={m.name}>{m.name} ({m.count})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-gray-500 text-xs block mb-1">طريقة الاستخدام / Route ({routes.length})</label>
                <select value={routeFilter} onChange={e => setRouteFilter(e.target.value)}
                  className="w-full border border-sand-dark rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-nile appearance-none cursor-pointer bg-white">
                  <option value="">الكل / All</option>
                  {routes.map(r => (
                    <option key={r.name} value={r.name}>{r.name} ({r.count})</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <label className="text-gray-500 text-xs">السعر / Price (EGP)</label>
              <input type="number" value={priceMin} onChange={e => setPriceMin(e.target.value)} placeholder="من / Min" min="0"
                className="w-28 border border-sand-dark rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-nile placeholder:text-gray-400" />
              <span className="text-gray-400">—</span>
              <input type="number" value={priceMax} onChange={e => setPriceMax(e.target.value)} placeholder="إلى / Max" min="0"
                className="w-28 border border-sand-dark rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-nile placeholder:text-gray-400" />
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between px-1">
        <p className="text-gray-500 text-sm" dir="auto">
          <span className="text-nile font-bold">{filtered.length.toLocaleString()}</span>
          {filtered.length !== drugs.length && (
            <span> / {drugs.length.toLocaleString()}</span>
          )}
          {' '}دواء / drugs
        </p>
      </div>

      <div className="space-y-2">
        {visibleDrugs.length === 0 ? (
          <div className="text-center py-16 bg-white border border-sand-dark rounded-xl">
            <p className="text-4xl mb-3">🔎</p>
            <p className="text-gray-500 text-lg">لا توجد نتائج / No results found</p>
            <p className="text-gray-400 text-sm mt-1">جرب تغيير معايير البحث / Try changing search criteria</p>
          </div>
        ) : (
          visibleDrugs.map((drug, i) => {
            const matchDrug = allDrugs?.find(d =>
              d.nameEn && drug.commercial_name_en && d.nameEn.toUpperCase() === drug.commercial_name_en.toUpperCase()
            )
            const Wrapper = matchDrug && onViewDrug ? 'button' : 'div'
            return (
              <Wrapper
                key={i}
                {...(matchDrug && onViewDrug ? { onClick: () => onViewDrug(matchDrug.id) } : {})}
                className={`w-full text-left bg-white border border-sand-dark rounded-xl p-4 transition-all ${
                  matchDrug && onViewDrug
                    ? 'hover:border-gold hover:shadow-md cursor-pointer'
                    : ''
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex-1 min-w-0" dir="auto">
                    <h3 className={`font-bold text-sm md:text-base truncate ${matchDrug && onViewDrug ? 'text-nile hover:text-gold-dark' : 'text-nile'}`}>
                      {matchDrug && onViewDrug ? '🔗 ' : ''}{drug.commercial_name_en}
                    </h3>
                    {drug.commercial_name_ar && (
                      <p className="text-gray-600 text-sm mt-0.5 truncate">{drug.commercial_name_ar}</p>
                    )}
                    {drug.scientific_name && (
                      <p className="text-gold-dark text-xs mt-1 truncate italic">{drug.scientific_name}</p>
                    )}
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      {drug.manufacturer && (
                        <span className="text-gray-400 text-xs">🏭 {drug.manufacturer}</span>
                      )}
                      {drug.drug_class && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getClassColor(drug.drug_class)}`}>
                          {drug.drug_class}
                        </span>
                      )}
                      {drug.route && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getRouteBadge(drug.route)}`}>
                          {drug.route}
                        </span>
                      )}
                    </div>
                  </div>
                  {drug.price_egp != null && drug.price_egp > 0 && (
                    <div className="flex-shrink-0 bg-gold/10 border border-gold/30 rounded-lg px-3 py-2 text-center sm:text-right">
                      <span className="text-nile font-bold text-lg">{drug.price_egp}</span>
                      <span className="text-gray-500 text-xs block">ج.م / EGP</span>
                    </div>
                  )}
                </div>
              </Wrapper>
            )
          })
        )}
      </div>

      {hasMore && (
        <div className="text-center py-4">
          <button
            onClick={() => setVisibleCount(prev => prev + ITEMS_PER_PAGE)}
            className="px-8 py-3 bg-nile text-white rounded-xl font-bold hover:bg-nile-light transition-colors"
          >
            عرض المزيد ({filtered.length - visibleCount} متبقي) / Load More
          </button>
        </div>
      )}

      <div className="h-8" />
    </div>
  )
}
