import { useState, useEffect } from 'react'

export default function DarkModeToggle() {
  const [dark, setDark] = useState(() => {
    try { return localStorage.getItem('dark-mode') === 'true' } catch { return false }
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    try { localStorage.setItem('dark-mode', dark) } catch {}
  }, [dark])

  return (
    <button
      onClick={() => setDark(d => !d)}
      className="p-2 rounded-lg hover:bg-white/10 transition-colors text-sm"
      title={dark ? 'الوضع النهاري / Light Mode' : 'الوضع الليلي / Dark Mode'}
    >
      {dark ? '☀️' : '🌙'}
    </button>
  )
}
