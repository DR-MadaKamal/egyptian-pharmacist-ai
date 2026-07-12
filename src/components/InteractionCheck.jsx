import { useState, useMemo } from 'react'
import { checkDrugDrugInteraction, severityConfig, searchDrugs } from '../utils/interactions.js'

export default function InteractionCheck({ drugs, onViewDrug }) {
  const [drugAQuery, setDrugAQuery] = useState('')
  const [drugBQuery, setDrugBQuery] = useState('')
  const [drugA, setDrugA] = useState(null)
  const [drugB, setDrugB] = useState(null)
  const [result, setResult] = useState(null)
  const [showA, setShowA] = useState(false)
  const [showB, setShowB] = useState(false)

  const resultsA = useMemo(() => drugAQuery && !drugA ? searchDrugs(drugs, drugAQuery).slice(0, 8) : [], [drugs, drugAQuery, drugA])
  const resultsB = useMemo(() => drugBQuery && !drugB ? searchDrugs(drugs, drugBQuery).slice(0, 8) : [], [drugs, drugBQuery, drugB])

  const handleCheck = () => {
    if (!drugA || !drugB) return
    setResult(checkDrugDrugInteraction(drugs, drugA.id, drugB.id))
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-nile">⚡ تفاعل دواء-دواء / Drug-Drug Interaction</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-sand-dark rounded-xl p-4">
          <label className="block font-bold text-nile mb-2">الدواء الأول / Drug A</label>
          {drugA ? (
            <div className="flex items-center justify-between bg-sand rounded-lg p-3">
              <button onClick={() => { setDrugA(null); setDrugAQuery(''); setResult(null) }} className="text-red-500 text-sm">✕</button>
              <div className="text-right">
                <span className="font-bold text-nile">{drugA.nameAr}</span>
                <span className="text-gray-500 text-sm mr-2">{drugA.nameEn}</span>
              </div>
            </div>
          ) : (
            <div className="relative">
              <input
                type="text" value={drugAQuery}
                onChange={e => { setDrugAQuery(e.target.value); setShowA(true) }}
                onFocus={() => setShowA(true)}
                placeholder="ابحث عن دواء..."
                className="w-full px-3 py-2 border border-sand-dark rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-gold text-right"
                dir="auto"
              />
              {showA && resultsA.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-sand-dark rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {resultsA.map(d => (
                    <button key={d.id} onClick={() => { setDrugA(d); setDrugAQuery(''); setShowA(false); setResult(null) }}
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
          <label className="block font-bold text-nile mb-2">الدواء الثاني / Drug B</label>
          {drugB ? (
            <div className="flex items-center justify-between bg-sand rounded-lg p-3">
              <button onClick={() => { setDrugB(null); setDrugBQuery(''); setResult(null) }} className="text-red-500 text-sm">✕</button>
              <div className="text-right">
                <span className="font-bold text-nile">{drugB.nameAr}</span>
                <span className="text-gray-500 text-sm mr-2">{drugB.nameEn}</span>
              </div>
            </div>
          ) : (
            <div className="relative">
              <input
                type="text" value={drugBQuery}
                onChange={e => { setDrugBQuery(e.target.value); setShowB(true) }}
                onFocus={() => setShowB(true)}
                placeholder="ابحث عن دواء..."
                className="w-full px-3 py-2 border border-sand-dark rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-gold text-right"
                dir="auto"
              />
              {showB && resultsB.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-sand-dark rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {resultsB.map(d => (
                    <button key={d.id} onClick={() => { setDrugB(d); setDrugBQuery(''); setShowB(false); setResult(null) }}
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

      <button
        onClick={handleCheck}
        disabled={!drugA || !drugB}
        className="w-full bg-nile text-white py-3 rounded-xl font-bold hover:bg-nile-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        🔍 تحقق من التفاعل / Check Interaction
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
                  <h3 className="font-bold text-nile text-lg">
                    {result.source.nameAr} + {result.target.nameAr}
                  </h3>
                  <p className="text-gray-500 text-sm">{result.source.nameEn} + {result.target.nameEn}</p>
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
              <div className="flex gap-2 mt-2">
                <button onClick={() => onViewDrug(result.source.id)}
                  className="text-xs text-nile hover:text-gold-dark underline">{result.source.nameAr}</button>
                <button onClick={() => onViewDrug(result.target.id)}
                  className="text-xs text-nile hover:text-gold-dark underline">{result.target.nameAr}</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
