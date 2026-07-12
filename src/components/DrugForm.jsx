import { useState, useRef } from 'react'
import { addUserDrug } from '../utils/store.js'

const initialState = {
  nameAr: '',
  nameEn: '',
  category: '',
  categoryAr: '',
  description: '',
}

const commonCategories = [
  { en: 'Antibiotic', ar: 'مضاد حيوي' },
  { en: 'Antihypertensive', ar: 'خافض للضغط' },
  { en: 'Antidiabetic', ar: 'خافض للسكر' },
  { en: 'NSAID', ar: 'مسكن/مضاد التهاب' },
  { en: 'Anticoagulant', ar: 'مضاد تخثر' },
  { en: 'Statin', ar: 'خافض كوليسترول' },
  { en: 'Antidepressant', ar: 'مضاد اكتئاب' },
  { en: 'Diuretic', ar: 'مدر بول' },
  { en: 'Antiepileptic', ar: 'مضاد صرع' },
  { en: 'PPI', ar: 'مثبط حموضة' },
  { en: 'Corticosteroid', ar: 'كورتيزون' },
  { en: 'Bronchodilator', ar: 'موسع قصبي' },
  { en: 'Cardiac', ar: 'قلبي' },
  { en: 'Other', ar: 'أخرى' },
]

export default function DrugForm({ onSuccess }) {
  const [form, setForm] = useState(initialState)
  const [interactions, setInteractions] = useState([])
  const [diseaseInts, setDiseaseInts] = useState([])
  const [newInter, setNewInter] = useState({ drugName: '', severity: 'moderate', description: '' })
  const [newDisease, setNewDisease] = useState({ name: '', severity: 'moderate', description: '' })
  const [submitting, setSubmitting] = useState(false)
  const previewRef = useRef(null)

  const update = (field, value) => setForm(f => ({ ...f, [field]: value }))

  const addInteraction = () => {
    if (!newInter.drugName.trim()) return
    setInteractions(prev => [...prev, { ...newInter, drugName: newInter.drugName.trim() }])
    setNewInter({ drugName: '', severity: 'moderate', description: '' })
  }

  const addDiseaseInt = () => {
    if (!newDisease.name.trim()) return
    setDiseaseInts(prev => [...prev, { ...newDisease, name: newDisease.name.trim() }])
    setNewDisease({ name: '', severity: 'moderate', description: '' })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.nameAr || !form.nameEn) return
    setSubmitting(true)

    const drug = {
      ...form,
      drugInteractions: [],
      diseaseInteractions: diseaseInts.map(d => ({
        diseaseId: d.name,
        severity: d.severity,
        description: d.description
      }))
    }
    addUserDrug(drug)
    onSuccess()
  }

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-nile">➕ إضافة دواء جديد / Add New Drug</h2>

      <form onSubmit={handleSubmit} className="bg-white border border-sand-dark rounded-xl p-4 md:p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-nile text-sm mb-1">الاسم بالعربية *</label>
            <input type="text" value={form.nameAr} onChange={e => update('nameAr', e.target.value)} required
              className="w-full px-3 py-2 border border-sand-dark rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-gold text-right" dir="rtl" />
          </div>
          <div>
            <label className="block font-bold text-nile text-sm mb-1">Name (English) *</label>
            <input type="text" value={form.nameEn} onChange={e => update('nameEn', e.target.value)} required
              className="w-full px-3 py-2 border border-sand-dark rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-gold" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-nile text-sm mb-1">التصنيف (عربي)</label>
            <input type="text" value={form.categoryAr} onChange={e => update('categoryAr', e.target.value)} list="cats-ar"
              className="w-full px-3 py-2 border border-sand-dark rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-gold text-right" dir="rtl" />
            <datalist id="cats-ar">{commonCategories.map(c => <option key={c.ar} value={c.ar} />)}</datalist>
          </div>
          <div>
            <label className="block font-bold text-nile text-sm mb-1">Category (English)</label>
            <input type="text" value={form.category} onChange={e => update('category', e.target.value)} list="cats-en"
              className="w-full px-3 py-2 border border-sand-dark rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-gold" />
            <datalist id="cats-en">{commonCategories.map(c => <option key={c.en} value={c.en} />)}</datalist>
          </div>
        </div>

        <div>
          <label className="block font-bold text-nile text-sm mb-1">الوصف / Description</label>
          <textarea value={form.description} onChange={e => update('description', e.target.value)} rows={2}
            className="w-full px-3 py-2 border border-sand-dark rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-gold" />
        </div>

        <div className="border-t border-sand-dark pt-4">
          <h3 className="font-bold text-nile mb-3">🩺 التفاعلات المرضية / Disease Interactions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
            <input type="text" value={newDisease.name} onChange={e => setNewDisease(d => ({ ...d, name: e.target.value }))}
              placeholder="اسم المرض / Disease name"
              className="px-3 py-2 border border-sand-dark rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-gold" />
            <select value={newDisease.severity} onChange={e => setNewDisease(d => ({ ...d, severity: e.target.value }))}
              className="px-3 py-2 border border-sand-dark rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-gold">
              <option value="contraindicated">🚫 ممنوع</option>
              <option value="severe">🔴 شديد</option>
              <option value="moderate">🟠 متوسط</option>
              <option value="minor">🟡 بسيط</option>
            </select>
            <button type="button" onClick={addDiseaseInt}
              className="bg-nile text-white py-2 rounded-lg font-bold text-sm hover:bg-nile-light transition-colors">+ إضافة</button>
          </div>
          {diseaseInts.length > 0 && (
            <div className="space-y-1 mb-2">
              {diseaseInts.map((d, i) => (
                <div key={i} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-1.5 text-sm">
                  <button type="button" onClick={() => setDiseaseInts(prev => prev.filter((_, j) => j !== i))}
                    className="text-red-500">✕</button>
                  <span>{d.name} <span className="text-gray-400">({d.severity})</span></span>
                </div>
              ))}
            </div>
          )}
        </div>

        <button type="submit" disabled={!form.nameAr || !form.nameEn || submitting}
          className="w-full bg-gold text-nile py-3 rounded-xl font-bold text-lg hover:bg-gold-light transition-colors disabled:opacity-50">
          {submitting ? 'جاري الحفظ...' : '💾 حفظ الدواء / Save Drug'}
        </button>
      </form>
    </div>
  )
}
