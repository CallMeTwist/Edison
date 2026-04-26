import { useEffect, lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { WorldProvider, useWorld } from '@/context/WorldContext'
import { ParticleBackground }      from '@/components/ParticleBackground'
import { NavDots }                 from '@/components/ui/NavDots'
import { EdgeSwipeHint }           from '@/components/EdgeSwipeHint'
import { TransitionVeil }          from '@/layouts/TransitionVeil'
import { useCursor }               from '@/hooks/useCursor'
import { useEdgeSwipe }            from '@/hooks/useEdgeSwipe'
import { WORLD_CONFIG, NAV_WORLDS } from '@/config/constants'
import type { WorldId }            from '@/services/types'
import '@/styles/globals.css'
import { useSwipeNav } from './hooks/useSwiperNav'

// Order used for left/right edge-swipe and general swipe nav.
// Contact is intentionally excluded — it's a CTA destination, not a sibling world.
const SWIPE_ORDER: WorldId[] = ['hub', ...NAV_WORLDS]

const neighborWorld = (current: WorldId, side: 'left' | 'right'): WorldId | null => {
  const i = SWIPE_ORDER.indexOf(current)
  if (i === -1) return null
  // Drag from the LEFT edge reveals the PREVIOUS world; from the RIGHT edge, the NEXT.
  const target = side === 'left' ? i - 1 : i + 1
  return SWIPE_ORDER[target] ?? null
}

const HubPage     = lazy(() => import('@/pages/HubPage').then(m => ({ default: m.HubPage })))
const PhysioPage  = lazy(() => import('@/pages/PhysioPage').then(m => ({ default: m.PhysioPage })))
const DevPage     = lazy(() => import('@/pages/DevPage').then(m => ({ default: m.DevPage })))
const FitnessPage = lazy(() => import('@/pages/FitnessPage').then(m => ({ default: m.FitnessPage })))
const ArtPage     = lazy(() => import('@/pages/ArtPage').then(m => ({ default: m.ArtPage })))
const ContactPage = lazy(() => import('@/pages/ContactPage').then(m => ({ default: m.ContactPage })))

function PortfolioApp() {
  useCursor()

  const { world, isVeil, veilColor, navigateTo } = useWorld()
  const cfg = WORLD_CONFIG[world]
  useSwipeNav({ current: world, onNavigate: navigateTo })

  const edgeSwipe = useEdgeSwipe({
    disabled: isVeil,
    onCommit: side => {
      const target = neighborWorld(world, side)
      if (target) navigateTo(target)
    },
  })

  const hintTargetWorld = edgeSwipe.side ? neighborWorld(world, edgeSwipe.side) : null
  const hintTargetColor = hintTargetWorld ? WORLD_CONFIG[hintTargetWorld].accent : null

  useEffect(() => {
    document.title = world === 'hub'
      ? 'Eluke Edison — Creative Portfolio'
      : `Eluke Edison — ${cfg.label}`
  }, [world, cfg.label])

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#000', overflow: 'hidden' }}>

      <ParticleBackground world={world} />

      <div style={{
        position:      'fixed',
        inset:          0,
        zIndex:         3,
        pointerEvents: 'none',
        boxShadow:     cfg.edgeGlow,
        transition:    'box-shadow 1.8s ease',
      }} />

      {/* Routed world pages */}
      <div style={{ position: 'relative', zIndex: 5, width: '100%', height: '100%' }}>
        <Suspense fallback={null}>
          <Routes>
            <Route path="/"        element={<HubPage     key="hub"     />} />
            <Route path="/physio"  element={<PhysioPage  key="physio"  />} />
            <Route path="/dev"     element={<DevPage     key="dev"     />} />
            <Route path="/fitness" element={<FitnessPage key="fitness" />} />
            <Route path="/art"     element={<ArtPage     key="art"     />} />
            <Route path="/contact" element={<ContactPage key="contact" />} />
            <Route path="*"        element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </div>

      <NavDots current={world} onGo={navigateTo} />

      <EdgeSwipeHint state={edgeSwipe} targetColor={hintTargetColor} />

      <TransitionVeil active={isVeil} color={veilColor} />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <WorldProvider>
        <PortfolioApp />
      </WorldProvider>
    </BrowserRouter>
  )
}
