import { useState, useMemo } from 'react'
import { drugs as builtInDrugs } from './data/drugs.js'
import { diseases as builtInDiseases } from './data/diseases.js'
import { getUserDrugs, getUserDiseases } from './utils/store.js'
import Navbar from './components/Navbar.jsx'
import Home from './components/Home.jsx'
import DrugBrowser from './components/DrugBrowser.jsx'
import DrugDetail from './components/DrugDetail.jsx'
import InteractionCheck from './components/InteractionCheck.jsx'
import DiseaseCheck from './components/DiseaseCheck.jsx'
import InterviewMode from './components/InterviewMode.jsx'
import DrugForm from './components/DrugForm.jsx'

const TABS = {
  home: { label: 'الرئيسية', labelEn: 'Home', icon: '🏠' },
  browse: { label: 'تصفح الأدوية', labelEn: 'Browse', icon: '🔍' },
  interact: { label: 'تفاعل دواء-دواء', labelEn: 'Drug-Drug', icon: '⚡' },
  disease: { label: 'تفاعل دواء-مرض', labelEn: 'Drug-Disease', icon: '🩺' },
  interview: { label: 'المقابلة', labelEn: 'Interview', icon: '🎓' },
  add: { label: 'إضافة دواء', labelEn: 'Add Drug', icon: '➕' },
}

export default function App() {
  const [tab, setTab] = useState('home')
  const [selectedDrugId, setSelectedDrugId] = useState(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const allDrugs = useMemo(() => {
    return [...builtInDrugs, ...getUserDrugs()]
  }, [refreshKey])

  const allDiseases = useMemo(() => {
    return [...builtInDiseases, ...getUserDiseases()]
  }, [refreshKey])

  const handleAddDrug = () => {
    setRefreshKey(k => k + 1)
    setTab('browse')
  }

  const handleViewDrug = (id) => {
    setSelectedDrugId(id)
    setTab('detail')
  }

  return (
    <div className="min-h-screen flex flex-col" dir="auto">
      <Navbar tabs={TABS} activeTab={tab} onTabChange={setTab} />

      <main className="flex-1 max-w-6xl w-full mx-auto px-3 sm:px-4 md:px-6 py-4 md:py-6">
        {tab === 'home' && (
          <Home
            drugs={allDrugs}
            diseases={allDiseases}
            onBrowse={() => setTab('browse')}
            onInterview={() => setTab('interview')}
          />
        )}
        {tab === 'browse' && (
          <DrugBrowser drugs={allDrugs} onViewDrug={handleViewDrug} />
        )}
        {tab === 'detail' && selectedDrugId && (
          <DrugDetail
            drugId={selectedDrugId}
            drugs={allDrugs}
            diseases={allDiseases}
            onBack={() => setTab('browse')}
            onViewDrug={handleViewDrug}
          />
        )}
        {tab === 'interact' && (
          <InteractionCheck drugs={allDrugs} onViewDrug={handleViewDrug} />
        )}
        {tab === 'disease' && (
          <DiseaseCheck drugs={allDrugs} diseases={allDiseases} onViewDrug={handleViewDrug} />
        )}
        {tab === 'interview' && (
          <InterviewMode drugs={allDrugs} diseases={allDiseases} />
        )}
        {tab === 'add' && (
          <DrugForm onSuccess={handleAddDrug} />
        )}
      </main>

      <footer className="bg-nile text-white/70 text-center text-sm py-3 px-4">
        Egyptian Drug Interaction Platform | منصة التفاعلات الدوائية المصرية
      </footer>
    </div>
  )
}
