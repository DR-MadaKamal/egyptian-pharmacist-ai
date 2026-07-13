import { useState, useMemo } from 'react'

export default function DrugCompare({ drugs }) {
  const [drugIds, setDrugIds] = useState([null, null])
  const [queries, setQueries] = useState(['', ''])
  const [show, setShow] = useState([false, false])

  const results = useMemo(() => [
    queries[0] && !drugIds[0] ? drugs.filter(d => d.nameEn?.toLowerCase().includes(queries[0].toLowerCase()) || d.nameAr?.includes(queries[0])).slice(0, 8) : [],
    queries[1] && !drugIds[1] ? drugs.filter(d => d.nameEn?.toLowerCase().includes(queries[1].toLowerCase()) || d.nameAr?.includes(queries[1])).slice(0, 8) : [],
  ], [drugs, queries, drugIds])

  const a = drugIds[0] ? drugs.find(d => d.id === drugIds[0]) : null
  const b = drugIds[1] ? drugs.find(d => d.id === drugIds[1]) : null

  const fields = [
    { label: 'الاسم العربي / Arabic Name', val: (d) => d.nameAr },
    { label: 'الاسم الإنجليزي / English Name', val: (d) => d.nameEn },
    { label: 'الاسم العلمي / Scientific Name', val: (d) => d.scientificNameAr || d.scientificNameEn },
    { label: 'التصنيف / Category', val: (d) => `${d.categoryAr || ''} ${d.category || ''}` },
    { label: 'الشركة المصنعة / Manufacturer', val: (d) => d.manufacturerEn || '-' },
    { label: 'السعر / Price', val: (d) => d.prices?.length > 0 ? `${d.prices[0].price} ${d.prices[0].unit}` : '-' },
    { label: 'طريقة التعاطي / Route', val: (d) => d.prices?.map(p => p.formEn || p.form).join(', ') || '-' },
    { label: 'التفاعلات الدوائية / Drug Int.', val: (d) => `${d.drugInteractions?.length || 0}` },
    { label: 'التفاعلات المرضية / Disease Int.', val: (d) => `${d.diseaseInteractions?.length || 0}` },
  ]

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-nile">🔍 مقارنة الأدوية / Compare Drugs</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[0, 1].map(idx => (
          <div key={idx} className="bg-white border border-sand-dark rounded-xl p-4">
            <label className="block font-bold text-nile mb-2">الدواء {idx === 0 ? 'الأول / Drug A' : 'الثاني / Drug B'}</label>
            {drugIds[idx] && drugs.find(d => d.id === drugIds[idx]) ? (
              <div className="flex items-center justify-between bg-sand rounded-lg p-3">
                <button onClick={() => { const ids = [...drugIds]; ids[idx] = null; setDrugIds(ids); setQueries(q => { const nq = [...q]; nq[idx] = ''; return nq }) }} className="text-red-500 text-sm">✕</button>
                <div className="text-right">
                  <span className="font-bold text-nile">{drugs.find(d => d.id === drugIds[idx])?.nameAr}</span>
                  <span className="text-gray-500 text-sm mr-2">{drugs.find(d => d.id === drugIds[idx])?.nameEn}</span>
                </div>
              </div>
            ) : (
              <div className="relative">
                <input type="text" value={queries[idx]} onChange={e => { const nq = [...queries]; nq[idx] = e.target.value; setQueries(nq); const ns = [...show]; ns[idx] = true; setShow(ns) }}
                  onFocus={() => { const ns = [...show]; ns[idx] = true; setShow(ns) }}
                  placeholder="ابحث عن دواء..." dir="auto"
                  className="w-full px-3 py-2 border border-sand-dark rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold text-right" />
                {show[idx] && results[idx].length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-sand-dark rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {results[idx].map(d => (
                      <button key={d.id} onClick={() => { const ids = [...drugIds]; ids[idx] = d.id; setDrugIds(ids); const nq = [...queries]; nq[idx] = ''; setQueries(nq); const ns = [...show]; ns[idx] = false; setShow(ns) }}
                        className="w-full text-right px-3 py-2 hover:bg-sand text-sm flex justify-between items-center">
                        <span className="text-gray-500">{d.nameEn}</span>
                        <span className="font-bold text-nile">{d.nameAr}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {a && b && (
        <div className="bg-white border border-sand-dark rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-sand">
                <th className="text-right px-4 py-2 text-nile font-bold w-1/3">الخاصية / Property</th>
                <th className="text-right px-4 py-2 text-nile font-bold">{a.nameAr}</th>
                <th className="text-right px-4 py-2 text-nile font-bold">{b.nameAr}</th>
              </tr>
            </thead>
            <tbody>
              {fields.map((f, i) => {
                const va = f.val(a) || '-'
                const vb = f.val(b) || '-'
                const diff = va !== vb
                return (
                  <tr key={i} className={`border-t border-gray-100 ${diff ? 'bg-yellow-50' : ''}`}>
                    <td className="px-4 py-2 text-gray-500 text-xs">{f.label}</td>
                    <td className={`px-4 py-2 font-medium ${diff ? 'text-nile' : 'text-gray-700'}`}>{va}</td>
                    <td className={`px-4 py-2 font-medium ${diff ? 'text-nile' : 'text-gray-700'}`}>{vb}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
