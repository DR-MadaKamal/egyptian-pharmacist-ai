import { getDrugById, getDrugInteractions, getDiseaseInteractions, severityConfig } from '../utils/interactions.js'
import { edaSupplement } from '../data/eda-supplement.js'

export default function DrugDetail({ drugId, drugs, diseases, onBack, onViewDrug }) {
  const drug = getDrugById(drugs, drugId)
  if (!drug) return <div className="text-center py-12 text-red-500">الدواء غير موجود / Drug not found</div>

  const drugInts = getDrugInteractions(drugs, drugId)
  const diseaseInts = getDiseaseInteractions(drugs, diseases, drugId)

  const Section = ({ title, children }) => (
    <div className="bg-white border border-sand-dark rounded-xl p-4">
      <h3 className="font-bold text-nile text-lg mb-3">{title}</h3>
      {children}
    </div>
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
        <button onClick={onBack} className="text-nile hover:text-gold-dark font-bold text-sm">
          ← الرجوع للقائمة / Back to list
        </button>

        <div className="bg-white border border-sand-dark rounded-xl p-4 md:p-6">
          <div className="flex items-start gap-4">
            <div className="text-5xl">💊</div>
            <div className="flex-1">
              <h2 className="text-2xl md:text-3xl font-bold text-nile">{drug.nameAr}</h2>
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
              <div className="text-sm text-gray-700 mt-1">{(drug.edaBrands && drug.edaBrands.length > 0) ? drug.edaBrands.join(', ') : 'غير متوفر / N/A'}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <span className="text-xs font-bold text-gray-400 uppercase">🏭 الشركات المصنعة / Manufacturers</span>
              <div className="text-sm text-gray-700 mt-1">{(drug.edaMfrs && drug.edaMfrs.length > 0) ? drug.edaMfrs.join(', ') : 'غير متوفر / N/A'}</div>
            </div>
            {drug.edaRoutes && drug.edaRoutes.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-3">
                <span className="text-xs font-bold text-gray-400 uppercase">📦 طرق التعاطي / Routes</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {drug.edaRoutes.map(rt => {
                    const parts = rt.split('.')
                    const emoji = {'ORAL':'💊','TOPICAL':'🧴','INJECTION':'💉','SPRAY':'🌫️','OPHTHALMIC':'👁️','OTIC':'👂','VAGINAL':'🩺','RECTAL':'🩸','EFF':'💊'}[parts[0]] || '📦'
                    return (
                      <span key={rt} className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                        {emoji} {parts[1] === parts[0] ? parts[0] : rt}
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
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <button onClick={onBack} className="text-nile hover:text-gold-dark font-bold text-sm">
        ← الرجوع للقائمة / Back to list
      </button>

      <div className="bg-white border border-sand-dark rounded-xl p-4 md:p-6">
        <div className="flex items-start gap-4">
          <div className="text-5xl">{drug.formEmoji || '💊'}</div>
          <div className="flex-1">
            <h2 className="text-2xl md:text-3xl font-bold text-nile">{drug.nameAr}</h2>
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
          </div>
        </div>
      </div>

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
          <Biline label="" ar={drug.manufacturerAr} en={drug.manufacturerEn} />
        </Section>
      </div>

      {(drug.prices && drug.prices.length > 0) || (drug.edaRf && drug.edaRf.length > 0) ? (
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
            ) : null}
          </div>
        </Section>
      ) : null}

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
    </div>
  )
}
