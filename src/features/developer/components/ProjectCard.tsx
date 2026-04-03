import { useState } from 'react'
import type { Project } from '@/services/types'

interface Props { project: Project; delay?: number }

export const ProjectCard: React.FC<Props> = ({ project, delay = 0 }) => {
  const [hov, setHov] = useState(false)

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background:   'rgba(0,255,136,.03)',
        border:       `1px solid ${hov ? 'rgba(0,255,136,.42)' : 'rgba(0,255,136,.10)'}`,
        borderRadius: 12,
        padding:      '18px 20px',
        cursor:       'pointer',
        transition:   'border-color .3s ease, box-shadow .3s ease, transform .3s ease',
        transform:    hov ? 'translateY(-4px)' : 'none',
        boxShadow:    hov ? '0 14px 40px rgba(0,255,136,.08)' : 'none',
        position:     'relative',
        overflow:     'hidden',
        animation:    `fadeUp .8s ${delay}s ease both`,
        flexShrink:    0,
      }}
    >
      {/* Scan highlight */}
      <div style={{
        position:   'absolute',
        top:         0,
        left:        hov ? '110%' : '-110%',
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
}
