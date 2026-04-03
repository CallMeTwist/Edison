import {
  createContext, useContext, useState, useCallback,
  type ReactNode, type FC,
} from 'react'
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

export const WorldProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [world,     setWorld]     = useState<WorldId>('hub')
  const [prevWorld, setPrevWorld] = useState<WorldId>('hub')
  const [isVeil,    setIsVeil]    = useState(false)
  const [veilColor, setVeilColor] = useState('#000000')

  const navigateTo = useCallback((next: WorldId) => {
    if (next === world) return
    const cfg = WORLD_CONFIG[next]
    setVeilColor(cfg.veilColor)
    setIsVeil(true)
    setTimeout(() => {
      setPrevWorld(world)
      setWorld(next)
      setTimeout(() => setIsVeil(false), 80)
    }, 360)
  }, [world])

  return (
    <WorldContext.Provider value={{ world, prevWorld, isVeil, veilColor, navigateTo }}>
      {children}
    </WorldContext.Provider>
  )
}

export const useWorld = (): WorldContextValue => {
  const ctx = useContext(WorldContext)
  if (!ctx) throw new Error('useWorld must be used inside <WorldProvider>')
  return ctx
}
