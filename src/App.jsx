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
import NetworkStatus from './components/NetworkStatus.jsx'

const TABS = {
  home: { label: 'الرئيسية', labelEn: 'Home', icon: '🏠' },
  drugs: { label: 'الأدوية', labelEn: 'Drugs', icon: '💊' },
  interview: { label: 'المقابلة', labelEn: 'Interview', icon: '🎓' },
  pharmacopeia: { label: 'الدستور واللوائح', labelEn: 'Pharmacopeia', icon: '📋' },
}

const TAB_TITLES = {
  home: 'الرئيسية / Home',
  drugs: 'الأدوية / Drugs',
  interview: 'المقابلة / Interview',
  pharmacopeia: 'الدستور واللوائح / Pharmacopeia',
  'admin-login': 'دخول المشرف / Admin Login',
  admin: 'لوحة التحكم / Admin Panel',
}

export default function App() {
  const [tab, setTab] = useState('home')
  const [selectedDrugId, setSelectedDrugId] = useState(null)
  const [refreshKey, _setRefreshKey] = useState(0)
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

  const selectedDrug = useMemo(() => {
    if (!selectedDrugId) return null
    return allDrugs.find(d => d.id === selectedDrugId) || null
  }, [selectedDrugId, allDrugs])

  useEffect(() => {
    if (tab === 'detail' && selectedDrug) {
      document.title = `${selectedDrug.nameAr} - Pharma AI`
    } else if (tab === 'home') {
      document.title = 'Complete Egyptian Pharmacist AI - الصيدلي المصري الشامل'
    } else {
      document.title = `${TAB_TITLES[tab] || 'Pharma AI'} - Pharma AI`
    }
  })

  useEffect(() => {
    const handler = (e) => {
      if ((e.key === '/' || (e.ctrlKey && e.key === '/')) && !['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) {
        e.preventDefault()
        const search = document.querySelector('input[type="text"]')
        search?.focus()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const handleViewDrug = (id) => {
    setSelectedDrugId(id)
    setTab('detail')
    try {
      const prev = JSON.parse(sessionStorage.getItem('recent-drugs') || '[]')
      const updated = [id, ...prev.filter(x => x !== id)].slice(0, 10)
      sessionStorage.setItem('recent-drugs', JSON.stringify(updated))
    } catch {}
  }

  const recentlyViewed = useMemo(() => {
    try {
      const ids = JSON.parse(sessionStorage.getItem('recent-drugs') || '[]')
      return ids.map(id => allDrugs.find(d => d.id === id)).filter(Boolean)
    } catch { return [] }
  }, [tab])

  const handleDrugsTab = () => {
    setTab('drugs')
  }

  return (
    <div className="min-h-screen flex flex-col" dir="auto">
      <Navbar tabs={TABS} activeTab={tab} onTabChange={setTab} />
      <NetworkStatus />

      <main className="flex-1 max-w-6xl w-full mx-auto px-3 sm:px-4 md:px-6 py-4 md:py-6">
        {tab === 'home' && (
          <Home
            drugs={allDrugs}
            diseases={allDiseases}
            recentlyViewed={recentlyViewed}
            onBrowse={() => setTab('drugs')}
            onInterview={() => setTab('interview')}
            onPrices={() => setTab('drugs')}
            onPharmacopeia={() => setTab('pharmacopeia')}
            onViewDrug={handleViewDrug}
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
        <div className="mt-2 text-white/30 text-xs flex items-center justify-center gap-3">
          <span><kbd className="bg-white/10 px-1.5 py-0.5 rounded text-white/50">/</kbd> بحث / Search</span>
          <span><kbd className="bg-white/10 px-1.5 py-0.5 rounded text-white/50">Esc</kbd> إغلاق / Close</span>
        </div>
      </footer>

      <ScrollToTop />
    </div>
  )
}
