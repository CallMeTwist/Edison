import { useEffect, useRef, useState } from 'react'
import gsap from '@/lib/gsap'
import { useWindowSize } from '@/hooks/useWindowSize'
import Speedometer from './Speedometer'

interface Props {
  onSpeedChange?: (speed: number) => void
}

/**
 * Stick-figure runner animated along the same sine-wave path as the
 * legacy CyclistScene. Limbs swing in opposing pairs (right arm + left leg
 * forward, etc.) using GSAP yoyo tweens — gives a credible running gait
 * without any per-frame keyframe painting.
 */
export const RunnerScene: React.FC<Props> = ({ onSpeedChange }) => {
  const containerRef     = useRef<HTMLDivElement>(null)
  const runnerRef        = useRef<SVGGElement>(null)
  const bodyBobRef       = useRef<SVGGElement>(null)
  const rightArmRef      = useRef<SVGGElement>(null)
  const leftArmRef       = useRef<SVGGElement>(null)
  const rightLegRef      = useRef<SVGGElement>(null)
  const leftLegRef       = useRef<SVGGElement>(null)
  const rightForearmRef  = useRef<SVGGElement>(null)
  const leftForearmRef   = useRef<SVGGElement>(null)
  const rightShinRef     = useRef<SVGGElement>(null)
  const leftShinRef      = useRef<SVGGElement>(null)

  const tweensRef        = useRef<gsap.core.Tween[]>([])

  const decayTimerRef    = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const onSpeedChangeRef = useRef(onSpeedChange)
  onSpeedChangeRef.current = onSpeedChange

  const [showTrail, setShowTrail]       = useState(false)
  const [displaySpeed, setDisplaySpeed] = useState(0)
  const { isMobile } = useWindowSize()

  const BASE = 1.15  // resting jog speed (was 0.45)
  const MAX  = 4.0

  useEffect(() => {
    const noMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (noMotion) return

    const initTimer = setTimeout(() => {
      if (
        !runnerRef.current ||
        !bodyBobRef.current ||
        !rightArmRef.current ||
        !leftArmRef.current ||
        !rightLegRef.current ||
        !leftLegRef.current ||
        !rightForearmRef.current ||
        !leftForearmRef.current ||
        !rightShinRef.current ||
        !leftShinRef.current
      ) return

      gsap.set(runnerRef.current, {
        scale: isMobile ? 0.78 : 1,
        transformOrigin: '50% 90%',
      })

      const stride        = 0.30  // shorter stride duration → faster cadence
      const upperArmSwing = 50
      const upperLegSwing = 45
      // Bend amounts at elbow/knee — these stay positive (joints only flex inward)
      const elbowBendMin  = 30
      const elbowBendMax  = 80
      const kneeBendMin   = 12
      const kneeBendMax   = 95

      // ── Body travel along path ──
      const runTween = gsap.to(runnerRef.current, {
        motionPath: {
          path: '#fitness-road-path',
          align: '#fitness-road-path',
          autoRotate: true,
          alignOrigin: [0.5, 0.95],
        },
        duration: 9,
        repeat: -1,
        ease: 'none',
      })
      runTween.progress(0.15)

      // ── Vertical body bob ──
      const bobTween = gsap.to(bodyBobRef.current, {
        y: -2.6,
        duration: stride / 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })

      // ── Upper-limb swings (shoulder / hip) ──
      gsap.set(rightArmRef.current, { rotation:  upperArmSwing, transformOrigin: '0px 0px' })
      const rArm = gsap.to(rightArmRef.current, {
        rotation: -upperArmSwing, duration: stride, repeat: -1, yoyo: true, ease: 'sine.inOut',
      })

      gsap.set(leftArmRef.current,  { rotation: -upperArmSwing, transformOrigin: '0px 0px' })
      const lArm = gsap.to(leftArmRef.current, {
        rotation:  upperArmSwing, duration: stride, repeat: -1, yoyo: true, ease: 'sine.inOut',
      })

      gsap.set(rightLegRef.current, { rotation:  upperLegSwing, transformOrigin: '0px 0px' })
      const rLeg = gsap.to(rightLegRef.current, {
        rotation: -upperLegSwing, duration: stride, repeat: -1, yoyo: true, ease: 'sine.inOut',
      })

      gsap.set(leftLegRef.current,  { rotation: -upperLegSwing, transformOrigin: '0px 0px' })
      const lLeg = gsap.to(leftLegRef.current, {
        rotation:  upperLegSwing, duration: stride, repeat: -1, yoyo: true, ease: 'sine.inOut',
      })

      // ── Joint bends ──
      // Elbow flexes toward +x (forward, direction of travel) so the forearm folds
      // up in front of the chest, not behind the back. Negative rotation in SVG
      // (y-down) swings the forearm forward.
      gsap.set(rightForearmRef.current, { rotation: -elbowBendMax, transformOrigin: '0px 0px' })
      const rFore = gsap.to(rightForearmRef.current, {
        rotation: -elbowBendMin, duration: stride, repeat: -1, yoyo: true, ease: 'power2.inOut',
      })

      gsap.set(leftForearmRef.current,  { rotation: -elbowBendMin, transformOrigin: '0px 0px' })
      const lFore = gsap.to(leftForearmRef.current, {
        rotation: -elbowBendMax, duration: stride, repeat: -1, yoyo: true, ease: 'power2.inOut',
      })

      // Knee: bends most during recovery (when the leg is lifting behind the body).
      // Right leg starts at +45° (planted/forward) → knee mostly extended.
      // Left leg starts at −45° (back/recovering) → knee bent.
      gsap.set(rightShinRef.current, { rotation: kneeBendMin, transformOrigin: '0px 0px' })
      const rShin = gsap.to(rightShinRef.current, {
        rotation: kneeBendMax, duration: stride, repeat: -1, yoyo: true, ease: 'power3.inOut',
      })

      gsap.set(leftShinRef.current,  { rotation: kneeBendMax, transformOrigin: '0px 0px' })
      const lShin = gsap.to(leftShinRef.current, {
        rotation: kneeBendMin, duration: stride, repeat: -1, yoyo: true, ease: 'power3.inOut',
      })

      tweensRef.current = [runTween, bobTween, rArm, lArm, rLeg, lLeg, rFore, lFore, rShin, lShin]

      const applySpeed = (s: number) => {
        const clamped = Math.min(Math.max(s, BASE), MAX)
        tweensRef.current.forEach(t => t.timeScale(clamped))
        onSpeedChangeRef.current?.(Math.round(((clamped - BASE) / (MAX - BASE)) * 100))
      }
      applySpeed(BASE)
    }, 100)

    const handleWheel = (e: WheelEvent) => {
      const raw = Math.abs(e.deltaY) / 60
      const speed = Math.min(Math.max(raw, BASE), MAX)
      tweensRef.current.forEach(t => t.timeScale(speed))
      setShowTrail(speed > 1.3)
      const pct = Math.round(((speed - BASE) / (MAX - BASE)) * 100)
      onSpeedChangeRef.current?.(pct)
      setDisplaySpeed(pct)

      clearTimeout(decayTimerRef.current)
      decayTimerRef.current = setTimeout(() => {
        tweensRef.current.forEach(t => t.timeScale(BASE))
        setShowTrail(false)
        onSpeedChangeRef.current?.(0)
        setDisplaySpeed(0)
      }, 900)
    }

    window.addEventListener('wheel', handleWheel, { passive: true })

    return () => {
      clearTimeout(initTimer)
      clearTimeout(decayTimerRef.current)
      tweensRef.current.forEach(t => t.kill())
      tweensRef.current = []
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

        {/* Sine-wave road */}
        <path
          id="fitness-road-path"
          d="M0,140 C160,95 320,165 480,115 C640,65 800,155 960,105 C1120,55 1280,145 1440,95"
          fill="none"
          stroke="rgba(255,69,0,.18)"
          strokeWidth="2"
          strokeDasharray="6 5"
        />

        {/*
          Runner — drawn around local origin (0,0) at the pelvis.
          alignOrigin [0.5, 0.95] in motion-path puts that pelvis just above the road.
          Limb groups translate to the joint, then the inner stroke draws the limb
          downward from there. Group rotation pivots at the joint (transformOrigin 0,0).
        */}
        <g ref={runnerRef}>
          <g ref={bodyBobRef}>
            {/* Head */}
            <circle cx="0" cy="-30" r="5.5" fill="none" stroke="#FFC4A0" strokeWidth="1.8" />
            {/* Neck */}
            <line x1="0" y1="-24.5" x2="0" y2="-22" stroke="#FFC4A0" strokeWidth="1.5" />
            {/* Torso */}
            <line x1="0" y1="-22" x2="0" y2="0" stroke="#FF6B35" strokeWidth="2.2" strokeLinecap="round" />

            {/*
              Each limb has two nested groups:
                upper (rotates around shoulder/hip at translate origin)
                  upper bone (line)
                  joint group at translate(0, upperLength) — rotates around elbow/knee
                    forearm/shin (line) plus hand/foot
              Upper bone is drawn from y=0 (joint origin) to y=upperLength.
              Forearm/shin is drawn from y=0 (its own joint origin) to y=lowerLength.
            */}

            {/* Right arm — shoulder at (0,-20) */}
            <g ref={rightArmRef} transform="translate(0,-20)">
              <line x1="0" y1="0" x2="0" y2="9" stroke="#FFC4A0" strokeWidth="1.9" strokeLinecap="round" />
              <g ref={rightForearmRef} transform="translate(0,9)">
                <line x1="0" y1="0" x2="0" y2="8" stroke="#FFC4A0" strokeWidth="1.7" strokeLinecap="round" />
                <circle cx="0" cy="9" r="1.3" fill="#FFC4A0" />
              </g>
            </g>

            {/* Left arm */}
            <g ref={leftArmRef} transform="translate(0,-20)">
              <line x1="0" y1="0" x2="0" y2="9" stroke="#FFC4A0" strokeWidth="1.7" strokeLinecap="round" opacity="0.78" />
              <g ref={leftForearmRef} transform="translate(0,9)">
                <line x1="0" y1="0" x2="0" y2="8" stroke="#FFC4A0" strokeWidth="1.5" strokeLinecap="round" opacity="0.78" />
                <circle cx="0" cy="9" r="1.2" fill="#FFC4A0" opacity="0.78" />
              </g>
            </g>

            {/* Right leg — hip at (0,0) */}
            <g ref={rightLegRef} transform="translate(0,0)">
              <line x1="0" y1="0" x2="0" y2="11" stroke="#FFC4A0" strokeWidth="2.1" strokeLinecap="round" />
              <g ref={rightShinRef} transform="translate(0,11)">
                <line x1="0" y1="0" x2="0" y2="11" stroke="#FFC4A0" strokeWidth="1.9" strokeLinecap="round" />
                {/* Foot — small horizontal stroke at the ankle */}
                <line x1="-1" y1="11" x2="4" y2="11" stroke="#FF6B35" strokeWidth="2.1" strokeLinecap="round" />
              </g>
            </g>

            {/* Left leg */}
            <g ref={leftLegRef} transform="translate(0,0)">
              <line x1="0" y1="0" x2="0" y2="11" stroke="#FFC4A0" strokeWidth="1.9" strokeLinecap="round" opacity="0.82" />
              <g ref={leftShinRef} transform="translate(0,11)">
                <line x1="0" y1="0" x2="0" y2="11" stroke="#FFC4A0" strokeWidth="1.7" strokeLinecap="round" opacity="0.82" />
                {/* Foot points forward (+x), matching the right foot */}
                <line x1="-1" y1="11" x2="4" y2="11" stroke="#FF6B35" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
              </g>
            </g>
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
