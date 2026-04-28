import { useState, useEffect, useRef } from 'react'
import { useWorld } from '@/context/WorldContext'
import { useWindowSize } from '@/hooks/useWindowSize'
import { BackButton } from '@/components/ui/BackButton'
import { Terminal } from '@/features/developer/components/Terminal'
import { ProjectCard } from '@/features/developer/components/ProjectCard'
import { DevGrid3D } from '@/features/developer/components/DevGrid3D'
import { PROJECTS, TIMELINE, OPEN_SOURCE, TECH_STACK } from '@/features/developer/data'
import gsap from '@/lib/gsap'
import MatrixRain from '@/features/developer/components/MatrixRain'

const ACC = '#00FF88'
const TABS = ['Projects', 'Timeline', 'Open Source', 'Tech Stack'] as const
type Tab = typeof TABS[number]

const Pill: React.FC<{ active: boolean; color: string; onClick: () => void; label: string }> =
  ({ active, color, onClick, label }) => (
    <button
      onClick={onClick}
      style={{
        padding: '7px 16px',
        background: active ? `${color}18` : 'transparent',
        border: `1px solid ${active ? color + '55' : 'rgba(0,255,136,.12)'}`,
        borderRadius: 100,
        color: active ? color : 'rgba(0,255,136,.45)',
        cursor: 'pointer',
        fontFamily: "'Space Mono', monospace",
        fontSize: 10,
        letterSpacing: 1.5,
        textTransform: 'uppercase',
        transition: 'all .28s ease',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </button>
  )

export const DevPage: React.FC = () => {
  const { navigateTo } = useWorld()
  const { isMobile } = useWindowSize()
  const [tab, setTab] = useState<Tab>('Projects')
  const tabContentRef = useRef<HTMLDivElement>(null)

  // Tab content transition
  useEffect(() => {
    if (!tabContentRef.current) return
    const noMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (noMotion) return
    const tween = gsap.fromTo(
      tabContentRef.current,
      { opacity: 0, x: -18 },
      { opacity: 1, x: 0, duration: 0.32, ease: 'power2.out' }
    )
    return () => { tween.kill() }
  }, [tab])

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 5,
      animation: 'worldIn .65s ease forwards',
      background: 'radial-gradient(ellipse at 60% 20%,rgba(0,16,6,.97) 0%,rgba(0,0,0,.99) 100%)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>

      <DevGrid3D />

      {/* CRT scanlines */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,255,136,.006) 2px,rgba(0,255,136,.006) 4px)', pointerEvents: 'none', zIndex: 1 }} />
      <div style={{ position: 'absolute', left: 0, right: 0, height: 2, background: 'linear-gradient(90deg,transparent,rgba(0,255,136,.25),transparent)', pointerEvents: 'none', zIndex: 2, animation: 'scan 4s linear infinite' }} />

      <BackButton onClick={() => navigateTo('hub')} accent="#00FF88" />

      {/* World label */}
      <div style={{ position: 'absolute', top: 24, left: '50%', transform: 'translateX(-50%)', textAlign: 'center', zIndex: 10, pointerEvents: 'none' }}>
        <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, letterSpacing: 6, color: 'rgba(0,255,136,.35)', marginBottom: 4 }}>SYSTEMS</div>
        <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 'clamp(18px,2.4vw,30px)', color: '#fff', animation: 'glitch 8s 4s ease-in-out infinite' }}>Developer</h2>
      </div>

      {/* Main layout */}
      <div style={{
        position: 'relative',
        zIndex: 5,
        height: '100%',
        display: 'flex',
        gap: isMobile ? 0 : 28,
        padding: isMobile ? '72px 16px 16px' : '76px 4% 24px',
        overflowY: isMobile ? 'auto' : 'hidden',
        overflowX: 'hidden',
        flexDirection: isMobile ? 'column' : 'row',
        WebkitOverflowScrolling: 'touch',
      }}>

        {/* ── Left column ── */}
        <div style={{
          flex: isMobile ? '0 0 auto' : '0 0 36%',
          display: 'flex',
          flexDirection: 'column',
          gap: isMobile ? 10 : 16,
          overflowY: isMobile ? 'visible' : 'auto',
          overflowX: 'hidden',
          flexShrink: 0,
          position: 'relative',
          paddingRight: isMobile ? 0 : 4,
          paddingBottom: isMobile ? 8 : 12,
          maxHeight: isMobile ? 'none' : 'none',
        }}>
          <MatrixRain opacity={0.14} />
          <div style={{ animation: 'fadeUp .8s .2s ease both' }}>
            <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, letterSpacing: 6, color: 'rgba(0,255,136,.45)', marginBottom: 8 }}>DEV.EXE / ONLINE</div>
            <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: 'clamp(32px,4vw,54px)', fontWeight: 800, color: '#fff', lineHeight: .92, marginBottom: 8 }}>
              Full Stack<br />
              <span style={{ color: ACC, animation: 'glitch 8s 3s ease-in-out infinite' }}>Developer</span>
            </h1>
            <p style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: 'rgba(0,255,136,.38)' }}>
              {">"} 3yrs · TypeScript · Laravel · Cloud Infra · Open Source
            </p>
          </div>

          <Terminal />

          {/* GitHub streak */}
          {(
            <div style={{ padding: '14px 18px', background: 'rgba(0,255,136,.02)', border: '1px solid rgba(0,255,136,.07)', borderRadius: 12, animation: 'fadeUp .8s .6s ease both' }}>
              <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, letterSpacing: 4, color: 'rgba(0,255,136,.3)', marginBottom: 10 }}>CONTRIBUTION_STREAK_2024</div>
              <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                {Array.from({ length: 52 }, (_, i) => (
                  <div key={i} style={{ width: 9, height: 9, borderRadius: 2, background: `rgba(0,255,136,${Math.random() > .38 ? Math.random() * .65 + .18 : .06})`, animation: `breathe ${2 + Math.random() * 2}s ${Math.random()}s ease-in-out infinite` }} />
                ))}
              </div>
            </div>
          )}

          {/* Contact CTA */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', flexShrink: 0 }}>
            <button
              onClick={() => navigateTo('contact')}
              style={{
                padding: '11px 26px',
                background: 'linear-gradient(135deg,rgba(0,255,136,.18),rgba(0,255,136,.06))',
                border: '1px solid rgba(0,255,136,.4)',
                borderRadius: 100,
                color: '#00FF88',
                cursor: 'pointer',
                fontFamily: "'Space Mono',monospace",
                fontSize: 10,
                letterSpacing: 2,
                textTransform: 'uppercase',
                transition: 'all .3s ease',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,255,136,.26)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'linear-gradient(135deg,rgba(0,255,136,.18),rgba(0,255,136,.06))' }}
            >
              Hire Me →
            </button>
          </div>
        </div>

        {/* ── Right column ── */}
        <div style={{ flex: isMobile ? '0 0 auto' : 1, display: 'flex', flexDirection: 'column', gap: 12, overflow: isMobile ? 'visible' : 'hidden', animation: 'fadeUp .8s .3s ease both', minWidth: 0, minHeight: 0, marginTop: isMobile ? 8 : 0 }}>
          {/* Tabs */}
          <div style={{
            display: 'flex',
            gap: 7,
            flexWrap: 'wrap',
            flexShrink: 0,
            position: isMobile ? 'sticky' : 'static',
            top: isMobile ? 0 : 'auto',
            zIndex: 4,
            padding: isMobile ? '10px 0' : 0,
            background: isMobile ? 'linear-gradient(to bottom, rgba(0,8,3,.96) 0%, rgba(0,8,3,.92) 70%, rgba(0,8,3,.7) 100%)' : 'transparent',
            backdropFilter: isMobile ? 'blur(10px)' : 'none',
            WebkitBackdropFilter: isMobile ? 'blur(10px)' : 'none',
            marginLeft: isMobile ? -16 : 0,
            marginRight: isMobile ? -16 : 0,
            paddingLeft: isMobile ? 16 : 0,
            paddingRight: isMobile ? 16 : 0,
          }}>
            {TABS.map(t => (
              <Pill key={t} label={t} active={tab === t} color={ACC} onClick={() => setTab(t)} />
            ))}
          </div>

          {/* Tab content */}
          <div ref={tabContentRef} key={tab} style={{ flex: isMobile ? '0 0 auto' : 1, overflowY: isMobile ? 'visible' : 'auto', overflowX: 'hidden', display: 'flex', flexDirection: 'column', gap: 12, paddingRight: isMobile ? 0 : 4, isolation: 'isolate' }}>

            {/* ── PROJECTS ── */}
            {tab === 'Projects' && PROJECTS.map((p, i) => (
              <ProjectCard key={p.name} project={p} delay={i * 0.08} />
            ))}

            {/* ── TIMELINE ── */}
            {tab === 'Timeline' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {TIMELINE.map((entry, i) => (
                  <div key={entry.year + i} style={{ display: 'flex', gap: 16, paddingBottom: 20, position: 'relative', animation: `fadeUp .6s ${i * .1}s ease both` }}>
                    {/* Timeline spine */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: ACC, boxShadow: `0 0 10px ${ACC}`, flexShrink: 0, marginTop: 4 }} />
                      {i < TIMELINE.length - 1 && <div style={{ width: 1, flex: 1, background: 'rgba(0,255,136,.15)', marginTop: 6 }} />}
                    </div>
                    <div style={{ paddingBottom: 4 }}>
                      <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: 'rgba(0,255,136,.5)', marginBottom: 3 }}>{entry.year}</div>
                      <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 2 }}>{entry.role}</h3>
                      <div style={{ fontSize: 11, color: 'rgba(0,255,136,.45)', fontFamily: "'Space Mono',monospace", marginBottom: 6 }}>{entry.org}</div>
                      <p style={{ fontSize: 12.5, color: 'rgba(255,255,255,.4)', lineHeight: 1.7 }}>{entry.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ── OPEN SOURCE ── */}
            {tab === 'Open Source' && OPEN_SOURCE.map((pkg, i) => (
              <div key={pkg.name} style={{ background: 'rgba(0,255,136,.03)', border: '1px solid rgba(0,255,136,.1)', borderRadius: 12, padding: '16px 20px', animation: `fadeUp .6s ${i * .1}s ease both`, cursor: 'pointer', transition: 'all .3s' }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = 'rgba(0,255,136,.38)'; el.style.transform = 'translateY(-3px)' }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = 'rgba(0,255,136,.1)'; el.style.transform = '' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                  <div>
                    <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 13, color: ACC }}>~/</span>
                    <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 16, fontWeight: 700, color: '#fff' }}>{pkg.name}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 10, fontSize: 10, fontFamily: "'Space Mono',monospace" }}>
                    <span style={{ color: 'rgba(255,215,0,.7)' }}>★ {pkg.stars.toLocaleString()}</span>
                    <span style={{ padding: '2px 8px', background: 'rgba(0,255,136,.07)', border: '1px solid rgba(0,255,136,.15)', borderRadius: 4, color: 'rgba(0,255,136,.6)' }}>{pkg.lang}</span>
                  </div>
                </div>
                <p style={{ fontSize: 12.5, color: 'rgba(255,255,255,.42)', lineHeight: 1.7 }}>{pkg.desc}</p>
              </div>
            ))}

            {/* ── TECH STACK ── */}
            {tab === 'Tech Stack' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {(Object.entries(TECH_STACK) as [string, string[]][]).map(([cat, items], ci) => (
                  <div key={cat} style={{ animation: `fadeUp .6s ${ci * .08}s ease both` }}>
                    <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, letterSpacing: 4, color: 'rgba(0,255,136,.35)', marginBottom: 9, textTransform: 'uppercase' }}>
                      {cat.replace('_', ' / ')}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                      {items.map(s => (
                        <span key={s} style={{ padding: '5px 12px', background: 'rgba(0,255,136,.05)', border: '1px solid rgba(0,255,136,.12)', borderRadius: 7, color: 'rgba(0,255,136,.75)', fontSize: 11, fontFamily: "'Space Mono',monospace", transition: 'all .25s' }}
                          onMouseEnter={e => { const el = e.currentTarget as HTMLSpanElement; el.style.background = 'rgba(0,255,136,.14)'; el.style.borderColor = 'rgba(0,255,136,.4)' }}
                          onMouseLeave={e => { const el = e.currentTarget as HTMLSpanElement; el.style.background = 'rgba(0,255,136,.05)'; el.style.borderColor = 'rgba(0,255,136,.12)' }}
                        >{s}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Corner glow */}
      <div style={{ position: 'absolute', bottom: '5%', right: '5%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle,rgba(0,255,136,.05) 0%,transparent 70%)', pointerEvents: 'none' }} />
    </div>
  )
}
