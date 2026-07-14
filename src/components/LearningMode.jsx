import { useState, useMemo } from 'react'
import { LEARNING_SECTIONS, LEARNING_CATEGORIES } from '../data/learningContent.js'

function HighlightText({ text, query }) {
  if (!query || !text) return <>{text}</>
  const q = query.trim()
  if (!q) return <>{text}</>
  const regex = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  const parts = text.split(regex)
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part)
          ? <mark key={i} className="bg-yellow-200 text-nile px-0.5 rounded">{part}</mark>
          : part
      )}
    </>
  )
}

export default function LearningMode({ onBack }) {
  const [selectedSection, setSelectedSection] = useState(null)
  const [expandedSub, setExpandedSub] = useState(null)
  const [search, setSearch] = useState('')

  const filteredSections = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return LEARNING_SECTIONS.map(s => ({ ...s, matchedSubs: s.subsections }))
    return LEARNING_SECTIONS.map(s => {
      const matchedSubs = s.subsections.filter(sub =>
        sub.title.toLowerCase().includes(q) ||
        sub.titleEn.toLowerCase().includes(q) ||
        sub.content.toLowerCase().includes(q)
      )
      return { ...s, matchedSubs }
    }).filter(s =>
      s.title.toLowerCase().includes(q) ||
      s.titleEn.toLowerCase().includes(q) ||
      s.matchedSubs.length > 0
    )
  }, [search])

  const totalMatches = useMemo(() => {
    return filteredSections.reduce((sum, s) => sum + s.matchedSubs.length, 0)
  }, [filteredSections])

  if (!selectedSection) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-nile">📚 المكتبة التعليمية / Learning Library</h2>
          <button onClick={onBack} className="text-sm bg-gray-100 text-gray-500 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors">
            ← العودة
          </button>
        </div>

        <div className="max-w-md">
          <input
            type="search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="🔍 بحث في المحتوى التعليمي... / Search learning content..."
            className="w-full border border-sand-dark rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-nile focus:border-transparent transition-all"
            dir="auto"
          />
        </div>

        {search.trim() && (
          <p className="text-sm text-gray-500">
            {totalMatches} نتيجة مطابقة / matching results
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {filteredSections.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-400 bg-white border border-sand-dark rounded-xl">
              <div className="text-5xl mb-3">🔍</div>
              <p className="text-lg font-medium">لا توجد نتائج / No results found</p>
              <p className="text-sm mt-1">حاول البحث بكلمات مختلفة / Try different keywords</p>
            </div>
          ) : (
            filteredSections.map(sec => {
              const cat = LEARNING_CATEGORIES.find(c => c.id === sec.id)
              return (
                <button
                  key={sec.id}
                  onClick={() => {
                    setSelectedSection(sec.id)
                    setExpandedSub(null)
                    setSearch('')
                  }}
                  className="bg-white border border-sand-dark rounded-xl p-5 text-right hover:shadow-md hover:border-gold transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{cat?.icon || '📖'}</span>
                    <div className="flex-1">
                      <h3 className="font-bold text-nile group-hover:text-gold-dark transition-colors">{sec.title}</h3>
                      <p className="text-xs text-gray-500">{sec.titleEn}</p>
                      <span className="inline-block mt-1.5 bg-sand text-nile text-[11px] px-2 py-0.5 rounded-full">
                        {sec.subsections.length} أقسام
                      </span>
                    </div>
                  </div>
                </button>
              )
            })
          )}
        </div>
      </div>
    )
  }

  const section = LEARNING_SECTIONS.find(s => s.id === selectedSection)
  if (!section) return null

  const cat = LEARNING_CATEGORIES.find(c => c.id === selectedSection)
  const displaySubs = search.trim()
    ? section.subsections.filter(sub =>
        sub.title.toLowerCase().includes(search.trim().toLowerCase()) ||
        sub.titleEn.toLowerCase().includes(search.trim().toLowerCase()) ||
        sub.content.toLowerCase().includes(search.trim().toLowerCase())
      )
    : section.subsections

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 min-w-0">
          <button
            onClick={() => { setSelectedSection(null); setSearch('') }}
            className="text-sm bg-gray-100 text-gray-500 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors shrink-0"
          >
            ← رجوع
          </button>
          <div className="min-w-0">
            <h2 className="text-xl md:text-2xl font-bold text-nile flex items-center gap-2">
              <span className="text-2xl">{cat?.icon || '📖'}</span>
              <span className="truncate">{section.title}</span>
            </h2>
            <p className="text-xs text-gray-500 truncate">{section.titleEn}</p>
          </div>
        </div>
      </div>

      <div className="max-w-md">
        <input
          type="search"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="🔍 بحث في هذا القسم... / Search this section..."
          className="w-full border border-sand-dark rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-nile focus:border-transparent transition-all"
          dir="auto"
        />
      </div>

      {search.trim() && (
        <p className="text-sm text-gray-500">
          {displaySubs.length} نتيجة مطابقة / matching subsections
        </p>
      )}

      <div className="space-y-2">
        {displaySubs.length === 0 ? (
          <div className="text-center py-8 text-gray-400 bg-white border border-sand-dark rounded-xl">
            <p>لا توجد نتائج مطابقة في هذا القسم</p>
            <p className="text-xs mt-1">No matching subsections in this section</p>
          </div>
        ) : (
          displaySubs.map((sub, idx) => {
            const isExpanded = expandedSub === idx
            return (
              <div
                key={idx}
                className="bg-white border border-sand-dark rounded-xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => setExpandedSub(isExpanded ? null : idx)}
                  className="w-full flex items-center justify-between p-4 text-right hover:bg-sand/30 transition-colors"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`text-sm transition-transform ${isExpanded ? 'rotate-90' : ''}`}>▶</span>
                    <div className="min-w-0 text-right">
                      <span className="font-bold text-nile block truncate" dir="auto">
                        <HighlightText text={sub.title} query={search} />
                      </span>
                      <span className="text-xs text-gray-400 block truncate">
                        <HighlightText text={sub.titleEn} query={search} />
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-gray-300 shrink-0 mr-2">{idx + 1}</span>
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 pt-2 border-t border-gray-100">
                    <pre className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed bg-gray-50 rounded-lg p-4 overflow-x-auto font-[inherit]" dir="auto">
                      {sub.content}
                    </pre>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
