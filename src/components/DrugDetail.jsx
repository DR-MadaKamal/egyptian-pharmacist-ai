import { useState, useEffect, useMemo } from 'react'
import { getDrugById, getDrugInteractions, getDiseaseInteractions, severityConfig } from '../utils/interactions.js'
import { edaSupplement } from '../data/eda-supplement.js'
import { findSimilarDrugs } from '../utils/searchUtils.js'

const MFR_ICONS = new Map([
  ['glaxo', '🧬'], ['gsk', '🧬'], ['pfizer', '🔵'], ['novartis', '🔴'], ['sanofi', '🟦'],
  ['bayer', '➕'], ['roche', '🔬'], ['johnson', '🤱'], ['abbott', '🅰️'], ['merck', '⬇️'],
  ['novo nordisk', '🩸'], ['astrazeneca', '🟢'], ['takeda', '🔶'], ['lilly', '💉'],
  ['boehringer', '🫁'], ['sandoz', '🟣'], ['tev', '💊'], ['hikma', '🔷'], ['eipico', '🇪🇬'],
  ['alexandria', '🏛️'], ['misr', '🇪🇬'], ['sigma', 'Σ'], ['memphis', '🏺'],
  ['arabic', '🌙'], ['pharco', '🔺'], ['amoun', '🟠'],
])

function getMfrIcon(name) {
  if (!name) return '🏭'
  const n = name.toLowerCase()
  for (const [key, icon] of MFR_ICONS) {
    if (n.includes(key)) return icon
  }
  return '🏭'
}

function useLastSync() {
  const [sync, setSync] = useState(null)
  useEffect(() => {
    fetch('/egyptian-pharmacist-ai/data/sync-manifest.json').then(r => r.json()).then(d => setSync(d.lastSync)).catch(() => {})
  }, [])
  return sync
}

export default function DrugDetail({ drugId, drugs, diseases, onBack, onViewDrug }) {
  const drug = getDrugById(drugs, drugId)
  if (!drug) return <div className="text-center py-12 text-red-500">الدواء غير موجود / Drug not found</div>

  const drugInts = getDrugInteractions(drugs, drugId)
  const diseaseInts = getDiseaseInteractions(drugs, diseases, drugId)
  const [detailTab, setDetailTab] = useState('info')
  const lastSync = useLastSync()
  const { alternatives, similars } = useMemo(() => findSimilarDrugs(drug, drugs, 8), [drug, drugs])

  const formatDate = (iso) => {
    if (!iso) return null
    const d = new Date(iso)
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  const Section = ({ title, children }) => (
    <div className="bg-white border border-sand-dark rounded-xl p-4">
      <h3 className="font-bold text-nile text-lg mb-3">{title}</h3>
      {children}
    </div>
  )

  const CopyBtn = ({ text }) => {
    const [copied, setCopied] = useState(false)
    return (
      <button
        onClick={() => navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500) })}
        className="text-xs text-gray-400 hover:text-nile ml-2 shrink-0"
        title="Copy / نسخ"
      >
        {copied ? '✓' : '📋'}
      </button>
    )
  }

  const ShareBtn = ({ drug }) => {
    const [shared, setShared] = useState(false)
    const handleShare = () => {
      const url = `${window.location.origin}${window.location.pathname}?drug=${drug.id}`
      if (navigator.share) {
        navigator.share({ title: drug.nameAr, text: `${drug.nameAr} - ${drug.nameEn}`, url }).catch(() => {})
      } else {
        navigator.clipboard.writeText(`${drug.nameAr} - ${drug.nameEn}: ${url}`).then(() => {
          setShared(true); setTimeout(() => setShared(false), 1500)
        })
      }
    }
    return (
      <button onClick={handleShare} className="text-xs text-gray-400 hover:text-nile mr-2 shrink-0" title="مشاركة / Share">
        {shared ? '✓' : '🔗'}
      </button>
    )
  }

  const PrintBtn = () => (
    <button onClick={() => window.print()} className="text-xs text-gray-400 hover:text-nile mr-2 shrink-0 no-print" title="طباعة / Print">
      🖨️
    </button>
  )

  const Biline = ({ label, ar, en }) => (
    <div className="mb-2">
      <span className="text-xs font-bold text-gray-400 uppercase">{label}</span>
      <p className="text-gray-700 text-sm">{ar}</p>
      <p className="text-gray-500 text-xs">{en}</p>
    </div>
  )

  if (drug.edaOnly) {
    return (
      <div className="space-y-4">
        <nav className="flex items-center gap-2 text-sm text-gray-500">
          <button onClick={onBack} className="text-nile hover:text-gold-dark font-medium">💊 الأدوية / Drugs</button>
          <span>/</span>
          <span className="text-gray-800 font-medium truncate">{drug.nameAr}</span>
        </nav>

        <div className="bg-white border border-sand-dark rounded-xl p-4 md:p-6">
          <div className="flex items-start gap-4">
            <div className="text-5xl">💊</div>
            <div className="flex-1">
              <h2 className="text-2xl md:text-3xl font-bold text-nile">
                {drug.nameAr}
                <ShareBtn drug={drug} />
                <PrintBtn />
                <CopyBtn text={`${drug.nameAr} - ${drug.nameEn}`} />
              </h2>
              <p className="text-gray-500 text-lg">{drug.nameEn}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {drug.dataSource === 'MOHMED' ? (
                  <span className="inline-block bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm">Drug Guide 2024</span>
                ) : (
                  <span className="inline-block bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">EDA Listed</span>
                )}
                {drug.edaGroups && drug.edaGroups.length > 0 && (
                  <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs">{drug.edaGroups[0]}</span>
                )}
              </div>
              {lastSync && <p className="text-[10px] text-gray-300 mt-2">آخر تحديث / Last sync: {formatDate(lastSync)}</p>}
            </div>
          </div>
        </div>

        <Section title="🔬 الاسم العلمي / Scientific Name">
          <Biline label="" ar={drug.scientificNameAr} en={drug.scientificNameEn} />
        </Section>

        <Section title="📋 معلومات التسجيل / Registration Info">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-lg p-3">
              <span className="text-xs font-bold text-gray-400 uppercase">🏷 العلامات التجارية / Brand Names</span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {(drug.edaBrands && drug.edaBrands.length > 0) ? drug.edaBrands.map((brand, i) => {
                  const match = drugs.find(d => d.nameEn && d.nameEn.toUpperCase() === brand.toUpperCase() && d.id !== drug.id)
                  if (match) {
                    return (
                      <button key={i} onClick={() => onViewDrug(match.id)}
                        className="text-xs bg-nile/10 text-nile hover:bg-gold/20 hover:text-gold-dark px-2 py-1 rounded-lg transition-colors font-medium border border-nile/20 hover:border-gold/40">
                        {brand}
                      </button>
                    )
                  }
                  return (
                    <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-lg border border-gray-200">
                      {brand}
                    </span>
                  )
                }) : <span className="text-sm text-gray-400">غير متوفر / N/A</span>}
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <span className="text-xs font-bold text-gray-400 uppercase">🏭 الشركات المصنعة / Manufacturers</span>
              <div className="text-sm text-gray-700 mt-1">{(drug.edaMfrs && drug.edaMfrs.length > 0) ? drug.edaMfrs.map(m => `${getMfrIcon(m)} ${m}`).join(', ') : 'غير متوفر / N/A'}</div>
            </div>
            {drug.edaRoutes && drug.edaRoutes.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-3">
                <span className="text-xs font-bold text-gray-400 uppercase">📦 طرق التعاطي / Routes</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {drug.edaRoutes.map(rt => {
                    const parts = rt.split('.')
                    const colors = {'ORAL':'bg-blue-100 text-blue-700','TOPICAL':'bg-green-100 text-green-700','INJECTION':'bg-red-100 text-red-700','SPRAY':'bg-purple-100 text-purple-700','OPHTHALMIC':'bg-cyan-100 text-cyan-700','OTIC':'bg-yellow-100 text-yellow-700','VAGINAL':'bg-pink-100 text-pink-700','RECTAL':'bg-orange-100 text-orange-700','EFF':'bg-indigo-100 text-indigo-700'}
                    return (
                      <span key={rt} className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${colors[parts[0]] || 'bg-gray-100 text-gray-700'}`}>
                        {parts[1] === parts[0] ? parts[0] : rt}
                      </span>
                    )
                  })}
                </div>
              </div>
            )}
            {drug.edaGroups && drug.edaGroups.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-3">
                <span className="text-xs font-bold text-gray-400 uppercase">🏷 التصنيف / Category</span>
                <div className="text-sm text-gray-700 mt-1">{drug.edaGroups.join(', ')}</div>
              </div>
            )}
          </div>
        </Section>

        {drug.pharmacology && (
          <Section title="📖 معلومات دوائية / Pharmacology">
            <p className="text-sm text-gray-700">{drug.pharmacology}</p>
          </Section>
        )}

        {drug.edaPriceRange && drug.edaPriceRange.length > 0 && (
          <Section title="💰 الأسعار / Prices">
            {drug.edaRf && drug.edaRf.length > 0 ? (
              <div className="space-y-2">
                {drug.edaRf.map(([route, form, pmin, pmax], i) => (
                  <div key={i} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                    <span className="font-bold text-gold-dark text-sm">
                      EGP {pmin}{pmin !== pmax ? ` – ${pmax}` : ''}
                    </span>
                    <span className="text-xs text-gray-600">{route} / {form}</span>
                  </div>
                ))}
                <p className="text-xs text-gray-500 mt-1">
                  {drug.dataSource === 'MOHMED'
                    ? 'السعر حسب دليل الأدوية 2024 (قد يكون قديماً) / Price from 2024 Drug Guide (may be outdated)'
                    : 'نطاق سعر معتمد من هيئة الدواء المصرية / Price range verified by the Egyptian Drug Authority'}
                </p>
              </div>
            ) : (
              <>
                <div className="text-lg font-bold text-gold-dark">
                  EGP {drug.edaPriceRange[0]} – {drug.edaPriceRange[1]}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {drug.dataSource === 'MOHMED'
                    ? 'السعر حسب دليل الأدوية 2024 (قد يكون قديماً) / Price from 2024 Drug Guide (may be outdated)'
                    : 'نطاق سعر معتمد من هيئة الدواء المصرية / Price range verified by the Egyptian Drug Authority'}
                </p>
              </>
            )}
          </Section>
        )}

        <Section title="⚠️ تنبيه / Notice">
          <p className="text-sm text-gray-500">
            {drug.dataSource === 'MOHMED'
              ? 'هذا الدواء من دليل الأدوية المصري (أسعار 2024). لا تتوفر معلومات سريرية مفصلة. يُرجى استشارة الطبيب أو الصيدلي.'
              : 'هذا الدواء مسجل في قاعدة بيانات هيئة الدواء المصرية. لا تتوفر معلومات سريرية مفصلة. يُرجى استشارة الطبيب أو الصيدلي للحصول على معلومات إضافية.'}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {drug.dataSource === 'MOHMED'
              ? 'This drug is from the Egypt Drugs Guide (2024 prices). No detailed clinical information available. Please consult a physician or pharmacist.'
              : 'This drug is registered in the Egyptian Drug Authority database. No detailed clinical information is available. Please consult a physician or pharmacist for additional information.'}
          </p>
        </Section>

        {alternatives.length > 0 && (
          <Section title={`🔄 بدائل بنفس المادة الفعالة / Alternatives (${alternatives.length})`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {alternatives.map(alt => (
                <button key={alt.id} onClick={() => onViewDrug(alt.id)}
                  className="text-right bg-gray-50 hover:bg-sand rounded-lg p-3 transition-colors border border-transparent hover:border-gold/30">
                  <div className="font-bold text-nile text-sm">{alt.formEmoji || '💊'} {alt.nameAr}</div>
                  <div className="text-xs text-gray-500">{alt.nameEn}</div>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    {alt.manufacturerEn && <span className="text-[10px] text-gray-400">{getMfrIcon(alt.manufacturerEn)} {alt.manufacturerEn}</span>}
                    {alt.price_egp != null && <span className="text-[10px] text-gold-dark font-bold">EGP {alt.price_egp}</span>}
                  </div>
                </button>
              ))}
            </div>
          </Section>
        )}

        {similars.length > 0 && (
          <Section title={`💊 أدوية مشابهة / Similar Drugs (${similars.length})`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {similars.map(alt => (
                <button key={alt.id} onClick={() => onViewDrug(alt.id)}
                  className="text-right bg-gray-50 hover:bg-sand rounded-lg p-3 transition-colors border border-transparent hover:border-gold/30">
                  <div className="font-bold text-nile text-sm">{alt.formEmoji || '💊'} {alt.nameAr}</div>
                  <div className="text-xs text-gray-500">{alt.nameEn}</div>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    {alt.manufacturerEn && <span className="text-[10px] text-gray-400">{getMfrIcon(alt.manufacturerEn)} {alt.manufacturerEn}</span>}
                    {alt.price_egp != null && <span className="text-[10px] text-gold-dark font-bold">EGP {alt.price_egp}</span>}
                    {alt.categoryAr && <span className="text-[10px] bg-sand text-nile px-1.5 py-0.5 rounded">{alt.categoryAr}</span>}
                  </div>
                </button>
              ))}
            </div>
          </Section>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <nav className="flex items-center gap-2 text-sm text-gray-500">
        <button onClick={onBack} className="text-nile hover:text-gold-dark font-medium">💊 الأدوية / Drugs</button>
        <span>/</span>
        <span className="text-gray-800 font-medium truncate">{drug.nameAr}</span>
      </nav>

      <div className="bg-white border border-sand-dark rounded-xl p-4 md:p-6">
        <div className="flex items-start gap-4">
          <div className="text-5xl">{drug.formEmoji || '💊'}</div>
          <div className="flex-1">
            <h2 className="text-2xl md:text-3xl font-bold text-nile">
              {drug.nameAr}
              <ShareBtn drug={drug} />
              <PrintBtn />
              <CopyBtn text={`${drug.nameAr} - ${drug.nameEn}`} />
            </h2>
            <p className="text-gray-500 text-lg">{drug.nameEn}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="bg-sand text-nile px-3 py-1 rounded-full text-sm">{drug.categoryAr}</span>
              <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">{drug.category}</span>
              {edaSupplement.find(e => e.id === drug.id)?.verified && (
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold" title="Verified against Egyptian Drug Authority database">
                  ✓ EDA Verified
                </span>
              )}
            </div>
            {lastSync && <p className="text-[10px] text-gray-300 mt-2">آخر تحديث / Last sync: {formatDate(lastSync)}</p>}
          </div>
        </div>
      </div>

      {/* detail tab bar */}
      <div className="flex gap-1 bg-sand rounded-lg p-0.5 overflow-x-auto no-print">
        {[
          { key: 'info', label: 'ℹ️ معلومات / Info' },
          { key: 'clinical', label: '⚕️ سريري / Clinical' },
          { key: 'pricing', label: '💰 أسعار / Pricing' },
          { key: 'interact', label: '⚡ تفاعلات / Interactions' },
        ].map(t => (
          <button key={t.key} onClick={() => setDetailTab(t.key)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
              detailTab === t.key ? 'bg-white text-nile shadow-sm' : 'text-gray-500 hover:text-nile'
            }`}>{t.label}</button>
        ))}
      </div>

      {detailTab === 'info' && (
      <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Section title="🔬 الاسم العلمي / Scientific Name">
          <Biline label="" ar={drug.scientificNameAr} en={drug.scientificNameEn} />
        </Section>
        <Section title="💊 المادة الفعالة / Active Ingredient">
          <Biline label="" ar={drug.activeIngredientAr} en={drug.activeIngredientEn} />
        </Section>
      </div>

      <Section title="📋 الوصف / Description">
        <p className="text-gray-700 text-sm mb-1">{drug.description}</p>
        <p className="text-gray-500 text-xs">{drug.descriptionAr}</p>
      </Section>

      <Section title="🩺 الاستخدامات / Indications">
        <Biline label="" ar={drug.indicationAr} en={drug.indicationEn} />
      </Section>
      </>
      )}

      {detailTab === 'clinical' && (
      <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Section title="⚙️ آلية العمل / Mechanism">
          <Biline label="" ar={drug.mechanismAr} en={drug.mechanismEn} />
        </Section>
        <Section title="⚠️ الآثار الجانبية / Side Effects">
          <Biline label="" ar={drug.sideEffectsAr} en={drug.sideEffectsEn} />
        </Section>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Section title="💊 الجرعة / Dosage">
          <Biline label="" ar={drug.dosageAr} en={drug.dosageEn} />
        </Section>
        <Section title="🤰 الحمل / Pregnancy">
          <Biline label="" ar={drug.pregnancyAr} en={drug.pregnancyEn} />
        </Section>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Section title="🍼 الرضاعة / Breastfeeding">
          <Biline label="" ar={drug.breastfeedingAr} en={drug.breastfeedingEn} />
        </Section>
        <Section title="🏭 الشركة المصنعة / Manufacturer">
          <Biline label="" ar={drug.manufacturerAr} en={`${getMfrIcon(drug.manufacturerEn)} ${drug.manufacturerEn}`} />
        </Section>
      </div>
      </>
      )}

      {detailTab === 'pricing' && (
      <>
        <Section title="💰 الأسعار / Prices">
          <div className="space-y-1">
            {drug.edaRf && drug.edaRf.length > 0 ? (
              drug.edaRf.map(([route, form, pmin, pmax], i) => (
                <div key={i} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2 text-sm">
                  <span className="font-bold text-gold-dark">EGP {pmin}{pmin !== pmax ? ` – ${pmax}` : ''}</span>
                  <span className="text-gray-600">{route} / {form}</span>
                </div>
              ))
            ) : drug.prices && drug.prices.length > 0 ? (
              drug.prices.map((p, i) => (
                <div key={i} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2 text-sm">
                  <span className="font-bold text-gold-dark">{p.price} {p.unit}</span>
                  <span className="text-gray-600">{p.form}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-sm">لا توجد أسعار متاحة / No prices available</p>
            )}
          </div>
        </Section>

        {alternatives.length > 0 && (
          <Section title={`🔄 بدائل بنفس المادة الفعالة / Alternatives (${alternatives.length})`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {alternatives.map(alt => (
                <button key={alt.id} onClick={() => onViewDrug(alt.id)}
                  className="text-right bg-gray-50 hover:bg-sand rounded-lg p-3 transition-colors border border-transparent hover:border-gold/30">
                  <div className="font-bold text-nile text-sm">{alt.formEmoji || '💊'} {alt.nameAr}</div>
                  <div className="text-xs text-gray-500">{alt.nameEn}</div>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    {alt.manufacturerEn && <span className="text-[10px] text-gray-400">{getMfrIcon(alt.manufacturerEn)} {alt.manufacturerEn}</span>}
                    {alt.price_egp != null && <span className="text-[10px] text-gold-dark font-bold">EGP {alt.price_egp}</span>}
                    {alt.edaBrands?.length > 0 && <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">{alt.edaBrands.length} brands</span>}
                  </div>
                </button>
              ))}
            </div>
          </Section>
        )}

        {similars.length > 0 && (
          <Section title={`💊 أدوية مشابهة / Similar Drugs (${similars.length})`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {similars.map(alt => (
                <button key={alt.id} onClick={() => onViewDrug(alt.id)}
                  className="text-right bg-gray-50 hover:bg-sand rounded-lg p-3 transition-colors border border-transparent hover:border-gold/30">
                  <div className="font-bold text-nile text-sm">{alt.formEmoji || '💊'} {alt.nameAr}</div>
                  <div className="text-xs text-gray-500">{alt.nameEn}</div>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    {alt.manufacturerEn && <span className="text-[10px] text-gray-400">{getMfrIcon(alt.manufacturerEn)} {alt.manufacturerEn}</span>}
                    {alt.price_egp != null && <span className="text-[10px] text-gold-dark font-bold">EGP {alt.price_egp}</span>}
                    {alt.categoryAr && <span className="text-[10px] bg-sand text-nile px-1.5 py-0.5 rounded">{alt.categoryAr}</span>}
                  </div>
                </button>
              ))}
            </div>
          </Section>
        )}

        {alternatives.length === 0 && similars.length === 0 && (
          <Section title="🔄 بدائل وأدوية مشابهة / Alternatives & Similar Drugs">
            <p className="text-gray-400 text-sm">لا توجد بدائل متاحة / No alternatives available in database</p>
          </Section>
        )}
      </>
      )}

      {detailTab === 'interact' && (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Section title="⚡ التفاعلات الدوائية / Drug Interactions">
          {drugInts.length === 0 ? (
            <p className="text-gray-400 text-sm">لا توجد تفاعلات دوائية مسجلة / No recorded drug interactions</p>
          ) : (
            <div className="space-y-2">
              {drugInts.map((inter, i) => (
                <div key={i} className="border border-gray-100 rounded-lg p-3 hover:bg-gray-50">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <button
                        onClick={() => onViewDrug(inter.drug.id)}
                        className="font-bold text-nile hover:text-gold-dark text-sm"
                      >
                        {inter.drug.nameAr} ({inter.drug.nameEn})
                      </button>
                      <p className="text-xs text-gray-600 mt-1">{inter.description}</p>
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full text-white whitespace-nowrap ${severityConfig[inter.severity]?.color || 'bg-gray-500'}`}>
                      {severityConfig[inter.severity]?.emoji} {inter.severity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Section>

        <Section title="🩺 التفاعلات المرضية / Disease Interactions">
          {diseaseInts.length === 0 ? (
            <p className="text-gray-400 text-sm">لا توجد تفاعلات مرضية مسجلة / No recorded disease interactions</p>
          ) : (
            <div className="space-y-2">
              {diseaseInts.map((inter, i) => (
                <div key={i} className="border border-gray-100 rounded-lg p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="font-bold text-nile text-sm">{inter.disease.nameAr} ({inter.disease.nameEn})</div>
                      <p className="text-xs text-gray-600 mt-1">{inter.description}</p>
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full text-white whitespace-nowrap ${severityConfig[inter.severity]?.color || 'bg-gray-500'}`}>
                      {severityConfig[inter.severity]?.emoji} {inter.severity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Section>
      </div>
      )}
    </div>
  )
}
