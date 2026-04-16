import { useState, useRef, useEffect, type FormEvent } from 'react'
import { useWorld }      from '@/context/WorldContext'
import { useWindowSize } from '@/hooks/useWindowSize'
import { CONTACT_INFO, SERVICE_OPTIONS, type ServiceType } from '@/features/contact/data'
import gsap from '@/lib/gsap'

type SendMethod = 'whatsapp' | 'email'
type FormState  = 'idle' | 'sending' | 'sent' | 'error'

interface FormData {
  name:    string
  service: ServiceType
  message: string
  email:   string
  phone:   string
}

const ACCENT = '#ffffff'

// World-aware accent colours so the form matches the calling world
const WORLD_ACCENT: Record<string, string> = {
  physio:  '#4FC3F7',
  dev:     '#00FF88',
  fitness: '#FF4500',
  art:     '#FF6B9D',
  hub:     '#ffffff',
}

export const ContactPage: React.FC = () => {
  const { navigateTo, prevWorld } = useWorld()
  const { isMobile }              = useWindowSize()

  const accent = WORLD_ACCENT[prevWorld] ?? ACCENT

  const [formState, setFormState] = useState<FormState>('idle')
  const [method,    setMethod]    = useState<SendMethod>('whatsapp')
  const [data, setData]           = useState<FormData>({
    name:    '',
    service: 'General Enquiry',
    message: '',
    email:   '',
    phone:   '',
  })

  const gradientRef    = useRef<HTMLDivElement>(null)
  const leftPanelRef   = useRef<HTMLDivElement>(null)
  const rightPanelRef  = useRef<HTMLDivElement>(null)
  const sliderRef      = useRef<HTMLDivElement>(null)
  const successRef     = useRef<HTMLDivElement>(null)

  // Page entry animation
  useEffect(() => {
    const noMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (noMotion) return

    const tweens: gsap.core.Tween[] = []

    // Animated background gradient fade in
    if (gradientRef.current) {
      tweens.push(gsap.fromTo(gradientRef.current, { opacity: 0 }, { opacity: 1, duration: 1.2, ease: 'power2.out' }))
    }

    // Stagger panels in
    const panels = [leftPanelRef.current, rightPanelRef.current].filter(Boolean) as HTMLDivElement[]
    if (panels.length) {
      tweens.push(gsap.fromTo(panels, { opacity: 0, y: 24 }, { opacity: 1, y: 0, stagger: 0.18, duration: 0.65, ease: 'power2.out' }))
    }

    return () => { tweens.forEach(t => t.kill()) }
  }, [])

  // Method toggle slider animation
  useEffect(() => {
    if (!sliderRef.current) return
    const noMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (noMotion) return
    const tween = gsap.to(sliderRef.current, {
      x: method === 'whatsapp' ? 0 : '100%',
      duration: 0.32,
      ease: 'power2.inOut',
    })
    return () => { tween.kill() }
  }, [method])

  // Success state animation
  useEffect(() => {
    if (formState !== 'sent' || !successRef.current) return
    const noMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (noMotion) return
    gsap.fromTo(
      successRef.current,
      { scale: 0.82, opacity: 0, y: 16 },
      { scale: 1, opacity: 1, y: 0, duration: 0.58, ease: 'back.out(1.7)' }
    )
  }, [formState])

  const set = (key: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setData(prev => ({ ...prev, [key]: e.target.value }))

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!data.name || !data.message) return

    setFormState('sending')

    try {
      if (method === 'whatsapp') {
        const text = encodeURIComponent(
          `*New enquiry from portfolio*\n\n` +
          `*Name:* ${data.name}\n` +
          `*Service:* ${data.service}\n` +
          (data.email ? `*Email:* ${data.email}\n` : '') +
          (data.phone ? `*Phone:* ${data.phone}\n` : '') +
          `\n*Message:*\n${data.message}`
        )
        window.open(`${CONTACT_INFO.whatsapp.link}?text=${text}`, '_blank')
        setFormState('sent')
      } else {
        const subject = encodeURIComponent(`Portfolio Enquiry — ${data.service}`)
        const body    = encodeURIComponent(
          `Name: ${data.name}\nService: ${data.service}\n` +
          (data.phone ? `Phone: ${data.phone}\n` : '') +
          `\n${data.message}`
        )
        window.open(`${CONTACT_INFO.email.link}?subject=${subject}&body=${body}`, '_blank')
        setFormState('sent')
      }
    } catch {
      setFormState('error')
    }
  }

  // GSAP-powered input focus/blur glow
  const onInputFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    gsap.to(e.currentTarget, { boxShadow: `0 0 0 1px ${accent}55, 0 0 20px ${accent}20`, duration: 0.28 })
    e.currentTarget.style.borderColor = `${accent}55`
    e.currentTarget.style.background  = `rgba(255,255,255,.06)`
  }

  const onInputBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    gsap.to(e.currentTarget, { boxShadow: 'none', duration: 0.28 })
    e.currentTarget.style.borderColor = 'rgba(255,255,255,.12)'
    e.currentTarget.style.background  = 'rgba(255,255,255,.04)'
  }

  // Input shared style
  const inputStyle: React.CSSProperties = {
    width:           '100%',
    padding:         '12px 16px',
    background:      'rgba(255,255,255,.04)',
    border:          `1px solid rgba(255,255,255,.12)`,
    borderRadius:     10,
    color:           '#fff',
    fontFamily:      "'Syne', sans-serif",
    fontSize:         13,
    outline:         'none',
    transition:      'border-color .25s ease',
  }

  const labelStyle: React.CSSProperties = {
    display:       'block',
    fontFamily:    "'Space Mono', monospace",
    fontSize:       9,
    letterSpacing:  4,
    textTransform: 'uppercase',
    color:         `${accent}80`,
    marginBottom:   7,
  }

  return (
    <div
      style={{
        position:       'fixed',
        inset:           0,
        zIndex:          10,
        display:        'flex',
        flexDirection:  isMobile ? 'column' : 'row',
        alignItems:     'stretch',
        animation:      'worldIn .65s ease forwards',
        overflowY:      'auto',
      }}
    >
      {/* Animated world-accent gradient background */}
      <div
        ref={gradientRef}
        style={{
          position:   'fixed',
          inset:       0,
          background: `radial-gradient(ellipse at 38% 35%, ${accent}08 0%, rgba(14,10,30,.97) 55%, rgba(0,0,0,.99) 100%)`,
          pointerEvents: 'none',
          zIndex:      0,
        }}
      />

      {/* Grid overlay — accent aware */}
      <div style={{ position:'absolute', inset:0, backgroundImage:`linear-gradient(${accent}07 1px,transparent 1px),linear-gradient(90deg,${accent}07 1px,transparent 1px)`, backgroundSize:'55px 55px', pointerEvents:'none', zIndex:1 }} />

      {/* ── Left info panel ── */}
      <div
        ref={leftPanelRef}
        style={{
          flex:           isMobile ? '0 0 auto' : '0 0 40%',
          padding:         isMobile ? '48px 24px 24px' : '80px 52px',
          display:        'flex',
          flexDirection:  'column',
          justifyContent: 'center',
          gap:             28,
          borderRight:     isMobile ? 'none' : `1px solid ${accent}12`,
          position:       'relative',
          zIndex:          2,
        }}
      >
        {/* Back button */}
        <button
          onClick={() => navigateTo(prevWorld)}
          style={{
            position:      'absolute',
            top:            24,
            left:           isMobile ? 20 : 52,
            background:   `${accent}10`,
            border:        `1px solid ${accent}28`,
            color:         `${accent}80`,
            padding:       '8px 20px',
            borderRadius:   100,
            cursor:        'pointer',
            fontFamily:    "'Space Mono', monospace",
            fontSize:       9,
            letterSpacing:  2,
            textTransform: 'uppercase',
            backdropFilter:'blur(10px)',
            transition:    'all .28s ease',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = accent }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = `${accent}80` }}
        >
          ← Back
        </button>

        {/* World label */}
        <div>
          <div style={{ fontFamily:"'Space Mono',monospace", fontSize:9, letterSpacing:6, color:`${accent}50`, textTransform:'uppercase', marginBottom:10 }}>
            Get In Touch
          </div>
          <h1
            style={{
              fontFamily:   "'Syne', sans-serif",
              fontSize:     'clamp(34px,4.5vw,58px)',
              fontWeight:    800,
              color:        '#fff',
              lineHeight:    0.95,
              marginBottom:  18,
            }}
          >
            Let's Build<br />
            <span style={{ color: accent }}>Something Real</span>
          </h1>
          <p style={{ color:'rgba(255,255,255,.42)', fontSize:13.5, lineHeight:1.9, maxWidth:380, fontFamily:"'Syne',sans-serif" }}>
            Whether you need physiotherapy guidance, a new digital product, a fitness transformation or a commissioned artwork — I'd love to hear from you.
          </p>
        </div>

        {/* Contact method icons */}
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {/* WhatsApp */}
          <a
            href={CONTACT_INFO.whatsapp.link}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display:       'flex',
              alignItems:    'center',
              gap:            14,
              padding:       '14px 18px',
              background:   `rgba(37,211,102,.06)`,
              border:        `1px solid rgba(37,211,102,.18)`,
              borderRadius:   12,
              textDecoration:'none',
              transition:    'all .28s ease',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(37,211,102,.13)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(37,211,102,.06)' }}
          >
            <svg width={22} height={22} viewBox="0 0 24 24" fill="#25D366">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            <div>
              <div style={{ color:'#25D366', fontSize:12, fontWeight:600, fontFamily:"'Syne',sans-serif" }}>WhatsApp</div>
              <div style={{ color:'rgba(255,255,255,.4)', fontSize:11, fontFamily:"'Space Mono',monospace" }}>{CONTACT_INFO.whatsapp.display}</div>
            </div>
          </a>

          {/* Email */}
          <a
            href={CONTACT_INFO.email.link}
            style={{
              display:       'flex',
              alignItems:    'center',
              gap:            14,
              padding:       '14px 18px',
              background:   `${accent}07`,
              border:        `1px solid ${accent}18`,
              borderRadius:   12,
              textDecoration:'none',
              transition:    'all .28s ease',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = `${accent}14` }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = `${accent}07` }}
          >
            <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
              <rect x={2} y={4} width={20} height={16} rx={2}/>
              <path d="M2 7l10 7 10-7"/>
            </svg>
            <div>
              <div style={{ color: accent, fontSize:12, fontWeight:600, fontFamily:"'Syne',sans-serif" }}>Email</div>
              <div style={{ color:'rgba(255,255,255,.4)', fontSize:11, fontFamily:"'Space Mono',monospace" }}>{CONTACT_INFO.email.address}</div>
            </div>
          </a>
        </div>

        {/* Response time note */}
        <div style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 16px', background:'rgba(255,255,255,.03)', border:'1px solid rgba(255,255,255,.07)', borderRadius:10 }}>
          <div style={{ width:8, height:8, borderRadius:'50%', background: accent, animation:'breathe 2s ease-in-out infinite', flexShrink:0 }} />
          <span style={{ fontSize:11, color:'rgba(255,255,255,.38)', fontFamily:"'Space Mono',monospace" }}>
            Typically responds within 24 hours
          </span>
        </div>
      </div>

      {/* ── Right: Form ── */}
      <div
        ref={rightPanelRef}
        style={{
          flex:    1,
          padding:  isMobile ? '0 24px 48px' : '80px 52px',
          display: 'flex',
          flexDirection:'column',
          justifyContent:'center',
          position:'relative',
          zIndex:   2,
        }}
      >
        {/* Send method toggle with animated slider */}
        <div style={{ marginBottom:28 }}>
          <div style={{ position:'relative', display:'flex', gap:0, background:'rgba(255,255,255,.04)', borderRadius:100, padding:3, width:'fit-content' }}>
            {/* Animated slider bar */}
            <div
              ref={sliderRef}
              style={{
                position:     'absolute',
                bottom:        0,
                left:          0,
                width:        '50%',
                height:         2,
                background:    accent,
                borderRadius:  100,
                boxShadow:    `0 0 8px ${accent}`,
              }}
            />
            {(['whatsapp', 'email'] as SendMethod[]).map(m => (
              <button
                key={m}
                onClick={() => setMethod(m)}
                style={{
                  padding:      '8px 20px',
                  background:    method === m ? `${accent}18` : 'transparent',
                  border:       `1px solid ${method === m ? `${accent}55` : 'rgba(255,255,255,.1)'}`,
                  borderRadius:  100,
                  color:         method === m ? accent : 'rgba(255,255,255,.4)',
                  cursor:       'pointer',
                  fontFamily:   "'Space Mono', monospace",
                  fontSize:      10,
                  letterSpacing:  1.5,
                  textTransform: 'uppercase',
                  transition:   'all .25s ease',
                  position:     'relative',
                  zIndex:         1,
                }}
              >
                {m === 'whatsapp' ? '💬 WhatsApp' : '✉️ Email'}
              </button>
            ))}
          </div>
        </div>

        {formState === 'sent' ? (
          /* ── Success state ── */
          <div
            ref={successRef}
            style={{
              display:        'flex',
              flexDirection:  'column',
              alignItems:     'center',
              justifyContent: 'center',
              gap:             20,
              padding:        '60px 0',
              textAlign:      'center',
            }}
          >
            <div style={{ width:72, height:72, borderRadius:'50%', background:`${accent}18`, border:`2px solid ${accent}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:32 }}>
              ✓
            </div>
            <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:28, fontWeight:800, color:'#fff' }}>Message Sent!</h2>
            <p style={{ color:'rgba(255,255,255,.45)', fontFamily:"'Syne',sans-serif", fontSize:14, lineHeight:1.8, maxWidth:340 }}>
              {method === 'whatsapp'
                ? 'WhatsApp opened with your message pre-filled. Send it and I\'ll reply within 24 hours.'
                : 'Your email client opened. Hit send and I\'ll get back to you shortly.'}
            </p>
            <button
              onClick={() => setFormState('idle')}
              style={{ padding:'11px 28px', background:`${accent}18`, border:`1px solid ${accent}40`, borderRadius:100, color:accent, cursor:'pointer', fontFamily:"'Space Mono',monospace", fontSize:10, letterSpacing:2, textTransform:'uppercase', transition:'all .25s' }}
            >
              Send Another
            </button>
          </div>
        ) : (
          /* ── Form ── */
          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:18 }}>
            {/* Name + Service row */}
            <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap:14 }}>
              <div>
                <label style={labelStyle}>Your Name *</label>
                <input
                  required
                  type="text"
                  placeholder="Alex Rivera"
                  value={data.name}
                  onChange={set('name')}
                  style={inputStyle}
                  onFocus={onInputFocus}
                  onBlur={onInputBlur}
                />
              </div>
              <div>
                <label style={labelStyle}>Service *</label>
                <select
                  value={data.service}
                  onChange={set('service')}
                  style={{ ...inputStyle, cursor:'pointer' }}
                  onFocus={onInputFocus}
                  onBlur={onInputBlur}
                >
                  {SERVICE_OPTIONS.map(s => (
                    <option key={s} value={s} style={{ background:'#0a0a0a' }}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Email + Phone row */}
            <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap:14 }}>
              <div>
                <label style={labelStyle}>Email (optional)</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={data.email}
                  onChange={set('email')}
                  style={inputStyle}
                  onFocus={onInputFocus}
                  onBlur={onInputBlur}
                />
              </div>
              <div>
                <label style={labelStyle}>Phone (optional)</label>
                <input
                  type="tel"
                  placeholder="+234 800 000 0000"
                  value={data.phone}
                  onChange={set('phone')}
                  style={inputStyle}
                  onFocus={onInputFocus}
                  onBlur={onInputBlur}
                />
              </div>
            </div>

            {/* Message */}
            <div>
              <label style={labelStyle}>Message *</label>
              <textarea
                required
                rows={isMobile ? 4 : 5}
                placeholder="Tell me about your project, goal, or question…"
                value={data.message}
                onChange={set('message')}
                style={{ ...inputStyle, resize:'vertical', lineHeight:1.8 }}
                onFocus={onInputFocus}
                onBlur={onInputBlur}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={formState === 'sending'}
              style={{
                padding:      '14px 36px',
                background:   `linear-gradient(135deg, ${accent}CC, ${accent}88)`,
                border:       'none',
                borderRadius:  100,
                color:        formState === 'sending' ? 'rgba(0,0,0,.5)' : '#000',
                cursor:        formState === 'sending' ? 'not-allowed' : 'pointer',
                fontFamily:   "'Syne', sans-serif",
                fontSize:      15,
                fontWeight:    700,
                width:        'fit-content',
                minWidth:      200,
                transition:   'all .3s ease',
                boxShadow:    `0 8px 30px ${accent}30`,
                opacity:       formState === 'sending' ? 0.7 : 1,
              }}
              onMouseEnter={e => {
                if (formState !== 'sending') {
                  (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.04) translateY(-2px)'
                  ;(e.currentTarget as HTMLButtonElement).style.boxShadow = `0 14px 40px ${accent}50`
                }
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.transform = ''
                ;(e.currentTarget as HTMLButtonElement).style.boxShadow = `0 8px 30px ${accent}30`
              }}
            >
              {formState === 'sending'
                ? 'Opening…'
                : method === 'whatsapp'
                  ? '💬 Send via WhatsApp'
                  : '✉️ Send via Email'}
            </button>

            <p style={{ fontSize:10.5, color:'rgba(255,255,255,.22)', fontFamily:"'Space Mono',monospace", lineHeight:1.7 }}>
              Clicking send will open {method === 'whatsapp' ? 'WhatsApp' : 'your email client'} with your message pre-filled.
              No data is stored on this site.
            </p>
          </form>
        )}
      </div>

      {/* Ambient glow */}
      <div style={{ position:'absolute', bottom:'-10%', right:'-5%', width:350, height:350, borderRadius:'50%', background:`radial-gradient(circle,${accent}06 0%,transparent 70%)`, pointerEvents:'none', animation:'breathe 5s ease-in-out infinite', zIndex:1 }} />
    </div>
  )
}
