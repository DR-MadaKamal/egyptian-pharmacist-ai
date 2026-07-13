import { useState, useMemo } from 'react'
import { severityConfig, checkDrugDrugInteraction } from '../utils/interactions.js'
import InteractionCheck from './InteractionCheck.jsx'
import DiseaseCheck from './DiseaseCheck.jsx'

export default function InteractionHub({ drugs, diseases, onViewDrug }) {
  const [mode, setMode] = useState('drug-drug')
  const [selected, setSelected] = useState([])
  const [multiResults, setMultiResults] = useState([])
  const [searchQuery, setSearchQuery] = useState('')

  const available = useMemo(() => {
    if (!searchQuery.trim()) return drugs.filter(d => d.drugInteractions?.length > 0).slice(0, 50)
    const q = searchQuery.toLowerCase()
    return drugs.filter(d =>
      !d.edaOnly &&
      (d.nameAr?.includes(q) || d.nameEn?.toLowerCase().includes(q))
    ).slice(0, 50)
  }, [drugs, searchQuery])

  const toggleSelect = (d) => {
    setSelected(prev => prev.find(s => s.id === d.id) ? prev.filter(s => s.id !== d.id) : [...prev, d])
  }

  const checkMulti = () => {
    const results = []
    for (let i = 0; i < selected.length; i++) {
      for (let j = i + 1; j < selected.length; j++) {
        const r = checkDrugDrugInteraction(drugs, selected[i].id, selected[j].id)
        if (r) results.push(r)
      }
    }
    setMultiResults(results)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h2 className="text-2xl font-bold text-nile ml-4">⚡ التفاعلات / Interactions</h2>
        <div className="flex gap-1 bg-sand rounded-lg p-0.5">
          <button
            onClick={() => setMode('drug-drug')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              mode === 'drug-drug' ? 'bg-white text-nile shadow-sm' : 'text-gray-500 hover:text-nile'
            }`}
          >
            دواء-دواء / Drug-Drug
          </button>
            <button
              onClick={() => setMode('drug-disease')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                mode === 'drug-disease' ? 'bg-white text-nile shadow-sm' : 'text-gray-500 hover:text-nile'
              }`}
            >
              دواء-مرض / Drug-Disease
            </button>
            <button
              onClick={() => setMode('multi')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                mode === 'multi' ? 'bg-white text-nile shadow-sm' : 'text-gray-500 hover:text-nile'
              }`}
            >
              متعدد / Multi
            </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 text-xs text-gray-500">
        {['contraindicated', 'severe', 'moderate', 'minor'].map(s => (
          <span key={s} className="flex items-center gap-1">
            <span className={`inline-block w-3 h-3 rounded-full ${severityConfig[s].color}`} />
            {severityConfig[s].emoji} {s.charAt(0).toUpperCase() + s.slice(1)}
          </span>
        ))}
      </div>

      {mode === 'drug-drug' && <InteractionCheck drugs={drugs} onViewDrug={onViewDrug} />}
      {mode === 'drug-disease' && <DiseaseCheck drugs={drugs} diseases={diseases} onViewDrug={onViewDrug} />}
      {mode === 'multi' && (
        <div className="space-y-4">
          <div className="bg-white border border-sand-dark rounded-xl p-4">
            <h3 className="font-bold text-nile mb-3">🔀 فحص متعدد / Multi-Interaction Check</h3>
            <p className="text-xs text-gray-500 mb-3">اختر أدوية متعددة لفحص جميع التفاعلات بينها / Select multiple drugs to check all pairwise interactions</p>
            <input
              type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              placeholder="🔍 بحث / Search..."
              className="w-full px-3 py-2 border border-sand-dark rounded-lg mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
            />
            <div className="max-h-48 overflow-y-auto space-y-1 mb-3 border border-gray-100 rounded-lg p-2">
              {available.map(d => {
                const sel = selected.some(s => s.id === d.id)
                return (
                  <label key={d.id} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-pointer text-sm hover:bg-sand transition-colors ${sel ? 'bg-sand font-medium' : ''}`}>
                    <input type="checkbox" checked={sel} onChange={() => toggleSelect(d)} className="rounded" />
                    <span className="flex-1 text-right">
                      <span className="text-nile">{d.nameAr}</span>
                      <span className="text-gray-400 mr-1 text-xs">{d.nameEn}</span>
                    </span>
                  </label>
                )
              })}
            </div>
            <button onClick={checkMulti} disabled={selected.length < 2}
              className="w-full bg-gold text-nile py-2 rounded-xl font-bold hover:bg-gold-light transition-colors disabled:opacity-50">
              🔍 فحص {selected.length} دواء / Check {selected.length} Drugs
            </button>
          </div>
          {multiResults.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-bold text-nile">نتائج الفحص / Results ({multiResults.length} تفاعل)</h3>
              {multiResults.map((r, i) => (
                <div key={i} className={`bg-white border rounded-xl p-3 ${severityConfig[r.severity]?.color ? `border-${severityConfig[r.severity].color.replace('bg-', '')}/30` : 'border-sand-dark'}`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full text-white ${severityConfig[r.severity]?.color || 'bg-gray-500'}`}>
                      {severityConfig[r.severity]?.emoji} {r.severity}
                    </span>
                    <span>
                      <button onClick={() => onViewDrug(r.drugA.id)} className="font-bold text-sm text-nile hover:text-gold-dark">{r.drugA.nameAr}</button>
                      <span className="text-gray-400 mx-1">⇔</span>
                      <button onClick={() => onViewDrug(r.drugB.id)} className="font-bold text-sm text-nile hover:text-gold-dark">{r.drugB.nameAr}</button>
                    </span>
                  </div>
                  {r.description && <p className="text-xs text-gray-600 mt-1">{r.description}</p>}
                </div>
              ))}
            </div>
          )}
          {selected.length >= 2 && multiResults.length === 0 && (
            <p className="text-center text-sm text-gray-400 py-4">لا توجد تفاعلات بين الأدوية المحددة / No interactions found between selected drugs</p>
          )}
        </div>
      )}
    </div>
  )
}
