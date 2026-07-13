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
import AdminLogin from './components/AdminLogin.jsx'
import AdminPanel from './components/AdminPanel.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'

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
  const [isAdmin, setIsAdmin] = useState(false)

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
          <DrugHub drugs={allDrugs} diseases={allDiseases} onViewDrug={handleViewDrug} />
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
        {tab === 'admin-login' && (
          <AdminLogin onLogin={() => { setIsAdmin(true); setTab('admin') }} />
        )}
        {tab === 'admin' && isAdmin && (
          <AdminPanel allDrugs={allDrugs} onLogout={() => { setIsAdmin(false); setTab('home') }} onViewDrug={handleViewDrug} />
        )}
      </main>

      <footer className="bg-nile text-white/70 text-center text-sm py-3 px-4">
        <div className="flex items-center justify-center gap-4">
          <span>Complete Egyptian Pharmacist AI | الصيدلي المصري الشامل</span>
          <button
            onClick={() => isAdmin ? setTab('admin') : setTab('admin-login')}
            className="text-white/40 hover:text-white/70 text-xs transition-colors"
            title="Admin Panel"
          >
            ⚙️
          </button>
        </div>
      </footer>

      <ScrollToTop />
    </div>
  )
}
