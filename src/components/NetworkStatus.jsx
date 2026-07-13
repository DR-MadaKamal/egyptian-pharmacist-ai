import { useState, useEffect } from 'react'

export default function NetworkStatus() {
  const [online, setOnline] = useState(navigator.onLine)

  useEffect(() => {
    const up = () => setOnline(true)
    const down = () => setOnline(false)
    window.addEventListener('online', up)
    window.addEventListener('offline', down)
    return () => {
      window.removeEventListener('online', up)
      window.removeEventListener('offline', down)
    }
  }, [])

  if (online) return null

  return (
    <div className="bg-red-600 text-white text-center text-sm py-1.5 font-semibold">
      ⚠️ أنت غير متصل بالإنترنت / You are offline — بعض البيانات قد لا تكون متاحة
    </div>
  )
}
