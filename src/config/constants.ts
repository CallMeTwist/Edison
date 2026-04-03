import type { WorldConfig, WorldId } from '@/services/types'

export const OWNER_NAME  = 'Edison'
export const OWNER_TITLE = 'Creative Multi-Disciplinarian'

// World visual configuration
export const WORLD_CONFIG: Record<WorldId, WorldConfig> = {
  hub: {
    id:             'hub',
    label:          'Hub',
    accent:         '#ffffff',
    particleColor:  [1, 1, 1],
    veilColor:      '#000000',
    edgeGlow:       'none',
  },
  physio: {
    id:             'physio',
    label:          'Physiotherapy',
    accent:         '#4FC3F7',
    particleColor:  [0.31, 0.76, 0.97],
    veilColor:      '#01060f',
    edgeGlow:       'inset 0 0 200px rgba(79,195,247,.06)',
  },
  dev: {
    id:             'dev',
    label:          'Developer',
    accent:         '#00FF88',
    particleColor:  [0, 1, 0.53],
    veilColor:      '#000a02',
    edgeGlow:       'inset 0 0 200px rgba(0,255,136,.06)',
  },
  fitness: {
    id:             'fitness',
    label:          'Fitness & Weight Loss',
    accent:         '#FF4500',
    particleColor:  [1, 0.27, 0],
    veilColor:      '#0a0100',
    edgeGlow:       'inset 0 0 200px rgba(255,69,0,.07)',
  },
  art: {
    id:             'art',
    label:          'Visual Artist',
    accent:         '#FF6B9D',
    particleColor:  [1, 0.42, 0.61],
    veilColor:      '#FBF0E8',
    edgeGlow:       'none',
  },
}

export const NAV_WORLDS: WorldId[] = ['physio', 'dev', 'fitness', 'art']

// Responsive breakpoints
export const BP = {
  sm:  480,
  md:  768,
  lg:  1024,
  xl:  1280,
} as const
