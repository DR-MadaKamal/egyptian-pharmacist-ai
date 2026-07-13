import { useState } from 'react'

const ADMIN_USER = 'admin'
const ADMIN_PASS = 'Mm123'

export default function AdminLogin({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      setError('')
      onLogin()
    } else {
      setError('اسم المستخدم أو كلمة المرور غير صحيحة / Invalid username or password')
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-12">
      <div className="bg-white border border-sand-dark rounded-xl p-6">
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">🔐</div>
          <h2 className="text-xl font-bold text-nile">دخول المشرف / Admin Login</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">اسم المستخدم / Username</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-sand-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
              dir="auto"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">كلمة المرور / Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-sand-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}

          <button
            type="submit"
            className="w-full bg-nile text-white py-2.5 rounded-lg font-bold hover:bg-nile-light transition-colors"
          >
            تسجيل الدخول / Login
          </button>
        </form>
      </div>
    </div>
  )
}
