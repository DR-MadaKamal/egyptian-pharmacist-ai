import { useState, useMemo } from 'react'

const ROUTE_LABELS = {
  'ORAL': 'فموي', 'TOPICAL': 'موضعي', 'INJECTION': 'حقن', 'SPRAY': 'رذاذ',
  'OPHTHALMIC': 'عين', 'OTIC': 'أذن', 'VAGINAL': 'مهبلي', 'RECTAL': 'شرجي', 'EFF': 'فوار',
}

function getDrugRoutes(d) {
  if (d.edaRf) return d.edaRf.map(r => r[0] + '.' + r[1])
  if (d.edaRoutes && d.edaRoutes.length > 0) return d.edaRoutes
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

export default function PriceList({ drugs, onViewDrug }) {
  const [query, setQuery] = useState('')
  const [routeFilter, setRouteFilter] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [page, setPage] = useState(1)
  const PAGE_SIZE = 100

  const allRoutes = useMemo(() => {
    const routes = new Set()
    drugs.forEach(d => getDrugRouteNorm(d).forEach(r => routes.add(r)))
    return [...routes].sort()
  }, [drugs])

  const sorted = useMemo(() => {
    let result = [...drugs].filter(d => d.prices && d.prices.length > 0)
    if (query) {
      const q = query.toLowerCase()
      result = result.filter(d =>
        d.nameAr.includes(q) || d.nameEn.toLowerCase().includes(q) ||
        (d.manufacturerEn || '').toLowerCase().includes(q) ||
        (d.edaBrands || []).some(b => b.toLowerCase().includes(q))
      )
    }
    if (routeFilter) {
      result = result.filter(d => getDrugRouteNorm(d).includes(routeFilter))
    }
    switch (sortBy) {
      case 'price-asc': result.sort((a, b) => {
        const pa = a.edaPriceRange ? a.edaPriceRange[0] : (a.prices[0]?.price || 0)
        const pb = b.edaPriceRange ? b.edaPriceRange[0] : (b.prices[0]?.price || 0)
        return pa - pb
      }); break
      case 'price-desc': result.sort((a, b) => {
        const pa = a.edaPriceRange ? a.edaPriceRange[1] : (a.prices[0]?.price || 0)
        const pb = b.edaPriceRange ? b.edaPriceRange[1] : (b.prices[0]?.price || 0)
        return pb - pa
      }); break
      default: result.sort((a, b) => a.nameEn.localeCompare(b.nameEn))
    }
    return result
  }, [drugs, query, routeFilter, sortBy])

  const pageItems = sorted.slice(0, page * PAGE_SIZE)

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-nile">💰 أسعار الأدوية / Drug Prices</h2>

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={query}
          onChange={e => { setQuery(e.target.value); setPage(1) }}
          placeholder="ابحث باسم الدواء أو الشركة..."
          className="flex-1 px-4 py-2.5 border border-sand-dark rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-gold text-right"
          dir="auto"
        />
        <select
          value={routeFilter}
          onChange={e => { setRouteFilter(e.target.value); setPage(1) }}
          className="px-4 py-2.5 border border-sand-dark rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-gold"
        >
          <option value="">كل الطرق / All Routes</option>
          {allRoutes.map(r => (
            <option key={r} value={r}>{ROUTE_LABELS[r] || r}</option>
          ))}
        </select>
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className="px-4 py-2.5 border border-sand-dark rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-gold"
        >
          <option value="name">الاسم / Name</option>
          <option value="price-asc">السعر: الأقل أولاً / Price: Low to High</option>
          <option value="price-desc">السعر: الأعلى أولاً / Price: High to Low</option>
        </select>
      </div>

      <div className="text-sm text-gray-500">
        {sorted.length} دواء / drugs with prices
      </div>

      <div className="bg-white border border-sand-dark rounded-xl overflow-hidden">
        {pageItems.map(drug => (
          <div
            key={drug.id}
            onClick={() => onViewDrug(drug.id)}
            className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
          >
            <div className="flex-1 min-w-0">
              <div className="font-bold text-nile text-sm">{drug.nameAr}</div>
              <div className="text-xs text-gray-500 truncate">{drug.nameEn}</div>
              <div className="text-xs text-gray-400 mt-0.5">
                {(drug.edaOnly ? (drug.edaMfrs || []).join(', ') : (drug.manufacturerAr || drug.manufacturerEn)) || 'غير متوفر'}
              </div>
            </div>
            <div className="text-left shrink-0 mr-3">
              {drug.edaOnly ? (
                drug.edaRf && drug.edaRf.length > 0 ? (
                  <div className="text-right">
                    {drug.edaRf.map(([route, form, pmin, pmax], i) => (
                      <div key={i} className="text-xs whitespace-nowrap leading-relaxed">
                        <span className="font-bold text-gold-dark">EGP {pmin}{pmin !== pmax ? `-${pmax}` : ''}</span>
                        <span className="text-gray-500 mx-1">|</span>
                        <span className="text-gray-600">{route}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  drug.edaPriceRange.length > 0 && (
                    <div className="text-sm font-bold text-gold-dark">
                      EGP {drug.edaPriceRange[0]} – {drug.edaPriceRange[1]}
                    </div>
                  )
                )
              ) : (
                drug.prices.map((p, i) => (
                  <div key={i} className="text-sm leading-relaxed">
                    <span className="font-bold text-gold-dark">{p.price} {p.unit}</span>
                    <span className="text-xs text-gray-500 mr-1">– {p.form}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>

      {pageItems.length < sorted.length && (
        <div className="text-center">
          <button
            onClick={() => setPage(p => p + 1)}
            className="px-6 py-2 bg-gold text-white rounded-xl hover:bg-gold-dark transition-colors"
          >
            عرض المزيد / Load More ({sorted.length - pageItems.length} متبقي)
          </button>
        </div>
      )}

      {sorted.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <div className="text-4xl mb-3">💰</div>
          <p>لا توجد نتائج / No results found</p>
        </div>
      )}
    </div>
  )
}
