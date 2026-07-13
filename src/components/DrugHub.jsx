import { useState, useEffect } from 'react'
import DrugBrowser from './DrugBrowser.jsx'
import PriceList from './PriceList.jsx'
import InteractionHub from './InteractionHub.jsx'
import DrugCompare from './DrugCompare.jsx'

const SUB_TABS = {
  browse: { label: 'تصفح', labelEn: 'Browse', icon: '🔍' },
  prices: { label: 'الأسعار', labelEn: 'Prices', icon: '💰' },
  interactions: { label: 'التفاعلات', labelEn: 'Interactions', icon: '⚡' },
  compare: { label: 'مقارنة', labelEn: 'Compare', icon: '⚖️' },
}

const STORAGE_KEY = 'drughub-subtab'

export default function DrugHub({ drugs, diseases, onViewDrug }) {
  const [subTab, setSubTab] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved && SUB_TABS[saved] ? saved : 'browse'
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, subTab)
  }, [subTab])

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 border-b border-sand-dark pb-3 overflow-x-auto">
        <h2 className="text-2xl font-bold text-nile shrink-0 ml-4">💊 الأدوية / Drugs</h2>
        <div className="flex gap-1">
          {Object.entries(SUB_TABS).map(([key, t]) => (
            <button
              key={key}
              onClick={() => setSubTab(key)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                subTab === key
                  ? 'bg-nile text-white'
                  : 'text-gray-500 hover:text-nile hover:bg-sand'
              }`}
            >
              {t.icon} {t.labelEn}
            </button>
          ))}
        </div>
      </div>

      {subTab === 'browse' && <DrugBrowser drugs={drugs} onViewDrug={onViewDrug} />}
      {subTab === 'prices' && <PriceList drugs={drugs} onViewDrug={onViewDrug} />}
      {subTab === 'interactions' && <InteractionHub drugs={drugs} diseases={diseases} onViewDrug={onViewDrug} />}
      {subTab === 'compare' && <DrugCompare drugs={drugs} />}
    </div>
  )
}
