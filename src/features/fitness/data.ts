import type { Program, NutritionPrinciple, MacroData, Supplement } from '@/services/types'

export const PROGRAMS: Program[] = [
  { name: 'HIIT BURN',      desc: 'Maximum fat incineration through high-intensity interval blast protocols combined with EPOC optimisation.',     intensity: 'MAX',  duration: '45 min',  color: '#FF4500' },
  { name: 'STRENGTH CORE',  desc: 'Build lean muscle mass and elevate resting metabolic rate through progressive compound strength training.',    intensity: 'HIGH', duration: '60 min',  color: '#FF6B35' },
  { name: 'BODY RESET',     desc: 'A complete 12-week body transformation journey blending training periodisation, nutrition and habit coaching.', intensity: 'EPIC', duration: '12 weeks', color: '#FF8C42' },
  { name: 'MINDFUL MOVE',   desc: 'Low-impact mobility, active recovery and injury prevention for long-term sustainable fitness.',                intensity: 'MED',  duration: '30 min',  color: '#FFAB70' },
]

export const NUTRITION_PRINCIPLES: NutritionPrinciple[] = [
  {
    icon:  'caloric',
    title: 'Caloric Precision',
    desc:  'Science-backed calorie targets calculated from your TDEE, activity level and body composition goals — not arbitrary generic numbers.',
    color: '#FF4500',
  },
  {
    icon:  'protein',
    title: 'Protein Prioritisation',
    desc:  'High-protein frameworks (1.6–2.2g/kg) to preserve lean mass during fat loss phases and drive hypertrophy in muscle-building phases.',
    color: '#FF6B35',
  },
  {
    icon:  'carbs',
    title: 'Carb Cycling',
    desc:  'Strategic manipulation of carbohydrate intake — high on training days to fuel performance, lower on rest days to enhance fat oxidation.',
    color: '#FF8C42',
  },
  {
    icon:  'behavioural',
    title: 'Behavioural Coaching',
    desc:  'Nutrition without psychology fails. Weekly mindset coaching, habit stacking and evidence-based behaviour change techniques baked in.',
    color: '#FFAB70',
  },
  {
    icon:  'tracking',
    title: 'Data-Driven Tracking',
    desc:  'Weekly biometric check-ins, progress photos and body composition tracking to make real-time adjustments that keep results coming.',
    color: '#FFC59A',
  },
  {
    icon:  'flexible',
    title: 'Flexible Dieting',
    desc:  'If It Fits Your Macros (IIFYM) approach combined with food quality guidance — sustainable eating that fits real life, travel and social events.',
    color: '#FFD4B5',
  },
]

export const MACRO_DATA: MacroData[] = [
  { label: 'Protein',  pct: 35, color: '#FF4500', desc: '~175g daily for 80kg athlete' },
  { label: 'Carbs',    pct: 40, color: '#FF8C42', desc: 'Cycled with training schedule' },
  { label: 'Fats',     pct: 25, color: '#FFAB70', desc: 'Essential fatty acids prioritised' },
]

export const SUPPLEMENTS: Supplement[] = [
  { name: 'Creatine Monohydrate', benefit: 'Strength & power output',       evidence: 'A' },
  { name: 'Whey Protein',         benefit: 'Muscle protein synthesis',      evidence: 'A' },
  { name: 'Caffeine',             benefit: 'Performance & fat oxidation',   evidence: 'A' },
  { name: 'Vitamin D3 + K2',      benefit: 'Hormonal health & immunity',    evidence: 'B' },
  { name: 'Omega-3 (EPA/DHA)',    benefit: 'Inflammation & recovery',       evidence: 'A' },
  { name: 'Magnesium Glycinate',  benefit: 'Sleep quality & recovery',      evidence: 'B' },
]

export const AREAS_OF_IMPACT = [
  'Build Strength Safely',
  'Improve Movement Quality',
  'Reduce Injury Risk',
  'Enhance Endurance',
  'Develop Consistency',
]

export const CLIENT_STATS = [
  { value: '87%', label: 'Clients Reach Their Goals' },
  { value: '10%', label: 'Typical Fat Loss Range' },
  { value: '90%+', label: 'Positive Client Feedback' },
  { value: '120+', label: 'Clients Supported' },
]
