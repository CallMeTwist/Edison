import { useRef } from 'react'
import type { Project } from '@/services/types'

interface Props { project: Project; delay?: number }

export const ProjectCard: React.FC<Props> = ({ project, delay = 0 }) => {
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseEnter = () => {
    if (!cardRef.current) return
    cardRef.current.style.transform    = 'translateY(-3px)'
    cardRef.current.style.borderColor  = 'rgba(0,255,136,.35)'
    cardRef.current.style.boxShadow    = '0 14px 36px rgba(0,255,136,.08)'
  }

  const handleMouseLeave = () => {
    if (!cardRef.current) return
    cardRef.current.style.transform    = ''
    cardRef.current.style.borderColor  = 'rgba(0,255,136,.10)'
    cardRef.current.style.boxShadow    = ''
  }

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        background:   'rgba(0,255,136,.03)',
        border:       '1px solid rgba(0,255,136,.10)',
        borderRadius: 12,
        padding:      '18px 20px',
        position:     'relative',
        overflow:     'hidden',
        isolation:    'isolate',
        animation:    `fadeUp .8s ${delay}s ease both`,
        flexShrink:    0,
        width:        '100%',
        boxSizing:    'border-box',
        transition:   'transform .35s ease, border-color .35s ease, box-shadow .35s ease',
        display:      'block',
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
        <a
          href="https://github.com/callmetwist"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 17,
            fontWeight: 700,
            color: '#fff',
            textDecoration: 'none',
            cursor: 'pointer',
            borderBottom: '1px solid transparent',
            transition: 'color .25s ease, border-color .25s ease',
          }}
          onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.color = '#00FF88'; el.style.borderColor = 'rgba(0,255,136,.5)' }}
          onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.color = '#fff'; el.style.borderColor = 'transparent' }}
        >
          {project.name}
        </a>
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
}
