import { useState, useMemo, useEffect } from 'react'
import DrugForm from './DrugForm.jsx'
import { getUserDrugs, deleteUserDrug } from '../utils/store.js'

export default function AdminPanel({ allDrugs, onLogout, onViewDrug }) {
  const [subTab, setSubTab] = useState('dashboard')
  const [refreshKey, setRefreshKey] = useState(0)
  const [syncInfo, setSyncInfo] = useState(null)

  useEffect(() => {
    fetch('/egyptian-pharmacist-ai/data/sync-manifest.json').then(r => r.json()).then(setSyncInfo).catch(() => {})
  }, [])

  const userDrugs = useMemo(() => getUserDrugs(), [refreshKey])

  const handleAddDrug = () => {
    setRefreshKey(k => k + 1)
    setSubTab('dashboard')
  }

  const handleDelete = (id) => {
    deleteUserDrug(id)
    setRefreshKey(k => k + 1)
  }

  const edaDrugsCount = useMemo(() => allDrugs.filter(d => d.edaOnly).length, [allDrugs])
  const enrichedCount = useMemo(() => allDrugs.filter(d => !d.edaOnly && !d.id?.startsWith('user_')).length, [allDrugs])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-sand-dark pb-3">
        <div className="flex items-center gap-2 overflow-x-auto">
          <h2 className="text-2xl font-bold text-nile shrink-0 ml-4">⚙️ لوحة التحكم / Admin Panel</h2>
          <div className="flex gap-1">
            {[
              { key: 'dashboard', label: 'لوحة البيانات', labelEn: 'Dashboard', icon: '📊' },
              { key: 'add', label: 'إضافة دواء', labelEn: 'Add Drug', icon: '➕' },
            ].map(t => (
              <button
                key={t.key}
                onClick={() => setSubTab(t.key)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  subTab === t.key ? 'bg-nile text-white' : 'text-gray-500 hover:text-nile hover:bg-sand'
                }`}
              >
                {t.icon} {t.labelEn}
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={onLogout}
          className="text-sm text-red-600 hover:text-red-800 font-medium shrink-0"
        >
          🚪 خروج / Logout
        </button>
      </div>

      {subTab === 'dashboard' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-nile">{allDrugs.length}</div>
              <div className="text-xs text-gray-600">إجمالي الأدوية / Total Drugs</div>
            </div>
            <div className="bg-green-50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-green-700">{enrichedCount}</div>
              <div className="text-xs text-gray-600">أدوية مدعمة / Enriched</div>
            </div>
            <div className="bg-purple-50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-purple-700">{edaDrugsCount}</div>
              <div className="text-xs text-gray-600">أدوية EDA / EDA Listed</div>
            </div>
            <div className="bg-orange-50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-orange-700">{userDrugs.length}</div>
              <div className="text-xs text-gray-600">أدوية مضافة / User Added</div>
            </div>
          </div>

          {syncInfo && (
            <div className="bg-white border border-sand-dark rounded-xl p-4">
              <h3 className="font-bold text-nile text-sm mb-2">🔄 آخر تحديث / Last Sync</h3>
              <div className="text-xs text-gray-500 space-y-1">
                <p>آخر مزامنة: {syncInfo.lastSync || 'غير متوفر'}</p>
                {syncInfo.sources && (
                  <p>المصادر المتاحة: {syncInfo.sources.filter(s => s.healthy).length} / {syncInfo.sources.length}</p>
                )}
              </div>
            </div>
          )}

          {userDrugs.length > 0 && (
            <div className="bg-white border border-sand-dark rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 font-bold text-nile">
                🗂️ الأدوية المضافة / User-Added Drugs
              </div>
              {userDrugs.map(d => (
                <div key={d.id} className="flex items-center justify-between px-4 py-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50">
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-nile text-sm">{d.nameAr}</div>
                    <div className="text-xs text-gray-500 truncate">{d.nameEn}</div>
                    <div className="text-xs text-gray-400">{d.manufacturerEn || 'غير متوفر'}</div>
                  </div>
                  <div className="flex gap-2 shrink-0 mr-3">
                    <button
                      onClick={() => onViewDrug(d.id)}
                      className="text-xs text-blue-600 hover:text-blue-800 px-2 py-1 rounded hover:bg-blue-50"
                    >
                      عرض / View
                    </button>
                    <button
                      onClick={() => handleDelete(d.id)}
                      className="text-xs text-red-600 hover:text-red-800 px-2 py-1 rounded hover:bg-red-50"
                    >
                      حذف / Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {userDrugs.length === 0 && (
            <div className="bg-white border border-sand-dark rounded-xl p-6 text-center text-gray-500">
              <div className="text-3xl mb-2">📭</div>
              <p>لا توجد أدوية مضافة / No user-added drugs</p>
              <button
                onClick={() => setSubTab('add')}
                className="mt-3 text-sm text-blue-600 hover:underline"
              >
                إضافة دواء جديد / Add a new drug
              </button>
            </div>
          )}
        </div>
      )}

      {subTab === 'add' && (
        <div className="max-w-lg mx-auto">
          <div className="bg-white border border-sand-dark rounded-xl p-6">
            <h3 className="text-lg font-bold text-nile mb-4">➕ إضافة دواء جديد / Add New Drug</h3>
            <DrugForm onSuccess={handleAddDrug} />
          </div>
        </div>
      )}
    </div>
  )
}
