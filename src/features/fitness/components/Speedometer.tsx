import { useEffect, useRef } from 'react'
import gsap from '@/lib/gsap'

interface Props {
  speed: number  // 0–100
}

const Speedometer: React.FC<Props> = ({ speed }) => {
  const needleRef   = useRef<SVGLineElement>(null)
  const progressRef = useRef<SVGPathElement>(null)

  useEffect(() => {
    if (!needleRef.current || !progressRef.current) return

    // Rotate needle: -115deg (speed=0) to +115deg (speed=100)
    const deg = -115 + (speed / 100) * 230
    gsap.to(needleRef.current, {
      rotation: deg,
      duration: 0.28,
      ease: 'power2.out',
      transformOrigin: '60px 60px',
    })

    // Arc progress
    const arcLen = 272
    const offset = arcLen - (speed / 100) * arcLen
    progressRef.current.style.setProperty('--arc-len', `${arcLen}px`)
    progressRef.current.style.setProperty('--arc-offset', `${offset}px`)
  }, [speed])

  return (
    <svg
      width="120"
      height="120"
      viewBox="0 0 120 120"
      style={{
        position: 'absolute',
        top:       12,
        right:     16,
        zIndex:    10,
        filter:   'drop-shadow(0 0 12px rgba(255,69,0,.25))',
      }}
    >
      {/* Background circle */}
      <circle cx="60" cy="60" r="52" fill="rgba(0,0,0,.55)" stroke="rgba(255,69,0,.12)" strokeWidth="1" />

      {/* Background track arc */}
      <path
        d="M20,95 A50,50 0 1,1 100,95"
        fill="none"
        stroke="rgba(255,69,0,.15)"
        strokeWidth="8"
        strokeLinecap="round"
      />

      {/* Progress arc */}
      <path
        ref={progressRef}
        d="M20,95 A50,50 0 1,1 100,95"
        fill="none"
        stroke="#FF4500"
        strokeWidth="8"
        strokeLinecap="round"
        style={{
          filter:           'drop-shadow(0 0 6px #FF4500)',
          strokeDasharray:  'var(--arc-len)',
          strokeDashoffset: 'var(--arc-offset)',
          transition:       'stroke-dashoffset 0.25s ease-out',
        }}
      />

      {/* Centre speed number */}
      <text
        x="60" y="65"
        textAnchor="middle"
        fill="#fff"
        fontFamily="'Bebas Neue',sans-serif"
        fontSize="22"
      >{speed}</text>

      {/* Unit label */}
      <text
        x="60" y="80"
        textAnchor="middle"
        fill="rgba(255,69,0,.6)"
        fontFamily="'Space Mono',monospace"
        fontSize="8"
      >KM/H</text>

      {/* Needle */}
      <line
        ref={needleRef}
        x1="60" y1="60" x2="60" y2="28"
        stroke="#FF8C42"
        strokeWidth="1.5"
        strokeLinecap="round"
        style={{ transformOrigin: '60px 60px' }}
      />

      {/* Centre dot */}
      <circle cx="60" cy="60" r="3" fill="#FF4500" />
    </svg>
  )
}

export default Speedometer
