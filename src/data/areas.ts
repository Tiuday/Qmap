import { AreaData } from '@/store/useMapStore'

export const MOCK_AREAS: AreaData[] = [
  {
    id: 'cp',
    name: 'Connaught Place',
    locality: 'Central Delhi',
    safetyLevel: 'moderate',
    crowdDensity: 85,
    trafficLevel: 90,
    isOpen: true,
    vibe: 'busy',
    crimeRate: 'medium',
    bestTimeToVisit: '7 PM – 10 PM',
    transport: ['Metro (Blue/Yellow Line)', 'Auto', 'Cab'],
    shortcutFrom: 'Take the underground path from Rajiv Chowk metro — avoid CP outer ring during peak hours.',
    coordinates: [77.2167, 28.6315],
    description: 'The commercial heart of Delhi. Always buzzing. Best for evening outings. Avoid lunch hours on weekdays.',
    tags: ['food', 'shopping', 'nightlife', 'social'],
    safeNearby: [
      { name: 'India Coffee House', type: 'cafe', note: 'Well-lit, always staffed, safe for solo visits' },
      { name: 'Palika Bazaar', type: 'mall', note: 'Covered, security-patrolled underground market' },
      { name: 'Central Park (CP)', type: 'park', note: 'Open green space, police presence, safe at dusk' },
      { name: 'Rajiv Chowk Metro Station', type: 'metro', note: 'Staffed 24/7, CISF security, women-only coaches' },
      { name: 'Hotel Janpath', type: 'hotel', note: 'Lobby open to public, safe to wait indoors' },
    ],
  },
  {
    id: 'hauz-khas',
    name: 'Hauz Khas Village',
    locality: 'South Delhi',
    safetyLevel: 'safe',
    crowdDensity: 60,
    trafficLevel: 45,
    isOpen: true,
    vibe: 'chill',
    crimeRate: 'low',
    bestTimeToVisit: '6 PM – 11 PM',
    transport: ['Metro (Yellow Line – Hauz Khas)', 'Auto', 'Cab'],
    shortcutFrom: 'Enter from the deer park side for immediate access to the lake view — skip the main market lane.',
    coordinates: [77.1975, 28.5494],
    description: 'Artsy, calm vibes with cafes and galleries. Strong introvert spot. Safe after dark near the lake.',
    tags: ['art', 'cafes', 'nature', 'introvert', 'nightlife'],
    safeNearby: [
      { name: 'Kunzum Travel Cafe', type: 'cafe', note: 'Community-run, pay-what-you-want, very safe space' },
      { name: 'Deer Park Entry Gate', type: 'park', note: 'Guarded entry, patrolled paths, good lighting' },
      { name: 'Hauz Khas Metro Station', type: 'metro', note: '5 min walk, CISF presence, safe waiting area' },
      { name: 'Social Hauz Khas', type: 'cafe', note: 'Well-staffed bar-cafe, good crowd, safe indoors' },
      { name: 'IIT Delhi Main Gate', type: 'hotel', note: 'Campus security nearby, well-lit road' },
    ],
  },
  {
    id: 'lajpat-nagar',
    name: 'Lajpat Nagar Market',
    locality: 'South East Delhi',
    safetyLevel: 'moderate',
    crowdDensity: 92,
    trafficLevel: 85,
    isOpen: true,
    vibe: 'busy',
    crimeRate: 'medium',
    bestTimeToVisit: '11 AM – 1 PM (weekdays)',
    transport: ['Metro (Pink Line – Lajpat Nagar)', 'Auto', 'Rickshaw'],
    shortcutFrom: 'Enter from Gate 2 near Central Market — avoids the main congestion point.',
    coordinates: [77.2373, 28.5665],
    description: 'Vibrant market famous for fabric and street food. Extremely crowded on weekends. Better on weekday mornings.',
    tags: ['shopping', 'street food', 'budget', 'social'],
    safeNearby: [
      { name: 'Haldiram\'s Lajpat Nagar', type: 'cafe', note: 'Crowded restaurant, safe, good lighting and staff' },
      { name: 'Lajpat Nagar Metro Station', type: 'metro', note: 'Pink Line, CISF security, women-only waiting zone' },
      { name: 'South Extension Mall', type: 'mall', note: '10 min walk, AC, security guards at all entrances' },
      { name: 'Cafe Coffee Day Central Market', type: 'cafe', note: 'Staff always present, ground floor, safe to shelter' },
      { name: 'Goyal Hospital', type: 'hospital', note: 'Nearest emergency facility, open 24 hours' },
    ],
  },
  {
    id: 'lodhi-garden',
    name: 'Lodhi Garden',
    locality: 'Lodhi Estate',
    safetyLevel: 'safe',
    crowdDensity: 30,
    trafficLevel: 15,
    isOpen: true,
    vibe: 'chill',
    crimeRate: 'low',
    bestTimeToVisit: '6 AM – 9 AM or 5 PM – 7 PM',
    transport: ['Metro (Violet Line – JLN Stadium)', 'Cab', 'Cycling'],
    shortcutFrom: 'Park at the Safdarjung entrance — 2 min walk to the main Mughal monuments.',
    coordinates: [77.2198, 28.5931],
    description: 'Green sanctuary in the heart of Delhi. Perfect introvert escape. Zero crowd in early mornings. Dog friendly.',
    tags: ['nature', 'walking', 'introvert', 'heritage', 'wellness'],
    safeNearby: [
      { name: 'India Habitat Centre Cafe', type: 'cafe', note: 'Cultural complex, 24/7 security, safe and calm' },
      { name: 'Khan Market', type: 'mall', note: 'Well-patrolled upscale market, cafes open late' },
      { name: 'JLN Stadium Metro', type: 'metro', note: 'Violet Line, 5 min walk, well-lit at night' },
      { name: 'AIIMS Hospital', type: 'hospital', note: 'Major trauma centre, always staffed' },
      { name: 'Lodi – The Garden Restaurant', type: 'cafe', note: 'Right by the garden, secure outdoor seating' },
    ],
  },
  {
    id: 'paharganj',
    name: 'Paharganj',
    locality: 'Central Delhi',
    safetyLevel: 'danger',
    crowdDensity: 78,
    trafficLevel: 70,
    isOpen: true,
    vibe: 'busy',
    crimeRate: 'high',
    bestTimeToVisit: 'Daytime only (10 AM – 6 PM)',
    transport: ['Metro (Blue Line – New Delhi)', 'Auto'],
    shortcutFrom: 'Stick to Main Bazaar road — avoid the inner lanes especially at night.',
    coordinates: [77.2088, 28.6453],
    description: 'Backpacker hub near New Delhi station. High foot traffic, pickpocketing reported. Use caution at night.',
    tags: ['budget', 'street food', 'backpacker'],
    safeNearby: [
      { name: 'New Delhi Railway Station', type: 'metro', note: 'RPF police presence 24/7, women\'s waiting room' },
      { name: 'Hotel Broadway', type: 'hotel', note: 'Established hotel lobby, security present at all times' },
      { name: 'Connaught Place (10 min)', type: 'park', note: 'Much safer nearby area — metro or auto away' },
      { name: 'LNJP Hospital', type: 'hospital', note: 'Closest emergency facility, 5 min by auto' },
      { name: 'New Delhi Metro Station', type: 'metro', note: 'Blue Line, CISF security, women-only coach zone' },
    ],
  },
  {
    id: 'dilli-haat',
    name: 'Dilli Haat',
    locality: 'INA, South Delhi',
    safetyLevel: 'safe',
    crowdDensity: 55,
    trafficLevel: 40,
    isOpen: true,
    vibe: 'social',
    crimeRate: 'low',
    bestTimeToVisit: '4 PM – 8 PM',
    transport: ['Metro (Yellow Line – INA)', 'Auto', 'Cab'],
    shortcutFrom: 'INA metro exit D drops you right at the entrance — no cab needed.',
    coordinates: [77.2056, 28.5721],
    description: 'Cultural craft market with state food stalls. Family friendly. Great for first dates. Very safe and patrolled.',
    tags: ['culture', 'food', 'craft', 'introvert', 'family'],
    safeNearby: [
      { name: 'INA Metro Station', type: 'metro', note: 'Yellow Line, exit D is right at Dilli Haat gate' },
      { name: 'AIIMS Emergency', type: 'hospital', note: '10 min by auto, major trauma centre' },
      { name: 'South Extension Market', type: 'mall', note: 'Well-lit, security-patrolled, cafes inside' },
      { name: 'Bikaner Sweets INA', type: 'cafe', note: 'Family-run, always busy, safe to shelter in' },
      { name: 'INA Market Covered Hall', type: 'mall', note: 'Covered market, staffed, good for shelter in rain' },
    ],
  },
  {
    id: 'saket',
    name: 'Select City Walk – Saket',
    locality: 'Saket, South Delhi',
    safetyLevel: 'safe',
    crowdDensity: 70,
    trafficLevel: 60,
    isOpen: true,
    vibe: 'social',
    crimeRate: 'low',
    bestTimeToVisit: '3 PM – 6 PM (weekdays)',
    transport: ['Metro (Yellow Line – Saket)', 'Cab', 'Auto'],
    shortcutFrom: 'Use Saket metro exit 2 for direct covered walkway to SCW.',
    coordinates: [77.2195, 28.5244],
    description: 'Premium mall zone. Safe, AC, structured. Great for solo women. Weekend evenings get very crowded.',
    tags: ['shopping', 'food court', 'movies', 'social', 'safe for women'],
    safeNearby: [
      { name: 'Select City Walk Mall', type: 'mall', note: 'Multi-floor mall, CCTV, security at every level' },
      { name: 'PVR Saket', type: 'mall', note: 'Multiplex inside SCW, safe and well-staffed' },
      { name: 'Saket Metro Station', type: 'metro', note: 'Yellow Line, exit 2 connects directly to mall' },
      { name: 'Max Hospital Saket', type: 'hospital', note: 'Premium hospital, always open, 3 min by auto' },
      { name: 'Garden of Five Senses', type: 'park', note: 'Patrolled garden, good lighting in evenings' },
    ],
  },
  {
    id: 'old-delhi',
    name: 'Chandni Chowk',
    locality: 'Old Delhi',
    safetyLevel: 'moderate',
    crowdDensity: 95,
    trafficLevel: 95,
    isOpen: true,
    vibe: 'busy',
    crimeRate: 'medium',
    bestTimeToVisit: '9 AM – 12 PM',
    transport: ['Metro (Yellow Line – Chandni Chowk)', 'E-rickshaw', 'Walking'],
    shortcutFrom: 'Start from the Jama Masjid side to avoid the main road chaos — e-rickshaw loops are faster.',
    coordinates: [77.2315, 28.6562],
    description: 'Historic chaos in the best way. Incredible food but extremely dense crowds. Avoid evening rush entirely.',
    tags: ['heritage', 'street food', 'shopping', 'photography'],
    safeNearby: [
      { name: 'Chandni Chowk Metro Station', type: 'metro', note: 'Yellow Line, CISF security, women\'s zone on platform' },
      { name: 'Karim\'s Restaurant', type: 'cafe', note: 'Established since 1913, well-staffed, safe dining' },
      { name: 'Red Fort Complex', type: 'park', note: 'ASI-patrolled, open grounds, police post inside' },
      { name: 'LNJP Hospital', type: 'hospital', note: '10 min auto, nearest emergency facility in Old Delhi' },
      { name: 'Paranthe Wali Gali', type: 'cafe', note: 'Busy lane, family eateries, safer than surrounding alleys' },
    ],
  },
]

// Heatmap points for crowd density (lng, lat, intensity 0-1)
export const CROWD_HEATMAP_DATA: [number, number, number][] = MOCK_AREAS.map(
  (a) => [a.coordinates[0], a.coordinates[1], a.crowdDensity / 100]
)

// Safety zone GeoJSON approximations
export const getSafetyColor = (level: string) => {
  switch (level) {
    case 'safe': return '#22c55e'
    case 'moderate': return '#f59e0b'
    case 'danger': return '#ef4444'
    default: return '#6b7280'
  }
}

export const getTrafficColor = (level: number) => {
  if (level < 35) return '#10b981'
  if (level < 70) return '#f59e0b'
  return '#ef4444'
}

export const getDensityLabel = (density: number) => {
  if (density >= 85) return 'Packed'
  if (density >= 65) return 'Busy'
  if (density >= 40) return 'Moderate'
  if (density >= 20) return 'Chill'
  return 'Empty'
}
