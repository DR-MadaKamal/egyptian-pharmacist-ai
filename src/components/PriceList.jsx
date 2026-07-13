import { useState, useMemo } from 'react'

export default function PriceList({ drugs, onViewDrug }) {
  const [query, setQuery] = useState('')
  const [sortBy, setSortBy] = useState('name')

  const sorted = useMemo(() => {
    let result = [...drugs].filter(d => d.prices && d.prices.length > 0)
    if (query) {
      const q = query.toLowerCase()
      result = result.filter(d =>
        d.nameAr.includes(q) || d.nameEn.toLowerCase().includes(q) ||
        d.manufacturerEn?.toLowerCase().includes(q) ||
        d.manufacturerAr?.includes(q)
      )
    }
    switch (sortBy) {
      case 'price-asc': result.sort((a, b) => (a.prices[0]?.price || 0) - (b.prices[0]?.price || 0)); break
      case 'price-desc': result.sort((a, b) => (b.prices[0]?.price || 0) - (a.prices[0]?.price || 0)); break
      default: result.sort((a, b) => a.nameEn.localeCompare(b.nameEn))
    }
    return result
  }, [drugs, query, sortBy])

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-nile">💰 أسعار الأدوية / Drug Prices</h2>

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="ابحث باسم الدواء أو الشركة..."
          className="flex-1 px-4 py-2.5 border border-sand-dark rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-gold text-right"
          dir="auto"
        />
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
        {sorted.map(drug => (
          <div
            key={drug.id}
            onClick={() => onViewDrug(drug.id)}
            className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
          >
            <div className="flex-1">
              <div className="font-bold text-nile text-sm">{drug.nameAr}</div>
              <div className="text-xs text-gray-500">{drug.nameEn}</div>
              <div className="text-xs text-gray-400 mt-0.5">{drug.manufacturerAr || drug.manufacturerEn}</div>
            </div>
            <div className="text-left">
              {drug.prices.map((p, i) => (
                <div key={i} className="text-sm">
                  <span className="font-bold text-gold-dark">{p.price} {p.unit}</span>
                  <span className="text-xs text-gray-500 mr-1">– {p.form}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {sorted.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <div className="text-4xl mb-3">💰</div>
          <p>لا توجد نتائج / No results found</p>
        </div>
      )}
    </div>
  )
}
