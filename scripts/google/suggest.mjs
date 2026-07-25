// Google Suggest expansion - fetch long-tail keyword suggestions from Google Autocomplete
// Lightweight alternative to geo pool, uses real search behavior data

const SEED_KEYWORDS = [
  // Souvenir Wisuda (prioritas tertinggi - 8 produk)
  "samir wisuda",
  "gordon wisuda",
  "patung wisuda",
  "kalung rektor",
  "tongkat rektor",
  "baju toga wisuda",
  "map ijazah",
  "tabung wisuda",
  
  // Plakat (prioritas tinggi - populer)
  "plakat custom",
  "plakat wayang",
  "souvenir wayang",
  "gunungan wayang",
  "plakat kayu",
  "plakat marmer",
  "plakat resin",
  "plakat akrilik",  // digeser ke belakang karena sudah banyak artikel
  
  // Medali & Piala
  "medali custom",
  "medali wisuda",
  "piala custom",
  "piala trophy",
  
  // Accessories
  "gantungan kunci custom",
  "tumbler custom",
  "papan nama custom",
  "nama dada custom",
  "pin bross custom",
  
  // Lainnya
  "souvenir custom",
  "prasasti custom",
  "gift box custom",
  
  // Location-based (Jogja)
  "plakat jogja",
  "medali jogja",
  "souvenir jogja",
]

/**
 * Fetch Google suggestions for a query
 * @param {string} query - Search query
 * @returns {Promise<string[]>} Array of suggestions
 */
export async function fetchSuggestions(query) {
  try {
    const url = `http://suggestqueries.google.com/complete/search?client=firefox&q=${encodeURIComponent(query)}`
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
      },
      timeout: 5000
    })
    
    if (!response.ok) {
      console.warn(`Google suggest failed for "${query}": ${response.status}`)
      return []
    }
    
    const data = await response.json()
    // Response format: [query, [suggestions]]
    return Array.isArray(data[1]) ? data[1] : []
  } catch (error) {
    console.warn(`Google suggest error for "${query}":`, error.message)
    return []
  }
}

/**
 * Fetch suggestions for all seed keywords
 * @returns {Promise<Array<{query: string, impressions: number}>>} Array of keyword objects
 */
export async function googleSuggest() {
  console.log("Fetching Google suggestions...")
  const suggestions = new Set()
  
  // Negative keywords - exclude irrelevant suggestions
  const NEGATIVE_KEYWORDS = [
    "kulit",        // wayang kulit (seni tradisional)
    "golek",        // wayang golek (boneka)
    "artinya",      // informational query
    "vector",       // format file digital
    "png",          // format file digital
    "cdr",          // format file digital
    "mini",         // ukuran tidak relevan
    "bandung",      // lokasi bukan target utama
    "jakarta",      // lokasi bukan target utama
    "surabaya",     // lokasi bukan target utama
    "semarang",     // lokasi bukan target utama
    "medan",        // lokasi bukan target utama
    "malang",       // lokasi bukan target utama
  ]
  
  // Fetch suggestions for each seed keyword
  for (const seed of SEED_KEYWORDS) {
    const results = await fetchSuggestions(seed)
    
    // Filter out negative keywords
    results.forEach(s => {
      const lower = s.toLowerCase()
      const hasNegative = NEGATIVE_KEYWORDS.some(neg => lower.includes(neg))
      if (!hasNegative) {
        suggestions.add(lower)
      }
    })
    
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100))
  }
  
  console.log(`Got ${suggestions.size} suggestions from Google (filtered)`)
  
  // Convert to keyword objects with synthetic impressions
  // Use 50 impressions as baseline (higher than fallback, lower than geo)
  return Array.from(suggestions).map(query => ({
    query,
    impressions: 50,
    clicks: 0,
    ctr: 0,
    position: 0,
    _suggest: true
  }))
}
