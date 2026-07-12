import { severityConfig } from '../utils/interactions.js'

export default function Home({ drugs, diseases, onBrowse, onInterview }) {
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

  const featuredDrugs = drugs.slice(0, 6)

  return (
    <div className="space-y-6">
      <div className="text-center py-6 md:py-10">
        <h1 className="text-3xl md:text-4xl font-bold text-nile mb-2">
          منصة التفاعلات الدوائية المصرية
        </h1>
        <p className="text-gray-600 text-base md:text-lg">
          Egyptian Drug Interaction Platform
        </p>
        <p className="text-gray-500 text-sm mt-2 max-w-xl mx-auto">
          مرجع شامل للتفاعلات الدوائية والدوائية-مرضية مع وضع المقابلة 
          — Comprehensive DDI & Drug-Disease Reference with Interview Mode
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
            <div className="text-xl md:text-2xl font-bold">{stat.value}</div>
            <div className="text-xs md:text-sm text-white/80">{stat.label}</div>
            <div className="text-[10px] text-white/50">{stat.labelEn}</div>
          </div>
        ))}
      </div>

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

      <div className="flex gap-3">
        <button onClick={onBrowse} className="flex-1 bg-nile text-white py-3 rounded-xl font-bold hover:bg-nile-light transition-colors">
          🔍 تصفح الأدوية / Browse Drugs
        </button>
        <button onClick={onInterview} className="flex-1 bg-gold text-nile py-3 rounded-xl font-bold hover:bg-gold-light transition-colors">
          🎓 بدء المقابلة / Start Interview
        </button>
      </div>

      <div>
        <h2 className="text-lg font-bold text-nile mb-3">أدوية مختارة / Featured Drugs</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {featuredDrugs.map(drug => (
            <div key={drug.id} className="bg-white border border-sand-dark rounded-xl p-3 text-center hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onBrowse()}
            >
              <div className="text-2xl mb-1">💊</div>
              <div className="font-bold text-nile text-sm">{drug.nameAr}</div>
              <div className="text-xs text-gray-500">{drug.nameEn}</div>
              <div className="text-[10px] text-gray-400 mt-1">{drug.categoryAr}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
