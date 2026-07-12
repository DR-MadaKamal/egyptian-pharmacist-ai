const STORAGE_KEY = 'egyptian-drug-interactions'

function loadUserData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : { drugs: [], diseases: [] }
  } catch {
    return { drugs: [], diseases: [] }
  }
}

function saveUserData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function getUserDrugs() {
  return loadUserData().drugs
}

export function getUserDiseases() {
  return loadUserData().diseases
}

export function addUserDrug(drug) {
  const data = loadUserData()
  drug.id = 'u_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8)
  drug.userAdded = true
  data.drugs.push(drug)
  saveUserData(data)
  return drug
}

export function updateUserDrug(id, updates) {
  const data = loadUserData()
  const idx = data.drugs.findIndex(d => d.id === id)
  if (idx === -1) return false
  data.drugs[idx] = { ...data.drugs[idx], ...updates }
  saveUserData(data)
  return true
}

export function deleteUserDrug(id) {
  const data = loadUserData()
  data.drugs = data.drugs.filter(d => d.id !== id)
  saveUserData(data)
}

export function addUserDisease(disease) {
  const data = loadUserData()
  disease.id = 'ud_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8)
  disease.userAdded = true
  data.diseases.push(disease)
  saveUserData(data)
  return disease
}
