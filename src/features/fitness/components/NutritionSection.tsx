import { NUTRITION_PRINCIPLES, MACRO_DATA, SUPPLEMENTS } from '../data'

const ACCENT = '#FF4500'
const DIM    = 'rgba(255,255,255,.38)'

const EvidenceBadge: React.FC<{ grade: 'A' | 'B' | 'C' }> = ({ grade }) => {
  const colors = { A: '#4CAF50', B: '#FF9800', C: '#9E9E9E' }
  return (
    <span style={{
      padding:      '1px 7px',
      background:   `${colors[grade]}22`,
      border:       `1px solid ${colors[grade]}55`,
      borderRadius:  4,
      color:         colors[grade],
      fontSize:       9,
      fontFamily:   "'Space Mono', monospace",
      letterSpacing:  0.5,
    }}>
      Grade {grade}
    </span>
  )
}

export const NutritionSection: React.FC = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

    {/* ── Section header ── */}
    <div>
      <div style={{ fontSize: 9, letterSpacing: 6, color: 'rgba(255,69,0,.5)', fontFamily: "'Space Mono', monospace", textTransform: 'uppercase', marginBottom: 8 }}>
        NUTRITION METHODOLOGY
      </div>
      <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(28px,3.5vw,46px)', color: '#fff', letterSpacing: 2, lineHeight: 0.95, marginBottom: 12 }}>
        FOOD IS <span style={{ color: ACCENT }}>FUEL,</span> NOT PUNISHMENT
      </h2>
      <p style={{ color: DIM, fontSize: 13, lineHeight: 1.9, maxWidth: 520 }}>
        Sustainable body composition change is 70% nutrition. My approach fuses metabolic science, behaviour psychology and real-world practicality — no crash diets, no starvation.
      </p>
    </div>

    {/* ── 6 principle cards ── */}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10 }}>
      {NUTRITION_PRINCIPLES.map((p, i) => (
        <div
          key={p.title}
          style={{
            padding:      '16px',
            background:   'rgba(255,69,0,.04)',
            border:       '1px solid rgba(255,69,0,.12)',
            borderRadius:  12,
            transition:    'all .32s ease',
            animation:    `nutritionSlide .6s ${i * 0.08}s ease both`,
            cursor:        'default',
          }}
          onMouseEnter={e => {
            const el = e.currentTarget as HTMLDivElement
            el.style.borderColor = 'rgba(255,69,0,.38)'
            el.style.transform   = 'translateY(-4px)'
            el.style.boxShadow   = '0 12px 30px rgba(255,69,0,.1)'
          }}
          onMouseLeave={e => {
            const el = e.currentTarget as HTMLDivElement
            el.style.borderColor = 'rgba(255,69,0,.12)'
            el.style.transform   = ''
            el.style.boxShadow   = ''
          }}
        >
          <div style={{ fontSize: 22, marginBottom: 8 }}>{p.icon}</div>
          <h4 style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 6 }}>
            {p.title}
          </h4>
          <p style={{ fontSize: 11.5, color: DIM, lineHeight: 1.75 }}>{p.desc}</p>
        </div>
      ))}
    </div>

    {/* ── Macro split ── */}
    <div style={{ padding: '20px', background: 'rgba(255,69,0,.03)', border: '1px solid rgba(255,69,0,.1)', borderRadius: 14 }}>
      <div style={{ fontSize: 9, letterSpacing: 5, color: 'rgba(255,69,0,.4)', fontFamily: "'Space Mono', monospace", marginBottom: 14 }}>
        MACRO SPLIT TEMPLATE
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {MACRO_DATA.map(m => {
          const w = `${m.pct}%`
          return (
            <div key={m.label}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                <span style={{ fontSize: 12, color: '#fff', fontFamily: "'Space Mono', monospace" }}>{m.label}</span>
                <span style={{ fontSize: 11, color: m.color, fontFamily: "'Space Mono', monospace" }}>{m.pct}% · {m.desc}</span>
              </div>
              <div style={{ height: 6, background: 'rgba(255,255,255,.07)', borderRadius: 100, overflow: 'hidden' }}>
                <div style={{
                  height:       '100%',
                  width:         w,
                  background:   `linear-gradient(90deg, ${m.color}, ${m.color}88)`,
                  borderRadius:  100,
                  boxShadow:    `0 0 10px ${m.color}60`,
                  animation:    `ringFill 1.5s ease both`,
                  // re-use same animation concept via width transition
                  transition:   'width 1.6s cubic-bezier(.23,1,.32,1)',
                }} />
              </div>
            </div>
          )
        })}
      </div>
    </div>

    {/* ── Supplement guide ── */}
    <div>
      <div style={{ fontSize: 9, letterSpacing: 5, color: 'rgba(255,69,0,.4)', fontFamily: "'Space Mono', monospace", marginBottom: 12 }}>
        EVIDENCE-BASED SUPPLEMENT GUIDE
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 8 }}>
        {SUPPLEMENTS.map(s => (
          <div
            key={s.name}
            style={{
              display:        'flex',
              justifyContent: 'space-between',
              alignItems:     'center',
              padding:        '10px 14px',
              background:     'rgba(255,69,0,.03)',
              border:         '1px solid rgba(255,69,0,.09)',
              borderRadius:    9,
              gap:             10,
            }}
          >
            <div>
              <div style={{ color: '#fff', fontSize: 12, fontWeight: 600, marginBottom: 2 }}>{s.name}</div>
              <div style={{ color: DIM, fontSize: 10.5 }}>{s.benefit}</div>
            </div>
            <EvidenceBadge grade={s.evidence} />
          </div>
        ))}
      </div>
      <p style={{ marginTop: 10, fontSize: 10, color: 'rgba(255,255,255,.22)', fontFamily: "'Space Mono', monospace", lineHeight: 1.7 }}>
        Evidence grades: A = strong RCT support · B = moderate evidence · C = preliminary / emerging
      </p>
    </div>

    {/* ── Sample meal timing ── */}
    <div style={{ padding: '20px', background: 'rgba(255,69,0,.03)', border: '1px solid rgba(255,69,0,.09)', borderRadius: 14 }}>
      <div style={{ fontSize: 9, letterSpacing: 5, color: 'rgba(255,69,0,.4)', fontFamily: "'Space Mono', monospace", marginBottom: 14 }}>
        SAMPLE NUTRIENT TIMING (Training Day)
      </div>
      {[
        { time: '07:00', meal: 'Pre-Workout',  content: 'Oats + whey protein + banana — ~500 kcal, 45g carbs, 35g protein' },
        { time: '09:30', meal: 'Intra-Workout', content: 'BCAAs / EAAs + electrolytes if session > 75 min' },
        { time: '11:00', meal: 'Post-Workout', content: 'Chicken + rice + greens — anabolic window, high protein, high carb' },
        { time: '14:30', meal: 'Lunch',        content: 'Lean protein + complex carbs + colourful vegetables, fibre focus' },
        { time: '18:00', meal: 'Dinner',       content: 'Salmon or beef + roasted veg + small portion complex carb' },
        { time: '21:00', meal: 'Evening',      content: 'Casein shake or cottage cheese — slow-digesting protein overnight' },
      ].map((row, i) => (
        <div
          key={row.time}
          style={{
            display:       'grid',
            gridTemplateColumns: '60px 100px 1fr',
            gap:            12,
            padding:       '9px 0',
            borderBottom:   i < 5 ? '1px solid rgba(255,69,0,.06)' : 'none',
            alignItems:    'start',
            animation:     `nutritionSlide .5s ${i * .07}s ease both`,
          }}
        >
          <span style={{ color: ACCENT, fontFamily: "'Space Mono', monospace", fontSize: 10, paddingTop: 1 }}>{row.time}</span>
          <span style={{ color: '#fff', fontSize: 11, fontWeight: 600 }}>{row.meal}</span>
          <span style={{ color: DIM, fontSize: 11, lineHeight: 1.6 }}>{row.content}</span>
        </div>
      ))}
    </div>

  </div>
)
