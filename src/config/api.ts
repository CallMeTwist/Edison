// ═══════════════════════════════════════════
//  API CONFIGURATION
//  Ready for Laravel backend connection.
//  Set VITE_API_URL in your .env file.
// ═══════════════════════════════════════════

const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

export const API_BASE_URL = `${BASE}/api/v1`

export const API_ENDPOINTS = {
  // Contact & Booking
  contact:    `${API_BASE_URL}/contact`,
  booking:    `${API_BASE_URL}/booking`,

  // Portfolio content (if served from DB later)
  projects:   `${API_BASE_URL}/projects`,
  artworks:   `${API_BASE_URL}/artworks`,
  programs:   `${API_BASE_URL}/programs`,

  // Blog (future)
  posts:      `${API_BASE_URL}/blog/posts`,
  post:       (slug: string) => `${API_BASE_URL}/blog/posts/${slug}`,

  // Testimonials
  testimonials: `${API_BASE_URL}/testimonials`,
} as const
