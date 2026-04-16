import { useRef } from 'react'
import type { Project } from '@/services/types'
import gsap from '@/lib/gsap'
import GlareHover from '@/components/GlareHover'

interface Props { project: Project; delay?: number }

export const ProjectCard: React.FC<Props> = ({ project, delay = 0 }) => {
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseEnter = () => {
    if (!cardRef.current) return
    cardRef.current.style.willChange = 'transform'
    gsap.to(cardRef.current, {
      rotationY: 7, rotationX: -4, scale: 1.032,
      duration: 0.4, ease: 'power2.out', transformPerspective: 900,
    })
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const rx = ((e.clientY - rect.top) / rect.height - 0.5) * -8
    const ry = ((e.clientX - rect.left) / rect.width - 0.5) * 8
    gsap.to(cardRef.current, { rotationX: rx, rotationY: ry, duration: 0.2, ease: 'none' })
  }

  const handleMouseLeave = () => {
    if (!cardRef.current) return
    gsap.to(cardRef.current, {
      rotationY: 0, rotationX: 0, scale: 1,
      duration: 0.5, ease: 'power3.out',
      onComplete: () => {
        if (cardRef.current) cardRef.current.style.willChange = ''
      },
    })
  }

  const inner = (
    <div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        background:   'rgba(0,255,136,.03)',
        border:       '1px solid rgba(0,255,136,.10)',
        borderRadius: 12,
        padding:      '18px 20px',
        cursor:       'pointer',
        position:     'relative',
        overflow:     'hidden',
        animation:    `fadeUp .8s ${delay}s ease both`,
        flexShrink:    0,
        width:        '100%',
        boxSizing:    'border-box',
      }}
    >
      {/* Scan highlight */}
      <div style={{
        position:   'absolute',
        top:         0,
        left:       '-110%',
        width:       '100%',
        height:      1.5,
        background: 'linear-gradient(90deg,transparent,#00FF88,transparent)',
        transition: 'left .55s ease',
      }} />

      {project.featured && (
        <div style={{
          position:     'absolute',
          top:           10,
          right:         10,
          padding:      '2px 8px',
          background:   'rgba(0,255,136,.08)',
          border:       '1px solid rgba(0,255,136,.22)',
          borderRadius:  4,
          color:        'rgba(0,255,136,.7)',
          fontSize:      9,
          fontFamily:   "'Space Mono', monospace",
          letterSpacing: 1,
        }}>
          FEATURED
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8, paddingRight: project.featured ? 72 : 0 }}>
        <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 17, fontWeight: 700, color: '#fff' }}>
          {project.name}
        </h3>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: 'rgba(0,255,136,.38)', flexShrink: 0, marginLeft: 12 }}>
          {project.year}
        </span>
      </div>

      <p style={{ color: 'rgba(255,255,255,.42)', fontSize: 12.5, lineHeight: 1.78, marginBottom: 12 }}>
        {project.desc}
      </p>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {project.tags.map(t => (
          <span
            key={t}
            style={{
              padding:     '3px 9px',
              background:  'rgba(0,255,136,.06)',
              border:      '1px solid rgba(0,255,136,.11)',
              borderRadius: 5,
              color:       'rgba(0,255,136,.65)',
              fontSize:     9.5,
              fontFamily:  "'Space Mono', monospace",
            }}
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  )

  // Wrap featured cards in GlareHover
  if (project.featured) {
    return (
      <GlareHover
        width="100%"
        height="auto"
        background="transparent"
        borderRadius="12px"
        borderColor="transparent"
        glareColor="#00FF88"
        glareOpacity={0.12}
        style={{ display: 'block' }}
      >
        {inner}
      </GlareHover>
    )
  }

  return inner
}
