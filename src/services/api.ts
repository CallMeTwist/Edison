import axios from 'axios'
import { API_BASE_URL } from '@/config/api'
import type { ApiResponse, ContactFormPayload, BookingPayload } from './types'

// ═══════════════════════════════════════════
//  AXIOS INSTANCE
//  Configured for Laravel Sanctum auth.
//  All API calls are prepared but currently
//  return local data — uncomment when your
//  Laravel backend is ready.
// ═══════════════════════════════════════════

export const http = axios.create({
  baseURL:         API_BASE_URL,
  withCredentials: true,           // for Laravel Sanctum cookies
  headers: {
    'Content-Type': 'application/json',
    Accept:         'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
})

// Request interceptor — attach CSRF token if available
http.interceptors.request.use((config) => {
  const token = document.cookie
    .split('; ')
    .find(r => r.startsWith('XSRF-TOKEN='))
    ?.split('=')[1]
  if (token) config.headers['X-XSRF-TOKEN'] = decodeURIComponent(token)
  return config
})

// Response interceptor — normalise errors
http.interceptors.response.use(
  (res) => res,
  (err) => {
    const message: string =
      err.response?.data?.message ?? 'An unexpected error occurred.'
    return Promise.reject(new Error(message))
  }
)

// ═══════════════════════════════════════════
//  API FUNCTIONS
//  Uncomment each function when backend ready.
// ═══════════════════════════════════════════

// CONTACT FORM
export const submitContact = async (
  payload: ContactFormPayload
): Promise<ApiResponse<null>> => {
  // return (await http.post('/contact', payload)).data
  // MOCK until backend is live:
  await new Promise(r => setTimeout(r, 800))
  console.log('[MOCK] Contact submitted:', payload)
  return { data: null, message: 'Message sent successfully!', success: true }
}

// BOOKING
export const submitBooking = async (
  payload: BookingPayload
): Promise<ApiResponse<null>> => {
  // return (await http.post('/booking', payload)).data
  await new Promise(r => setTimeout(r, 800))
  console.log('[MOCK] Booking submitted:', payload)
  return { data: null, message: 'Booking request received!', success: true }
}

// PROJECTS (future: fetch from DB)
// export const fetchProjects = async () =>
//   (await http.get('/projects')).data

// ARTWORKS (future: fetch from DB)
// export const fetchArtworks = async () =>
//   (await http.get('/artworks')).data
