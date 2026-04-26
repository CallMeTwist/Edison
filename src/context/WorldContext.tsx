import {
  createContext, useContext, useState, useCallback, useEffect, useRef,
  type ReactNode, type FC,
} from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import type { WorldId } from '@/services/types'
import { WORLD_CONFIG } from '@/config/constants'

interface WorldContextValue {
  world:       WorldId
  prevWorld:   WorldId
  isVeil:      boolean
  veilColor:   string
  navigateTo:  (next: WorldId) => void
}

const WorldContext = createContext<WorldContextValue | null>(null)

const WORLD_TO_PATH: Record<WorldId, string> = {
  hub:     '/',
  physio:  '/physio',
  dev:     '/dev',
  fitness: '/fitness',
  art:     '/art',
  contact: '/contact',
}

const PATH_TO_WORLD: Record<string, WorldId> = {
  '/':        'hub',
  '/physio':  'physio',
  '/dev':     'dev',
  '/fitness': 'fitness',
  '/art':     'art',
  '/contact': 'contact',
}

const pathToWorld = (path: string): WorldId =>
  PATH_TO_WORLD[path] ?? 'hub'

export const WorldProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const location = useLocation()
  const navigate = useNavigate()

  const currentWorld = pathToWorld(location.pathname)

  const [prevWorld, setPrevWorld] = useState<WorldId>(currentWorld)
  const [isVeil,    setIsVeil]    = useState(false)
  const [veilColor, setVeilColor] = useState('#000000')
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastWorldRef  = useRef<WorldId>(currentWorld)

  // Track route changes (covers both navigateTo and browser back/forward).
  // We update prevWorld to the world the user just LEFT (lastWorldRef.current),
  // not the one they arrived at — pages like ContactPage rely on this to theme.
  useEffect(() => {
    if (currentWorld === lastWorldRef.current) return

    setPrevWorld(lastWorldRef.current)
    lastWorldRef.current = currentWorld

    // If the veil isn't already open (browser back/forward path), flash it briefly
    setIsVeil(prev => {
      if (!prev) setVeilColor(WORLD_CONFIG[currentWorld].veilColor)
      return true
    })

    if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
    closeTimerRef.current = setTimeout(() => {
      setIsVeil(false)
      closeTimerRef.current = null
    }, 240)
    // No cleanup that clears the timer — re-renders triggered by setPrevWorld
    // would otherwise abort the close and the veil would stick.
  }, [currentWorld])

  // One-time unmount cleanup for the close timer
  useEffect(() => () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
  }, [])

  const navigateTo = useCallback((next: WorldId) => {
    if (next === currentWorld) return
    const cfg = WORLD_CONFIG[next]
    setVeilColor(cfg.veilColor)
    setIsVeil(true)
    setTimeout(() => {
      navigate(WORLD_TO_PATH[next])
    }, 360)
  }, [currentWorld, navigate])

  return (
    <WorldContext.Provider value={{ world: currentWorld, prevWorld, isVeil, veilColor, navigateTo }}>
      {children}
    </WorldContext.Provider>
  )
}

export const useWorld = (): WorldContextValue => {
  const ctx = useContext(WorldContext)
  if (!ctx) throw new Error('useWorld must be used inside <WorldProvider>')
  return ctx
}
