import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { severityConfig } from '../utils/interactions.js'
import { searchEda } from '../utils/edaLoader.js'
import Highlight from './Highlight.jsx'
import {
  searchDrugs, sortResults, getSourceCounts, arabicToLatin,
  getSearchHistory, addSearchHistory, removeSearchHistory, clearSearchHistory,
  getSearchBookmarks, addSearchBookmark, removeSearchBookmark,
  getQuickFilters, getPopularSearches, exportSearchResults, copyShareUrl,
} from '../utils/searchUtils.js'

function AnimatedCounter({ end }) {
  const [val, setVal] = useState(0)
  const ref = useRef(null)
  const done = useRef(false)
  useEffect(() => {
    if (done.current) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        done.current = true
        let start = 0
        const step = Math.max(1, Math.floor(end / 30))
        const interval = setInterval(() => {
          start += step
          if (start >= end) { setVal(end); clearInterval(interval) }
          else setVal(start)
        }, 30)
        obs.disconnect()
      }
    }, { threshold: 0.5 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [end])
  return <span ref={ref}>{val}</span>
}

const PLACEHOLDERS = [
  { ar: '🔍 ابحث عن أي دواء بالاسم...', en: 'Search by drug name...' },
  { ar: '🔍 ابحث عن المادة الفعالة...', en: 'Search by active ingredient...' },
  { ar: '🔍 ابحث عن اسم الشركة المصنعة...', en: 'Search by manufacturer...' },
  { ar: '🔍 ابحث عن الاسم العلمي...', en: 'Search by scientific name...' },
  { ar: '🔍 ابحث عن البراند...', en: 'Search by brand name...' },
  { ar: '🔍 ابحث عن فئة الدواء...', en: 'Search by drug class...' },
]

export default function Home({ drugs, diseases, recentlyViewed, onBrowse, onInterview, onPrices, onPharmacopeia, onViewDrug, onViewComparisons }) {
  const [query, setQuery] = useState('')
  const [searchMode, setSearchMode] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [tipDismissed, setTipDismissed] = useState(() => {
    try { return sessionStorage.getItem('tip-dismissed') === 'true' } catch { return false }
  })
  const [featuredDrugs, setFeaturedDrugs] = useState(() => {
    return [...drugs.filter(d => !d.edaOnly)].sort(() => Math.random() - 0.5).slice(0, 6)
  })
  const [expandedDrug, setExpandedDrug] = useState(null)
  const [placeholderIdx, setPlaceholderIdx] = useState(0)
  const [charCount, setCharCount] = useState(0)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [searchHistory, setSearchHistory] = useState(() => getSearchHistory())
  const [bookmarks, setBookmarks] = useState(() => getSearchBookmarks())
  const [sortBy, setSortBy] = useState('relevance')
  const [viewMode, setViewMode] = useState('grid')
  const [visibleCount, setVisibleCount] = useState(20)
  const [compareIds, setCompareIds] = useState(new Set())
  const [showExportMenu, setShowExportMenu] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [sourceFilter, setSourceFilter] = useState('')
  const [activeQuickFilter, setActiveQuickFilter] = useState('')
  const [suggestionIdx, setSuggestionIdx] = useState(-1)
  const [activeFilters, setActiveFilters] = useState({ priceRange: null, manufacturer: '', category: '', route: '' })
  const [showHelp, setShowHelp] = useState(false)
  const [isVoiceActive, setIsVoiceActive] = useState(false)
  const [loading, setLoading] = useState(false)
  const [copiedUrl, setCopiedUrl] = useState(false)
  const [correctedQuery, setCorrectedQuery] = useState(null)
  const [resultSourceCounts, setResultSourceCounts] = useState({ enriched: 0, eda: 0, mohmed: 0 })
  const [totalResultCount, setTotalResultCount] = useState(0)
  const inputRef = useRef(null)
  const suggestionsRef = useRef(null)
  const debounceRef = useRef(null)

  const enriched = useMemo(() => drugs.filter(d => !d.edaOnly), [drugs])
  const edaOnlyDrugs = useMemo(() => drugs.filter(d => d.edaOnly), [drugs])

  const placeholder = PLACEHOLDERS[placeholderIdx]
  const quickFilters = useMemo(() => getQuickFilters(), [])
  const popularSearches = useMemo(() => getPopularSearches(), [])

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIdx(i => (i + 1) % PLACEHOLDERS.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const handleQueryChange = useCallback((e) => {
    const val = e.target.value
    setQuery(val)
    setCharCount(val.length)
    setSuggestionIdx(-1)
    setCorrectedQuery(null)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      if (searchMode) setSearchMode(false)
      setShowSuggestions(val.length >= 2)
    }, 150)
  }, [searchMode])

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q || q.length < 2) return []
    const fromEnriched = enriched.filter(d =>
      d.nameEn?.toLowerCase().includes(q) || d.nameAr?.includes(q) ||
      d.scientificNameEn?.toLowerCase().includes(q) || d.categoryAr?.includes(q) ||
      d.manufacturerEn?.toLowerCase().includes(q)
    ).slice(0, 4)
    const fromEda = searchEda(edaOnlyDrugs, q).slice(0, 4)
    return [...fromEnriched, ...fromEda]
  }, [query, enriched, edaOnlyDrugs])

  const searchResults = useMemo(() => {
    const q = query.trim()
    if (!searchMode || !q || q.length < 2) return []

    const enrichedResults = enriched.filter(d =>
      d.nameEn?.toLowerCase().includes(q.toLowerCase()) || d.nameAr?.includes(q) ||
      d.scientificNameEn?.toLowerCase().includes(q.toLowerCase()) || d.scientificNameAr?.includes(q) ||
      d.category?.toLowerCase().includes(q.toLowerCase()) || d.categoryAr?.includes(q) ||
      d.manufacturerEn?.toLowerCase().includes(q.toLowerCase()) || d.manufacturerAr?.includes(q) ||
      d.activeIngredientEn?.toLowerCase().includes(q.toLowerCase()) || d.activeIngredientAr?.includes(q)
    )

    const { results: advancedResults, totalCount, correctedQuery: cq } = searchDrugs(drugs, q, {
      fuzzyEnabled: true,
      correctSpellingEnabled: true,
      transliterationEnabled: true,
      priceRange: activeFilters.priceRange,
      manufacturerFilter: activeFilters.manufacturer,
      categoryFilter: activeFilters.category,
      routeFilter: activeFilters.route,
      sourceFilter: sourceFilter || undefined,
      maxResults: 200,
    })

    const merged = advancedResults.length > 0 ? advancedResults :
      [...enrichedResults, ...searchEda(edaOnlyDrugs, q.toLowerCase())]

    const deduped = []
    const seen = new Set()
    for (const d of merged) {
      if (!seen.has(d.id)) { seen.add(d.id); deduped.push(d) }
    }

    if (cq) setCorrectedQuery(cq)
    setResultSourceCounts(getSourceCounts(deduped))
    setTotalResultCount(deduped.length || totalCount)
    return deduped.slice(0, 200)
  }, [query, searchMode, enriched, edaOnlyDrugs, drugs, activeFilters, sourceFilter])

  const sortedResults = useMemo(() => sortResults(searchResults, sortBy), [searchResults, sortBy])

  const visibleResults = useMemo(() => sortedResults.slice(0, visibleCount), [sortedResults, visibleCount])

  const doSearch = useCallback((override) => {
    const q = (override || query).trim()
    if (!q || q.length < 2) return
    setQuery(q)
    setCharCount(q.length)
    setSearchMode(true)
    setShowSuggestions(false)
    setVisibleCount(20)
    setHistoryOpen(false)
    addSearchHistory(q)
    setSearchHistory(getSearchHistory())
    setLoading(true)
    setTimeout(() => setLoading(false), 300)
  }, [query])

  const clearSearch = useCallback(() => {
    setQuery('')
    setCharCount(0)
    setSearchMode(false)
    setShowSuggestions(false)
    setVisibleCount(20)
    setCorrectedQuery(null)
    setCompareIds(new Set())
    setActiveQuickFilter('')
    setActiveFilters({ priceRange: null, manufacturer: '', category: '', route: '' })
    setSourceFilter('')
  }, [])

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      if (showSuggestions) setShowSuggestions(false)
      else if (searchMode) clearSearch()
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSuggestionIdx(i => Math.min(i + 1, suggestions.length - 1))
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSuggestionIdx(i => Math.max(i - 1, -1))
    }
    if (e.key === 'Enter') {
      if (suggestionIdx >= 0 && suggestions[suggestionIdx]) {
        const s = suggestions[suggestionIdx]
        setQuery(s.nameAr || s.nameEn)
        doSearch(s.nameAr || s.nameEn)
      } else {
        doSearch()
      }
    }
    if (e.key === '/' && !searchMode && document.activeElement !== inputRef.current) {
      e.preventDefault()
      inputRef.current?.focus()
    }
  }, [showSuggestions, searchMode, clearSearch, suggestionIdx, suggestions, doSearch])

  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
        setSearchMode(false)
        setShowSuggestions(false)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  useEffect(() => {
    const handler = (e) => {
      if (historyOpen && !e.target.closest('.history-dropdown')) setHistoryOpen(false)
      if (showExportMenu && !e.target.closest('.export-menu')) setShowExportMenu(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [historyOpen, showExportMenu])

  const handleInfiniteScroll = useCallback(() => {
    if (visibleCount >= sortedResults.length) return
    setVisibleCount(c => Math.min(c + 20, sortedResults.length))
  }, [visibleCount, sortedResults.length])

  useEffect(() => {
    if (!searchMode) return
    const handler = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
        handleInfiniteScroll()
      }
    }
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [searchMode, handleInfiniteScroll])

  const toggleCompare = useCallback((drugId) => {
    setCompareIds(prev => {
      const next = new Set(prev)
      if (next.has(drugId)) next.delete(drugId)
      else if (next.size < 4) next.add(drugId)
      return next
    })
  }, [])

  const handleVoiceSearch = useCallback(() => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) return
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.lang = 'ar-EG'
    recognition.interimResults = false
    recognition.maxAlternatives = 1
    recognition.onstart = () => setIsVoiceActive(true)
    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript
      setQuery(text)
      setCharCount(text.length)
      doSearch(text)
    }
    recognition.onend = () => setIsVoiceActive(false)
    recognition.onerror = () => setIsVoiceActive(false)
    recognition.start()
  }, [doSearch])

  const handleCopyUrl = useCallback(async () => {
    const url = await copyShareUrl(query)
    if (url) { setCopiedUrl(true); setTimeout(() => setCopiedUrl(false), 2000) }
  }, [query])

  const handleExport = useCallback((format) => {
    exportSearchResults(sortedResults, format)
    setShowExportMenu(false)
  }, [sortedResults])

  const handleBookmark = useCallback(() => {
    addSearchBookmark(query, searchResults)
    setBookmarks(getSearchBookmarks())
  }, [query, searchResults])

  useEffect(() => {
    const interval = setInterval(() => {
      setFeaturedDrugs([...enriched].sort(() => Math.random() - 0.5).slice(0, 6))
    }, 15000)
    return () => clearInterval(interval)
  }, [enriched])

  const totalInteractions = drugs.reduce((s, d) => s + d.drugInteractions.length + d.diseaseInteractions.length, 0)
  const contraindicated = drugs.reduce((s, d) =>
    s + d.drugInteractions.filter(i => i.severity === 'contraindicated').length +
    d.diseaseInteractions.filter(i => i.severity === 'contraindicated').length, 0)
  const severe = drugs.reduce((s, d) =>
    s + d.drugInteractions.filter(i => i.severity === 'severe').length +
    d.diseaseInteractions.filter(i => i.severity === 'severe').length, 0)
  const categories = [...new Set(drugs.map(d => d.category))].length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center py-4 md:py-6">
        <h1 className="text-3xl md:text-4xl font-bold text-nile mb-2">الصيدلي المصري الشامل</h1>
        <p className="text-gray-600 text-base md:text-lg">Complete Egyptian Pharmacist AI</p>
        <p className="text-gray-500 text-sm mt-2 max-w-xl mx-auto">
          مرجع ذكي شامل للتفاعلات الدوائية والدوائية-مرضية — {drugs.length.toLocaleString()} دواء / {drugs.length.toLocaleString()} drugs indexed
        </p>
      </div>

      {/* ========== SEARCH BAR ========== */}
      <div className="max-w-2xl mx-auto w-full relative" role="search" aria-label="Search drugs">
        {/* Quick filters */}
        <div className="flex flex-wrap gap-1.5 mb-2 justify-center">
          {quickFilters.map(f => (
            <button key={f.id}
              onClick={() => {
                setActiveQuickFilter(activeQuickFilter === f.id ? '' : f.id)
                setQuery(f.query)
                setCharCount(f.query.length)
                doSearch(f.query)
              }}
              className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                activeQuickFilter === f.id
                  ? 'bg-gold text-nile shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-gold hover:text-gold-dark'
              }`}>
              {f.icon} {f.label}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={handleQueryChange}
              onFocus={() => { if (query.length >= 2) setShowSuggestions(true); setHistoryOpen(query.length === 0) }}
              onBlur={() => setTimeout(() => { setShowSuggestions(false); setHistoryOpen(false) }, 200)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder.ar + ' / ' + placeholder.en}
              className="w-full px-5 py-3.5 pr-12 border-2 border-gold rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent text-right shadow-sm text-base transition-shadow focus:shadow-md"
              dir="auto"
              role="combobox"
              aria-expanded={showSuggestions}
              aria-autocomplete="list"
              aria-controls="search-suggestions"
              aria-activedescendant={suggestionIdx >= 0 ? `suggestion-${suggestionIdx}` : undefined}
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none" title="Ctrl+K to focus">Ctrl+K</span>
            {query.length > 0 && (
              <button onClick={() => { setQuery(''); setCharCount(0); inputRef.current?.focus() }}
                className="absolute left-10 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm p-1"
                aria-label="Clear search">✕</button>
            )}
          </div>

          {/* Voice search button */}
          <button onClick={handleVoiceSearch}
            disabled={isVoiceActive}
            className={`px-3 py-3.5 rounded-xl transition-all shadow-sm text-base ${
              isVoiceActive ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-200'
            }`}
            title="بحث صوتي / Voice Search"
            aria-label="Voice search">
            {isVoiceActive ? '🎙️' : '🎤'}
          </button>

          <button onClick={() => doSearch()}
            className="px-6 py-3.5 bg-gold text-nile rounded-xl font-bold hover:bg-gold-light transition-colors shadow-sm text-base whitespace-nowrap">
            🔎 بحث
          </button>
          {searchMode && (
            <button onClick={clearSearch}
              className="px-4 py-3.5 bg-gray-100 text-gray-500 rounded-xl hover:bg-gray-200 transition-colors font-medium">
              ✕ مسح
            </button>
          )}
        </div>

        {/* Character count + Source indicator */}
        {query.length > 0 && (
          <div className="flex items-center justify-between mt-1 px-1">
            <span className="text-[10px] text-gray-400">{charCount} حرف / chars</span>
            {searchMode && totalResultCount > 0 && (
              <span className="text-[10px] text-gray-400">
                {resultSourceCounts.enriched > 0 && <span className="text-green-600">{resultSourceCounts.enriched} غني</span>}
                {resultSourceCounts.enriched > 0 && resultSourceCounts.eda > 0 && ' + '}
                {resultSourceCounts.eda > 0 && <span className="text-blue-600">{resultSourceCounts.eda} EDA</span>}
                {(resultSourceCounts.enriched > 0 || resultSourceCounts.eda > 0) && resultSourceCounts.mohmed > 0 && ' + '}
                {resultSourceCounts.mohmed > 0 && <span className="text-purple-600">{resultSourceCounts.mohmed} MOHMED</span>}
              </span>
            )}
          </div>
        )}

        {/* History dropdown (when input empty and focused) */}
        {historyOpen && !searchMode && searchHistory.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-sand-dark rounded-xl shadow-lg z-30 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
              <span className="text-xs font-medium text-gray-500">🕐 عمليات بحث سابقة / Recent</span>
              <button onClick={(e) => { e.stopPropagation(); clearSearchHistory(); setSearchHistory([]); setHistoryOpen(false) }}
                className="text-[10px] text-red-400 hover:text-red-600">مسح الكل</button>
            </div>
            {searchHistory.slice(0, 8).map((h, i) => (
              <button key={i}
                onMouseDown={() => { setQuery(h); doSearch(h) }}
                className="w-full text-right px-4 py-2.5 text-sm hover:bg-sand transition-colors flex items-center justify-between group">
                <span className="text-gray-400 group-hover:text-gray-600">🔍</span>
                <span className="text-nile">{h}</span>
                <button
                  onMouseDown={(e) => { e.stopPropagation(); removeSearchHistory(h); setSearchHistory(getSearchHistory()) }}
                  className="text-gray-300 hover:text-red-400 text-xs ml-2">✕</button>
              </button>
            ))}
          </div>
        )}

        {/* Autocomplete suggestions */}
        {showSuggestions && !searchMode && query.length >= 2 && suggestions.length > 0 && (
          <div id="search-suggestions" ref={suggestionsRef}
            className="absolute top-full left-0 right-0 mt-1 bg-white border border-sand-dark rounded-xl shadow-lg z-20 overflow-hidden max-h-96 overflow-y-auto">
            {/* Enriched section */}
            {suggestions.some(s => !s.edaOnly) && (
              <div className="px-3 py-1.5 bg-green-50 border-b border-green-100">
                <span className="text-[10px] font-medium text-green-700">💚 أدوية مُغنّاة / Enriched Drugs</span>
              </div>
            )}
            {suggestions.filter(s => !s.edaOnly).map((d, idx) => (
              <button key={d.id} id={`suggestion-${idx}`}
                onMouseDown={() => { setQuery(d.nameAr || d.nameEn); doSearch(d.nameAr || d.nameEn) }}
                className={`w-full text-right px-4 py-3 text-sm transition-colors border-b border-gray-50 last:border-b-0 flex items-center justify-between gap-2 ${
                  suggestionIdx === idx ? 'bg-gold/10' : 'hover:bg-sand'
                }`}>
                <span className="text-gray-400 text-xs shrink-0">
                  <Highlight text={d.nameEn} query={query} />
                </span>
                <span className="flex items-center gap-2 flex-1 justify-end">
                  {d.drugInteractions?.length > 0 && (
                    <span className="text-[10px] bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded-full">{d.drugInteractions.length} int.</span>
                  )}
                  {d.categoryAr && (
                    <span className="text-[10px] bg-nile/10 text-nile px-1.5 py-0.5 rounded-full">{d.categoryAr}</span>
                  )}
                  <span className="font-medium text-nile">
                    <Highlight text={d.nameAr} query={query} />
                  </span>
                  <span className="text-xl">{d.formEmoji || '💊'}</span>
                </span>
              </button>
            ))}

            {/* EDA section */}
            {suggestions.some(s => s.edaOnly) && (
              <div className="px-3 py-1.5 bg-blue-50 border-b border-blue-100">
                <span className="text-[10px] font-medium text-blue-700">🏛️ قاعدة بيانات EDA / EDA Database</span>
              </div>
            )}
            {suggestions.filter(s => s.edaOnly).map((d, idx) => (
              <button key={d.id}
                onMouseDown={() => { setQuery(d.nameAr || d.nameEn); doSearch(d.nameAr || d.nameEn) }}
                className="w-full text-right px-4 py-3 text-sm hover:bg-sand transition-colors border-b border-gray-50 last:border-b-0 flex items-center justify-between gap-2">
                <span className="text-gray-400 text-xs shrink-0">
                  <Highlight text={d.nameEn} query={query} /> (EDA)
                </span>
                <span className="flex items-center gap-2 flex-1 justify-end">
                  {d.edaBrands?.length > 0 && (
                    <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">{d.edaBrands.length} brands</span>
                  )}
                  {d.edaRoutes?.length > 0 && (
                    <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">{d.edaRoutes[0]}</span>
                  )}
                  <span className="font-medium text-nile">
                    <Highlight text={d.nameAr} query={query} />
                  </span>
                  <span className="text-xl">💊</span>
                </span>
              </button>
            ))}

            {/* Popular searches when few suggestions */}
            {suggestions.length < 4 && (
              <div className="px-3 py-2 bg-gray-50">
                <span className="text-[10px] text-gray-400 block mb-1">🔥 عمليات بحث شائعة / Popular</span>
                <div className="flex flex-wrap gap-1">
                  {popularSearches.filter(p => !p.includes(query.toLowerCase())).slice(0, 3).map(p => (
                    <button key={p} onMouseDown={() => { setQuery(p); doSearch(p) }}
                      className="text-[10px] bg-white border border-gray-200 text-gray-600 px-2 py-0.5 rounded-full hover:border-gold">{p}</button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ========== SEARCH RESULTS ========== */}
      {searchMode && (
        <div className="space-y-4">
          {/* Results header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-nile">🔍 نتائج البحث / Search Results</h2>
              <span className="text-sm text-gray-500">
                {sortedResults.length} نتيجة / results
                {correctedQuery && (
                  <span className="text-xs text-amber-600 ml-1">
                    (هل قصدت <button onClick={() => { setQuery(correctedQuery); doSearch(correctedQuery) }}
                      className="underline font-medium">{correctedQuery}</button>؟)
                  </span>
                )}
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Sort dropdown */}
              <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white text-gray-600 focus:outline-none focus:ring-1 focus:ring-gold">
                <option value="relevance">📊 الصلة / Relevance</option>
                <option value="name-en">🔤 A-Z / Name EN</option>
                <option value="name-ar">🔤 أ-ي / Name AR</option>
                <option value="price-low">💰 السعر ↑ / Price Low</option>
                <option value="price-high">💰 السعر ↓ / Price High</option>
                <option value="interactions">⚡ التفاعلات / Interactions</option>
              </select>

              {/* View toggle */}
              <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                <button onClick={() => setViewMode('grid')}
                  className={`px-2 py-1 text-xs ${viewMode === 'grid' ? 'bg-gold text-nile' : 'bg-white text-gray-500'}`}
                  aria-label="Grid view">▦</button>
                <button onClick={() => setViewMode('list')}
                  className={`px-2 py-1 text-xs ${viewMode === 'list' ? 'bg-gold text-nile' : 'bg-white text-gray-500'}`}
                  aria-label="List view">☰</button>
              </div>

              {/* Filter toggle */}
              <button onClick={() => setShowFilters(!showFilters)}
                className={`px-2 py-1.5 text-xs rounded-lg border transition-colors ${
                  showFilters ? 'bg-nile text-white border-nile' : 'bg-white text-gray-500 border-gray-200 hover:border-gold'
                }`}>⚙️ فلاتر</button>

              {/* Bookmark */}
              <button onClick={handleBookmark}
                className="px-2 py-1.5 text-xs rounded-lg border border-gray-200 bg-white text-gray-500 hover:border-gold hover:text-gold-dark transition-colors"
                title="حفظ البحث / Bookmark search">🔖</button>

              {/* Copy share URL */}
              <button onClick={handleCopyUrl}
                className="px-2 py-1.5 text-xs rounded-lg border border-gray-200 bg-white text-gray-500 hover:border-gold hover:text-gold-dark transition-colors"
                title="نسخ رابط / Share">
                {copiedUrl ? '✅' : '🔗'}
              </button>

              {/* Export */}
              <div className="relative export-menu">
                <button onClick={() => setShowExportMenu(!showExportMenu)}
                  className="px-2 py-1.5 text-xs rounded-lg border border-gray-200 bg-white text-gray-500 hover:border-gold hover:text-gold-dark transition-colors"
                  title="تصدير / Export">📥</button>
                {showExportMenu && (
                  <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 py-1">
                    <button onClick={() => handleExport('csv')} className="block w-full text-right px-4 py-2 text-xs hover:bg-sand">📄 CSV</button>
                    <button onClick={() => { navigator.clipboard.writeText(JSON.stringify(sortedResults, null, 2)); setShowExportMenu(false) }}
                      className="block w-full text-right px-4 py-2 text-xs hover:bg-sand">📋 JSON</button>
                  </div>
                )}
              </div>

              {/* Compare button */}
              {compareIds.size >= 2 && (
                <button onClick={() => onViewComparisons?.([...compareIds])}
                  className="px-3 py-1.5 text-xs rounded-lg bg-nile text-white font-bold hover:bg-nile-light transition-colors animate-pulse">
                  ⚖️ قارن ({compareIds.size})
                </button>
              )}
            </div>
          </div>

          {/* Advanced filters panel */}
          {showFilters && (
            <div className="bg-white border border-sand-dark rounded-xl p-4 space-y-3">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="text-xs text-gray-500 block mb-1">المصدر / Source</label>
                  <select value={sourceFilter} onChange={e => setSourceFilter(e.target.value)}
                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white">
                    <option value="">الكل / All</option>
                    <option value="enriched">💚 مُغنّاة / Enriched</option>
                    <option value="eda">🏛 EDA</option>
                    <option value="mohmed">📖 MOHMED</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">النطاق السعري / Price Range (EGP)</label>
                  <div className="flex gap-1">
                    <input type="number" placeholder="من" onChange={e => {
                      const min = parseFloat(e.target.value) || 0
                      setActiveFilters(f => ({ ...f, priceRange: [min, f.priceRange?.[1] || Infinity] }))
                    }} className="w-1/2 text-sm border border-gray-200 rounded-lg px-2 py-2" />
                    <input type="number" placeholder="إلى" onChange={e => {
                      const max = parseFloat(e.target.value) || Infinity
                      setActiveFilters(f => ({ ...f, priceRange: [f.priceRange?.[0] || 0, max] }))
                    }} className="w-1/2 text-sm border border-gray-200 rounded-lg px-2 py-2" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">الشركة / Manufacturer</label>
                  <input type="text" placeholder="ابحث..." value={activeFilters.manufacturer}
                    onChange={e => setActiveFilters(f => ({ ...f, manufacturer: e.target.value }))}
                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">المسار / Route</label>
                  <input type="text" placeholder="FMO, TOPICAL..." value={activeFilters.route}
                    onChange={e => setActiveFilters(f => ({ ...f, route: e.target.value }))}
                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2" />
                </div>
              </div>
              <button onClick={() => { setActiveFilters({ priceRange: null, manufacturer: '', category: '', route: '' }); setSourceFilter('') }}
                className="text-xs text-red-500 hover:text-red-700">🔄 إعادة ضبط الفلاتر / Reset Filters</button>
            </div>
          )}

          {/* Loading skeleton */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white border border-sand-dark rounded-xl p-4 animate-pulse">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-2">
                      <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                      <div className="h-3 bg-gray-100 rounded w-1/3"></div>
                    </div>
                    <div className="w-10 h-10 bg-gray-100 rounded"></div>
                  </div>
                  <div className="mt-3 space-y-1">
                    <div className="h-3 bg-gray-100 rounded w-full"></div>
                    <div className="h-3 bg-gray-100 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Results */}
          {!loading && sortedResults.length === 0 && (
            <div className="text-center py-12 text-gray-400 bg-white border border-sand-dark rounded-xl">
              <div className="text-5xl mb-3">🔍</div>
              <p className="text-lg font-medium">لا توجد نتائج مطابقة / No matching results</p>
              <p className="text-sm mt-1">حاول البحث باسم آخر أو مادة فعالة / Try a different name or active ingredient</p>
              <div className="mt-4 flex flex-wrap gap-2 justify-center">
                {popularSearches.slice(0, 4).map(p => (
                  <button key={p} onClick={() => { setQuery(p); doSearch(p) }}
                    className="px-3 py-1.5 text-xs bg-sand rounded-full hover:bg-gold/20 text-nile">{p}</button>
                ))}
              </div>
            </div>
          )}

          {!loading && sortedResults.length > 0 && (
            <>
              {/* Grid view */}
              {viewMode === 'grid' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {visibleResults.map(drug => (
                    <DrugCard key={drug.id} drug={drug} query={query} onViewDrug={onViewDrug}
                      compareIds={compareIds} onToggleCompare={toggleCompare} />
                  ))}
                </div>
              )}

              {/* List view */}
              {viewMode === 'list' && (
                <div className="space-y-2">
                  {visibleResults.map(drug => (
                    <DrugListItem key={drug.id} drug={drug} query={query} onViewDrug={onViewDrug}
                      compareIds={compareIds} onToggleCompare={toggleCompare} />
                  ))}
                </div>
              )}

              {/* Load more */}
              {visibleCount < sortedResults.length && (
                <div className="text-center">
                  <button onClick={handleInfiniteScroll}
                    className="px-6 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 hover:border-gold hover:text-gold-dark transition-colors">
                    عرض المزيد ({sortedResults.length - visibleCount} متبقي) / Load More
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* ========== HOME CONTENT (hidden during search) ========== */}
      {!searchMode && (
        <>
          {/* Stats counters */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {[
              { label: 'الأدوية', labelEn: 'Drugs', value: drugs.length, color: 'bg-nile', icon: '💊' },
              { label: 'الأمراض', labelEn: 'Diseases', value: diseases.length, color: 'bg-nile-light', icon: '🦠' },
              { label: 'التفاعلات', labelEn: 'Interactions', value: totalInteractions, color: 'bg-gold-dark', icon: '⚡' },
              { label: 'تصنيفات', labelEn: 'Categories', value: categories, color: 'bg-green-700', icon: '📊' },
            ].map(stat => (
              <div key={stat.labelEn} className={`${stat.color} text-white rounded-xl p-3 md:p-4 text-center`}>
                <div className="text-2xl md:text-3xl mb-1">{stat.icon}</div>
                <div className="text-xl md:text-2xl font-bold"><AnimatedCounter end={stat.value} /></div>
                <div className="text-xs md:text-sm text-white/80">{stat.label}</div>
                <div className="text-[10px] text-white/50">{stat.labelEn}</div>
              </div>
            ))}
          </div>

          {/* Seasonal tip */}
          {!tipDismissed && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 md:p-4 flex items-start gap-3">
              <span className="text-xl">☀️</span>
              <div>
                <p className="font-bold text-amber-800 text-sm">نصيحة موسمية / Seasonal Tip</p>
                <p className="text-amber-700 text-xs mt-1">
                  يُفضل تخزين الأدوية في مكان بارد وجاف بعيداً عن أشعة الشمس المباشرة. حرارة الصيف قد تؤثر على فاعلية بعض الأدوية.
                </p>
                <p className="text-amber-600 text-xs mt-0.5">
                  Store medicines in a cool, dry place away from direct sunlight. Summer heat can affect the effectiveness of some medications.
                </p>
              </div>
              <button onClick={() => { setTipDismissed(true); try { sessionStorage.setItem('tip-dismissed', 'true') } catch {} }} className="text-amber-400 hover:text-amber-600 shrink-0">✕</button>
            </div>
          )}

          {/* Severity summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 md:p-4">
              <div className="text-lg font-bold text-red-800">{severityConfig.contraindicated.emoji} ممنوع / Contraindicated</div>
              <div className="text-2xl font-bold text-red-700">{contraindicated}</div>
              <div className="text-sm text-red-600">تفاعل ممنوع</div>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 md:p-4">
              <div className="text-lg font-bold text-orange-800">{severityConfig.severe.emoji} شديد / Severe</div>
              <div className="text-2xl font-bold text-orange-700">{severe}</div>
              <div className="text-sm text-orange-600">تفاعل شديد</div>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 md:p-4">
              <div className="text-lg font-bold text-yellow-800">{severityConfig.moderate.emoji} متوسط / Moderate</div>
              <div className="text-2xl font-bold text-yellow-700">{totalInteractions - contraindicated - severe}</div>
              <div className="text-sm text-yellow-600">تفاعل متوسط أو بسيط</div>
            </div>
          </div>

          {/* Quick nav buttons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button onClick={onBrowse} className="bg-nile text-white py-3 rounded-xl font-bold hover:bg-nile-light transition-colors">
              💊 الأدوية / Drugs
            </button>
            <button onClick={onInterview} className="bg-gold text-nile py-3 rounded-xl font-bold hover:bg-gold-light transition-colors">
              🎓 المقابلة / Interview
            </button>
            <button onClick={onPharmacopeia} className="bg-green-700 text-white py-3 rounded-xl font-bold hover:bg-green-600 transition-colors">
              📋 الدستور / Pharmacopeia
            </button>
            <button onClick={onBrowse} className="bg-purple-700 text-white py-3 rounded-xl font-bold hover:bg-purple-600 transition-colors">
              💰 الأسعار / Prices
            </button>
          </div>

          {/* Recently viewed */}
          {recentlyViewed && recentlyViewed.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-nile mb-3">🕐 شوهدت مؤخراً / Recently Viewed</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {recentlyViewed.map(drug => (
                  <div key={drug.id}
                    onClick={() => onViewDrug(drug.id)}
                    className="bg-white border border-sand-dark rounded-xl p-3 text-center hover:shadow-md hover:border-gold transition-all cursor-pointer"
                  >
                    <div className="text-2xl mb-1">{drug.formEmoji || '💊'}</div>
                    <div className="font-bold text-nile text-sm">{drug.nameAr}</div>
                    <div className="text-xs text-gray-500">{drug.nameEn}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Search tips */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-nile">💡 نصائح البحث / Search Tips</h3>
              <button onClick={() => setShowHelp(!showHelp)} className="text-xs text-gray-400 hover:text-gray-600">
                {showHelp ? 'إخفاء' : 'عرض المزيد'}
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-gray-600">
              <div className="flex items-center gap-1"><span className="text-gold-dark">•</span> ابحث بالاسم العربي أو الإنجليزي</div>
              <div className="flex items-center gap-1"><span className="text-gold-dark">•</span> ابحث بالمادة الفعالة</div>
              <div className="flex items-center gap-1"><span className="text-gold-dark">•</span> ابحث بالاسم العلمي</div>
              <div className="flex items-center gap-1"><span className="text-gold-dark">•</span> اضغط <kbd className="px-1 bg-white border rounded text-[10px]">Ctrl+K</kbd> للتركيز</div>
            </div>
            {showHelp && (
              <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-gray-500 border-t border-gray-200 pt-3">
                <div className="flex items-center gap-1"><span className="text-gold-dark">•</span> ابحث بالإنجليزي للعثور على النتائج العربية</div>
                <div className="flex items-center gap-1"><span className="text-gold-dark">•</span> استخدم أسهم الكيبورد للتنقل</div>
                <div className="flex items-center gap-1"><span className="text-gold-dark">•</span> اضغط <kbd className="px-1 bg-white border rounded text-[10px]">Esc</kbd> للإلغاء</div>
                <div className="flex items-center gap-1"><span className="text-gold-dark">•</span> حفظ عمليات البحث السابقة</div>
                <div className="flex items-center gap-1"><span className="text-gold-dark">•</span> تصدير النتائج CSV/JSON</div>
                <div className="flex items-center gap-1"><span className="text-gold-dark">•</span> مقارنة أدوية (اختر 2+)</div>
                <div className="flex items-center gap-1"><span className="text-gold-dark">•</span> فلاتر متقدمة: السعر، المصدر، الشركة</div>
                <div className="flex items-center gap-1"><span className="text-gold-dark">•</span> بحث صوتي بالعربي 🎤</div>
              </div>
            )}
          </div>

          {/* Featured drugs */}
          <div>
            <h2 className="text-lg font-bold text-nile mb-3">⭐ أدوية مختارة / Featured Drugs</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {featuredDrugs.map(drug => (
                <div key={drug.id}
                  onClick={() => setExpandedDrug(expandedDrug?.id === drug.id ? null : drug)}
                  className={`bg-white border rounded-xl p-3 text-center hover:shadow-md transition-all cursor-pointer ${
                    expandedDrug?.id === drug.id ? 'border-gold shadow-lg ring-2 ring-gold scale-105 z-10' : 'border-sand-dark'
                  }`}
                >
                  <div className="text-2xl mb-1">{drug.formEmoji || '💊'}</div>
                  <div className="font-bold text-nile text-sm">{drug.nameAr}</div>
                  <div className="text-xs text-gray-500">{drug.nameEn}</div>
                  <div className="text-[10px] text-gray-400 mt-1">{drug.categoryAr}</div>
                </div>
              ))}
            </div>

            {expandedDrug && (
              <div className="mt-4 bg-white border border-gold rounded-xl p-5 shadow-lg">
                <div className="flex items-start justify-between mb-3">
                  <button onClick={() => setExpandedDrug(null)} className="text-gray-400 hover:text-gray-600 text-lg">✕</button>
                  <div className="text-right flex-1 mr-3">
                    <h3 className="text-xl font-bold text-nile">{expandedDrug.nameAr}</h3>
                    <p className="text-gray-500">{expandedDrug.nameEn}</p>
                  </div>
                  <div className="text-4xl">{expandedDrug.formEmoji || '💊'}</div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                  {expandedDrug.scientificNameAr && (
                    <div><span className="text-xs text-gray-400 block">الاسم العلمي / Scientific</span><span className="text-gray-700">{expandedDrug.scientificNameAr}</span></div>
                  )}
                  {expandedDrug.categoryAr && (
                    <div><span className="text-xs text-gray-400 block">التصنيف / Category</span><span className="text-gray-700">{expandedDrug.categoryAr}</span></div>
                  )}
                  {expandedDrug.manufacturerEn && (
                    <div><span className="text-xs text-gray-400 block">الشركة المصنعة / Manufacturer</span><span className="text-gray-700">{expandedDrug.manufacturerAr || expandedDrug.manufacturerEn}</span></div>
                  )}
                  {expandedDrug.activeIngredientAr && (
                    <div><span className="text-xs text-gray-400 block">المادة الفعالة / Active Ingredient</span><span className="text-gray-700">{expandedDrug.activeIngredientAr}</span></div>
                  )}
                  {expandedDrug.prices && expandedDrug.prices.length > 0 && (
                    <div><span className="text-xs text-gray-400 block">السعر / Price</span><span className="text-gold-dark font-bold">{expandedDrug.prices[0].price} {expandedDrug.prices[0].unit}</span></div>
                  )}
                  {expandedDrug.descriptionAr && (
                    <div className="col-span-full"><span className="text-xs text-gray-400 block">الوصف / Description</span><p className="text-gray-600 text-xs line-clamp-3">{expandedDrug.descriptionAr}</p></div>
                  )}
                  {expandedDrug.drugInteractions?.length > 0 && (
                    <div><span className="text-xs text-gray-400 block">تفاعلات دوائية / Drug Int.</span>
                      <span className="text-orange-600 font-bold">{expandedDrug.drugInteractions.length} تفاعل</span>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => onViewDrug(expandedDrug.id)}
                  className="mt-3 text-sm bg-nile text-white px-4 py-2 rounded-lg hover:bg-nile-light transition-colors"
                >
                  عرض التفاصيل الكاملة / View Full Details →
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

/* ========== Drug Card (Grid) ========== */
function DrugCard({ drug, query, onViewDrug, compareIds, onToggleCompare }) {
  const inCompare = compareIds.has(drug.id)
  return (
    <div className={`bg-white border rounded-xl p-4 transition-all group relative ${
      inCompare ? 'border-nile ring-2 ring-nile shadow-md' : 'border-sand-dark hover:shadow-md hover:border-gold'
    }`}>
      <div className="flex items-start justify-between gap-2">
        <div className="text-right flex-1">
          <div className="font-bold text-nile text-lg group-hover:text-gold-dark transition-colors">
            <Highlight text={drug.nameAr} query={query} />
          </div>
          <div className="text-sm text-gray-500">
            <Highlight text={drug.nameEn} query={query} />
          </div>
          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
            {drug.edaOnly ? (
              <span className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full">
                {drug.dataSource === 'MOHMED' ? '📖 Drug Guide 2024' : '🏛 EDA Listed'}
              </span>
            ) : (
              <>
                <span className="bg-sand text-nile text-xs px-2 py-0.5 rounded-full">{drug.categoryAr}</span>
                {drug.scientificNameEn && (
                  <span className="text-[10px] text-gray-400 italic">{drug.scientificNameEn}</span>
                )}
              </>
            )}
          </div>
        </div>
        <div className="text-4xl">{drug.formEmoji || '💊'}</div>
      </div>

      {drug.edaOnly ? (
        <div className="text-xs text-gray-500 mt-2 space-y-0.5">
          {drug.edaBrands?.length > 0 && (
            <div>🏷 {drug.edaBrands.slice(0, 3).join(', ')}{drug.edaBrands.length > 3 ? ` +${drug.edaBrands.length - 3}` : ''}</div>
          )}
          {drug.manufacturerEn && <div>🏭 {drug.manufacturerEn}</div>}
          {drug.edaRoutes?.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {drug.edaRoutes.slice(0, 3).map(r => (
                <span key={r} className="inline-block bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded text-[10px]">{r}</span>
              ))}
            </div>
          )}
        </div>
      ) : (
        <p className="text-xs text-gray-500 mt-2 line-clamp-2">{drug.description || drug.descriptionAr}</p>
      )}

      <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
        <div className="flex gap-2 text-xs">
          {!drug.edaOnly && drug.drugInteractions?.length > 0 && (
            <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded">{drug.drugInteractions.length} تفاعل دوائي</span>
          )}
          {!drug.edaOnly && drug.diseaseInteractions?.length > 0 && (
            <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded">{drug.diseaseInteractions.length} تفاعل مرضي</span>
          )}
        </div>
        {drug.edaRf && drug.edaRf.length > 0 ? (
          <span className="text-xs text-gold-dark font-bold">EGP {drug.edaRf[0][2]}</span>
        ) : drug.prices?.length > 0 ? (
          <span className="text-xs text-gold-dark font-bold">{drug.prices[0].price} {drug.prices[0].unit}</span>
        ) : drug.edaPriceRange?.length > 0 ? (
          <span className="text-xs text-gold-dark font-bold">EGP {drug.edaPriceRange[0]}</span>
        ) : null}
      </div>

      {/* Compare checkbox */}
      <button onClick={(e) => { e.stopPropagation(); onToggleCompare(drug.id) }}
        className={`absolute top-2 left-2 w-5 h-5 rounded border-2 flex items-center justify-center text-[10px] transition-all ${
          inCompare ? 'bg-nile border-nile text-white' : 'bg-white border-gray-300 text-transparent hover:border-gold'
        }`}
        title="إضافة للمقارنة / Add to compare">
        {inCompare ? '✓' : ''}
      </button>

      {/* View detail button */}
      <button onClick={(e) => { e.stopPropagation(); onViewDrug(drug.id) }}
        className="mt-2 w-full text-center text-xs bg-nile/5 text-nile py-1.5 rounded-lg hover:bg-nile/10 transition-colors font-medium">
        عرض التفاصيل / View Details →
      </button>
    </div>
  )
}

/* ========== Drug List Item ========== */
function DrugListItem({ drug, query, onViewDrug, compareIds, onToggleCompare }) {
  const inCompare = compareIds.has(drug.id)
  return (
    <div onClick={() => onViewDrug(drug.id)}
      className={`bg-white border rounded-xl p-3 flex items-center gap-3 cursor-pointer transition-all ${
        inCompare ? 'border-nile ring-1 ring-nile' : 'border-sand-dark hover:shadow-md hover:border-gold'
      }`}>
      <button onClick={(e) => { e.stopPropagation(); onToggleCompare(drug.id) }}
        className={`w-5 h-5 rounded border-2 flex items-center justify-center text-[10px] shrink-0 transition-all ${
          inCompare ? 'bg-nile border-nile text-white' : 'bg-white border-gray-300 text-transparent hover:border-gold'
        }`}>
        {inCompare ? '✓' : ''}
      </button>

      <div className="text-2xl shrink-0">{drug.formEmoji || '💊'}</div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-bold text-nile text-sm truncate">
            <Highlight text={drug.nameAr} query={query} />
          </span>
          <span className="text-xs text-gray-400 truncate">
            <Highlight text={drug.nameEn} query={query} />
          </span>
        </div>
        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
          {drug.edaOnly ? (
            <span className="bg-blue-50 text-blue-700 text-[10px] px-1.5 py-0.5 rounded-full">
              {drug.dataSource === 'MOHMED' ? '📖' : '🏛'} {drug.manufacturerEn || 'EDA'}
            </span>
          ) : (
            <>
              <span className="bg-sand text-nile text-[10px] px-1.5 py-0.5 rounded-full">{drug.categoryAr}</span>
              {drug.drugInteractions?.length > 0 && (
                <span className="bg-orange-100 text-orange-700 text-[10px] px-1.5 py-0.5 rounded-full">{drug.drugInteractions.length} int.</span>
              )}
            </>
          )}
          {drug.edaBrands?.length > 0 && (
            <span className="text-[10px] text-gray-400 truncate">🏷 {drug.edaBrands.slice(0, 2).join(', ')}</span>
          )}
        </div>
      </div>

      <div className="text-right shrink-0">
        {drug.edaRf?.length > 0 ? (
          <span className="text-xs text-gold-dark font-bold">EGP {drug.edaRf[0][2]}</span>
        ) : drug.prices?.length > 0 ? (
          <span className="text-xs text-gold-dark font-bold">{drug.prices[0].price} {drug.prices[0].unit}</span>
        ) : drug.edaPriceRange?.length > 0 ? (
          <span className="text-xs text-gold-dark font-bold">EGP {drug.edaPriceRange[0]}</span>
        ) : null}
      </div>
    </div>
  )
}
