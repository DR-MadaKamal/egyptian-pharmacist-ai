export async function consumeEddb(source) {
  const EDA_URL = 'https://raw.githubusercontent.com/karem505/egyptian-drug-database/main/data/egyptian-drugs.json'
  const res = await fetch(EDA_URL)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const data = await res.json()
  return {
    status: 'ok',
    recordCount: data.length,
    mirror: 'karem505/egyptian-drug-database',
    data: data,
  }
}
