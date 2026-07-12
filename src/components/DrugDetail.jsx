import { getDrugById, getDrugInteractions, getDiseaseInteractions, severityConfig } from '../utils/interactions.js'

export default function DrugDetail({ drugId, drugs, diseases, onBack, onViewDrug }) {
  const drug = getDrugById(drugs, drugId)
  if (!drug) return <div className="text-center py-12 text-red-500">الدواء غير موجود / Drug not found</div>

  const drugInts = getDrugInteractions(drugs, drugId)
  const diseaseInts = getDiseaseInteractions(drugs, diseases, drugId)

  return (
    <div className="space-y-4">
      <button onClick={onBack} className="text-nile hover:text-gold-dark font-bold text-sm">
        ← الرجوع للقائمة / Back to list
      </button>

      <div className="bg-white border border-sand-dark rounded-xl p-4 md:p-6">
        <div className="flex items-start gap-4">
          <div className="text-5xl">💊</div>
          <div className="flex-1">
            <h2 className="text-2xl md:text-3xl font-bold text-nile">{drug.nameAr}</h2>
            <p className="text-gray-500 text-lg">{drug.nameEn}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="bg-sand text-nile px-3 py-1 rounded-full text-sm">{drug.categoryAr}</span>
              <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">{drug.category}</span>
            </div>
            <p className="text-gray-600 mt-3 text-sm leading-relaxed">{drug.description}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-sand-dark rounded-xl p-4">
          <h3 className="font-bold text-nile text-lg mb-3">⚡ التفاعلات الدوائية / Drug Interactions</h3>
          {drugInts.length === 0 ? (
            <p className="text-gray-400 text-sm">لا توجد تفاعلات دوائية مسجلة / No recorded drug interactions</p>
          ) : (
            <div className="space-y-2">
              {drugInts.map((inter, i) => (
                <div key={i} className="border border-gray-100 rounded-lg p-3 hover:bg-gray-50">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <button
                        onClick={() => onViewDrug(inter.drug.id)}
                        className="font-bold text-nile hover:text-gold-dark text-sm"
                      >
                        {inter.drug.nameAr} ({inter.drug.nameEn})
                      </button>
                      <p className="text-xs text-gray-600 mt-1">{inter.description}</p>
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full text-white whitespace-nowrap ${severityConfig[inter.severity]?.color || 'bg-gray-500'}`}>
                      {severityConfig[inter.severity]?.emoji} {inter.severity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white border border-sand-dark rounded-xl p-4">
          <h3 className="font-bold text-nile text-lg mb-3">🩺 التفاعلات المرضية / Disease Interactions</h3>
          {diseaseInts.length === 0 ? (
            <p className="text-gray-400 text-sm">لا توجد تفاعلات مرضية مسجلة / No recorded disease interactions</p>
          ) : (
            <div className="space-y-2">
              {diseaseInts.map((inter, i) => (
                <div key={i} className="border border-gray-100 rounded-lg p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="font-bold text-nile text-sm">{inter.disease.nameAr} ({inter.disease.nameEn})</div>
                      <p className="text-xs text-gray-600 mt-1">{inter.description}</p>
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full text-white whitespace-nowrap ${severityConfig[inter.severity]?.color || 'bg-gray-500'}`}>
                      {severityConfig[inter.severity]?.emoji} {inter.severity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
