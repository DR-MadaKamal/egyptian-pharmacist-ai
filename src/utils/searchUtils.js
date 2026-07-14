const ARABIC_TO_LATIN = {
  'أ': 'a', 'ا': 'a', 'إ': 'i', 'إ': 'i', 'ة': 'a', 'ه': 'h',
  'ب': 'b', 'ت': 't', 'ث': 'th', 'ج': 'g', 'ح': 'h', 'خ': 'kh',
  'د': 'd', 'ذ': 'dh', 'ر': 'r', 'ز': 'z', 'س': 's', 'ش': 'sh',
  'ص': 's', 'ض': 'd', 'ط': 't', 'ظ': 'z', 'ع': 'a', 'غ': 'gh',
  'ف': 'f', 'ق': 'q', 'ك': 'k', 'ل': 'l', 'م': 'm', 'ن': 'n',
  'و': 'w', 'ي': 'y', 'ى': 'a', 'ء': 'a', 'آ': 'aa',
}

export function arabicToLatin(text) {
  if (!text) return ''
  return text.split('').map(ch => ARABIC_TO_LATIN[ch] || ch).join('')
}

const COMMON_MISSPELLINGS = {
  'paracetmol': 'paracetamol', 'paracetemol': 'paracetamol',
  'amoxicilin': 'amoxicillin', 'amoxycillin': 'amoxicillin',
  'ibuprofen': 'ibuprofen', 'ibuprofin': 'ibuprofen',
  'metformin': 'metformin', 'metformine': 'metformin',
  'omeprazol': 'omeprazole', 'omeprazle': 'omeprazole',
  'amlodipine': 'amlodipine', 'amlodipin': 'amlodipine',
  'losartan': 'losartan', 'losarten': 'losartan',
  'azithromycin': 'azithromycin', 'azythromycin': 'azithromycin',
  'ciprofloxacin': 'ciprofloxacin', 'ciprefloxacin': 'ciprofloxacin',
  'cetirizine': 'cetirizine', 'ceterizine': 'cetirizine',
  'montelukast': 'montelukast', 'montelukste': 'montelukast',
  'dexamethasone': 'dexamethasone', 'dexamethazone': 'dexamethasone',
  'prednisolone': 'prednisolone', 'predneisolone': 'prednisolone',
  'salbutamol': 'salbutamol', 'salbutemol': 'salbutamol',
  'insulin': 'insulin', 'insuline': 'insulin',
  'vitamin': 'vitamin', 'vitamine': 'vitamin',
  'amoxicilin': 'amoxicillin', 'amoxil': 'amoxicillin',
  'panadol': 'paracetamol', 'adol': 'paracetamol',
  'voltaren': 'diclofenac', 'cataflam': 'diclofenac',
  'augmentin': 'amoxicillin+clavulanate', 'amoclav': 'amoxicillin+clavulanate',
  'zyrtec': 'cetirizine', 'cetrec': 'cetirizine',
  'clarityne': 'loratadine', 'loratin': 'loratadine',
  'nexium': 'esomeprazole', 'esoprex': 'esomeprazole',
  'crestor': 'rosuvastatin', 'rozuvin': 'rosuvastatin',
  'lipitor': 'atorvastatin', 'atorvast': 'atorvastatin',
  'viagra': 'sildenafil', 'cialis': 'tadalafil',
  'prozac': 'fluoxetine', 'floxet': 'fluoxetine',
  'xanax': 'alprazolam', 'alprozol': 'alprazolam',
  'valium': 'diazepam', 'dazepam': 'diazepam',
  'tramal': 'tramadol', 'tramadol': 'tramadol',
  'nurofen': 'ibuprofen', 'brufen': 'ibuprofen',
  'flagyl': 'metronidazole', 'metranidazol': 'metronidazole',
  'keflex': 'cephalexin', 'sefalexin': 'cephalexin',
  'zinnat': 'cefuroxime', 'cefuroxim': 'cefuroxime',
  'rocephin': 'ceftriaxone', 'ceftriaxon': 'ceftriaxone',
  'tienam': 'imipenem', 'imipinem': 'imipenem',
  'vancomycin': 'vancomycin', 'vancomysin': 'vancomycin',
  'gentamicin': 'gentamicin', 'gentamycin': 'gentamicin',
  'erythromycin': 'erythromycin', 'erithromycin': 'erythromycin',
  'doxycycline': 'doxycycline', 'doxicycline': 'doxycycline',
  'minocycline': 'minocycline', 'minocycyclin': 'minocycline',
  'tetracycline': 'tetracycline', 'tetracylin': 'tetracycline',
  'metronidazole': 'metronidazole', 'metronidazol': 'metronidazole',
  'tinidazole': 'tinidazole', 'tinidazol': 'tinidazole',
  'ciprofloxacin': 'ciprofloxacin', 'ciprofloxacin': 'ciprofloxacin',
  'levofloxacin': 'levofloxacin', 'levoacin': 'levofloxacin',
  'moxifloxacin': 'moxifloxacin', 'moxacin': 'moxifloxacin',
  'norfloxacin': 'norfloxacin', 'noracin': 'norfloxacin',
  'ofloxacin': 'ofloxacin', 'ocin': 'ofloxacin',
}

export function correctSpelling(word) {
  if (!word) return word
  const lower = word.toLowerCase().trim()
  return COMMON_MISSPELLINGS[lower] || lower
}

function levenshteinDistance(a, b) {
  const m = a.length, n = b.length
  if (m === 0) return n
  if (n === 0) return m
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0))
  for (let i = 0; i <= m; i++) dp[i][0] = i
  for (let j = 0; j <= n; j++) dp[0][j] = j
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])
    }
  }
  return dp[m][n]
}

function fuzzyMatch(text, query, maxDist = 2) {
  if (!text || !query) return false
  const t = text.toLowerCase()
  const q = query.toLowerCase()
  if (t.includes(q)) return true
  if (q.length >= 4) {
    const words = t.split(/\s+/)
    for (const word of words) {
      if (word.length >= 3 && levenshteinDistance(word.slice(0, q.length), q) <= maxDist) return true
    }
  }
  return false
}

function computeRelevance(drug, query) {
  const q = query.toLowerCase()
  const ql = arabicToLatin(query).toLowerCase()
  let score = 0
  const nameEn = (drug.nameEn || '').toLowerCase()
  const nameAr = drug.nameAr || ''
  const sciEn = (drug.scientificNameEn || '').toLowerCase()
  const activeEn = (drug.activeIngredientEn || '').toLowerCase()
  const activeAr = drug.activeIngredientAr || ''
  const brands = (drug.edaBrands || []).map(b => b.toLowerCase())
  const latinName = arabicToLatin(nameAr).toLowerCase()

  if (nameEn === q || nameAr === query) score += 1000
  if (nameEn.startsWith(q) || nameAr.startsWith(query)) score += 500
  if (nameEn.includes(q)) score += 300
  if (nameAr.includes(query)) score += 300
  if (sciEn.includes(q)) score += 200
  if (activeEn.includes(q) || activeAr.includes(query)) score += 200
  if (latinName.includes(ql)) score += 150
  if (brands.some(b => b.includes(q))) score += 150
  if (drug.manufacturerEn?.toLowerCase().includes(q)) score += 100
  if (drug.categoryAr?.includes(query)) score += 80
  if (drug.category?.toLowerCase().includes(q)) score += 80

  return score
}

export function searchDrugs(drugs, query, options = {}) {
  const {
    maxResults = 60,
    fuzzyEnabled = true,
    correctSpellingEnabled = true,
    transliterationEnabled = true,
    priceRange = null,
    manufacturerFilter = null,
    categoryFilter = null,
    routeFilter = null,
    sourceFilter = null,
  } = options

  let q = query.trim()
  if (!q || q.length < 2) return { results: [], query: q, correctedQuery: null }

  let correctedQuery = null
  if (correctSpellingEnabled) {
    const words = q.split(/\s+/)
    const corrected = words.map(w => {
      const c = correctSpelling(w)
      if (c !== w.toLowerCase()) { correctedQuery = true; return c }
      return w
    })
    if (correctedQuery) q = corrected.join(' ')
  }

  const ql = transliterationEnabled ? arabicToLatin(q).toLowerCase() : ''
  const results = []

  for (const drug of drugs) {
    let matches = false

    const nameEn = (drug.nameEn || '').toLowerCase()
    const nameAr = drug.nameAr || ''
    const sciEn = (drug.scientificNameEn || '').toLowerCase()
    const sciAr = drug.scientificNameAr || ''
    const activeEn = (drug.activeIngredientEn || '').toLowerCase()
    const activeAr = drug.activeIngredientAr || ''
    const cat = (drug.category || '').toLowerCase()
    const catAr = drug.categoryAr || ''
    const mfr = (drug.manufacturerEn || '').toLowerCase()
    const mfrAr = drug.manufacturerAr || ''
    const brands = drug.edaBrands || []
    const groups = drug.edaGroups || []
    const routes = drug.edaRoutes || []
    const latinName = arabicToLatin(nameAr).toLowerCase()

    const exactMatch = nameEn.includes(q) || nameAr.includes(q) ||
      sciEn.includes(q) || sciAr.includes(q) ||
      activeEn.includes(q) || activeAr.includes(q)

    const fuzzyMatchOk = fuzzyEnabled && fuzzyMatch(nameEn, q) || fuzzyMatch(sciEn, q) || fuzzyMatch(activeEn, q)

    const translitMatch = transliterationEnabled && ql.length >= 3 && (
      latinName.includes(ql) || arabicToLatin(sciAr).toLowerCase().includes(ql)
    )

    const brandMatch = brands.some(b => b.toLowerCase().includes(q))
    const groupMatch = groups.some(g => g.toLowerCase().includes(q))
    const routeMatch = routes.some(r => r.toLowerCase().includes(q))
    const catMatch = cat.includes(q) || catAr.includes(q)
    const mfrMatch = mfr.includes(q) || mfrAr.includes(q)

    matches = exactMatch || fuzzyMatchOk || translitMatch || brandMatch || groupMatch || routeMatch || catMatch || mfrMatch

    if (matches) {
      if (priceRange) {
        const price = getDrugPrice(drug)
        if (price !== null && (price < priceRange[0] || price > priceRange[1])) continue
      }
      if (manufacturerFilter && !mfr.includes(manufacturerFilter.toLowerCase())) continue
      if (categoryFilter && !cat.includes(categoryFilter.toLowerCase()) && !catAr.includes(categoryFilter)) continue
      if (routeFilter && !routes.some(r => r.toLowerCase().includes(routeFilter.toLowerCase()))) continue
      if (sourceFilter === 'enriched' && drug.edaOnly) continue
      if (sourceFilter === 'eda' && !drug.edaOnly) continue
      if (sourceFilter === 'mohmed' && drug.dataSource !== 'MOHMED') continue

      results.push({ drug, score: computeRelevance(drug, q) })
    }
  }

  results.sort((a, b) => b.score - a.score)
  return {
    results: results.slice(0, maxResults).map(r => r.drug),
    query: q,
    correctedQuery: correctedQuery ? q : null,
    totalCount: results.length,
  }
}

function getDrugPrice(drug) {
  if (drug.prices?.length > 0) {
    const p = parseFloat(drug.prices[0].price)
    if (!isNaN(p)) return p
  }
  if (drug.edaRf?.length > 0) {
    const p = parseFloat(drug.edaRf[0][2])
    if (!isNaN(p)) return p
  }
  if (drug.edaPriceRange?.length > 0) {
    const p = parseFloat(drug.edaPriceRange[0])
    if (!isNaN(p)) return p
  }
  return null
}

export function sortResults(results, sortBy) {
  const copy = [...results]
  switch (sortBy) {
    case 'name-en': return copy.sort((a, b) => (a.nameEn || '').localeCompare(b.nameEn || ''))
    case 'name-ar': return copy.sort((a, b) => (a.nameAr || '').localeCompare(b.nameAr || ''))
    case 'price-low': return copy.sort((a, b) => (getDrugPrice(a) || Infinity) - (getDrugPrice(b) || Infinity))
    case 'price-high': return copy.sort((a, b) => (getDrugPrice(b) || 0) - (getDrugPrice(a) || 0))
    case 'interactions': return copy.sort((a, b) => (b.drugInteractions?.length || 0) - (a.drugInteractions?.length || 0))
    default: return copy
  }
}

export function getSourceCounts(results) {
  const counts = { enriched: 0, eda: 0, mohmed: 0 }
  for (const d of results) {
    if (d.edaOnly && d.dataSource === 'MOHMED') counts.mohmed++
    else if (d.edaOnly) counts.eda++
    else counts.enriched++
  }
  return counts
}

const SEARCH_HISTORY_KEY = 'search-history'
const MAX_HISTORY = 15

export function getSearchHistory() {
  try {
    return JSON.parse(localStorage.getItem(SEARCH_HISTORY_KEY)) || []
  } catch { return [] }
}

export function addSearchHistory(query) {
  if (!query || query.trim().length < 2) return
  try {
    const history = getSearchHistory().filter(h => h !== query)
    history.unshift(query)
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history.slice(0, MAX_HISTORY)))
  } catch {}
}

export function removeSearchHistory(query) {
  try {
    const history = getSearchHistory().filter(h => h !== query)
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history))
  } catch {}
}

export function clearSearchHistory() {
  try { localStorage.removeItem(SEARCH_HISTORY_KEY) } catch {}
}

const SEARCH_BOOKMARKS_KEY = 'search-bookmarks'

export function getSearchBookmarks() {
  try {
    return JSON.parse(localStorage.getItem(SEARCH_BOOKMARKS_KEY)) || []
  } catch { return [] }
}

export function addSearchBookmark(query, results) {
  try {
    const bookmarks = getSearchBookmarks()
    if (bookmarks.some(b => b.query === query)) return
    bookmarks.unshift({ query, count: results.length, timestamp: Date.now() })
    localStorage.setItem(SEARCH_BOOKMARKS_KEY, JSON.stringify(bookmarks.slice(0, 20)))
  } catch {}
}

export function removeSearchBookmark(query) {
  try {
    const bookmarks = getSearchBookmarks().filter(b => b.query !== query)
    localStorage.setItem(SEARCH_BOOKMARKS_KEY, JSON.stringify(bookmarks))
  } catch {}
}

const QUICK_FILTERS = [
  { id: 'antibiotics', label: 'المضادات الحيوية', labelEn: 'Antibiotics', query: 'antibiotic', icon: '🦠' },
  { id: 'analgesics', label: 'مسكنات الألم', labelEn: 'Analgesics', query: 'analgesic', icon: '💊' },
  { id: 'cardiovascular', label: 'القلب والأوعية', labelEn: 'Cardiovascular', query: 'cardiovascular', icon: '❤️' },
  { id: 'diabetes', label: 'السكري', labelEn: 'Diabetes', query: 'diabetes', icon: '🩸' },
  { id: 'respiratory', label: 'الجهاز التنفسي', labelEn: 'Respiratory', query: 'respiratory', icon: '🫁' },
  { id: 'gi', label: 'الجهاز الهضمي', labelEn: 'GI', query: 'gastrointestinal', icon: '🫄' },
  { id: 'derma', label: 'الجلدية', labelEn: 'Dermatology', query: 'dermatology', icon: '🧴' },
  { id: 'contraceptives', label: 'المنعقات', labelEn: 'Contraceptives', query: 'contraceptive', icon: '💊' },
]

export function getQuickFilters() {
  return QUICK_FILTERS
}

export function getPopularSearches() {
  const history = getSearchHistory()
  if (history.length >= 3) return history.slice(0, 5)
  return ['paracetamol', 'amoxicillin', 'insulin', 'omeprazole', 'metformin']
}

export function searchByInteraction(allDrugs, drugId) {
  const source = allDrugs.find(d => d.id === drugId)
  if (!source) return []
  const interactIds = new Set()
  for (const i of (source.drugInteractions || [])) {
    if (i.with) interactIds.add(i.with)
  }
  return allDrugs.filter(d => interactIds.has(d.id))
}

export function exportSearchResults(results, format = 'csv') {
  if (format === 'csv') {
    const headers = ['Name (AR)', 'Name (EN)', 'Scientific Name', 'Category', 'Manufacturer', 'Price (EGP)', 'Interactions']
    const rows = results.map(d => [
      d.nameAr, d.nameEn, d.scientificNameEn, d.categoryAr,
      d.manufacturerEn, getDrugPrice(d) || 'N/A',
      (d.drugInteractions?.length || 0) + (d.diseaseInteractions?.length || 0),
    ])
    const csv = [headers, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'search-results.csv'; a.click()
    URL.revokeObjectURL(url)
  }
}

export function generateShareUrl(query) {
  const base = window.location.origin + window.location.pathname
  return `${base}?q=${encodeURIComponent(query)}`
}

export function copyShareUrl(query) {
  const url = generateShareUrl(query)
  return navigator.clipboard.writeText(url).then(() => url).catch(() => null)
}
