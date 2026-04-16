// ═══════════════════════════════════════════
//  CORE APP TYPES
// ═══════════════════════════════════════════

export type WorldId = 'hub' | 'physio' | 'dev' | 'fitness' | 'art' | 'contact'

export interface WorldConfig {
  id: WorldId
  label: string
  accent: string
  particleColor: [number, number, number]
  veilColor: string
  edgeGlow: string
}

// ═══════════════════════════════════════════
//  PHYSIOTHERAPY
// ═══════════════════════════════════════════

export type BodyRegionId =
  | 'head'
  | 'shoulder'
  | 'elbow'
  | 'hand'
  | 'chest'
  | 'core'
  | 'hip'
  | 'knee'
  | 'ankle'
  
export interface BodyRegion {
  label: string
  desc: string
  tags: string[]
}

// ═══════════════════════════════════════════
//  DEVELOPER
// ═══════════════════════════════════════════

export interface Project {
  name: string
  desc: string
  tags: string[]
  year: string
  link?: string
  featured?: boolean
}

export interface TimelineEntry {
  year: string
  role: string
  org: string
  desc: string
}

export interface OpenSourceItem {
  name: string
  desc: string
  stars: number
  lang: string
}

// ═══════════════════════════════════════════
//  FITNESS
// ═══════════════════════════════════════════

export interface Program {
  name: string
  desc: string
  intensity: 'MAX' | 'HIGH' | 'EPIC' | 'MED' | 'LOW'
  duration: string
  color: string
}

export interface NutritionPrinciple {
  icon: string
  title: string
  desc: string
  color: string
}

export interface MacroData {
  label: string
  pct: number
  color: string
  desc: string
}

export interface Supplement {
  name: string
  benefit: string
  evidence: 'A' | 'B' | 'C'
}

// ═══════════════════════════════════════════
//  ART
// ═══════════════════════════════════════════

export type ArtShape = 'blob1' | 'blob2' | 'blob3' | 'diamond' | 'circle' | 'triangle' | 'hexagon'

export interface ArtWork {
  id: number
  title: string
  medium: string
  year: string
  description: string
  dimensions?: string
  colors: { h1: string; h2: string }
  shape: ArtShape
  available?: boolean
}

// ═══════════════════════════════════════════
//  API (Laravel integration) — PREPARED
// ═══════════════════════════════════════════

export interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

export interface ContactFormPayload {
  name: string
  email: string
  message: string
  service: WorldId | 'general'
  phone?: string
}

export interface BookingPayload {
  name: string
  email: string
  phone: string
  service: string
  preferredDate: string
  notes?: string
}

export interface ApiErrorResponse {
  message: string
  errors?: Record<string, string[]>
}
