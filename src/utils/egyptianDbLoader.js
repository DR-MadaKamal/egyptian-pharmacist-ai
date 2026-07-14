const DB_URL = 'https://raw.githubusercontent.com/karem505/egyptian-drug-database/main/data/egyptian-drugs.json';
const CACHE_KEY = 'egyptian_drug_db_v1';
const CACHE_TTL = 24 * 60 * 60 * 1000;

export async function loadEgyptianDrugs() {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { timestamp, data } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_TTL) {
        return data;
      }
    }
  } catch {
    // localStorage unavailable or corrupt — continue to fetch
  }

  let data;
  try {
    const res = await fetch(DB_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    data = await res.json();
  } catch {
    // Network failure — try to return stale cache
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        return JSON.parse(cached).data;
      }
    } catch {
      // ignore
    }
    return [];
  }

  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: Date.now(), data }));
  } catch {
    // Storage full or unavailable — silently skip
  }

  return data;
}

export function searchEgyptianDrugs(drugs, query, filters = {}) {
  let results = drugs;

  if (filters.drugClass) {
    const cls = filters.drugClass.toLowerCase();
    results = results.filter(d => d.drug_class && d.drug_class.toLowerCase() === cls);
  }
  if (filters.manufacturer) {
    const mfr = filters.manufacturer.toLowerCase();
    results = results.filter(d => d.manufacturer && d.manufacturer.toLowerCase() === mfr);
  }
  if (filters.route) {
    const rt = filters.route.toLowerCase();
    results = results.filter(d => d.route && d.route.toLowerCase() === rt);
  }
  if (filters.priceMin != null) {
    results = results.filter(d => d.price_egp >= filters.priceMin);
  }
  if (filters.priceMax != null) {
    results = results.filter(d => d.price_egp <= filters.priceMax);
  }

  if (query && query.trim()) {
    const q = query.trim().toLowerCase();
    const fields = ['commercial_name_en', 'commercial_name_ar', 'scientific_name', 'manufacturer', 'drug_class'];

    results = results.filter(d =>
      fields.some(f => d[f] && d[f].toLowerCase().includes(q))
    );

    const exact = [];
    const starts = [];
    const contains = [];

    for (const d of results) {
      const matched = fields
        .filter(f => d[f] && d[f].toLowerCase().includes(q))
        .map(f => d[f].toLowerCase());

      const isExact = matched.some(v => v === q);
      const isStarts = matched.some(v => v.startsWith(q));

      if (isExact) exact.push(d);
      else if (isStarts) starts.push(d);
      else contains.push(d);
    }

    results = [...exact, ...starts, ...contains];
  }

  return results;
}

export function getEgyptianDrugClasses(drugs) {
  const map = new Map();
  for (const d of drugs) {
    const cls = d.drug_class || 'UNKNOWN';
    map.set(cls, (map.get(cls) || 0) + 1);
  }
  return [...map.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function getEgyptianManufacturers(drugs) {
  const map = new Map();
  for (const d of drugs) {
    const mfr = d.manufacturer || 'UNKNOWN';
    map.set(mfr, (map.get(mfr) || 0) + 1);
  }
  return [...map.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function getEgyptianRoutes(drugs) {
  const map = new Map();
  for (const d of drugs) {
    const rt = d.route || 'UNKNOWN';
    map.set(rt, (map.get(rt) || 0) + 1);
  }
  return [...map.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name));
}
