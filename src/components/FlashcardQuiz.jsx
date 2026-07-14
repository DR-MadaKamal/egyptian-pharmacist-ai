import { useState, useMemo, useCallback } from 'react'
import { FLASHCARD_CATEGORIES, FLASHCARDS } from '../data/flashcards.js'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const DIFFICULTY_CONFIG = {
  easy: { ar: 'سهل', en: 'Easy', color: 'bg-green-100 text-green-700', dot: 'bg-green-500' },
  medium: { ar: 'متوسط', en: 'Medium', color: 'bg-yellow-100 text-yellow-700', dot: 'bg-yellow-500' },
  hard: { ar: 'صعب', en: 'Hard', color: 'bg-red-100 text-red-700', dot: 'bg-red-500' },
}

export default function FlashcardQuiz({ onBack }) {
  const [phase, setPhase] = useState('setup')
  const [selectedCats, setSelectedCats] = useState(new Set(FLASHCARD_CATEGORIES.map(c => c.id)))
  const [selectedDiff, setSelectedDiff] = useState(new Set(['easy', 'medium', 'hard']))
  const [shuffleCards, setShuffleCards] = useState(true)
  const [cards, setCards] = useState([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [results, setResults] = useState([])

  const toggleCat = (id) => {
    setSelectedCats(prev => {
      const next = new Set(prev)
      if (next.has(id)) { if (next.size > 1) next.delete(id) }
      else next.add(id)
      return next
    })
  }

  const toggleDiff = (id) => {
    setSelectedDiff(prev => {
      const next = new Set(prev)
      if (next.has(id)) { if (next.size > 1) next.delete(id) }
      else next.add(id)
      return next
    })
  }

  const filteredCount = useMemo(() =>
    FLASHCARDS.filter(c => selectedCats.has(c.cat) && selectedDiff.has(c.difficulty)).length,
    [selectedCats, selectedDiff]
  )

  const startFlashcards = useCallback(() => {
    let pool = FLASHCARDS.filter(c => selectedCats.has(c.cat) && selectedDiff.has(c.difficulty))
    if (shuffleCards) pool = shuffle(pool)
    if (pool.length === 0) return
    setCards(pool)
    setCurrentIdx(0)
    setShowAnswer(false)
    setResults([])
    setPhase('cards')
  }, [selectedCats, selectedDiff, shuffleCards])

  const markResult = (known) => {
    setResults(prev => [...prev, { card: cards[currentIdx], known }])
    setShowAnswer(false)
    if (currentIdx + 1 < cards.length) {
      setCurrentIdx(i => i + 1)
    } else {
      setPhase('results')
    }
  }

  const jumpToCard = (idx) => {
    setCurrentIdx(idx)
    setShowAnswer(false)
    setPhase('cards')
  }

  if (phase === 'setup') {
    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        <div className="text-center py-4 md:py-6">
          <h2 className="text-3xl font-bold text-nile mb-2">🃏 بطاقات المراجعة / Flashcards</h2>
          <p className="text-gray-500">50 بطاقة م Coverage لـ 5 مواضيع صيدلانية / 50 cards across 5 pharmacy topics</p>
        </div>

        <div className="bg-white border border-sand-dark rounded-xl p-5">
          <label className="block font-bold text-nile mb-3">اختر التصنيفات / Categories</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {FLASHCARD_CATEGORIES.map(cat => {
              const count = FLASHCARDS.filter(c => c.cat === cat.id && selectedDiff.has(c.difficulty)).length
              const active = selectedCats.has(cat.id)
              return (
                <button key={cat.id} onClick={() => toggleCat(cat.id)}
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-right ${
                    active ? `${cat.color} text-white border-transparent` : 'border-sand-dark hover:border-gray-300 text-gray-600'
                  }`}>
                  <span className="text-2xl">{cat.icon}</span>
                  <div className="flex-1">
                    <div className="font-bold text-sm">{cat.ar}</div>
                    <div className={`text-xs ${active ? 'text-white/70' : 'text-gray-400'}`}>{cat.en} ({count})</div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        <div className="bg-white border border-sand-dark rounded-xl p-5">
          <label className="block font-bold text-nile mb-3">مستوى الصعوبة / Difficulty</label>
          <div className="flex gap-2">
            {Object.entries(DIFFICULTY_CONFIG).map(([key, cfg]) => (
              <button key={key} onClick={() => toggleDiff(key)}
                className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all border-2 ${
                  selectedDiff.has(key) ? `${cfg.color} border-transparent` : 'border-sand-dark text-gray-400'
                }`}>
                <span className={`inline-block w-2 h-2 rounded-full mr-1.5 ${cfg.dot}`}></span>
                {cfg.ar} / {cfg.en}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white border border-sand-dark rounded-xl p-4 flex items-center justify-between">
          <label className="font-bold text-nile text-sm">🔀 خلط عشوائي / Shuffle</label>
          <button onClick={() => setShuffleCards(s => !s)}
            className={`w-12 h-6 rounded-full transition-colors relative ${shuffleCards ? 'bg-nile' : 'bg-gray-300'}`}>
            <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${shuffleCards ? 'left-[26px]' : 'left-0.5'}`} />
          </button>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-500 mb-3">{filteredCount} بطاقة جاهزة / cards ready</p>
          <button onClick={startFlashcards} disabled={filteredCount === 0}
            className="bg-gold text-nile px-8 py-3 rounded-xl font-bold text-lg hover:bg-gold-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            🃏 ابدأ المراجعة / Start Review
          </button>
        </div>
      </div>
    )
  }

  if (phase === 'cards') {
    const card = cards[currentIdx]
    const cat = FLASHCARD_CATEGORIES.find(c => c.id === card.cat)
    const diff = DIFFICULTY_CONFIG[card.difficulty]
    const progress = ((currentIdx + (showAnswer ? 1 : 0)) / cards.length) * 100

    return (
      <div className="space-y-4 max-w-2xl mx-auto">
        {/* Progress bar */}
        <div className="bg-gray-100 rounded-full h-2">
          <div className="bg-gold h-2 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">{currentIdx + 1} / {cards.length}</span>
          <span className="text-gray-400 text-xs">{cat?.icon} {cat?.ar}</span>
        </div>

        {/* Flashcard */}
        <div className={`bg-white border-2 rounded-2xl overflow-hidden transition-all duration-300 ${
          showAnswer ? 'border-green-400 shadow-lg shadow-green-50' : 'border-sand-dark shadow-md'
        }`}>
          {/* Question side */}
          <div className="p-5 md:p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${diff.color}`}>{diff.ar}</span>
              <span className="text-xs text-gray-400">💡 {card.hint}</span>
            </div>
            <p className="text-lg md:text-xl font-bold text-nile text-right leading-relaxed" dir="auto">{card.q}</p>
            <p className="text-sm text-gray-500 text-right mt-1" dir="auto">{card.qEn}</p>
          </div>

          {/* Answer (revealed) */}
          {showAnswer && (
            <div className="border-t border-green-100 bg-green-50/50 p-5 md:p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-green-600 text-sm font-bold">✅ الإجابة / Answer</span>
              </div>
              <p className="text-right text-nile leading-relaxed text-sm md:text-base" dir="auto">{card.a}</p>
              <p className="text-right text-gray-500 mt-2 text-xs md:text-sm leading-relaxed" dir="auto">{card.aEn}</p>
            </div>
          )}
        </div>

        {/* Action buttons */}
        {!showAnswer ? (
          <button onClick={() => setShowAnswer(true)}
            className="w-full bg-nile text-white py-3.5 rounded-xl font-bold text-lg hover:bg-nile-light transition-colors">
            👁 أظهر الإجابة / Show Answer
          </button>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => markResult(false)}
              className="bg-red-500 text-white py-3.5 rounded-xl font-bold hover:bg-red-600 transition-colors">
              ❌ لم أعرف / Didn't Know
            </button>
            <button onClick={() => markResult(true)}
              className="bg-green-500 text-white py-3.5 rounded-xl font-bold hover:bg-green-600 transition-colors">
              ✅ عرفتها / Knew It
            </button>
          </div>
        )}

        {/* Card index navigation */}
        <div className="flex flex-wrap gap-1 justify-center">
          {cards.map((c, i) => {
            const r = results[i]
            let bg = 'bg-gray-200'
            if (r) bg = r.known ? 'bg-green-400' : 'bg-red-400'
            if (i === currentIdx) bg += ' ring-2 ring-nile ring-offset-1'
            return (
              <button key={c.id} onClick={() => jumpToCard(i)}
                className={`w-3 h-3 rounded-full transition-all ${bg}`} />
            )
          })}
        </div>
      </div>
    )
  }

  // Results phase
  const known = results.filter(r => r.known).length
  const unknown = results.length - known
  const pct = results.length > 0 ? Math.round((known / results.length) * 100) : 0
  const gradeEmoji = pct >= 90 ? '🌟' : pct >= 75 ? '🎉' : pct >= 60 ? '👍' : pct >= 40 ? '📚' : '💪'
  const gradeAr = pct >= 90 ? 'ممتاز' : pct >= 75 ? 'جيد جداً' : pct >= 60 ? 'جيد' : pct >= 40 ? 'مقبول' : 'يحتاج مراجعة'

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="text-center bg-white border border-sand-dark rounded-xl p-6 md:p-8">
        <div className="text-6xl mb-3">{gradeEmoji}</div>
        <h2 className="text-2xl font-bold text-nile mb-1">نتيجة المراجعة / Review Results</h2>
        <p className="text-gray-500 mb-4">{gradeAr}</p>

        <div className="text-5xl font-bold text-nile mb-2">{pct}%</div>
        <div className="text-gray-500 mb-6">
          {known} / {results.length} بطاقات مُتقنة
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-green-50 rounded-xl p-3">
            <div className="text-2xl font-bold text-green-700">{known}</div>
            <div className="text-sm text-green-600">عرفتها / Knew</div>
          </div>
          <div className="bg-red-50 rounded-xl p-3">
            <div className="text-2xl font-bold text-red-700">{unknown}</div>
            <div className="text-sm text-red-600">لم أعرف / Didn't Know</div>
          </div>
        </div>

        {/* Breakdown by category */}
        {(() => {
          const byCat = {}
          results.forEach(r => {
            const cid = r.card.cat
            if (!byCat[cid]) byCat[cid] = { total: 0, known: 0 }
            byCat[cid].total++
            if (r.known) byCat[cid].known++
          })
          return (
            <div className="mb-6">
              <p className="text-sm font-bold text-gray-500 mb-2">📊 حسب التصنيف / By Category</p>
              <div className="space-y-2">
                {Object.entries(byCat).map(([cid, { total, known: k }]) => {
                  const cat = FLASHCARD_CATEGORIES.find(c => c.id === cid)
                  const p = Math.round((k / total) * 100)
                  return (
                    <div key={cid} className="flex items-center gap-3 text-sm">
                      <span className="text-lg">{cat?.icon}</span>
                      <span className="flex-1 text-right font-medium text-nile">{cat?.ar}</span>
                      <span className="text-gray-400">{k}/{total}</span>
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div className={`h-2 rounded-full ${p >= 70 ? 'bg-green-500' : p >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                          style={{ width: `${p}%` }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })()}

        {/* Unknown cards review */}
        {unknown > 0 && (
          <div className="mb-6 text-right">
            <p className="text-sm font-bold text-gray-500 mb-2">🔄 بطاقات تحتاج مراجعة / Cards to Review</p>
            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {results.filter(r => !r.known).map((r, i) => (
                <button key={i} onClick={() => jumpToCard(cards.indexOf(r.card))}
                  className="w-full text-right text-sm p-2 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition-colors flex items-center justify-between">
                  <span className="text-xs text-red-400">{FLASHCARD_CATEGORIES.find(c => c.id === r.card.cat)?.icon}</span>
                  <span className="flex-1 mr-2">{r.card.q}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button onClick={() => { setPhase('setup'); setResults([]) }}
            className="flex-1 bg-sand text-nile py-3 rounded-xl font-bold hover:bg-sand-dark transition-colors">
            🔄 إعادة / Retry
          </button>
          {onBack && (
            <button onClick={onBack}
              className="flex-1 bg-nile text-white py-3 rounded-xl font-bold hover:bg-nile-light transition-colors">
              🏠 القائمة / Menu
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
