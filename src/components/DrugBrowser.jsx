import { useState, useMemo } from 'react'
import { searchDrugs } from '../utils/interactions.js'
import { drugCategories, drugCategoriesAr } from '../data/drugs.js'

export default function DrugBrowser({ drugs, onViewDrug }) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')

  const filtered = useMemo(() => {
    let result = searchDrugs(drugs, query)
    if (category) {
      result = result.filter(d => d.category === category)
    }
    return result
  }, [drugs, query, category])

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-nile">🔍 تصفح الأدوية / Drug Browser</h2>

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="ابحث باسم الدواء (عربي/English)..."
          className="flex-1 px-4 py-2.5 border border-sand-dark rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-gold text-right"
          dir="auto"
        />
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="px-4 py-2.5 border border-sand-dark rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-gold"
        >
          <option value="">كل التصنيفات / All Categories</option>
          {drugCategories.map((cat, i) => (
            <option key={cat} value={cat}>{cat} | {drugCategoriesAr[i]}</option>
          ))}
        </select>
      </div>

      <div className="text-sm text-gray-500">
        {filtered.length} دواء / drugs found
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map(drug => (
          <div
            key={drug.id}
            onClick={() => onViewDrug(drug.id)}
            className="bg-white border border-sand-dark rounded-xl p-4 hover:shadow-md transition-all cursor-pointer hover:border-gold"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="text-right flex-1">
                <div className="font-bold text-nile text-lg">{drug.nameAr}</div>
                <div className="text-sm text-gray-500">{drug.nameEn}</div>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="bg-sand text-nile text-xs px-2 py-0.5 rounded-full">{drug.categoryAr}</span>
                  <span className="text-[10px] text-gray-400">{drug.category}</span>
                </div>
              </div>
              <div className="text-3xl">{drug.formEmoji || '💊'}</div>
            </div>
            <p className="text-xs text-gray-500 mt-2 line-clamp-2">{drug.description}</p>
            <div className="flex items-center justify-between mt-2">
              <div className="flex gap-2 text-xs">
                {drug.drugInteractions.length > 0 && (
                  <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded">
                    {drug.drugInteractions.length} تفاعل دوائي
                  </span>
                )}
                {drug.diseaseInteractions.length > 0 && (
                  <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                    {drug.diseaseInteractions.length} تفاعل مرضي
                  </span>
                )}
              </div>
              <span className="text-xs text-gray-400">{drug.manufacturerEn || ''}</span>
            </div>
            {drug.prices && drug.prices.length > 0 && (
              <div className="mt-1 text-xs text-gold-dark font-bold">
                {drug.prices[0].price} {drug.prices[0].unit}
                {drug.prices.length > 1 ? ` (+${drug.prices.length - 1})` : ''}
              </div>
            )}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <div className="text-4xl mb-3">🔍</div>
          <p>لا توجد أدوية مطابقة للبحث / No drugs match your search</p>
        </div>
      )}
    </div>
  )
}
