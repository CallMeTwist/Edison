import { useRef, useEffect, useCallback } from 'react'
import gsap from '@/lib/gsap'
import type { BodyRegionId } from '@/services/types'

interface Props {
  selected: BodyRegionId | null
  onSelect: (id: BodyRegionId | null) => void
}

const ACC = '#4FC3F7'

interface Region {
  id: BodyRegionId
  label: string
}

const REGIONS: Region[] = [
  { id: 'head',     label: 'Head'       },
  { id: 'shoulder', label: 'Shoulders'  },
  { id: 'chest',    label: 'Chest'      },
  { id: 'core',     label: 'Core'       },
  { id: 'hip',      label: 'Hips'       },
  { id: 'elbow',    label: 'Elbows'     },
  { id: 'hand',     label: 'Hands'      },
  { id: 'knee',     label: 'Knees'      },
  { id: 'ankle',    label: 'Ankles'     },
]

// Returns fill + stroke based on selection state
const regionStyle = (id: BodyRegionId, selected: BodyRegionId | null) => ({
  fill:   selected === id ? 'rgba(79,195,247,0.18)' : 'rgba(79,195,247,0.04)',
  stroke: selected === id ? ACC : 'rgba(79,195,247,0.45)',
  strokeWidth: selected === id ? 1.4 : 0.9,
  filter: selected === id ? `drop-shadow(0 0 5px ${ACC})` : undefined,
  transition: 'fill 0.25s ease, stroke 0.25s ease',
  cursor: 'pointer',
})

export const HologramBody: React.FC<Props> = ({ selected, onSelect }) => {
  const svgRef   = useRef<SVGSVGElement>(null)
  const groupRef = useRef<Record<string, SVGGElement | null>>({})

  // Breathing animation on mount
  useEffect(() => {
    const noMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (noMotion || !svgRef.current) return
    const tween = gsap.to(svgRef.current, {
      scale: 1.025,
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      transformOrigin: '50% 50%',
    })
    return () => { tween.kill() }
  }, [])

  const handleClick = useCallback((id: BodyRegionId) => {
    const next = selected === id ? null : id
    onSelect(next)
    window.dispatchEvent(new CustomEvent('physio:region-selected', { detail: { region: next } }))

    // GSAP pulse on clicked region
    const el = groupRef.current[id]
    if (el) {
      const noMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (!noMotion) {
        gsap.fromTo(el, { scale: 1 }, {
          scale: 1.06,
          duration: 0.14,
          yoyo: true,
          repeat: 1,
          ease: 'power2.out',
          transformOrigin: '50% 50%',
        })
      }
    }
  }, [selected, onSelect])

  const setRef = (id: BodyRegionId) => (el: SVGGElement | null) => {
    groupRef.current[id] = el
  }

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 200 480"
      width="100%"
      height="100%"
      style={{ display: 'block', maxHeight: '100%', maxWidth: '100%', overflow: 'visible' }}
    >
      {/* ── Background grid ── */}
      <defs>
        <pattern id="holo-grid" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(79,195,247,0.06)" strokeWidth="0.5" />
        </pattern>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      <rect width="200" height="480" fill="url(#holo-grid)" opacity="0.5" />

      {/* ── Scan line ── */}
      <line x1="0" y1="0" x2="200" y2="0" stroke="rgba(79,195,247,0.3)" strokeWidth="1"
        style={{ animation: 'scan 5s linear infinite' }} />

      {/* ── HEAD ── */}
      <g
        ref={setRef('head')}
        onClick={() => handleClick('head')}
        style={{ cursor: 'pointer' }}
      >
        <ellipse
          cx="100" cy="38" rx="27" ry="30"
          {...regionStyle('head', selected)}
          strokeDasharray="3 2"
        />
        {/* Helmet line */}
        <path d="M73,32 Q100,22 127,32" fill="none"
          stroke={selected === 'head' ? ACC : 'rgba(79,195,247,0.35)'}
          strokeWidth="0.8" strokeLinecap="round"
        />
        {/* Visor dots */}
        <circle cx="90" cy="38" r="3"
          fill={selected === 'head' ? 'rgba(79,195,247,0.4)' : 'rgba(79,195,247,0.12)'}
          stroke={ACC} strokeWidth="0.6"
        />
        <circle cx="110" cy="38" r="3"
          fill={selected === 'head' ? 'rgba(79,195,247,0.4)' : 'rgba(79,195,247,0.12)'}
          stroke={ACC} strokeWidth="0.6"
        />
        {/* Invisible hit-area */}
        <ellipse cx="100" cy="38" rx="27" ry="30" fill="transparent" />
      </g>

      {/* Neck */}
      <rect x="91" y="68" width="18" height="16" rx="4"
        fill="rgba(79,195,247,0.04)" stroke="rgba(79,195,247,0.25)" strokeWidth="0.7"
      />

      {/* ── SHOULDERS ── */}
      <g
        ref={setRef('shoulder')}
        onClick={() => handleClick('shoulder')}
      >
        {/* Left shoulder */}
        <ellipse cx="55" cy="90" rx="28" ry="18"
          {...regionStyle('shoulder', selected)}
          strokeDasharray="3 2"
        />
        {/* Right shoulder */}
        <ellipse cx="145" cy="90" rx="28" ry="18"
          {...regionStyle('shoulder', selected)}
          strokeDasharray="3 2"
        />
        {/* Collarbone line */}
        <line x1="68" y1="84" x2="132" y2="84"
          stroke={selected === 'shoulder' ? ACC : 'rgba(79,195,247,0.3)'}
          strokeWidth="0.8"
        />
        <ellipse cx="55"  cy="90" rx="28" ry="18" fill="transparent" />
        <ellipse cx="145" cy="90" rx="28" ry="18" fill="transparent" />
      </g>

      {/* ── CHEST ── */}
      <g
        ref={setRef('chest')}
        onClick={() => handleClick('chest')}
      >
        <path d="M70,108 L130,108 L134,175 L66,175 Z"
          {...regionStyle('chest', selected)}
          strokeDasharray="3 2"
        />
        {/* Sternum line */}
        <line x1="100" y1="110" x2="100" y2="173"
          stroke={selected === 'chest' ? ACC : 'rgba(79,195,247,0.22)'}
          strokeWidth="0.7"
        />
        {/* Rib hints */}
        {[120, 133, 146, 160].map((y, i) => (
          <path key={i}
            d={`M100,${y} Q87,${y + 3} 73,${y}`}
            fill="none"
            stroke={selected === 'chest' ? ACC : 'rgba(79,195,247,0.2)'}
            strokeWidth="0.7"
          />
        ))}
        {[120, 133, 146, 160].map((y, i) => (
          <path key={`r${i}`}
            d={`M100,${y} Q113,${y + 3} 127,${y}`}
            fill="none"
            stroke={selected === 'chest' ? ACC : 'rgba(79,195,247,0.2)'}
            strokeWidth="0.7"
          />
        ))}
        <path d="M70,108 L130,108 L134,175 L66,175 Z" fill="transparent" />
      </g>

      {/* ── CORE ── */}
      <g
        ref={setRef('core')}
        onClick={() => handleClick('core')}
      >
        <rect x="68" y="175" width="64" height="52" rx="8"
          {...regionStyle('core', selected)}
          strokeDasharray="3 2"
        />
        {/* Abs grid */}
        {[190, 205].map((y, i) => (
          <line key={i} x1="72" y1={y} x2="128" y2={y}
            stroke={selected === 'core' ? ACC : 'rgba(79,195,247,0.18)'}
            strokeWidth="0.6"
          />
        ))}
        <line x1="100" y1="177" x2="100" y2="225"
          stroke={selected === 'core' ? ACC : 'rgba(79,195,247,0.18)'}
          strokeWidth="0.6"
        />
        <rect x="68" y="175" width="64" height="52" rx="8" fill="transparent" />
      </g>

      {/* ── HIP ── */}
      <g
        ref={setRef('hip')}
        onClick={() => handleClick('hip')}
      >
        <path d="M62,227 L138,227 L146,278 L54,278 Z"
          {...regionStyle('hip', selected)}
          strokeDasharray="3 2"
        />
        {/* Hip bone hint */}
        <path d="M68,240 Q100,235 132,240" fill="none"
          stroke={selected === 'hip' ? ACC : 'rgba(79,195,247,0.22)'}
          strokeWidth="0.8"
        />
        <path d="M62,227 L138,227 L146,278 L54,278 Z" fill="transparent" />
      </g>

      {/* ── ELBOWS ── */}
      <g
        ref={setRef('elbow')}
        onClick={() => handleClick('elbow')}
      >
        {/* Left arm upper */}
        <rect x="30" y="96" width="24" height="90" rx="12"
          fill="rgba(79,195,247,0.04)" stroke="rgba(79,195,247,0.3)" strokeWidth="0.8"
        />
        {/* Left elbow joint */}
        <ellipse cx="42" cy="192" rx="14" ry="13"
          {...regionStyle('elbow', selected)}
          strokeDasharray="3 2"
        />
        {/* Right arm upper */}
        <rect x="146" y="96" width="24" height="90" rx="12"
          fill="rgba(79,195,247,0.04)" stroke="rgba(79,195,247,0.3)" strokeWidth="0.8"
        />
        {/* Right elbow joint */}
        <ellipse cx="158" cy="192" rx="14" ry="13"
          {...regionStyle('elbow', selected)}
          strokeDasharray="3 2"
        />
        <ellipse cx="42"  cy="192" rx="14" ry="13" fill="transparent" />
        <ellipse cx="158" cy="192" rx="14" ry="13" fill="transparent" />
      </g>

      {/* ── HANDS ── */}
      <g
        ref={setRef('hand')}
        onClick={() => handleClick('hand')}
      >
        {/* Left forearm */}
        <rect x="32" y="204" width="20" height="65" rx="10"
          fill="rgba(79,195,247,0.04)" stroke="rgba(79,195,247,0.28)" strokeWidth="0.8"
        />
        {/* Left hand */}
        <ellipse cx="42" cy="278" rx="14" ry="16"
          {...regionStyle('hand', selected)}
          strokeDasharray="3 2"
        />
        {/* Right forearm */}
        <rect x="148" y="204" width="20" height="65" rx="10"
          fill="rgba(79,195,247,0.04)" stroke="rgba(79,195,247,0.28)" strokeWidth="0.8"
        />
        {/* Right hand */}
        <ellipse cx="158" cy="278" rx="14" ry="16"
          {...regionStyle('hand', selected)}
          strokeDasharray="3 2"
        />
        <ellipse cx="42"  cy="278" rx="14" ry="16" fill="transparent" />
        <ellipse cx="158" cy="278" rx="14" ry="16" fill="transparent" />
      </g>

      {/* ── KNEES ── */}
      <g
        ref={setRef('knee')}
        onClick={() => handleClick('knee')}
      >
        {/* Left thigh */}
        <rect x="60" y="278" width="38" height="80" rx="12"
          fill="rgba(79,195,247,0.04)" stroke="rgba(79,195,247,0.3)" strokeWidth="0.8"
        />
        {/* Left knee */}
        <ellipse cx="79" cy="364" rx="20" ry="15"
          {...regionStyle('knee', selected)}
          strokeDasharray="3 2"
        />
        {/* Right thigh */}
        <rect x="102" y="278" width="38" height="80" rx="12"
          fill="rgba(79,195,247,0.04)" stroke="rgba(79,195,247,0.3)" strokeWidth="0.8"
        />
        {/* Right knee */}
        <ellipse cx="121" cy="364" rx="20" ry="15"
          {...regionStyle('knee', selected)}
          strokeDasharray="3 2"
        />
        <ellipse cx="79"  cy="364" rx="20" ry="15" fill="transparent" />
        <ellipse cx="121" cy="364" rx="20" ry="15" fill="transparent" />
      </g>

      {/* ── ANKLES ── */}
      <g
        ref={setRef('ankle')}
        onClick={() => handleClick('ankle')}
      >
        {/* Left shin */}
        <rect x="62" y="378" width="34" height="72" rx="12"
          fill="rgba(79,195,247,0.04)" stroke="rgba(79,195,247,0.3)" strokeWidth="0.8"
        />
        {/* Left ankle */}
        <ellipse cx="79" cy="456" rx="18" ry="14"
          {...regionStyle('ankle', selected)}
          strokeDasharray="3 2"
        />
        {/* Left foot */}
        <path d="M64,464 Q62,472 88,472 Q92,464 96,458 L62,458 Z"
          fill={selected === 'ankle' ? 'rgba(79,195,247,0.12)' : 'rgba(79,195,247,0.03)'}
          stroke="rgba(79,195,247,0.3)" strokeWidth="0.7"
        />
        {/* Right shin */}
        <rect x="104" y="378" width="34" height="72" rx="12"
          fill="rgba(79,195,247,0.04)" stroke="rgba(79,195,247,0.3)" strokeWidth="0.8"
        />
        {/* Right ankle */}
        <ellipse cx="121" cy="456" rx="18" ry="14"
          {...regionStyle('ankle', selected)}
          strokeDasharray="3 2"
        />
        {/* Right foot */}
        <path d="M104,458 L136,458 L138,472 Q112,472 104,464 Z"
          fill={selected === 'ankle' ? 'rgba(79,195,247,0.12)' : 'rgba(79,195,247,0.03)'}
          stroke="rgba(79,195,247,0.3)" strokeWidth="0.7"
        />
        <ellipse cx="79"  cy="456" rx="18" ry="14" fill="transparent" />
        <ellipse cx="121" cy="456" rx="18" ry="14" fill="transparent" />
        <rect x="62"  y="378" width="34" height="72" rx="12" fill="transparent" />
        <rect x="104" y="378" width="34" height="72" rx="12" fill="transparent" />
      </g>

      {/* ── Diagnostic markers when selected ── */}
      {selected && (
        <g style={{ pointerEvents: 'none' }}>
          <circle cx="186" cy="20" r="6"
            fill="rgba(79,195,247,0.15)" stroke={ACC} strokeWidth="1"
            style={{ animation: 'breathe 1.5s ease-in-out infinite' }}
          />
          <text x="196" y="24" fontSize="7" fill={ACC}
            fontFamily="'Space Mono',monospace" textAnchor="end">
            {REGIONS.find(r => r.id === selected)?.label.toUpperCase()}
          </text>
        </g>
      )}
    </svg>
  )
}
