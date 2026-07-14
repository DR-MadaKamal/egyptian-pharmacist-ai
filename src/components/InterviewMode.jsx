import { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import { severityConfig } from '../utils/interactions.js'
import { generateMixedQuestions } from '../utils/quiz.js'
import FlashcardQuiz from './FlashcardQuiz.jsx'
import LearningMode from './LearningMode.jsx'
import DrugEncyclopedia from './DrugEncyclopedia.jsx'
import InsulinGuide from './InsulinGuide.jsx'
import { FLASHCARD_CATEGORIES, FLASHCARDS, GOLDEN_TIPS } from '../data/flashcards.js'

function QuestionCard({ question, index, total, onAnswer, answered, onSkip }) {
  const severityColors = { contraindicated: 'bg-red-600', severe: 'bg-orange-500', moderate: 'bg-yellow-500', mild: 'bg-blue-500' }
  const severityAr = { contraindicated: 'ممنوع', severe: 'شديد', moderate: 'متوسط', mild: 'خفيف' }
  return (
    <div className="bg-white border border-sand-dark rounded-xl p-4 md:p-6">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-gray-400">سؤال {index + 1} / {total}</span>
        <div className="flex items-center gap-2">
          {question.severity && (
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full text-white ${severityColors[question.severity] || 'bg-gray-500'}`}>
              {severityAr[question.severity] || question.severity}
            </span>
          )}
          <span className="bg-nile text-white text-xs px-2 py-1 rounded">
            {question.type === 'drug-drug' ? 'تفاعل دوائي' : 'تفاعل مرضي'}
          </span>
        </div>
      </div>

      <div className="text-right mb-4">
        <p className="text-lg font-bold text-nile">{question.question}</p>
        <p className="text-sm text-gray-500">{question.questionEn}</p>
      </div>

      <div className="space-y-2">
        {question.options.map((opt, i) => {
          const drugName = opt.drug ? `${opt.drug.nameAr} (${opt.drug.nameEn})` : null
          const diseaseName = opt.disease ? `${opt.disease.nameAr} (${opt.disease.nameEn})` : null
          const label = drugName || diseaseName

          let btnStyle = 'border-sand-dark hover:border-gold hover:bg-gold/5'
          let rightSide = null

          if (answered) {
            if (opt.correct) {
              btnStyle = 'border-green-500 bg-green-50'
              rightSide = <span className="text-green-600 text-sm font-bold">✓ صحيح</span>
            } else if (answered === opt) {
              btnStyle = 'border-red-400 bg-red-50'
              rightSide = <span className="text-red-500 text-sm font-bold">✗</span>
            }
          }

          return (
            <button
              key={i}
              onClick={() => !answered && onAnswer(opt)}
              disabled={!!answered}
              className={`w-full text-right border-2 rounded-xl p-3 transition-all disabled:cursor-default flex items-center justify-between gap-2 ${btnStyle}`}
            >
              <span className="text-sm text-gray-500">{String.fromCharCode(65 + i)}.</span>
              <span className="flex-1 font-bold text-nile text-sm md:text-base">{label}</span>
              {rightSide}
            </button>
          )
        })}
      </div>

      {answered && (
        <div className={`mt-4 p-3 rounded-lg ${answered.correct ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <div className="flex items-center gap-2 mb-1">
            <span>{answered.correct ? '✅' : '❌'}</span>
            <span className={`font-bold ${answered.correct ? 'text-green-700' : 'text-red-700'}`}>
              {answered.correct ? 'إجابة صحيحة!' : 'إجابة خاطئة'}
            </span>
            {question.severity && (
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full text-white ${severityConfig[question.severity]?.color}`}>
                {question.severity}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600 mt-1">{question.description}</p>
          {!answered.correct && (
            <p className="text-xs text-gray-500 mt-1">
              الإجابة الصحيحة: {question.answer.nameAr} ({question.answer.nameEn})
            </p>
          )}
        </div>
      )}
    </div>
  )
}

function KnowledgeBank({ onBack }) {
  const [expandedId, setExpandedId] = useState(null)
  const [filterCat, setFilterCat] = useState('all')
  const [filterDiff, setFilterDiff] = useState('all')
  const [searchQ, setSearchQ] = useState('')

  const filtered = useMemo(() => {
    let cards = FLASHCARDS
    if (filterCat !== 'all') cards = cards.filter(c => c.cat === filterCat)
    if (filterDiff !== 'all') cards = cards.filter(c => c.difficulty === filterDiff)
    if (searchQ.trim()) {
      const q = searchQ.trim().toLowerCase()
      cards = cards.filter(c =>
        c.q.toLowerCase().includes(q) || c.qEn.toLowerCase().includes(q) ||
        c.a.toLowerCase().includes(q) || c.aEn.toLowerCase().includes(q)
      )
    }
    return cards
  }, [filterCat, filterDiff, searchQ])

  const diffConfig = { easy: { ar: 'سهل', color: 'bg-green-100 text-green-700' }, medium: { ar: 'متوسط', color: 'bg-yellow-100 text-yellow-700' }, hard: { ar: 'صعب', color: 'bg-red-100 text-red-700' } }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-nile">📖 بنك الأسئلة / Question Bank</h2>
        <button onClick={onBack} className="text-sm bg-gray-100 text-gray-500 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors">← العودة / Back</button>
      </div>

      <div className="bg-white border border-sand-dark rounded-xl p-4 space-y-3">
        <input type="text" value={searchQ} onChange={e => setSearchQ(e.target.value)}
          placeholder="🔍 ابحث في الأسئلة والإجابات... / Search questions & answers..."
          className="w-full px-4 py-2 border border-sand-dark rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold" dir="auto" />

        <div className="flex flex-wrap gap-2">
          <button onClick={() => setFilterCat('all')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${filterCat === 'all' ? 'bg-nile text-white' : 'bg-sand text-nile hover:bg-sand-dark'}`}>
            الكل ({FLASHCARDS.length})
          </button>
          {FLASHCARD_CATEGORIES.map(cat => {
            const count = FLASHCARDS.filter(c => c.cat === cat.id).length
            return (
              <button key={cat.id} onClick={() => setFilterCat(cat.id)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${filterCat === cat.id ? `${cat.color} text-white` : 'bg-sand text-nile hover:bg-sand-dark'}`}>
                {cat.icon} {cat.ar} ({count})
              </button>
            )
          })}
        </div>

        <div className="flex gap-2">
          {['all', 'easy', 'medium', 'hard'].map(d => (
            <button key={d} onClick={() => setFilterDiff(d)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                filterDiff === d ? (d === 'all' ? 'bg-gray-600 text-white' : diffConfig[d]?.color.replace('100', '600').replace('text-', 'text-white ')) : 'bg-sand text-nile hover:bg-sand-dark'
              }`}>
              {d === 'all' ? 'كل المستويات' : diffConfig[d]?.ar}
            </button>
          ))}
        </div>
      </div>

      <p className="text-sm text-gray-500">{filtered.length} سؤال / questions</p>

      <div className="space-y-3">
        {filtered.map(card => {
          const cat = FLASHCARD_CATEGORIES.find(c => c.id === card.cat)
          const diff = diffConfig[card.difficulty]
          const isExpanded = expandedId === card.id
          return (
            <div key={card.id} className="bg-white border border-sand-dark rounded-xl overflow-hidden">
              <button onClick={() => setExpandedId(isExpanded ? null : card.id)}
                className="w-full text-right p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors">
                <span className="text-xl shrink-0 mt-0.5">{cat?.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-nile text-sm md:text-base leading-relaxed">{card.q}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{card.qEn}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${diff?.color}`}>{diff?.ar}</span>
                    <span className="text-[10px] text-gray-400">{cat?.ar}</span>
                    <span className="text-[10px] text-gold-dark italic">💡 {card.hint}</span>
                  </div>
                </div>
                <span className={`text-gray-400 text-lg transition-transform shrink-0 ${isExpanded ? 'rotate-180' : ''}`}>▼</span>
              </button>
              {isExpanded && (
                <div className="border-t border-gray-100 bg-green-50/50 p-4 space-y-2">
                  <div className="text-right">
                    <p className="text-sm font-bold text-green-700 mb-1">✅ الإجابة بالعربي:</p>
                    <p className="text-sm text-nile leading-relaxed">{card.a}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-green-600 mb-1">English Answer:</p>
                    <p className="text-xs text-gray-600 leading-relaxed">{card.aEn}</p>
                  </div>
                </div>
              )}
            </div>
          )
        })}
        {filtered.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <p className="text-lg">🔍 لا توجد نتائج / No results</p>
          </div>
        )}
      </div>

      {GOLDEN_TIPS.length > 0 && (
        <div className="mt-8 space-y-3">
          <h3 className="text-lg font-bold text-nile">💡 نصائح ذهبية لمقابلات السلاسل / Golden Tips for Chain Interviews</h3>
          {GOLDEN_TIPS.map(tip => (
            <div key={tip.id} className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{tip.icon}</span>
                <span className="font-bold text-amber-800 text-sm">{tip.title}</span>
                <span className="text-xs text-amber-600">/ {tip.titleEn}</span>
              </div>
              <p className="text-sm text-amber-900 leading-relaxed">{tip.content}</p>
              <p className="text-xs text-amber-700 mt-1 leading-relaxed">{tip.contentEn}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function InterviewMode({ drugs, diseases, onViewDrug }) {
  const [mode, setMode] = useState(null)
  const [phase, setPhase] = useState('setup')
  const [questionCount, setQuestionCount] = useState(10)
  const [questions, setQuestions] = useState([])
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState([])
  const [answered, setAnswered] = useState(null)
  const [timeLeft, setTimeLeft] = useState(null)
  const timerRef = useRef(null)

  const enoughData = drugs.filter(d => (d.drugInteractions || []).length > 0).length > 1

  const startInterview = useCallback(() => {
    const qs = generateMixedQuestions(drugs, diseases, questionCount)
    if (qs.length === 0) return
    setQuestions(qs)
    setCurrent(0)
    setAnswers([])
    setAnswered(null)
    setTimeLeft(questionCount * 30)
    setPhase('quiz')
  }, [drugs, diseases, questionCount])

  useEffect(() => {
    if (phase !== 'quiz' || timeLeft === null || timeLeft <= 0) {
      if (timeLeft === 0) setPhase('results')
      return
    }
    timerRef.current = setTimeout(() => setTimeLeft(t => t - 1), 1000)
    return () => clearTimeout(timerRef.current)
  }, [phase, timeLeft])

  const formatTime = (s) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  const handleAnswer = (opt) => {
    setAnswered(opt)
    setAnswers(prev => [...prev, { question: questions[current], selected: opt, correct: opt.correct }])
  }

  const nextQuestion = () => {
    if (current + 1 < questions.length) {
      setCurrent(c => c + 1)
      setAnswered(null)
    } else {
      setPhase('results')
    }
  }

  const correctCount = answers.filter(a => a.correct).length
  const percentage = answers.length > 0 ? Math.round((correctCount / answers.length) * 100) : 0

  if (!mode) {
    return (
      <div className="space-y-6">
        <div className="text-center py-6 md:py-10">
          <h2 className="text-3xl font-bold text-nile mb-2">🎓 المقابلة / Interview Mode</h2>
          <p className="text-gray-500">اختر طريقة التدريب / Choose your training mode</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <button onClick={() => setMode('quiz')}
            className="bg-white border-2 border-sand-dark hover:border-gold rounded-xl p-6 text-center transition-all hover:shadow-lg group">
            <div className="text-4xl mb-3">📝</div>
            <h3 className="font-bold text-nile text-lg group-hover:text-gold-dark transition-colors">اختبار تفاعلي</h3>
            <p className="text-sm text-gray-500 mt-1">Interactive Quiz</p>
            <p className="text-xs text-gray-400 mt-2">أسئلة اختيار من متعدد مع تقييم وtimer</p>
            <p className="text-xs text-gray-400">Multiple choice with scoring & timer</p>
          </button>
          <button onClick={() => setMode('flashcards')}
            className="bg-white border-2 border-sand-dark hover:border-gold rounded-xl p-6 text-center transition-all hover:shadow-lg group">
            <div className="text-4xl mb-3">🃏</div>
            <h3 className="font-bold text-nile text-lg group-hover:text-gold-dark transition-colors">بطاقات مراجعة</h3>
            <p className="text-sm text-gray-500 mt-1">Flashcards</p>
            <p className="text-xs text-gray-400 mt-2">{FLASHCARDS.length} بطاقة في {FLASHCARD_CATEGORIES.length} مواضيع</p>
            <p className="text-xs text-gray-400">{FLASHCARDS.length} cards across {FLASHCARD_CATEGORIES.length} topics</p>
          </button>
          <button onClick={() => setMode('browse')}
            className="bg-white border-2 border-sand-dark hover:border-gold rounded-xl p-6 text-center transition-all hover:shadow-lg group">
            <div className="text-4xl mb-3">📖</div>
            <h3 className="font-bold text-nile text-lg group-hover:text-gold-dark transition-colors">بنك الأسئلة</h3>
            <p className="text-sm text-gray-500 mt-1">Question Bank</p>
            <p className="text-xs text-gray-400 mt-2">تصفح كل الأسئلة والإجابات كمرجع</p>
            <p className="text-xs text-gray-400">Browse all Q&A as a reference</p>
          </button>
          <button onClick={() => setMode('learning')}
            className="bg-white border-2 border-sand-dark hover:border-gold rounded-xl p-6 text-center transition-all hover:shadow-lg group">
            <div className="text-4xl mb-3">📚</div>
            <h3 className="font-bold text-nile text-lg group-hover:text-gold-dark transition-colors">المكتبة التعليمية</h3>
            <p className="text-sm text-gray-500 mt-1">Learning Library</p>
            <p className="text-xs text-gray-400 mt-2">مرجع شامل من 35 مصدر صيدلاني</p>
            <p className="text-xs text-gray-400">Comprehensive reference from 35 pharmacy sources</p>
          </button>
          <button onClick={() => setMode('encyclopedia')}
            className="bg-white border-2 border-sand-dark hover:border-gold rounded-xl p-6 text-center transition-all hover:shadow-lg group">
            <div className="text-4xl mb-3">🏥</div>
            <h3 className="font-bold text-nile text-lg group-hover:text-gold-dark transition-colors">دليل الأدوية المصري</h3>
            <p className="text-sm text-gray-500 mt-1">Drug Encyclopedia</p>
            <p className="text-xs text-gray-400 mt-2">25,070 دواء مسجل في مصر مع الأسعار</p>
            <p className="text-xs text-gray-400">25,070 registered Egyptian medicines with prices</p>
          </button>
          <button onClick={() => setMode('insulin')}
            className="bg-white border-2 border-sand-dark hover:border-gold rounded-xl p-6 text-center transition-all hover:shadow-lg group">
            <div className="text-4xl mb-3">💉</div>
            <h3 className="font-bold text-nile text-lg group-hover:text-gold-dark transition-colors">دليل الإنسولين</h3>
            <p className="text-sm text-gray-500 mt-1">Insulin Guide</p>
            <p className="text-xs text-gray-400 mt-2">15 إنسولين في 5 فئات مع معلومات شاملة</p>
            <p className="text-xs text-gray-400">15 insulins in 5 categories with full details</p>
          </button>
        </div>
      </div>
    )
  }

  if (mode === 'flashcards') {
    return <FlashcardQuiz onBack={() => setMode(null)} />
  }

  if (mode === 'browse') {
    return <KnowledgeBank onBack={() => setMode(null)} />
  }

  if (mode === 'learning') {
    return <LearningMode onBack={() => setMode(null)} />
  }

  if (mode === 'encyclopedia') {
    return <DrugEncyclopedia onBack={() => setMode(null)} onViewDrug={onViewDrug} allDrugs={drugs} />
  }

  if (mode === 'insulin') {
    return <InsulinGuide onBack={() => setMode(null)} />
  }

  if (phase === 'setup') {
    return (
      <div className="space-y-6">
        <div className="text-center py-6 md:py-10">
          <h2 className="text-3xl font-bold text-nile mb-2">📝 اختبار تفاعلي / Interactive Quiz</h2>
          <p className="text-gray-500">اختبر معرفتك في التفاعلات الدوائية / Test your knowledge of drug interactions</p>
        </div>

        {!enoughData && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-yellow-800 text-sm">
            ⚠️ البيانات غير كافية لإنشاء أسئلة. أضف المزيد من الأدوية مع التفاعلات.
          </div>
        )}

        <div className="bg-white border border-sand-dark rounded-xl p-6 max-w-md mx-auto">
          <label className="block font-bold text-nile mb-3 text-lg">عدد الأسئلة / Number of Questions</label>
          <div className="flex gap-2 mb-6">
            {[5, 10, 15, 20].map(n => (
              <button key={n} onClick={() => setQuestionCount(n)}
                className={`flex-1 py-2 rounded-lg font-bold text-sm transition-colors ${
                  questionCount === n ? 'bg-nile text-white' : 'bg-sand text-nile hover:bg-sand-dark'
                }`}>{n}</button>
            ))}
          </div>

          <div className="space-y-2 text-sm text-gray-600 mb-6">
            <p>📝 أسئلة تفاعل دواء-دواء و دواء-مرض</p>
            <p>🔀 ترتيب عشوائي للأسئلة والخيارات</p>
            <p>📊 تقييم كامل في النهاية</p>
          </div>

          <button onClick={startInterview} disabled={!enoughData}
            className="w-full bg-gold text-nile py-3 rounded-xl font-bold text-lg hover:bg-gold-light transition-colors disabled:opacity-50">
            🎯 ابدأ المقابلة / Start Interview
          </button>
          <button onClick={() => setMode(null)}
            className="w-full mt-2 bg-gray-100 text-gray-500 py-2 rounded-xl font-medium text-sm hover:bg-gray-200 transition-colors">
            ← العودة / Back
          </button>
        </div>
      </div>
    )
  }

  if (phase === 'quiz') {
    if (questions.length === 0) {
      return <div className="text-center py-12 text-gray-500">لا توجد أسئلة كافية / Not enough questions</div>
    }

    const question = questions[current]
    return (
      <div className="space-y-4 max-w-2xl mx-auto">
        <div className="bg-gray-100 rounded-full h-2">
          <div className="bg-gold h-2 rounded-full transition-all duration-300"
            style={{ width: `${(answered ? current + 1 : current) / questions.length * 100}%` }} />
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">التقدم: {answered ? current + 1 : current} / {questions.length}</span>
          {timeLeft !== null && (
            <span className={`font-mono font-bold ${timeLeft < 30 ? 'text-red-500 animate-pulse' : 'text-gray-500'}`}>
              ⏱ {formatTime(timeLeft)}
            </span>
          )}
        </div>

        <QuestionCard
          question={question}
          index={current}
          total={questions.length}
          onAnswer={handleAnswer}
          answered={answered}
        />

        {answered ? (
          <button onClick={nextQuestion}
            className="w-full bg-nile text-white py-3 rounded-xl font-bold hover:bg-nile-light transition-colors">
            {current + 1 < questions.length ? '→ السؤال التالي / Next Question' : '📊 عرض النتائج / View Results'}
          </button>
        ) : (
          <button onClick={() => { setAnswers(prev => [...prev, { question, selected: null, correct: false, skipped: true }]); setCurrent(c => c + 1) }}
            className="w-full bg-gray-100 text-gray-500 py-2 rounded-xl font-medium text-sm hover:bg-gray-200 transition-colors">
            ⏭ تخطي / Skip
          </button>
        )}
      </div>
    )
  }

  const [reviewIndex, setReviewIndex] = useState(null)

  const grade = percentage >= 90 ? 'ممتاز / Excellent' : percentage >= 75 ? 'جيد جداً / Very Good' : percentage >= 60 ? 'جيد / Good' : percentage >= 40 ? 'مقبول / Fair' : 'ضعيف / Needs Improvement'
  const gradeEmoji = percentage >= 90 ? '🌟' : percentage >= 75 ? '🎉' : percentage >= 60 ? '👍' : percentage >= 40 ? '📚' : '💪'

  if (reviewIndex !== null) {
    const r = answers[reviewIndex]
    const q = r?.question
    if (!q) return null
    const correctOpt = q.options.find(o => o.correct)
    return (
      <div className="space-y-4 max-w-2xl mx-auto">
        <QuestionCard question={q} index={reviewIndex} total={answers.length} onAnswer={() => {}} answered={r.selected && r} />
        {(!r.correct || r.skipped) && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-sm text-green-700">
            {r.skipped ? '⏭ تم التخطي — ' : ''}الإجابة الصحيحة: {correctOpt?.drug?.nameAr || correctOpt?.disease?.nameAr} ({correctOpt?.drug?.nameEn || correctOpt?.disease?.nameEn})
          </div>
        )}
        <div className="flex gap-2">
          {reviewIndex > 0 && (
            <button onClick={() => setReviewIndex(i => i - 1)} className="flex-1 bg-sand text-nile py-2 rounded-xl font-bold hover:bg-sand-dark transition-colors">← السابق / Previous</button>
          )}
          {reviewIndex < answers.length - 1 ? (
            <button onClick={() => setReviewIndex(i => i + 1)} className="flex-1 bg-nile text-white py-2 rounded-xl font-bold hover:bg-nile-light transition-colors">التالي / Next →</button>
          ) : (
            <button onClick={() => setReviewIndex(null)} className="flex-1 bg-nile text-white py-2 rounded-xl font-bold hover:bg-nile-light transition-colors">📊 العودة للنتائج / Back to Results</button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="text-center bg-white border border-sand-dark rounded-xl p-6 md:p-8">
        <div className="text-6xl mb-3">{gradeEmoji}</div>
        <h2 className="text-2xl font-bold text-nile mb-1">النتيجة / Results</h2>
        <p className="text-gray-500 mb-4">{grade}</p>

        <div className="text-5xl font-bold text-nile mb-2">{percentage}%</div>
        <div className="text-gray-500 mb-6">
          {correctCount} / {answers.length} إجابة صحيحة
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-green-50 rounded-xl p-3">
            <div className="text-2xl font-bold text-green-700">{correctCount}</div>
            <div className="text-sm text-green-600">صحيح / Correct</div>
          </div>
          <div className="bg-red-50 rounded-xl p-3">
            <div className="text-2xl font-bold text-red-700">{answers.length - correctCount}</div>
            <div className="text-sm text-red-600">خطأ / Wrong</div>
          </div>
        </div>

        {timeLeft !== null && timeLeft > 0 && (
          <p className="text-xs text-gray-400 mb-4">الوقت المستغرق: {formatTime(questionCount * 30 - timeLeft)}</p>
        )}

        {/* Knowledge gap heatmap */}
        {(() => {
          const bySeverity = {}
          answers.forEach(a => {
            const sev = a.question.severity || 'unknown'
            if (!bySeverity[sev]) bySeverity[sev] = { total: 0, correct: 0 }
            bySeverity[sev].total++
            if (a.correct) bySeverity[sev].correct++
          })
          const heatColors = { contraindicated: 'bg-red-100 text-red-800', severe: 'bg-orange-100 text-orange-800', moderate: 'bg-yellow-100 text-yellow-800', mild: 'bg-blue-100 text-blue-800' }
          const heatLabels = { contraindicated: 'ممنوع / CI', severe: 'شديد / Severe', moderate: 'متوسط / Moderate', mild: 'خفيف / Mild' }
          return Object.keys(bySeverity).length > 0 && (
            <div className="mb-6">
              <p className="text-sm font-bold text-gray-500 mb-2">📊 فجوات المعرفة حسب الشدة / Knowledge Gaps by Severity</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {Object.entries(bySeverity).map(([sev, { total, correct }]) => {
                  const pct = Math.round((correct / total) * 100)
                  return (
                    <div key={sev} className={`rounded-xl p-3 text-center ${heatColors[sev] || 'bg-gray-100 text-gray-700'}`}>
                      <div className="text-lg font-bold">{pct}%</div>
                      <div className="text-xs">{heatLabels[sev] || sev}</div>
                      <div className="text-[10px] opacity-70">{correct}/{total}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })()}

        <div className="space-y-2 mb-6 text-right">
          {answers.map((a, i) => (
            <button key={i} onClick={() => setReviewIndex(i)}
              className={`w-full text-right text-sm p-2 rounded-lg cursor-pointer hover:opacity-80 transition-opacity ${a.correct ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              <span>{a.correct ? '✅' : a.skipped ? '⏭️' : '❌'}</span>
              {' '}
              {a.question.drug.nameAr}: {a.correct
                ? (a.question.answer.nameAr || a.question.answer.nameEn)
                : a.skipped
                  ? `⏭ تم التخطي ← ${a.question.answer.nameAr || a.question.answer.nameEn}`
                  : `❌ ${a.selected?.drug?.nameAr || a.selected?.disease?.nameAr || ''} ← ${a.question.answer.nameAr || a.question.answer.nameEn}`
              }
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <button onClick={() => { setPhase('setup'); setReviewIndex(null) }}
            className="flex-1 bg-sand text-nile py-3 rounded-xl font-bold hover:bg-sand-dark transition-colors">
            🔄 إعادة / Retry
          </button>
          <button onClick={() => { setPhase('setup'); setMode(null); setReviewIndex(null) }}
            className="flex-1 bg-nile text-white py-3 rounded-xl font-bold hover:bg-nile-light transition-colors">
            🏠 القائمة الرئيسية / Main Menu
          </button>
        </div>
      </div>
    </div>
  )
}
