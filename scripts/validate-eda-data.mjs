import fs from 'fs'
import path from 'path'

const EDA_DRUGS_FILE = process.argv[2] || path.resolve('public/data/eda-drugs.json')
const SUPP_FILE = path.resolve('src/data/eda-supplement.js')

const SEVERITY = { INFO: 0, WARN: 1, ERROR: 2 }

const checks = []

function check(severity, category, msg, detail = '') {
  checks.push({ severity, category, msg, detail })
}

function checkThreshold(category, label, value, threshold, severity = SEVERITY.WARN) {
  if (value > threshold) {
    check(severity, category, `${label}: ${value} (threshold: ${threshold})`, '')
    return false
  }
  return true
}

async function main() {
  const data = JSON.parse(fs.readFileSync(EDA_DRUGS_FILE, 'utf-8'))
  const drugs = data.filter(d => d.t !== 'non-drug')
  const nonDrugs = data.filter(d => d.t === 'non-drug')

  console.log(`\n=== EDA Data Quality Report ===`)
  console.log(`File: ${EDA_DRUGS_FILE}`)
  console.log(`Total entries: ${data.length}`)
  console.log(`Drug entries: ${drugs.length}`)
  console.log(`Non-drug entries: ${nonDrugs.length}`)

  // ── Completeness ──
  const withBrands = drugs.filter(x => x.b && x.b.length > 0).length
  const withMfrs = drugs.filter(x => x.m && x.m.length > 0).length
  const withPrices = drugs.filter(x => x.p && x.p.length > 0).length
  const withRoutes = drugs.filter(x => x.r && x.r.length > 0).length
  const withConstituents = drugs.filter(x => x.c && x.c.length > 0).length

  console.log(`\n--- Completeness (drug entries only) ---`)
  console.log(`With brands: ${withBrands}/${drugs.length} (${(withBrands/drugs.length*100).toFixed(1)}%)`)
  console.log(`With manufacturers: ${withMfrs}/${drugs.length} (${(withMfrs/drugs.length*100).toFixed(1)}%)`)
  console.log(`With prices: ${withPrices}/${drugs.length} (${(withPrices/drugs.length*100).toFixed(1)}%)`)
  console.log(`With routes: ${withRoutes}/${drugs.length} (${(withRoutes/drugs.length*100).toFixed(1)}%)`)
  console.log(`With constituents: ${withConstituents}/${drugs.length} (${(withConstituents/drugs.length*100).toFixed(1)}%)`)

  // Thresholds
  checkThreshold('completeness', 'Entries without brands', drugs.length - withBrands, 100, SEVERITY.WARN)
  checkThreshold('completeness', 'Entries without manufacturers', drugs.length - withMfrs, 200, SEVERITY.WARN)
  checkThreshold('completeness', 'Entries without prices', drugs.length - withPrices, 50, SEVERITY.WARN)

  // ── Duplicates ──
  const seen = new Map()
  let dupes = 0
  for (const d of drugs) {
    const base = d.s.toUpperCase().replace(/\s*\(.*?\)/g, '').trim()
    if (seen.has(base)) {
      dupes++
      if (dupes <= 5) {
        check(SEVERITY.WARN, 'duplicates', `Possible duplicate: "${d.s}" matches "${seen.get(base)}"`, '')
      }
    }
    seen.set(base, d.s)
  }
  checkThreshold('duplicates', 'Duplicate base names', dupes, 10, SEVERITY.WARN)

  // ── Scientific name quality ──
  const productLike = drugs.filter(d => /\d+\s*(TAB|CAP|MG|ML|GM|PC|AMP|VIAL|CREAM|GEL|SUSP|SYRUP)/i.test(d.s) && !d.s.includes('+'))
  checkThreshold('scientific_names', 'Product-like names (commercial name fallback)', productLike.length, 250, SEVERITY.WARN)
  if (productLike.length > 0) {
    check(SEVERITY.INFO, 'scientific_names', `Sample product-like names:`, productLike.slice(0, 5).map(d => d.s).join(', '))
  }

  // ── Manufacturer quality ──
  const allMfrs = new Set()
  drugs.forEach(d => (d.m || []).forEach(m => allMfrs.add(m)))
  const dirtyMfrs = [...allMfrs].filter(m => m.includes(' > ') || m.includes('  '))
  checkThreshold('manufacturers', 'Dirty manufacturer names', dirtyMfrs.length, 10, SEVERITY.ERROR)
  if (dirtyMfrs.length > 0 && dirtyMfrs.length <= 20) {
    check(SEVERITY.WARN, 'manufacturers', `Dirty manufacturers remaining:`, dirtyMfrs.join(', '))
  }

  // ── Price anomalies ──
  const wideRange = drugs.filter(d => d.p && (d.p[1] - d.p[0]) > 500)
  const zeroPrices = drugs.filter(d => d.p && d.p.some(p => p <= 0))
  const pricesAbove10k = drugs.filter(d => d.p && d.p[1] > 10000)
  const pricesBelow1 = drugs.filter(d => d.p && d.p[0] < 1)

  checkThreshold('prices', 'Wide price ranges (>500 EGP)', wideRange.length, 200, SEVERITY.INFO)
  checkThreshold('prices', 'Zero/negative prices', zeroPrices.length, 0, SEVERITY.ERROR)
  checkThreshold('prices', 'Prices above 10,000 EGP', pricesAbove10k.length, 100, SEVERITY.INFO)
  checkThreshold('prices', 'Prices below 1 EGP', pricesBelow1.length, 20, SEVERITY.INFO)

  // ── Route anomalies ──
  const allRoutes = new Set()
  drugs.forEach(d => (d.r || []).forEach(r => allRoutes.add(r)))
  const unknownRoutes = [...allRoutes].filter(r => /UNKNOWN|UNK|N\/A/i.test(r))
  checkThreshold('routes', 'Unknown route values', unknownRoutes.length, 0, SEVERITY.WARN)

  // ── Brand-name conflicts ──
  const brandToSci = new Map()
  for (const d of drugs) {
    for (const b of (d.b || [])) {
      if (!brandToSci.has(b)) brandToSci.set(b, new Set())
      brandToSci.get(b).add(d.s)
    }
  }
  const brandConflicts = [...brandToSci.entries()]
    .filter(([brand, scis]) => scis.size > 1)
    .sort((a, b) => b[1].size - a[1].size)
  checkThreshold('brand_conflicts', 'Brands under multiple scientific names', brandConflicts.length, 10, SEVERITY.WARN)
  if (brandConflicts.length > 0) {
    check(SEVERITY.INFO, 'brand_conflicts', `Top conflicts:`, brandConflicts.slice(0, 5).map(([b, s]) => `${b} → ${[...s].join(' | ')}`).join('; '))
  }

  // ── Constituent anomalies ──
  const allConstituents = new Set()
  drugs.forEach(d => (d.c || []).forEach(c => allConstituents.add(c)))
  const doseInConstituent = [...allConstituents].filter(c => /\d/.test(c))
  checkThreshold('constituents', 'Constituents containing digits (dose leakage)', doseInConstituent.length, 500, SEVERITY.INFO)

  // ── Supplement cross-reference ──
  let supplementVerified = 0
  let supplementTotal = 0
  try {
    const suppSrc = fs.readFileSync(SUPP_FILE, 'utf-8')
    const suppMatch = suppSrc.match(/export\s+const\s+edaSupplement\s*=\s*(\[[\s\S]*?\]);/)
    if (suppMatch) {
      const supp = JSON.parse(suppMatch[1])
      supplementTotal = supp.length
      supplementVerified = supp.filter(e => e.verified).length
      console.log(`\n--- Supplement Cross-Reference ---`)
      console.log(`Supplement entries: ${supplementTotal}`)
      console.log(`Verified against EDA: ${supplementVerified} (${(supplementVerified/supplementTotal*100).toFixed(1)}%)`)
      checkThreshold('supplement', 'Unverified supplement entries', supplementTotal - supplementVerified, supplementTotal * 0.3, SEVERITY.WARN)
    }
  } catch {
    check(SEVERITY.INFO, 'supplement', 'Could not read supplement file', '')
  }

  // ── Summary ──
  const errors = checks.filter(c => c.severity === SEVERITY.ERROR)
  const warnings = checks.filter(c => c.severity === SEVERITY.WARN)
  const infos = checks.filter(c => c.severity === SEVERITY.INFO)

  console.log(`\n--- Quality Summary ---`)
  console.log(`Errors: ${errors.length}, Warnings: ${warnings.length}, Info: ${infos.length}`)

  if (errors.length > 0) {
    console.log(`\nERRORS (must fix):`)
    errors.forEach(e => console.log(`  [${e.category}] ${e.msg} ${e.detail ? '- ' + e.detail : ''}`))
  }
  if (warnings.length > 0) {
    console.log(`\nWARNINGS (should review):`)
    warnings.forEach(e => console.log(`  [${e.category}] ${e.msg} ${e.detail ? '- ' + e.detail : ''}`))
  }

  // Exit with error code if critical issues found
  if (errors.length > 0) {
    console.error(`\n❌ Data quality check FAILED: ${errors.length} error(s) must be fixed`)
    process.exit(1)
  }

  console.log(`\n✅ Data quality check PASSED`)
}

main().catch(err => {
  console.error('Validation script failed:', err)
  process.exit(1)
})
