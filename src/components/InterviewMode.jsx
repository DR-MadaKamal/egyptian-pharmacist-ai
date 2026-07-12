import { useState, useMemo, useCallback } from 'react'
import { severityConfig } from '../utils/interactions.js'
import { generateMixedQuestions } from '../utils/quiz.js'

function QuestionCard({ question, index, total, onAnswer, answered }) {
  return (
    <div className="bg-white border border-sand-dark rounded-xl p-4 md:p-6">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-gray-400">سؤال {index + 1} / {total}</span>
        <span className="bg-nile text-white text-xs px-2 py-1 rounded">
          {question.type === 'drug-drug' ? 'تفاعل دوائي' : 'تفاعل مرضي'}
        </span>
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

export default function InterviewMode({ drugs, diseases }) {
  const [phase, setPhase] = useState('setup')
  const [questionCount, setQuestionCount] = useState(10)
  const [questions, setQuestions] = useState([])
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState([])
  const [answered, setAnswered] = useState(null)

  const enoughData = drugs.filter(d => d.drugInteractions.length > 0).length > 1

  const startInterview = useCallback(() => {
    const qs = generateMixedQuestions(drugs, diseases, questionCount)
    if (qs.length === 0) return
    setQuestions(qs)
    setCurrent(0)
    setAnswers([])
    setAnswered(null)
    setPhase('quiz')
  }, [drugs, diseases, questionCount])

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

  if (phase === 'setup') {
    return (
      <div className="space-y-6">
        <div className="text-center py-6 md:py-10">
          <h2 className="text-3xl font-bold text-nile mb-2">🎓 المقابلة / Interview Mode</h2>
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
        <div className="text-center text-sm text-gray-500">
          التقدم: {answered ? current + 1 : current} / {questions.length}
        </div>

        <QuestionCard
          question={question}
          index={current}
          total={questions.length}
          onAnswer={handleAnswer}
          answered={answered}
        />

        {answered && (
          <button onClick={nextQuestion}
            className="w-full bg-nile text-white py-3 rounded-xl font-bold hover:bg-nile-light transition-colors">
            {current + 1 < questions.length ? '→ السؤال التالي / Next Question' : '📊 عرض النتائج / View Results'}
          </button>
        )}
      </div>
    )
  }

  const grade = percentage >= 90 ? 'ممتاز / Excellent' : percentage >= 75 ? 'جيد جداً / Very Good' : percentage >= 60 ? 'جيد / Good' : percentage >= 40 ? 'مقبول / Fair' : 'ضعيف / Needs Improvement'
  const gradeEmoji = percentage >= 90 ? '🌟' : percentage >= 75 ? '🎉' : percentage >= 60 ? '👍' : percentage >= 40 ? '📚' : '💪'

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

        <div className="space-y-2 mb-6 text-right">
          {answers.map((a, i) => (
            <div key={i} className={`text-sm p-2 rounded-lg ${a.correct ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              <span>{a.correct ? '✅' : '❌'}</span>
              {' '}
              {a.question.drug.nameAr}: {a.correct
                ? (a.question.answer.nameAr || a.question.answer.nameEn)
                : `❌ ${a.selected.drug?.nameAr || a.selected.disease?.nameAr || ''} ← ✓ ${a.question.answer.nameAr || a.question.answer.nameEn}`
              }
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button onClick={() => setPhase('setup')}
            className="flex-1 bg-sand text-nile py-3 rounded-xl font-bold hover:bg-sand-dark transition-colors">
            🔄 إعادة / Retry
          </button>
          <button onClick={() => setPhase('setup')}
            className="flex-1 bg-nile text-white py-3 rounded-xl font-bold hover:bg-nile-light transition-colors">
            🏠 القائمة الرئيسية / Main Menu
          </button>
        </div>
      </div>
    </div>
  )
}
