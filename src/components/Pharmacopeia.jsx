import { useState } from 'react'
import { dataSources } from '../config/data-sources.js'

const SECTION_CARDS = [
  {
    icon: '📘',
    title: 'الدستور الدوائي المصري',
    titleEn: 'Egyptian Pharmacopoeia',
    desc: 'المرجع الرسمي لمعايير الجودة والمواصفات القياسية للمواد والمستحضرات الصيدلية في مصر',
    descEn: 'Official reference for quality standards, specifications, and monographs of pharmaceutical substances in Egypt',
    longDesc: 'يغطي الدستور الدوائي المصري جميع المواد الخام والمستحضرات الصيدلية المعتمدة، ويتضمن طرق التحليل والاختبار ومتطلبات التخزين.',
    longDescEn: 'The Egyptian Pharmacopoeia covers all approved pharmaceutical raw materials and preparations, including analytical methods, testing, and storage requirements.',
    sources: ['egyptian-pharmacopoeia'],
    color: 'border-l-4 border-nile',
  },
  {
    icon: '🌿',
    title: 'دليل الأعشاب الطبية',
    titleEn: 'Herbal Monograph',
    desc: 'الدليل الرسمي للنباتات الطبية البرية والدستورية والتركيبات العشبية والزيوت العطرية',
    descEn: 'Official guide for wild medicinal plants, pharmacopeial plants, herbal formulations, and essential oils',
    longDesc: 'يشمل التوثيق العلمي للنباتات الطبية المصرية والتركيبات العشبية المعتمدة والزيوت العطرية وطرق استخلاصها.',
    longDescEn: 'Includes scientific documentation of Egyptian medicinal plants, approved herbal formulations, essential oils, and extraction methods.',
    sources: ['herbal-monograph'],
    color: 'border-l-4 border-green-700',
  },
  {
    icon: '🏛️',
    title: 'لوائح واشتراطات التسجيل',
    titleEn: 'Registration Regulations',
    desc: 'قواعد وإرشادات تسجيل المستحضرات الصيدلية والمستلزمات الطبية ومستحضرات التجميل',
    descEn: 'Rules and guidelines for registering pharmaceutical products, medical devices, and cosmetics',
    longDesc: 'يتضمن نماذج الطلبات والمتطلبات الفنية والإدارية لتسجيل المنتجات الدوائية في هيئة الدواء المصرية.',
    longDescEn: 'Includes application forms, technical and administrative requirements for registering pharmaceutical products with the EDA.',
    sources: ['variation-tool', 'api-search', 'naming-checker'],
    color: 'border-l-4 border-gold-dark',
  },
  {
    icon: '🔬',
    title: 'التراخيص والتفتيش',
    titleEn: 'Licensing & Inspection',
    desc: 'بيانات المصانع والمخازن وشركات التصنيع وجهات التفتيش والرقابة',
    descEn: 'Factory, warehouse, and contract manufacturing data with inspection and compliance info',
    longDesc: 'قاعدة بيانات شاملة للمنشآت الصيدلية المرخصة ونتائج التفتيش الدوري وشهادات التصنيع الجيد.',
    longDescEn: 'Comprehensive database of licensed pharmaceutical establishments, periodic inspection results, and GMP certificates.',
    sources: ['search-licenses', 'service-portal', 'public-identity'],
    color: 'border-l-4 border-blue-700',
  },
  {
    icon: '🧴',
    title: 'مستحضرات التجميل والمستلزمات الطبية',
    titleEn: 'Cosmetics & Medical Devices',
    desc: 'قواعد بيانات مستحضرات التجميل المسجلة والمستلزمات الطبية وتصنيفاتها',
    descEn: 'Registered cosmetics and medical devices databases with classifications',
    longDesc: 'سجلات رسمية لمستحضرات التجميل والأجهزة الطبية المسجلة في مصر مع تصنيفاتها الدولية.',
    longDescEn: 'Official registries of cosmetics and medical devices registered in Egypt with international classifications.',
    sources: ['cosmetics-egycosma', 'medical-device'],
    color: 'border-l-4 border-purple-700',
  },
  {
    icon: '📋',
    title: 'التتبع الدوائي والتسعير',
    titleEn: 'Track & Trace & Pricing',
    desc: 'منظومة التتبع الدوائي القومية وبوابة تقديم الأسعار',
    descEn: 'National drug tracing system and online pricing submission gate',
    longDesc: 'منصة التتبع الدوائي القومية (DSM) ونظام تقديم ومراجعة أسعار المستحضرات الصيدلية.',
    longDescEn: 'National Drug Supply Management (DSM) platform and pharmaceutical pricing submission and review system.',
    sources: ['track-and-trace', 'pricing-submission'],
    color: 'border-l-4 border-orange-700',
  },
]

export default function Pharmacopeia({ drugs }) {
  const [expanded, setExpanded] = useState({})
  const [search, setSearch] = useState('')

  const matchesSearch = (section) => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      section.title.toLowerCase().includes(q) ||
      section.titleEn.toLowerCase().includes(q) ||
      section.desc.toLowerCase().includes(q) ||
      section.descEn.toLowerCase().includes(q) ||
      (section.longDesc && section.longDesc.toLowerCase().includes(q)) ||
      (section.longDescEn && section.longDescEn.toLowerCase().includes(q)) ||
      section.sources.some(id => {
        const s = dataSources.find(ds => ds.id === id)
        return s && (s.nameEn.toLowerCase().includes(q) || s.nameAr.toLowerCase().includes(q))
      })
    )
  }

  const filteredCards = SECTION_CARDS.filter(matchesSearch)

  return (
    <div className="space-y-6">
      <div className="text-center py-4">
        <h1 className="text-3xl font-bold text-nile">📋 الدستور واللوائح / Pharmacopeia & Regulations</h1>
        <p className="text-gray-500 mt-1 max-w-2xl mx-auto">
          المرجع الرسمي لمعايير الجودة والتسجيل الدوائي في مصر — Quality standards, regulations, and official EDA references
        </p>
      </div>

      <div className="max-w-md mx-auto">
        <input
          type="search"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="🔍 بحث في الأقسام والمصادر... / Search sections & sources..."
          className="w-full border border-sand-dark rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-nile focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCards.map(section => {
          const srcs = section.sources.map(id => dataSources.find(s => s.id === id)).filter(Boolean)
          const isExpanded = expanded[section.titleEn]
          return (
            <div key={section.titleEn} className={`bg-white border border-sand-dark rounded-xl p-5 ${section.color}`}>
              <div className="flex items-start gap-3">
                <span className="text-3xl">{section.icon}</span>
                <div className="flex-1">
                  <h3 className="font-bold text-nile text-lg">{section.title}</h3>
                  <p className="text-gray-500 text-xs">{section.titleEn}</p>
                  <p className="text-gray-700 text-sm mt-2">{section.desc}</p>
                  <p className="text-gray-400 text-xs mt-1">{section.descEn}</p>

                  {isExpanded && section.longDesc && (
                    <div className="mt-2 p-3 bg-gray-50 rounded-lg text-sm text-gray-700">
                      <p className="font-bold text-xs text-gray-400 mb-1">📖 تفاصيل إضافية / More Details</p>
                      <p>{section.longDesc}</p>
                      <p className="text-gray-400 text-xs mt-1">{section.longDescEn}</p>
                    </div>
                  )}

                  {srcs.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <span className="text-xs font-bold text-gray-400 uppercase">المصادر / Sources</span>
                      <div className="space-y-1.5 mt-1">
                        {srcs.map(s => {
                          const dotColor = s.currentlyConsumed ? 'bg-green-500' : s.status === 'active' ? 'bg-yellow-400' : 'bg-red-500'
                          return (
                            <div key={s.id} className="text-xs flex items-start gap-2">
                              <span className={`inline-block w-2 h-2 rounded-full mt-1.5 shrink-0 ${dotColor}`} title={s.status} />
                              <div>
                                <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline">{s.nameEn}</a>
                                <span className="text-gray-400 block">{s.nameAr}</span>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => setExpanded(prev => ({ ...prev, [section.titleEn]: !prev[section.titleEn] }))}
                    className="mt-2 text-xs text-nile hover:text-nile-dark font-medium"
                  >
                    {isExpanded ? '⬆ إخفاء التفاصيل / Less' : '⬇ المزيد من التفاصيل / More'}
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {filteredCards.length === 0 && (
        <div className="text-center py-8 text-gray-400">لا توجد نتائج مطابقة / No matching sections found</div>
      )}

      <div className="bg-white border border-sand-dark rounded-xl p-5">
        <h2 className="font-bold text-nile text-lg mb-3">📊 إحصائيات الدستور / Pharmacopeia Stats</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-nile">{drugs.length}</div>
            <div className="text-xs text-gray-600">دواء مسجل / Registered Drugs</div>
          </div>
          <div className="bg-green-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-green-700">{drugs.filter(d => !d.edaOnly).length}</div>
            <div className="text-xs text-gray-600">دواء مدعم / Enriched Drugs</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-purple-700">{dataSources.filter(s => s.status === 'active').length}</div>
            <div className="text-xs text-gray-600">مصدر بيانات / Data Sources</div>
          </div>
          <div className="bg-orange-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-orange-700">{dataSources.filter(s => s.currentlyConsumed).length}</div>
            <div className="text-xs text-gray-600">مصدر مدمج / Sources Consumed</div>
          </div>
        </div>
      </div>
    </div>
  )
}
