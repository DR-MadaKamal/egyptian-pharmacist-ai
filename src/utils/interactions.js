const severityOrder = { contraindicated: 4, severe: 3, moderate: 2, minor: 1 }

export const severityConfig = {
  contraindicated: {
    label: 'ممنوع / Contraindicated',
    color: 'bg-[#8E0000]',
    light: 'bg-red-950/20 text-red-800',
    emoji: '🚫'
  },
  severe: {
    label: 'شديد / Severe',
    color: 'bg-red-700',
    light: 'bg-red-100 text-red-800',
    emoji: '🔴'
  },
  moderate: {
    label: 'متوسط / Moderate',
    color: 'bg-orange-600',
    light: 'bg-orange-100 text-orange-800',
    emoji: '🟠'
  },
  minor: {
    label: 'بسيط / Minor',
    color: 'bg-yellow-600',
    light: 'bg-yellow-100 text-yellow-800',
    emoji: '🟡'
  }
}

export function getDrugById(drugs, id) {
  return drugs.find(d => d.id === id)
}

export function getDiseaseById(diseases, id) {
  return diseases.find(d => d.id === id)
}

export function getDrugInteractions(drugs, drugId) {
  const drug = getDrugById(drugs, drugId)
  if (!drug) return []
  return drug.drugInteractions
    .map(inter => {
      const target = getDrugById(drugs, inter.drugId)
      return target ? { ...inter, drug: target } : null
    })
    .filter(Boolean)
    .sort((a, b) => severityOrder[b.severity] - severityOrder[a.severity])
}

export function getDiseaseInteractions(drugs, diseases, drugId) {
  const drug = getDrugById(drugs, drugId)
  if (!drug) return []
  return drug.diseaseInteractions
    .map(inter => {
      const disease = getDiseaseById(diseases, inter.diseaseId)
      return disease ? { ...inter, disease } : null
    })
    .filter(Boolean)
    .sort((a, b) => severityOrder[b.severity] - severityOrder[a.severity])
}

export function checkDrugDrugInteraction(drugs, drugAId, drugBId) {
  const drugA = getDrugById(drugs, drugAId)
  const drugB = getDrugById(drugs, drugBId)
  if (!drugA || !drugB) return null

  const aToB = drugA.drugInteractions.find(i => i.drugId === drugBId)
  const bToA = drugB.drugInteractions.find(i => i.drugId === drugAId)

  if (!aToB && !bToA) return { severity: 'none', description: 'لا يوجد تفاعل معروف / No known interaction' }
  const primary = aToB || bToA
  return { ...primary, source: aToB ? drugA : drugB, target: aToB ? drugB : drugA }
}

export function checkDrugDiseaseInteraction(drugs, diseases, drugId, diseaseId) {
  const drug = getDrugById(drugs, drugId)
  const disease = getDiseaseById(diseases, diseaseId)
  if (!drug || !disease) return null

  const inter = drug.diseaseInteractions.find(i => i.diseaseId === diseaseId)
  if (!inter) return { severity: 'none', description: 'لا يوجد تفاعل معروف / No known interaction' }
  return { ...inter, drug, disease }
}

export function searchDrugs(drugs, query) {
  const q = query.toLowerCase().trim()
  if (!q) return drugs
  return drugs.filter(d =>
    d.nameEn.toLowerCase().includes(q) ||
    d.nameAr.includes(q) ||
    d.category.toLowerCase().includes(q) ||
    d.categoryAr.includes(q)
  )
}

export function searchDiseases(diseases, query) {
  const q = query.toLowerCase().trim()
  if (!q) return diseases
  return diseases.filter(d =>
    d.nameEn.toLowerCase().includes(q) ||
    d.nameAr.includes(q) ||
    d.category.toLowerCase().includes(q)
  )
}
