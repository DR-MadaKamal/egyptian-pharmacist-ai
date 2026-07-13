import { useState, useMemo, useEffect } from 'react'
import { drugs as builtInDrugs } from './data/drugs.js'
import { diseases as builtInDiseases } from './data/diseases.js'
import { getUserDrugs, getUserDiseases } from './utils/store.js'
import { loadEdaDrugs } from './utils/edaLoader.js'
import Navbar from './components/Navbar.jsx'
import Home from './components/Home.jsx'
import DrugHub from './components/DrugHub.jsx'
import DrugDetail from './components/DrugDetail.jsx'
import InterviewMode from './components/InterviewMode.jsx'
import Pharmacopeia from './components/Pharmacopeia.jsx'

const TABS = {
  home: { label: 'الرئيسية', labelEn: 'Home', icon: '🏠' },
  drugs: { label: 'الأدوية', labelEn: 'Drugs', icon: '💊' },
  interview: { label: 'المقابلة', labelEn: 'Interview', icon: '🎓' },
  pharmacopeia: { label: 'الدستور واللوائح', labelEn: 'Pharmacopeia', icon: '📋' },
}

export default function App() {
  const [tab, setTab] = useState('home')
  const [selectedDrugId, setSelectedDrugId] = useState(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const [edaDrugs, setEdaDrugs] = useState(null)

  useEffect(() => {
    loadEdaDrugs().then(setEdaDrugs)
  }, [])

  const allDrugs = useMemo(() => {
    const base = [...builtInDrugs, ...getUserDrugs()]
    if (edaDrugs) return [...base, ...edaDrugs]
    return base
  }, [refreshKey, edaDrugs])

  const allDiseases = useMemo(() => {
    return [...builtInDiseases, ...getUserDiseases()]
  }, [refreshKey])

  const handleAddDrug = () => {
    setRefreshKey(k => k + 1)
    setTab('drugs')
  }

  const handleViewDrug = (id) => {
    setSelectedDrugId(id)
    setTab('detail')
  }

  const handleDrugsTab = () => {
    setTab('drugs')
  }

  return (
    <div className="min-h-screen flex flex-col" dir="auto">
      <Navbar tabs={TABS} activeTab={tab} onTabChange={setTab} />

      <main className="flex-1 max-w-6xl w-full mx-auto px-3 sm:px-4 md:px-6 py-4 md:py-6">
        {tab === 'home' && (
          <Home
            drugs={allDrugs}
            diseases={allDiseases}
            onBrowse={() => setTab('drugs')}
            onInterview={() => setTab('interview')}
            onPrices={() => setTab('drugs')}
            onPharmacopeia={() => setTab('pharmacopeia')}
          />
        )}
        {tab === 'drugs' && (
          <DrugHub drugs={allDrugs} diseases={allDiseases} onViewDrug={handleViewDrug} onAddDrug={handleAddDrug} />
        )}
        {tab === 'detail' && selectedDrugId && (
          <DrugDetail
            drugId={selectedDrugId}
            drugs={allDrugs}
            diseases={allDiseases}
            onBack={handleDrugsTab}
            onViewDrug={handleViewDrug}
          />
        )}
        {tab === 'interview' && (
          <InterviewMode drugs={allDrugs} diseases={allDiseases} />
        )}
        {tab === 'pharmacopeia' && (
          <Pharmacopeia drugs={allDrugs} />
        )}
      </main>

      <footer className="bg-nile text-white/70 text-center text-sm py-3 px-4">
        Complete Egyptian Pharmacist AI | الصيدلي المصري الشامل
      </footer>
    </div>
  )
}
