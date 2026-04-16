import { useEffect, useRef, useState } from 'react'
import gsap from '@/lib/gsap'
import { useWindowSize } from '@/hooks/useWindowSize'
import Speedometer from './Speedometer'

interface Props {
  onSpeedChange?: (speed: number) => void
}

export const CyclistScene: React.FC<Props> = ({ onSpeedChange }) => {
  const containerRef     = useRef<HTMLDivElement>(null)
  const cyclistRef       = useRef<SVGGElement>(null)
  const rearWheelRef     = useRef<SVGGElement>(null)
  const frontWheelRef    = useRef<SVGGElement>(null)
  const rightLegRef      = useRef<SVGGElement>(null)
  const leftLegRef       = useRef<SVGGElement>(null)
  const rideTweenRef     = useRef<gsap.core.Tween | null>(null)
  const rearTweenRef     = useRef<gsap.core.Tween | null>(null)
  const frontTweenRef    = useRef<gsap.core.Tween | null>(null)
  const rightLegTweenRef = useRef<gsap.core.Tween | null>(null)
  const leftLegTweenRef  = useRef<gsap.core.Tween | null>(null)
  const decayTimerRef    = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const onSpeedChangeRef = useRef(onSpeedChange)
  onSpeedChangeRef.current = onSpeedChange

  const [showTrail, setShowTrail] = useState(false)
  const [displaySpeed, setDisplaySpeed] = useState(0)
  const { isMobile } = useWindowSize()

  const BASE = 0.45

  useEffect(() => {
    const noMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (noMotion) return

    const initTimer = setTimeout(() => {
      if (
        !cyclistRef.current ||
        !rearWheelRef.current ||
        !frontWheelRef.current ||
        !rightLegRef.current ||
        !leftLegRef.current
      ) return

      // FIX 2C: scale cyclist group for mobile
      gsap.set(cyclistRef.current, {
        scale: isMobile ? 0.78 : 1,
        transformOrigin: '50% 90%',
      })

      rideTweenRef.current = gsap.to(cyclistRef.current, {
        motionPath: {
          path: '#fitness-road-path',
          align: '#fitness-road-path',
          autoRotate: true,
          alignOrigin: [0.5, 0.9],
        },
        duration: 9,
        repeat: -1,
        ease: 'none',
      })

      // FIX 2A: start cyclist visible at 15% into path
      rideTweenRef.current.progress(0.15)

      rearTweenRef.current = gsap.to(rearWheelRef.current, {
        rotation: 360,
        repeat: -1,
        ease: 'none',
        duration: 0.9,
        transformOrigin: '50% 50%',
      })

      frontTweenRef.current = gsap.to(frontWheelRef.current, {
        rotation: 360,
        repeat: -1,
        ease: 'none',
        duration: 0.9,
        transformOrigin: '50% 50%',
      })

      // FIX 1: leg GSAP animations
      rightLegTweenRef.current = gsap.to(rightLegRef.current!, {
        rotation: 360,
        transformOrigin: '38px 40px',
        duration: 1.1,
        repeat: -1,
        ease: 'none',
      })

      leftLegTweenRef.current = gsap.to(leftLegRef.current!, {
        rotation: 360,
        transformOrigin: '38px 40px',
        duration: 1.1,
        repeat: -1,
        ease: 'none',
      })
      leftLegTweenRef.current.progress(0.5) // start 180° offset

      // FIX 3: apply initial speed
      const applySpeed = (s: number) => {
        const clamped = Math.min(Math.max(s, BASE), 3.5)
        rideTweenRef.current?.timeScale(clamped)
        rearTweenRef.current?.timeScale(clamped)
        frontTweenRef.current?.timeScale(clamped)
        rightLegTweenRef.current?.timeScale(clamped)
        leftLegTweenRef.current?.timeScale(clamped)
        onSpeedChangeRef.current?.(Math.round(((clamped - BASE) / (3.5 - BASE)) * 100))
      }

      applySpeed(BASE)
    }, 100)

    // FIX 3: wheel handler at useEffect level (outside initTimer)
    const handleWheel = (e: WheelEvent) => {
      const raw = Math.abs(e.deltaY) / 60
      const speed = Math.min(Math.max(raw, BASE), 3.5)
      rideTweenRef.current?.timeScale(speed)
      rearTweenRef.current?.timeScale(speed)
      frontTweenRef.current?.timeScale(speed)
      rightLegTweenRef.current?.timeScale(speed)
      leftLegTweenRef.current?.timeScale(speed)
      setShowTrail(speed > 1.3)
      onSpeedChangeRef.current?.(Math.round(((speed - BASE) / (3.5 - BASE)) * 100))
      setDisplaySpeed(Math.round(((speed - BASE) / (3.5 - BASE)) * 100))

      clearTimeout(decayTimerRef.current)
      decayTimerRef.current = setTimeout(() => {
        rideTweenRef.current?.timeScale(BASE)
        rearTweenRef.current?.timeScale(BASE)
        frontTweenRef.current?.timeScale(BASE)
        rightLegTweenRef.current?.timeScale(BASE)
        leftLegTweenRef.current?.timeScale(BASE)
        setShowTrail(false)
        onSpeedChangeRef.current?.(0)
        setDisplaySpeed(0)
      }, 900)
    }

    window.addEventListener('wheel', handleWheel, { passive: true })

    return () => {
      clearTimeout(initTimer)
      clearTimeout(decayTimerRef.current)
      rideTweenRef.current?.kill()
      rearTweenRef.current?.kill()
      frontTweenRef.current?.kill()
      rightLegTweenRef.current?.kill()
      leftLegTweenRef.current?.kill()
      window.removeEventListener('wheel', handleWheel)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      ref={containerRef}
      style={{
        position:   'relative',
        overflow:   'hidden',
        width:      '100%',
        height:      200,
        background: 'linear-gradient(180deg, rgba(20,3,0,.97) 0%, rgba(8,1,0,.99) 100%)',
        flexShrink:  0,
        willChange: 'transform',
      }}
    >
      <svg
        width="100%"
        height="200"
        viewBox="0 0 1440 200"
        preserveAspectRatio="xMidYMid slice"
        style={{ display: 'block' }}
      >
        {/* City skyline */}
        <rect x={80}   y={130} width={40}  height={60}  fill="rgba(255,69,0,.07)" />
        <rect x={130}  y={110} width={30}  height={80}  fill="rgba(255,69,0,.05)" />
        <rect x={200}  y={120} width={55}  height={70}  fill="rgba(255,69,0,.06)" />
        <rect x={270}  y={100} width={35}  height={90}  fill="rgba(255,69,0,.04)" />
        <rect x={900}  y={125} width={50}  height={65}  fill="rgba(255,69,0,.07)" />
        <rect x={970}  y={105} width={40}  height={85}  fill="rgba(255,69,0,.05)" />
        <rect x={1060} y={115} width={60}  height={75}  fill="rgba(255,69,0,.06)" />
        <rect x={1140} y={95}  width={35}  height={95}  fill="rgba(255,69,0,.04)" />
        <rect x={1250} y={120} width={45}  height={70}  fill="rgba(255,69,0,.07)" />

        {/* Road path — sine wave */}
        <path
          id="fitness-road-path"
          d="M0,140 C160,95 320,165 480,115 C640,65 800,155 960,105 C1120,55 1280,145 1440,95"
          fill="none"
          stroke="rgba(255,69,0,.2)"
          strokeWidth="2"
          strokeDasharray="6 5"
        />

        {/* Cyclist group — animated along path */}
        <g ref={cyclistRef}>
          {/* Rear wheel */}
          <g ref={rearWheelRef}>
            <circle cx="18" cy="46" r="13" stroke="#FF4500" strokeWidth="2" fill="none" />
            <line x1="18" y1="33" x2="18" y2="59" stroke="rgba(255,69,0,.6)" strokeWidth="1" />
            <line x1="5"  y1="46" x2="31" y2="46" stroke="rgba(255,69,0,.6)" strokeWidth="1" />
            <line x1="9"  y1="37" x2="27" y2="55" stroke="rgba(255,69,0,.4)" strokeWidth="1" />
            <line x1="27" y1="37" x2="9"  y2="55" stroke="rgba(255,69,0,.4)" strokeWidth="1" />
          </g>

          {/* Front wheel */}
          <g ref={frontWheelRef}>
            <circle cx="60" cy="46" r="13" stroke="#FF4500" strokeWidth="2" fill="none" />
            <line x1="60" y1="33" x2="60" y2="59" stroke="rgba(255,69,0,.6)" strokeWidth="1" />
            <line x1="47" y1="46" x2="73" y2="46" stroke="rgba(255,69,0,.6)" strokeWidth="1" />
            <line x1="51" y1="37" x2="69" y2="55" stroke="rgba(255,69,0,.4)" strokeWidth="1" />
            <line x1="69" y1="37" x2="51" y2="55" stroke="rgba(255,69,0,.4)" strokeWidth="1" />
          </g>

          {/* Chain ring + pedal axle */}
          <circle cx="38" cy="40" r="5" stroke="#FF6B35" strokeWidth="1.5" fill="none" />
          <circle cx="38" cy="40" r="1.5" fill="#FF6B35" />

          {/* Bike frame */}
          <line x1="38" y1="40" x2="35" y2="26" stroke="#FF6B35" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="35" y1="26" x2="55" y2="22" stroke="#FF6B35" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="38" y1="40" x2="55" y2="22" stroke="#FF6B35" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="18" y1="46" x2="38" y2="40" stroke="#FF6B35" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="18" y1="46" x2="35" y2="26" stroke="#FF6B35" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="55" y1="22" x2="60" y2="46" stroke="#FF6B35" strokeWidth="1.8" strokeLinecap="round" />

          {/* Handlebar */}
          <line x1="55" y1="22" x2="58" y2="17" stroke="#FF8C42" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="55" y1="22" x2="59" y2="24" stroke="#FF8C42" strokeWidth="1.5" strokeLinecap="round" />

          {/* Seat */}
          <line x1="31" y1="24" x2="39" y2="24" stroke="#FF8C42" strokeWidth="2" strokeLinecap="round" />

          {/* Rider — head */}
          <circle cx="52" cy="10" r="5.5" fill="none" stroke="#FFC4A0" strokeWidth="1.8" />
          {/* Neck */}
          <line x1="52" y1="15.5" x2="51" y2="19" stroke="#FFC4A0" strokeWidth="1.5" />
          {/* Torso */}
          <line x1="51" y1="19" x2="44" y2="28" stroke="#FF6B35" strokeWidth="2" strokeLinecap="round" />
          {/* Right arm */}
          <line x1="48" y1="22" x2="57" y2="20" stroke="#FFC4A0" strokeWidth="1.6" strokeLinecap="round" />
          {/* Left arm */}
          <line x1="48" y1="22" x2="55" y2="21.5" stroke="#FFC4A0" strokeWidth="1.4" strokeLinecap="round" opacity="0.7" />

          {/* Right leg (GSAP animated) */}
          <g ref={rightLegRef} style={{ transformOrigin: '38px 40px' }}>
            <line x1="38" y1="40" x2="45" y2="52" stroke="#FFC4A0" strokeWidth="2" strokeLinecap="round" />
            <line x1="45" y1="52" x2="38" y2="61" stroke="#FFC4A0" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="38" y1="61" x2="43" y2="62" stroke="#FF6B35" strokeWidth="2" strokeLinecap="round" />
            <line x1="43" y1="62" x2="46" y2="61" stroke="#FF8C42" strokeWidth="1.5" />
          </g>

          {/* Left leg (GSAP animated, 180° offset) */}
          <g ref={leftLegRef} style={{ transformOrigin: '38px 40px' }}>
            <line x1="38" y1="40" x2="31" y2="28" stroke="#FFC4A0" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
            <line x1="31" y1="28" x2="38" y2="19" stroke="#FFC4A0" strokeWidth="1.8" strokeLinecap="round" opacity="0.8" />
            <line x1="38" y1="19" x2="33" y2="18" stroke="#FF6B35" strokeWidth="2" strokeLinecap="round" />
            <line x1="33" y1="18" x2="30" y2="19" stroke="#FF8C42" strokeWidth="1.5" />
          </g>
        </g>
      </svg>

      {/* Neon speed trail */}
      {showTrail && (
        <>
          <div style={{
            position:        'absolute',
            bottom:           52,
            left:             0,
            width:            38,
            height:            4,
            background:      'linear-gradient(90deg, #FF4500, transparent)',
            animation:       'trailFade 0.28s linear infinite',
            transformOrigin: 'left center',
          }} />
          <div style={{
            position:        'absolute',
            bottom:           44,
            left:             0,
            width:            28,
            height:            3,
            background:      'linear-gradient(90deg, #FF6B35, transparent)',
            animation:       'trailFade 0.28s linear infinite',
            animationDelay:  '0.1s',
            transformOrigin: 'left center',
          }} />
        </>
      )}

      <Speedometer speed={displaySpeed} />

      {/* Road markings */}
      {[200, 560, 920, 1280].map((x, i) => (
        <div
          key={i}
          style={{
            position:   'absolute',
            bottom:      20,
            left:        `${(x / 1440) * 100}%`,
            width:        40,
            height:        2,
            background: 'rgba(255,69,0,.15)',
            animation:  `scan ${2 + i * 0.3}s linear infinite`,
          }}
        />
      ))}
    </div>
  )
}
