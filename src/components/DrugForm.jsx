import { useState, useRef } from 'react'
import { addUserDrug } from '../utils/store.js'

const initialState = {
  nameAr: '', nameEn: '',
  scientificNameAr: '', scientificNameEn: '',
  activeIngredientAr: '', activeIngredientEn: '',
  category: '', categoryAr: '',
  formEmoji: '💊',
  description: '', descriptionAr: '',
  indicationEn: '', indicationAr: '',
  mechanismEn: '', mechanismAr: '',
  sideEffectsEn: '', sideEffectsAr: '',
  dosageEn: '', dosageAr: '',
  pregnancyEn: '', pregnancyAr: '',
  breastfeedingEn: '', breastfeedingAr: '',
  manufacturerEn: '', manufacturerAr: '',
  prices: [],
  imageUrl: '',
}

const formEmojis = ['💊', '💉', '💧', '🩹', '💨', '🧴', '🍬']

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
  const [newPrice, setNewPrice] = useState({ form: '', formEn: '', price: '', unit: 'EGP' })
  const [submitting, setSubmitting] = useState(false)

  const update = (field, value) => setForm(f => ({ ...f, [field]: value }))

  const addPrice = () => {
    if (!newPrice.form || !newPrice.price) return
    setForm(f => ({ ...f, prices: [...f.prices, { ...newPrice, price: Number(newPrice.price) }] }))
    setNewPrice({ form: '', formEn: '', price: '', unit: 'EGP' })
  }

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
      drugInteractions: interactions.map(i => ({
        drugId: i.drugName,
        severity: i.severity,
        description: i.description
      })),
      diseaseInteractions: diseaseInts.map(d => ({
        diseaseId: d.name,
        severity: d.severity,
        description: d.description
      }))
    }
    addUserDrug(drug)
    onSuccess()
  }

  const Field = ({ label, field, dir, required }) => (
    <div>
      <label className="block font-bold text-nile text-sm mb-1">{label}</label>
      <input type="text" value={form[field]} onChange={e => update(field, e.target.value)} required={required}
        className="w-full px-3 py-2 border border-sand-dark rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-gold"
        dir={dir || 'auto'} />
    </div>
  )

  const Textarea = ({ label, field }) => (
    <div>
      <label className="block font-bold text-nile text-sm mb-1">{label}</label>
      <textarea value={form[field]} onChange={e => update(field, e.target.value)} rows={2}
        className="w-full px-3 py-2 border border-sand-dark rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-gold" />
    </div>
  )

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-nile">➕ إضافة دواء جديد / Add New Drug</h2>

      <form onSubmit={handleSubmit} className="bg-white border border-sand-dark rounded-xl p-4 md:p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="الاسم بالعربية *" field="nameAr" dir="rtl" required />
          <Field label="Name (English) *" field="nameEn" required />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="الاسم العلمي (عربي)" field="scientificNameAr" dir="rtl" />
          <Field label="Scientific Name" field="scientificNameEn" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="المادة الفعالة (عربي)" field="activeIngredientAr" dir="rtl" />
          <Field label="Active Ingredient" field="activeIngredientEn" />
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
          <label className="block font-bold text-nile text-sm mb-1">رمز الشكل الصيدلي / Form Emoji</label>
          <div className="flex gap-2">
            {formEmojis.map(e => (
              <button key={e} type="button" onClick={() => update('formEmoji', e)}
                className={`text-2xl p-2 rounded-lg border-2 ${form.formEmoji === e ? 'border-gold bg-gold/10' : 'border-gray-200 hover:border-gray-400'}`}>
                {e}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Textarea label="الوصف (عربي)" field="description" />
          <Textarea label="Description (English)" field="descriptionAr" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Textarea label="الاستخدامات (عربي)" field="indicationAr" />
          <Textarea label="Indications (English)" field="indicationEn" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Textarea label="آلية العمل (عربي)" field="mechanismAr" />
          <Textarea label="Mechanism (English)" field="mechanismEn" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Textarea label="الآثار الجانبية (عربي)" field="sideEffectsAr" />
          <Textarea label="Side Effects (English)" field="sideEffectsEn" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Textarea label="الجرعة (عربي)" field="dosageAr" />
          <Textarea label="Dosage (English)" field="dosageEn" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Textarea label="الحمل (عربي)" field="pregnancyAr" />
          <Textarea label="Pregnancy (English)" field="pregnancyEn" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Textarea label="الرضاعة (عربي)" field="breastfeedingAr" />
          <Textarea label="Breastfeeding (English)" field="breastfeedingEn" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="الشركة المصنعة (عربي)" field="manufacturerAr" dir="rtl" />
          <Field label="Manufacturer (English)" field="manufacturerEn" />
        </div>

        <div className="border-t border-sand-dark pt-4">
          <h3 className="font-bold text-nile mb-3">💰 الأسعار / Prices</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2">
            <input type="text" value={newPrice.form} onChange={e => setNewPrice(p => ({ ...p, form: e.target.value }))}
              placeholder="الشكل (عربي)"
              className="px-3 py-2 border border-sand-dark rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-gold text-right" dir="rtl" />
            <input type="text" value={newPrice.formEn} onChange={e => setNewPrice(p => ({ ...p, formEn: e.target.value }))}
              placeholder="Form (English)"
              className="px-3 py-2 border border-sand-dark rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-gold" />
            <input type="number" value={newPrice.price} onChange={e => setNewPrice(p => ({ ...p, price: e.target.value }))}
              placeholder="السعر / Price"
              className="px-3 py-2 border border-sand-dark rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-gold" />
            <button type="button" onClick={addPrice}
              className="bg-nile text-white py-2 rounded-lg font-bold text-sm hover:bg-nile-light transition-colors">+ إضافة</button>
          </div>
          {form.prices.length > 0 && (
            <div className="space-y-1">
              {form.prices.map((p, i) => (
                <div key={i} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-1.5 text-sm">
                  <button type="button" onClick={() => setForm(f => ({ ...f, prices: f.prices.filter((_, j) => j !== i) }))}
                    className="text-red-500">✕</button>
                  <span>{p.form} – {p.price} {p.unit}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-sand-dark pt-4">
          <h3 className="font-bold text-nile mb-3">⚡ التفاعلات الدوائية / Drug Interactions</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2">
            <input type="text" value={newInter.drugName} onChange={e => setNewInter(d => ({ ...d, drugName: e.target.value }))}
              placeholder="اسم الدواء / Drug name"
              className="px-3 py-2 border border-sand-dark rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-gold" />
            <input type="text" value={newInter.description} onChange={e => setNewInter(d => ({ ...d, description: e.target.value }))}
              placeholder="الوصف / Description"
              className="px-3 py-2 border border-sand-dark rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-gold" />
            <select value={newInter.severity} onChange={e => setNewInter(d => ({ ...d, severity: e.target.value }))}
              className="px-3 py-2 border border-sand-dark rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-gold">
              <option value="contraindicated">🚫 ممنوع</option>
              <option value="severe">🔴 شديد</option>
              <option value="moderate">🟠 متوسط</option>
              <option value="minor">🟡 بسيط</option>
            </select>
            <button type="button" onClick={addInteraction}
              className="bg-nile text-white py-2 rounded-lg font-bold text-sm hover:bg-nile-light transition-colors">+ إضافة</button>
          </div>
          {interactions.length > 0 && (
            <div className="space-y-1">
              {interactions.map((d, i) => (
                <div key={i} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-1.5 text-sm">
                  <button type="button" onClick={() => setInteractions(prev => prev.filter((_, j) => j !== i))}
                    className="text-red-500">✕</button>
                  <span>{d.drugName} <span className="text-gray-400">({d.severity})</span></span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-sand-dark pt-4">
          <h3 className="font-bold text-nile mb-3">🩺 التفاعلات المرضية / Disease Interactions</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2">
            <input type="text" value={newDisease.name} onChange={e => setNewDisease(d => ({ ...d, name: e.target.value }))}
              placeholder="اسم المرض / Disease name"
              className="px-3 py-2 border border-sand-dark rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-gold" />
            <input type="text" value={newDisease.description} onChange={e => setNewDisease(d => ({ ...d, description: e.target.value }))}
              placeholder="الوصف / Description"
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
            <div className="space-y-1">
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
