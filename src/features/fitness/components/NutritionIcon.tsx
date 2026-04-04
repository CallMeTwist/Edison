/**
 * Custom SVG nutrition icons — no emoji, no stock clip-art.
 * Each icon is a 24×24 minimal line/fill illustration that reads
 * clearly at small sizes and matches the fiery fitness palette.
 */

interface IconProps {
  color: string
  size?: number
}

/** Caloric Precision — flame inside a measuring beaker */
export const IconCaloricPrecision: React.FC<IconProps> = ({ color, size = 26 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    {/* Beaker outline */}
    <path d="M9 3h6M9 3v5L5 16a2 2 0 0 0 1.84 2.76h10.32A2 2 0 0 0 19 16l-4-8V3" />
    {/* Tick marks */}
    <line x1="7.5" y1="13" x2="9" y2="13" />
    <line x1="7" y1="16" x2="8.5" y2="16" />
    {/* Flame inside */}
    <path d="M12 18c0 0-2-1.5-2-3.5 0-1 .7-1.8 1.4-2.2-.1.6 0 1.3.6 1.7.3-1 1-2 1-3 1 .8 1.5 2 1.5 3 0 .5-.2 1-.5 1.5C13.5 16.5 12 18 12 18Z" fill={color} stroke="none" />
  </svg>
)

/** Protein Prioritisation — dumbbell */
export const IconProtein: React.FC<IconProps> = ({ color, size = 26 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    {/* Bar */}
    <line x1="7" y1="12" x2="17" y2="12" />
    {/* Left weight plates */}
    <rect x="3" y="9.5" width="2" height="5" rx="0.5" />
    <rect x="5" y="10.5" width="2" height="3" rx="0.5" />
    {/* Right weight plates */}
    <rect x="17" y="10.5" width="2" height="3" rx="0.5" />
    <rect x="19" y="9.5" width="2" height="5" rx="0.5" />
  </svg>
)

/** Carb Cycling — two arrows forming a cycle, with a grain icon */
export const IconCarbCycling: React.FC<IconProps> = ({ color, size = 26 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    {/* Circular cycle arrows */}
    <path d="M4 12a8 8 0 0 1 8-8" />
    <path d="M20 12a8 8 0 0 1-8 8" />
    <polyline points="4 8 4 12 8 12" />
    <polyline points="20 16 20 12 16 12" />
    {/* Centre grain dot */}
    <circle cx="12" cy="12" r="1.5" fill={color} stroke="none" />
  </svg>
)

/** Behavioural Coaching — minimal head silhouette with a lightbulb thought */
export const IconBehavioural: React.FC<IconProps> = ({ color, size = 26 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    {/* Head */}
    <circle cx="9" cy="12" r="5" />
    {/* Thought dots */}
    <circle cx="15.5" cy="9.5" r="0.8" fill={color} stroke="none" />
    <circle cx="17.5" cy="7.5" r="1.1" fill={color} stroke="none" />
    {/* Bulb at end of thought */}
    <path d="M19 5.5a2.5 2.5 0 0 1 0 3.5" />
    <path d="M19 5.5a2.5 2.5 0 0 0 0 3.5" />
    <line x1="18.3" y1="9.8" x2="19.7" y2="9.8" />
    <line x1="18.6" y1="11.2" x2="19.4" y2="11.2" />
  </svg>
)

/** Data-Driven Tracking — minimalist bar chart with trend line */
export const IconDataTracking: React.FC<IconProps> = ({ color, size = 26 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    {/* Axes */}
    <line x1="4" y1="19" x2="20" y2="19" />
    <line x1="4" y1="19" x2="4" y2="5" />
    {/* Bars */}
    <rect x="6"  y="14" width="3" height="5" rx="0.4" fill={color} stroke="none" opacity="0.5" />
    <rect x="10" y="10" width="3" height="9" rx="0.4" fill={color} stroke="none" opacity="0.7" />
    <rect x="14" y="7"  width="3" height="12" rx="0.4" fill={color} stroke="none" />
    {/* Trend arrow */}
    <path d="M6.5 13L10.5 9.5L14.5 7" strokeDasharray="2 1" />
    <polyline points="13 6 14.5 7 14 8.5" />
  </svg>
)

/** Flexible Dieting — fork and knife with a checkmark overlay */
export const IconFlexibleDiet: React.FC<IconProps> = ({ color, size = 26 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    {/* Fork */}
    <line x1="8" y1="3" x2="8" y2="21" />
    <path d="M6 3v5a2 2 0 0 0 4 0V3" />
    {/* Knife */}
    <path d="M15 3a5 5 0 0 1 2 4v1h-2v13" />
    {/* Small checkmark badge */}
    <circle cx="18.5" cy="18.5" r="3" fill={color} stroke="none" opacity="0.9" />
    <polyline points="17.2 18.5 18.2 19.5 19.8 17.5" stroke="#000" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

/* ── Map used in NutritionSection ── */
export type NutritionIconKey =
  | 'caloric'
  | 'protein'
  | 'carbs'
  | 'behavioural'
  | 'tracking'
  | 'flexible'

export const NUTRITION_ICONS: Record<NutritionIconKey, React.FC<IconProps>> = {
  caloric:      IconCaloricPrecision,
  protein:      IconProtein,
  carbs:        IconCarbCycling,
  behavioural:  IconBehavioural,
  tracking:     IconDataTracking,
  flexible:     IconFlexibleDiet,
}
