import { useState } from 'react'

export default function Navbar({ tabs, activeTab, onTabChange }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const tabKeys = Object.keys(tabs)

  return (
    <nav className="bg-nile text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6">
        <div className="flex items-center justify-between h-14 md:h-16">
          <button
            onClick={() => { onTabChange('home'); setMobileOpen(false) }}
            className="flex items-center gap-2 text-lg md:text-xl font-bold tracking-tight"
          >
            <span className="text-gold text-2xl">⚕️</span>
            <span className="hidden xs:inline">Drug Interact</span>
            <span className="text-gold text-base md:text-lg">🇪🇬</span>
          </button>

          <div className="hidden md:flex items-center gap-1">
            {tabKeys.map(key => (
              <button
                key={key}
                onClick={() => onTabChange(key)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === key
                    ? 'bg-gold text-nile'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                {tabs[key].icon} {tabs[key].labelEn}
              </button>
            ))}
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white/10"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden pb-3 space-y-1">
            {tabKeys.map(key => (
              <button
                key={key}
                onClick={() => { onTabChange(key); setMobileOpen(false) }}
                className={`w-full text-right px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === key
                    ? 'bg-gold text-nile'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                {tabs[key].icon} {tabs[key].label}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}
