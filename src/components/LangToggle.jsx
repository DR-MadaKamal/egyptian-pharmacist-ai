import { useState } from 'react'

const LANG_LABELS = { ar: '🇪🇬 AR', en: '🇬🇧 EN' }

export default function LangToggle() {
  const [lang, setLang] = useState(() => {
    try { return localStorage.getItem('pharma-lang') || 'ar' } catch { return 'ar' }
  })

  const toggle = () => {
    const next = lang === 'ar' ? 'en' : 'ar'
    setLang(next)
    localStorage.setItem('pharma-lang', next)
    window.dispatchEvent(new Event('languagechange'))
  }

  return (
    <button onClick={toggle} className="text-xs font-bold px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 transition-colors" title="Toggle language">
      {LANG_LABELS[lang]}
    </button>
  )
}
