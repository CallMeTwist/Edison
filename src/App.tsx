import { useEffect } from 'react'
import { WorldProvider, useWorld } from '@/context/WorldContext'
import { ParticleBackground }      from '@/components/ParticleBackground'
import { NavDots }                 from '@/components/ui/NavDots'
import { TransitionVeil }          from '@/layouts/TransitionVeil'
import { useCursor }               from '@/hooks/useCursor'
import { HubPage }                 from '@/pages/HubPage'
import { PhysioPage }              from '@/pages/PhysioPage'
import { DevPage }                 from '@/pages/DevPage'
import { FitnessPage }             from '@/pages/FitnessPage'
import { ArtPage }                 from '@/pages/ArtPage'
import { WORLD_CONFIG }            from '@/config/constants'
import '@/styles/globals.css'

// ─────────────────────────────────────────
// Inner app — consumes WorldContext
// ─────────────────────────────────────────
function PortfolioApp() {
  useCursor()

  const { world, isVeil, veilColor, navigateTo } = useWorld()
  const cfg = WORLD_CONFIG[world]

  // Keep browser title in sync
  useEffect(() => {
    document.title = world === 'hub'
      ? 'Eluke Edison — Creative Portfolio'
      : `Eluke Edison — ${cfg.label}`
  }, [world, cfg.label])

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#000', overflow: 'hidden' }}>

      {/* Persistent particle galaxy — colour shifts per world */}
      <ParticleBackground world={world} />

      {/* Edge ambient glow per world */}
      <div style={{
        position:   'fixed',
        inset:       0,
        zIndex:      3,
        pointerEvents:'none',
        boxShadow:   cfg.edgeGlow,
        transition: 'box-shadow 1.8s ease',
      }} />

      {/* World pages — keyed so they fully remount on navigation */}
      <div style={{ position: 'relative', zIndex: 5, width: '100%', height: '100%' }}>
        {world === 'hub'     && <HubPage     key="hub"     />}
        {world === 'physio'  && <PhysioPage  key="physio"  />}
        {world === 'dev'     && <DevPage     key="dev"     />}
        {world === 'fitness' && <FitnessPage key="fitness" />}
        {world === 'art'     && <ArtPage     key="art"     />}
      </div>

      {/* World navigation dots (hidden on hub) */}
      <NavDots current={world} onGo={navigateTo} />

      {/* Cinematic veil during transitions */}
      <TransitionVeil active={isVeil} color={veilColor} />
    </div>
  )
}

// ─────────────────────────────────────────
// Root export — wraps with providers
// ─────────────────────────────────────────
export default function App() {
  return (
    <WorldProvider>
      <PortfolioApp />
    </WorldProvider>
  )
}
