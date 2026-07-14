import { useState, useMemo } from 'react'
import { INSULIN_CATEGORIES, INSULINS, INSULIN_COMPARISON, getInsulinsByCategory, getInsulinById } from '../data/insulin.js'

function BackButton({ onClick, label }) {
  return (
    <button onClick={onClick} className="text-sm bg-gray-100 text-gray-500 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors mb-4">
      ← {label || 'العودة / Back'}
    </button>
  )
}

function CategoryCard({ cat, count, onClick }) {
  return (
    <button onClick={onClick}
      className="bg-white border-2 border-sand-dark hover:border-gold rounded-xl p-4 text-left transition-all hover:shadow-lg group w-full">
      <div className="flex items-center gap-3">
        <span className="text-3xl">{cat.icon}</span>
        <div className="flex-1">
          <h3 className="font-bold text-nile text-base group-hover:text-gold-dark transition-colors">{cat.label}</h3>
          <p className="text-sm text-gray-500">{cat.labelEn}</p>
          <p className="text-xs text-gray-400 mt-1">{count} إنسولين / insulins</p>
        </div>
        <div className={`w-3 h-3 rounded-full ${cat.color}`} />
      </div>
    </button>
  )
}

function InsulinCard({ insulin, onClick }) {
  const cat = INSULIN_CATEGORIES.find(c => c.id === insulin.category)
  return (
    <button onClick={onClick}
      className="w-full bg-white border border-sand-dark rounded-xl p-4 text-left hover:border-gold hover:shadow-md transition-all">
      <div className="flex items-start gap-3">
        <span className="text-2xl">💉</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-nile text-sm md:text-base">{insulin.nameEn}</h4>
            <span className="text-xs text-gray-400">/ {insulin.nameAr}</span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">{insulin.genericEn} — {insulin.genericAr}</p>
          <p className="text-xs text-gray-400 mt-0.5">{insulin.manufacturer}</p>
          <div className="flex flex-wrap gap-1.5 mt-2">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cat?.colorLight || 'bg-gray-100 text-gray-600'}`}>
              {cat?.icon} {cat?.labelEn}
            </span>
            <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
              ⏱ {insulin.onset}
            </span>
            <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
              📊 {insulin.duration}
            </span>
          </div>
        </div>
        <span className="text-gray-300 text-lg">›</span>
      </div>
    </button>
  )
}

function InsulinDetail({ insulin, onBack }) {
  const cat = INSULIN_CATEGORIES.find(c => c.id === insulin.category)
  const [expandedSection, setExpandedSection] = useState(null)

  const toggleSection = (id) => setExpandedSection(expandedSection === id ? null : id)

  const sections = [
    { id: 'pharma', icon: '💉', title: 'الخصائص الدوائية', titleEn: 'Pharmacology', content: (
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-blue-50 rounded-lg p-3">
            <p className="text-xs text-blue-600 font-bold">بداية المفعول / Onset</p>
            <p className="text-sm text-nile font-bold">{insulin.onset}</p>
            <p className="text-[10px] text-gray-500">{insulin.onsetAr}</p>
          </div>
          <div className="bg-orange-50 rounded-lg p-3">
            <p className="text-xs text-orange-600 font-bold">الذروة / Peak</p>
            <p className="text-sm text-nile font-bold">{insulin.peak}</p>
            <p className="text-[10px] text-gray-500">{insulin.peakAr}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-3">
            <p className="text-xs text-green-600 font-bold">المدة / Duration</p>
            <p className="text-sm text-nile font-bold">{insulin.duration}</p>
            <p className="text-[10px] text-gray-500">{insulin.durationAr}</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-3">
            <p className="text-xs text-purple-600 font-bold">التركيز / Concentration</p>
            <p className="text-sm text-nile font-bold">{insulin.concentration}</p>
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-600 font-bold mb-1">المظهر / Appearance</p>
          <p className="text-sm text-nile">{insulin.appearance}</p>
          <p className="text-[10px] text-gray-500">{insulin.appearanceAr}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-600 font-bold mb-1">طريقة الإعطاء / Route</p>
          <p className="text-sm text-nile">{insulin.route}</p>
          <p className="text-[10px] text-gray-500">{insulin.routeAr}</p>
        </div>
      </div>
    )},
    { id: 'mechanism', icon: '🔬', title: 'آلية التأثير', titleEn: 'Mechanism of Action', content: (
      <div className="space-y-2">
        <p className="text-sm text-nile leading-relaxed">{insulin.mechanismEn}</p>
        <p className="text-xs text-gray-500 leading-relaxed">{insulin.mechanismAr}</p>
      </div>
    )},
    { id: 'indications', icon: '📋', title: 'الاستطبابات', titleEn: 'Indications', content: (
      <div className="space-y-2">
        <p className="text-sm text-nile leading-relaxed">{insulin.indicationsEn}</p>
        <p className="text-xs text-gray-500 leading-relaxed">{insulin.indicationsAr}</p>
      </div>
    )},
    { id: 'sideEffects', icon: '⚠️', title: 'الآثار الجانبية', titleEn: 'Side Effects', content: (
      <div className="space-y-2">
        <p className="text-sm text-nile leading-relaxed">{insulin.sideEffectsEn}</p>
        <p className="text-xs text-gray-500 leading-relaxed">{insulin.sideEffectsAr}</p>
      </div>
    )},
    { id: 'precautions', icon: '🛡️', title: 'الاحتياطات', titleEn: 'Precautions', content: (
      <div className="space-y-2">
        <p className="text-sm text-nile leading-relaxed">{insulin.precautionsEn}</p>
        <p className="text-xs text-gray-500 leading-relaxed">{insulin.precautionsAr}</p>
      </div>
    )},
    { id: 'dosing', icon: '💊', title: 'الجرعة', titleEn: 'Dosing', content: (
      <div className="space-y-2">
        <p className="text-sm text-nile leading-relaxed">{insulin.dosingEn}</p>
        <p className="text-xs text-gray-500 leading-relaxed">{insulin.dosingAr}</p>
      </div>
    )},
    { id: 'storage', icon: '🌡️', title: 'التخزين', titleEn: 'Storage', content: (
      <div className="space-y-2">
        <p className="text-sm text-nile leading-relaxed">{insulin.storage}</p>
        <p className="text-xs text-gray-500 leading-relaxed">{insulin.storageAr}</p>
      </div>
    )},
    { id: 'egypt', icon: '🇪🇬', title: 'توفر في مصر', titleEn: 'Egyptian Availability', content: (
      <div className="space-y-2">
        <p className="text-sm text-nile leading-relaxed">{insulin.egyptianInfo}</p>
        <p className="text-xs text-gray-500 leading-relaxed">{insulin.egyptianInfoAr}</p>
      </div>
    )},
  ]

  return (
    <div className="space-y-4">
      <BackButton onClick={onBack} label="العودة / Back" />

      {/* Header */}
      <div className="bg-white border border-sand-dark rounded-xl p-4 md:p-6">
        <div className="flex items-center gap-3 mb-3">
          <span className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-xl ${cat?.color || 'bg-gray-400'}`}>
            {cat?.icon}
          </span>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-nile">{insulin.nameEn}</h2>
            <p className="text-sm text-gray-500">{insulin.nameAr}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${cat?.colorLight || 'bg-gray-100 text-gray-600'}`}>
            {cat?.icon} {cat?.labelEn}
          </span>
          <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
            🏭 {insulin.manufacturer}
          </span>
        </div>
        <div className="mt-3 text-sm text-gray-600">
          <p><span className="font-bold">Generic:</span> {insulin.genericEn}</p>
          <p className="text-xs text-gray-400">{insulin.genericAr}</p>
        </div>
      </div>

      {/* Key Facts */}
      {insulin.keyFacts && insulin.keyFacts.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <h3 className="font-bold text-amber-800 text-sm mb-2">💡 معلومات مهمة / Key Facts</h3>
          <ul className="space-y-1.5">
            {insulin.keyFacts.map((fact, i) => (
              <li key={i} className="text-xs">
                <span className="text-amber-700">•</span>
                <span className="text-nile ml-1">{fact.en}</span>
                <span className="text-gray-400 block mr-4">{fact.ar}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Collapsible Sections */}
      <div className="space-y-2">
        {sections.map(section => (
          <div key={section.id} className="bg-white border border-sand-dark rounded-xl overflow-hidden">
            <button onClick={() => toggleSection(section.id)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-2">
                <span className="text-lg">{section.icon}</span>
                <span className="font-bold text-nile text-sm">{section.title}</span>
                <span className="text-xs text-gray-400">/ {section.titleEn}</span>
              </div>
              <span className={`text-gray-400 text-sm transition-transform ${expandedSection === section.id ? 'rotate-180' : ''}`}>▼</span>
            </button>
            {expandedSection === section.id && (
              <div className="border-t border-gray-100 p-4 bg-gray-50/50">
                {section.content}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function ComparisonTable() {
  return (
    <div className="space-y-4">
      <h3 className="font-bold text-nile text-lg">📊 جدول المقارنة / Comparison Table</h3>
      <div className="bg-white border border-sand-dark rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-nile text-white">
                <th className="px-3 py-2 text-right font-bold">المعامل / Parameter</th>
                <th className="px-3 py-2 text-center font-bold">⚡ سريع</th>
                <th className="px-3 py-2 text-center font-bold">⏱ قصير</th>
                <th className="px-3 py-2 text-center font-bold">⏳ متوسط</th>
                <th className="px-3 py-2 text-center font-bold">🕐 طويل</th>
                <th className="px-3 py-2 text-center font-bold">🔀 مخلوط</th>
              </tr>
            </thead>
            <tbody>
              {INSULIN_COMPARISON.categories[0].data.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="px-3 py-2 text-right font-bold text-nile whitespace-nowrap">{row.parameter}</td>
                  <td className="px-3 py-2 text-center text-gray-600">{row.rapid}</td>
                  <td className="px-3 py-2 text-center text-gray-600">{row.short}</td>
                  <td className="px-3 py-2 text-center text-gray-600">{row.intermediate}</td>
                  <td className="px-3 py-2 text-center text-gray-600">{row.long}</td>
                  <td className="px-3 py-2 text-center text-gray-600">{row.mixed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h4 className="font-bold text-blue-800 text-sm mb-2">📝 الفروقات الرئيسية / Key Differences</h4>
        <ul className="space-y-2">
          {INSULIN_COMPARISON.keyDifferences.map((diff, i) => (
            <li key={i} className="text-xs">
              <span className="text-blue-600">•</span>
              <span className="text-nile ml-1">{diff.en}</span>
              <span className="text-gray-400 block mr-4 mt-0.5">{diff.ar}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function CategoryView({ categoryId, onBack, onSelectInsulin }) {
  const cat = INSULIN_CATEGORIES.find(c => c.id === categoryId)
  const insulins = getInsulinsByCategory(categoryId)

  return (
    <div className="space-y-4">
      <BackButton onClick={onBack} label="العودة / Back" />

      <div className="flex items-center gap-3">
        <span className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-xl ${cat?.color || 'bg-gray-400'}`}>
          {cat?.icon}
        </span>
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-nile">{cat?.label}</h2>
          <p className="text-sm text-gray-500">{cat?.labelEn} — {insulins.length} إنسولين</p>
        </div>
      </div>

      <div className="space-y-3">
        {insulins.map(insulin => (
          <InsulinCard key={insulin.id} insulin={insulin} onClick={() => onSelectInsulin(insulin.id)} />
        ))}
      </div>
    </div>
  )
}

export default function InsulinGuide({ onBack }) {
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedInsulinId, setSelectedInsulinId] = useState(null)
  const [showComparison, setShowComparison] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const selectedInsulin = selectedInsulinId ? getInsulinById(selectedInsulinId) : null

  const filteredInsulins = useMemo(() => {
    if (!searchQuery.trim()) return null
    const q = searchQuery.toLowerCase().trim()
    return INSULINS.filter(i =>
      i.nameEn.toLowerCase().includes(q) ||
      i.nameAr.includes(q) ||
      i.genericEn.toLowerCase().includes(q) ||
      i.genericAr.includes(q) ||
      i.manufacturer.toLowerCase().includes(q)
    )
  }, [searchQuery])

  // Individual insulin detail view
  if (selectedInsulin) {
    return (
      <div className="space-y-6">
        <InsulinDetail
          insulin={selectedInsulin}
          onBack={() => {
            setSelectedInsulinId(null)
          }}
        />
      </div>
    )
  }

  // Category view
  if (selectedCategory) {
    return (
      <CategoryView
        categoryId={selectedCategory}
        onBack={() => setSelectedCategory(null)}
        onSelectInsulin={(id) => setSelectedInsulinId(id)}
      />
    )
  }

  // Comparison view
  if (showComparison) {
    return (
      <div className="space-y-6">
        <BackButton onClick={() => setShowComparison(false)} />
        <ComparisonTable />
      </div>
    )
  }

  // Search results
  if (filteredInsulins) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-nile">💉 دليل الإنسولين / Insulin Guide</h2>
          <button onClick={onBack} className="text-sm bg-gray-100 text-gray-500 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors">← العودة / Back</button>
        </div>
        <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
          placeholder="🔍 ابحث عن إنسولين... / Search insulin..."
          className="w-full px-4 py-2 border border-sand-dark rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold" dir="auto" />
        <p className="text-sm text-gray-500">{filteredInsulins.length} نتيجة / results</p>
        <div className="space-y-3">
          {filteredInsulins.map(insulin => (
            <InsulinCard key={insulin.id} insulin={insulin} onClick={() => setSelectedInsulinId(insulin.id)} />
          ))}
          {filteredInsulins.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <p className="text-lg">🔍 لا توجد نتائج / No results</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Main menu — categories overview
  const totalInsulins = INSULINS.length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-nile">💉 دليل الإنسولين / Insulin Guide</h2>
        <button onClick={onBack} className="text-sm bg-gray-100 text-gray-500 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors">← العودة / Back</button>
      </div>

      {/* Search */}
      <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
        placeholder="🔍 ابحث عن إنسولين بالاسم أو المادة الفعالة... / Search by name or generic..."
        className="w-full px-4 py-2 border border-sand-dark rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold" dir="auto" />

      {/* Stats */}
      <div className="bg-gradient-to-l from-nile to-blue-700 rounded-xl p-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold">{totalInsulins}</p>
            <p className="text-sm text-white/80">إنسولين في 5 فئات</p>
            <p className="text-xs text-white/60">Insulins in 5 categories</p>
          </div>
          <div className="text-4xl">💉</div>
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-3">
        {INSULIN_CATEGORIES.map(cat => (
          <CategoryCard key={cat.id} cat={cat} count={getInsulinsByCategory(cat.id).length}
            onClick={() => setSelectedCategory(cat.id)} />
        ))}
      </div>

      {/* Comparison */}
      <button onClick={() => setShowComparison(true)}
        className="w-full bg-white border-2 border-sand-dark hover:border-gold rounded-xl p-4 text-center transition-all hover:shadow-lg">
        <div className="text-2xl mb-2">📊</div>
        <h3 className="font-bold text-nile">جدول المقارنة / Comparison Table</h3>
        <p className="text-xs text-gray-400 mt-1">مقارنة شاملة لجميع أنواع الإنسولين / Comprehensive comparison of all insulin types</p>
      </button>
    </div>
  )
}
