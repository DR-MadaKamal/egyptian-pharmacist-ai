function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function generateDDIQuestion(drugs) {
  const candidates = drugs.filter(d => d.drugInteractions.length > 0)
  if (candidates.length === 0) return null
  const drug = candidates[Math.floor(Math.random() * candidates.length)]
  const correct = drug.drugInteractions[Math.floor(Math.random() * drug.drugInteractions.length)]
  const correctDrug = drugs.find(d => d.id === correct.drugId)
  if (!correctDrug) return null

  const wrong = shuffle(drugs.filter(d =>
    d.id !== drug.id &&
    d.id !== correct.drugId &&
    !drug.drugInteractions.some(i => i.drugId === d.id)
  )).slice(0, 3)

  if (wrong.length < 3) return null

  const options = shuffle([
    { drug: correctDrug, correct: true, severity: correct.severity, description: correct.description },
    ...wrong.map(w => ({ drug: w, correct: false }))
  ])

  const interactionType = ['drug-drug'][Math.floor(Math.random() * 1)]
  return {
    type: interactionType,
    question: `ما هو الدواء الذي يتفاعل مع ${drug.nameAr} (${drug.nameEn})؟`,
    questionEn: `Which drug interacts with ${drug.nameEn} (${drug.nameAr})?`,
    drug,
    options,
    answer: correctDrug,
    severity: correct.severity,
    description: correct.description
  }
}

export function generateDDiseaseQ(drugs, diseases) {
  const candidates = drugs.filter(d => d.diseaseInteractions.length > 0)
  if (candidates.length === 0) return null
  const drug = candidates[Math.floor(Math.random() * candidates.length)]
  const correct = drug.diseaseInteractions[Math.floor(Math.random() * drug.diseaseInteractions.length)]
  const correctDisease = diseases.find(d => d.id === correct.diseaseId)
  if (!correctDisease) return null

  const wrong = shuffle(diseases.filter(d =>
    d.id !== correct.diseaseId &&
    !drug.diseaseInteractions.some(i => i.diseaseId === d.id)
  )).slice(0, 3)

  if (wrong.length < 3) return null

  const options = shuffle([
    { disease: correctDisease, correct: true, severity: correct.severity, description: correct.description },
    ...wrong.map(w => ({ disease: w, correct: false }))
  ])

  return {
    type: 'drug-disease',
    question: `ما المرض الذي يتعارض مع استخدام ${drug.nameAr} (${drug.nameEn})؟`,
    questionEn: `Which disease contraindicates ${drug.nameEn} (${drug.nameAr})?`,
    drug,
    options,
    answer: correctDisease,
    severity: correct.severity,
    description: correct.description
  }
}

export function generateQuestions(drugs, diseases, count = 10) {
  const questions = []
  const attempts = 0
  while (questions.length < count && attempts < count * 5) {
    const isDrug = Math.random() > 0.5
    const q = isDrug ? generateDDIQuestion(drugs) : generateDDiseaseQ(drugs, diseases)
    if (q) questions.push(q)
  }
  return shuffle(questions)
}

export function generateMixedQuestions(drugs, diseases, count = 10) {
  return generateQuestions(drugs, diseases, count)
}
