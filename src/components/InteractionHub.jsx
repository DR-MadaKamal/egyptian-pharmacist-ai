import { useState } from 'react'
import InteractionCheck from './InteractionCheck.jsx'
import DiseaseCheck from './DiseaseCheck.jsx'

export default function InteractionHub({ drugs, diseases, onViewDrug }) {
  const [mode, setMode] = useState('drug-drug')

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
        </div>
      </div>

      {mode === 'drug-drug' && <InteractionCheck drugs={drugs} onViewDrug={onViewDrug} />}
      {mode === 'drug-disease' && <DiseaseCheck drugs={drugs} diseases={diseases} onViewDrug={onViewDrug} />}
    </div>
  )
}
