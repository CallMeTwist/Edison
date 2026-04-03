import type { ArtShape } from '@/services/types'

interface Props {
  shape: ArtShape
  h1:    string
  h2:    string
  index: number
}

export const ArtShapeEl: React.FC<Props> = ({ shape, h1, h2, index }) => {
  const base: React.CSSProperties = {
    position:       'absolute',
    inset:           0,
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'center',
    overflow:       'hidden',
  }

  const orb: React.CSSProperties = {
    position:     'absolute',
    width:        '80%',
    height:       '80%',
    borderRadius: '50%',
    background:   `radial-gradient(circle, ${h1}44 0%, ${h1}18 50%, transparent 75%)`,
    animation:    `breathe ${3 + index * 0.4}s ${index * 0.2}s ease-in-out infinite`,
  }

  const shapes: Record<ArtShape, React.ReactNode> = {
    blob1: (
      <div style={{
        width:        '58%', height: '58%',
        borderRadius: '60% 40% 55% 45% / 45% 55% 40% 60%',
        background:   `linear-gradient(145deg, ${h1}70, ${h2}35)`,
        animation:    `spin ${10 + index * 2}s linear infinite`,
      }} />
    ),
    blob2: (
      <div style={{
        width:        '54%', height: '54%',
        borderRadius: '40% 60% 45% 55% / 55% 45% 60% 40%',
        background:   `conic-gradient(from ${index * 60}deg, ${h1}60, ${h2}25, ${h1}60)`,
        animation:    `spin ${13 + index}s linear infinite`,
      }} />
    ),
    blob3: (
      <div style={{
        width:        '60%', height: '50%',
        borderRadius: '70% 30% 60% 40% / 40% 60% 30% 70%',
        background:   `linear-gradient(${index * 45}deg, ${h1}65, ${h2}30)`,
        animation:    `spin ${11 + index * 1.5}s linear infinite reverse`,
      }} />
    ),
    diamond: (
      <div style={{
        width: '44%', height: '44%',
        background:   `linear-gradient(145deg, ${h1}60, ${h2}25)`,
        transform:    'rotate(45deg)',
        borderRadius:  8,
        animation:    `breathe ${3.5 + index * 0.3}s ease-in-out infinite`,
        boxShadow:    `0 0 30px ${h1}40`,
      }} />
    ),
    circle: (
      <div style={{
        width: '56%', height: '56%',
        borderRadius: '50%',
        background:   `conic-gradient(from ${index * 45}deg, ${h1}65, ${h2}22, ${h1}65)`,
        animation:    `spin ${9 + index}s linear infinite`,
        boxShadow:    `0 0 40px ${h1}35`,
      }} />
    ),
    triangle: (
      <div style={{
        width: 0, height: 0,
        borderLeft:   '55px solid transparent',
        borderRight:  '55px solid transparent',
        borderBottom: `96px solid ${h1}50`,
        animation:    `breathe ${3 + index * 0.3}s ease-in-out infinite`,
        filter:       `drop-shadow(0 0 14px ${h1}60)`,
      }} />
    ),
    hexagon: (
      <div style={{
        width:      '52%',
        height:     '52%',
        background: `linear-gradient(${index * 30}deg, ${h1}58, ${h2}28)`,
        clipPath:   'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
        animation:  `spin ${14 + index}s linear infinite`,
        boxShadow:  `0 0 35px ${h1}40`,
      }} />
    ),
  }

  return (
    <div style={base}>
      <div style={orb} />
      {shapes[shape]}
      {/* Hatching overlay */}
      <div style={{
        position:        'absolute',
        inset:            0,
        backgroundImage: `repeating-linear-gradient(${index * 30}deg, transparent, transparent 10px, ${h1}07 10px, ${h1}07 11px)`,
      }} />
      {/* Grain */}
      <div style={{
        position:   'absolute',
        inset:       0,
        background: `radial-gradient(ellipse at ${30 + index * 8}% ${40 + index * 6}%, ${h1}22 0%, transparent 65%)`,
        animation:  `breathe ${4 + index * 0.5}s ${index * 0.3}s ease-in-out infinite`,
      }} />
    </div>
  )
}
