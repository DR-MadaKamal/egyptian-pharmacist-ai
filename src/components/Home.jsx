import { useState, useEffect, useRef, useMemo } from 'react'
import { severityConfig } from '../utils/interactions.js'

function AnimatedCounter({ end, suffix }) {
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

  return <span ref={ref}>{val}{suffix}</span>
}

export default function Home({ drugs, diseases, recentlyViewed, onBrowse, onInterview, onPrices, onPharmacopeia, onSearch }) {
  const [quickQuery, setQuickQuery] = useState('')
  const [tipDismissed, setTipDismissed] = useState(() => {
    try { return sessionStorage.getItem('tip-dismissed') === 'true' } catch { return false }
  })
  const suggestions = drugs.filter(d => {
    if (!quickQuery.trim() || quickQuery.length < 2) return false
    const q = quickQuery.toLowerCase()
    return d.nameEn?.toLowerCase().includes(q) || d.nameAr?.includes(q)
  }).slice(0, 5)

  const enrichedDrugs = useMemo(() => drugs.filter(d => !d.edaOnly), [drugs])
  const [featuredDrugs, setFeaturedDrugs] = useState(() => {
    const shuffled = [...(drugs.filter(d => !d.edaOnly))].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, 6)
  })
  const [expandedDrug, setExpandedDrug] = useState(null)

  useEffect(() => {
    const interval = setInterval(() => {
      const shuffled = [...enrichedDrugs].sort(() => Math.random() - 0.5)
      setFeaturedDrugs(shuffled.slice(0, 6))
    }, 15000)
    return () => clearInterval(interval)
  }, [enrichedDrugs])
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
      <div className="text-center py-6 md:py-10">
        <h1 className="text-3xl md:text-4xl font-bold text-nile mb-2">
         الصيدلي المصري الشامل
        </h1>
        <p className="text-gray-600 text-base md:text-lg">
          Complete Egyptian Pharmacist AI
        </p>
        <p className="text-gray-500 text-sm mt-2 max-w-xl mx-auto">
          مرجع ذكي شامل للتفاعلات الدوائية والدوائية-مرضية مع تقييم بالذكاء الاصطناعي
          — Smart comprehensive DDI & Drug-Disease Reference with AI Interview Mode
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {[
          { label: 'الأدوية', labelEn: 'Drugs', value: drugs.length, color: 'bg-nile', icon: '💊' },
          { label: 'الأمراض', labelEn: 'Diseases', value: diseases.length, color: 'bg-nile-light', icon: '🦠' },
          { label: 'التفاعلات', labelEn: 'Interactions', value: totalInteractions, color: 'bg-gold-dark', icon: '⚡' },
          { label: 'تصنيفات', labelEn: 'Categories', value: categories, color: 'bg-green-700', icon: '📊' },
        ].map(stat => (
          <div key={stat.labelEn} className={`${stat.color} text-white rounded-xl p-3 md:p-4 text-center`}>
            <div className="text-2xl md:text-3xl mb-1">{stat.icon}</div>
            <div className="text-xl md:text-2xl font-bold"><AnimatedCounter end={stat.value} suffix="" /></div>
            <div className="text-xs md:text-sm text-white/80">{stat.label}</div>
            <div className="text-[10px] text-white/50">{stat.labelEn}</div>
          </div>
        ))}
      </div>

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
        <button onClick={onPrices} className="bg-purple-700 text-white py-3 rounded-xl font-bold hover:bg-purple-600 transition-colors">
          💰 الأسعار / Prices
        </button>
      </div>

      {recentlyViewed && recentlyViewed.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-nile mb-3">🕐 شوهدت مؤخراً / Recently Viewed</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {recentlyViewed.map(drug => (
              <div key={drug.id} className="bg-white border border-sand-dark rounded-xl p-3 text-center hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => onBrowse()}
              >
                <div className="text-2xl mb-1">{drug.formEmoji || '💊'}</div>
                <div className="font-bold text-nile text-sm">{drug.nameAr}</div>
                <div className="text-xs text-gray-500">{drug.nameEn}</div>
        <div className="max-w-md mx-auto mt-4 relative">
          <input
            type="text"
            value={quickQuery}
            onChange={e => setQuickQuery(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && quickQuery.trim()) { onSearch(quickQuery.trim()); setQuickQuery('') } }}
            placeholder="ابحث عن دواء... / Search for a drug..."
            className="w-full px-4 py-2.5 border border-sand-dark rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-gold text-right"
            dir="auto"
          />
          {quickQuery.length >= 2 && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-sand-dark rounded-xl shadow-lg z-10 overflow-hidden">
              {suggestions.map(d => (
                <button
                  key={d.id}
                  onMouseDown={() => { onSearch(quickQuery.trim()); setQuickQuery('') }}
                  className="w-full text-right px-4 py-2 text-sm hover:bg-sand transition-colors border-b border-gray-100 last:border-b-0"
                >
                  <span className="text-gray-800">{d.nameAr}</span>
                  <span className="text-gray-400 mr-2 text-xs">{d.nameEn}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-lg font-bold text-nile mb-3">أدوية مختارة / Featured Drugs</h2>
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
                <div><span className="text-xs text-gray-400 block">الاسم العلمي</span><span className="text-gray-700">{expandedDrug.scientificNameAr}</span></div>
              )}
              {expandedDrug.categoryAr && (
                <div><span className="text-xs text-gray-400 block">التصنيف</span><span className="text-gray-700">{expandedDrug.categoryAr}</span></div>
              )}
              {expandedDrug.manufacturerEn && (
                <div><span className="text-xs text-gray-400 block">الشركة المصنعة</span><span className="text-gray-700">{expandedDrug.manufacturerAr || expandedDrug.manufacturerEn}</span></div>
              )}
              {expandedDrug.activeIngredientAr && (
                <div><span className="text-xs text-gray-400 block">المادة الفعالة</span><span className="text-gray-700">{expandedDrug.activeIngredientAr}</span></div>
              )}
              {expandedDrug.prices && expandedDrug.prices.length > 0 && (
                <div><span className="text-xs text-gray-400 block">السعر</span><span className="text-gold-dark font-bold">{expandedDrug.prices[0].price} {expandedDrug.prices[0].unit}</span></div>
              )}
              {expandedDrug.descriptionAr && (
                <div className="col-span-full"><span className="text-xs text-gray-400 block">الوصف</span><p className="text-gray-600 text-xs">{expandedDrug.descriptionAr}</p></div>
              )}
            </div>
            <button
              onClick={() => { onBrowse() }}
              className="mt-3 text-xs text-blue-600 hover:underline"
            >
              عرض التفاصيل الكاملة / View full details →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
