import { useState, useMemo } from 'react'
import { checkDrugDiseaseInteraction, severityConfig, searchDrugs, searchDiseases } from '../utils/interactions.js'

export default function DiseaseCheck({ drugs, diseases, onViewDrug }) {
  const [drugQuery, setDrugQuery] = useState('')
  const [diseaseQuery, setDiseaseQuery] = useState('')
  const [drug, setDrug] = useState(null)
  const [disease, setDisease] = useState(null)
  const [result, setResult] = useState(null)
  const [showDrug, setShowDrug] = useState(false)
  const [showDisease, setShowDisease] = useState(false)

  const drugResults = useMemo(() => drugQuery && !drug ? searchDrugs(drugs, drugQuery).slice(0, 8) : [], [drugs, drugQuery, drug])
  const diseaseResults = useMemo(() => diseaseQuery && !disease ? searchDiseases(diseases, diseaseQuery).slice(0, 8) : [], [diseases, diseaseQuery, disease])

  const handleCheck = () => {
    if (!drug || !disease) return
    setResult(checkDrugDiseaseInteraction(drugs, diseases, drug.id, disease.id))
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-nile">🩺 تفاعل دواء-مرض / Drug-Disease Interaction</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-sand-dark rounded-xl p-4">
          <label className="block font-bold text-nile mb-2">الدواء / Drug</label>
          {drug ? (
            <div className="flex items-center justify-between bg-sand rounded-lg p-3">
              <button onClick={() => { setDrug(null); setDrugQuery(''); setResult(null) }} className="text-red-500 text-sm">✕</button>
              <div className="text-right">
                <span className="font-bold text-nile">{drug.nameAr}</span>
                <span className="text-gray-500 text-sm mr-2">{drug.nameEn}</span>
              </div>
            </div>
          ) : (
            <div className="relative">
              <input type="text" value={drugQuery}
                onChange={e => { setDrugQuery(e.target.value); setShowDrug(true) }}
                onFocus={() => setShowDrug(true)}
                placeholder="ابحث عن دواء..."
                className="w-full px-3 py-2 border border-sand-dark rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-gold text-right" dir="auto" />
              {showDrug && drugResults.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-sand-dark rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {drugResults.map(d => (
                    <button key={d.id} onClick={() => { setDrug(d); setDrugQuery(''); setShowDrug(false); setResult(null) }}
                      className="w-full text-right px-3 py-2 hover:bg-sand text-sm flex justify-between">
                      <span className="text-gray-500">{d.nameEn}</span>
                      <span className="font-bold text-nile">{d.nameAr}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="bg-white border border-sand-dark rounded-xl p-4">
          <label className="block font-bold text-nile mb-2">المرض / Disease</label>
          {disease ? (
            <div className="flex items-center justify-between bg-sand rounded-lg p-3">
              <button onClick={() => { setDisease(null); setDiseaseQuery(''); setResult(null) }} className="text-red-500 text-sm">✕</button>
              <div className="text-right">
                <span className="font-bold text-nile">{disease.nameAr}</span>
                <span className="text-gray-500 text-sm mr-2">{disease.nameEn}</span>
              </div>
            </div>
          ) : (
            <div className="relative">
              <input type="text" value={diseaseQuery}
                onChange={e => { setDiseaseQuery(e.target.value); setShowDisease(true) }}
                onFocus={() => setShowDisease(true)}
                placeholder="ابحث عن مرض..."
                className="w-full px-3 py-2 border border-sand-dark rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-gold text-right" dir="auto" />
              {showDisease && diseaseResults.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-sand-dark rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {diseaseResults.map(d => (
                    <button key={d.id} onClick={() => { setDisease(d); setDiseaseQuery(''); setShowDisease(false); setResult(null) }}
                      className="w-full text-right px-3 py-2 hover:bg-sand text-sm flex justify-between">
                      <span className="text-gray-500">{d.nameEn}</span>
                      <span className="font-bold text-nile">{d.nameAr}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <button onClick={handleCheck} disabled={!drug || !disease}
        className="w-full bg-nile text-white py-3 rounded-xl font-bold hover:bg-nile-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
        🩺 تحقق من التفاعل / Check Interaction
      </button>

      {result && (
        <div className={`rounded-xl p-4 md:p-6 ${result.severity === 'none' ? 'bg-green-50 border border-green-200' : 'bg-white border border-sand-dark'}`}>
          <div className="flex items-center gap-3 mb-3">
            {result.severity === 'none' ? (
              <>
                <span className="text-3xl">✅</span>
                <div>
                  <h3 className="font-bold text-green-700 text-lg">لا يوجد تفاعل / No Interaction</h3>
                  <p className="text-green-600 text-sm">{result.description}</p>
                </div>
              </>
            ) : (
              <>
                <span className="text-3xl">{severityConfig[result.severity]?.emoji}</span>
                <div>
                  <h3 className="font-bold text-nile text-lg">{result.drug.nameAr} + {result.disease.nameAr}</h3>
                  <p className="text-gray-500 text-sm">{result.drug.nameEn} + {result.disease.nameEn}</p>
                </div>
                <span className={`mr-auto text-xs font-bold px-3 py-1.5 rounded-full text-white ${severityConfig[result.severity]?.color}`}>
                  {result.severity.toUpperCase()}
                </span>
              </>
            )}
          </div>
          {result.severity !== 'none' && (
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-gray-700 text-sm">{result.description}</p>
              <button onClick={() => onViewDrug(result.drug.id)}
                className="text-xs text-nile hover:text-gold-dark underline mt-2 inline-block">{result.drug.nameAr}</button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
