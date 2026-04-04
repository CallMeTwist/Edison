import { useState } from 'react'
import { useWorld }     from '@/context/WorldContext'
import { useWindowSize } from '@/hooks/useWindowSize'
import { BackButton }   from '@/components/ui/BackButton'
import { BodyModel3D }  from '@/features/physio/components/BodyModel3D'
import { BODY_DATA, PHYSIO_SERVICES, PHYSIO_STATS } from '@/features/physio/data'
import type { BodyRegionId } from '@/services/types'

const ACC = '#4FC3F7'

export const PhysioPage: React.FC = () => {
  const { navigateTo }    = useWorld()
  const { isMobile }      = useWindowSize()
  const [sel, setSel]     = useState<BodyRegionId | null>(null)
  const [_hov, setHov]    = useState<BodyRegionId | null>(null)

  const info = sel ? BODY_DATA[sel] : null

  return (
    <div style={{
      position:   'fixed',
      inset:       0,
      zIndex:      5,
      display:    'flex',
      flexDirection: isMobile ? 'column' : 'row',
      animation:  'worldIn .65s ease forwards',
      background: 'radial-gradient(ellipse at 28% 55%,rgba(5,20,45,.97) 0%,rgba(0,2,10,.99) 100%)',
      overflowY:   isMobile ? 'auto' : 'hidden',
    }}>

      {/* Grid overlay */}
      <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(79,195,247,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(79,195,247,.04) 1px,transparent 1px)', backgroundSize:'60px 60px', pointerEvents:'none', zIndex:0 }} />

      {/* Scan beam */}
      <div style={{ position:'absolute', left:0, right:0, height:2, background:'linear-gradient(90deg,transparent,rgba(79,195,247,.28),transparent)', pointerEvents:'none', zIndex:2, animation:'scan 5.5s linear infinite' }} />

      <BackButton onClick={() => navigateTo('hub')} accent="#4FC3F7" />

        

      {/* World label */}
      <div style={{ position:'absolute', top:24, left:'50%', transform:'translateX(-50%)', textAlign:'center', zIndex:10, pointerEvents:'none' }}>
        <div style={{ fontFamily:"'Space Mono',monospace", fontSize:9, letterSpacing:6, color:'rgba(79,195,247,.4)', marginBottom:4 }}>WORLD 01</div>
        <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:'clamp(18px,2.4vw,30px)', color:'#fff' }}>Physiotherapy</h2>
      </div>

      {/* ── 3D Body Column ── */}
      <div style={{
        flex:            isMobile ? '0 0 auto' : '0 0 44%',
        height:           isMobile ? 360 : '100%',
        display:         'flex',
        alignItems:      'center',
        justifyContent:  'center',
        paddingTop:       isMobile ? 80 : 72,
        paddingBottom:    isMobile ? 0 : 0,
        position:        'relative',
        zIndex:           5,
        animation:       'fadeUp .8s .2s ease both',
      }}>
        <BodyModel3D onSelect={setSel} onHover={setHov} />

        {!isMobile && (
          <div style={{ position:'absolute', bottom:28, left:'50%', transform:'translateX(-50%)', fontFamily:"'Space Mono',monospace", fontSize:9, letterSpacing:3, color:'rgba(79,195,247,.3)', textTransform:'uppercase', textAlign:'center', animation:'pulse 2.5s ease-in-out infinite', whiteSpace:'nowrap' }}>
            Drag · Rotate · Click
          </div>
        )}
      </div>

      {/* ── Info Column ── */}
      <div style={{
        flex:        1,
        display:    'flex',
        flexDirection:'column',
        justifyContent:'center',
        padding:     isMobile ? '24px 20px 32px' : '88px 44px 40px',
        zIndex:       5,
        gap:           22,
        overflowY:   'auto',
        animation:   'fadeUp .8s .35s ease both',
      }}>

        {/* Stats row */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8 }}>
          {PHYSIO_STATS.map(s => (
            <div key={s.label} style={{ padding:'10px', background:'rgba(79,195,247,.04)', border:'1px solid rgba(79,195,247,.1)', borderRadius:10, textAlign:'center' }}>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:20, fontWeight:800, color:ACC, marginBottom:3 }}>{s.value}</div>
              <div style={{ fontSize:9.5, color:'rgba(255,255,255,.35)', fontFamily:"'Space Mono',monospace", lineHeight:1.5 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Body region panel */}
        {!info ? (
          <div>
            <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:'clamp(28px,3.5vw,50px)', fontWeight:800, color:'#fff', lineHeight:1.05, marginBottom:16 }}>
              Evidence-Based<br />
              <span style={{ color:ACC }}>Physiotherapy</span>
            </h1>
            <p style={{ color:'rgba(255,255,255,.4)', fontSize:13.5, lineHeight:1.9, maxWidth:400, marginBottom:20 }}>
              Specialising in musculoskeletal rehabilitation, sports injuries, chronic pain management and movement re-education.
            </p>
            <p style={{ color:'rgba(79,195,247,.5)', fontSize:12, fontFamily:"'Space Mono',monospace", animation:'pulse 2s ease-in-out infinite' }}>
              {isMobile ? 'Tap the diagram below' : '← Click a body region on the model'}
            </p>
          </div>
        ) : (
          <div key={sel} style={{ animation:'fadeUp .4s ease forwards' }}>
            <div style={{ fontSize:9, letterSpacing:6, color:'rgba(79,195,247,.5)', fontFamily:"'Space Mono',monospace", textTransform:'uppercase', marginBottom:10 }}>Treatment Focus</div>
            <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:'clamp(22px,2.8vw,38px)', fontWeight:800, color:'#fff', marginBottom:14, lineHeight:1.1 }}>
              {info.label}
            </h2>
            <p style={{ color:'rgba(255,255,255,.46)', fontSize:13.5, lineHeight:1.95, marginBottom:20, maxWidth:420 }}>
              {info.desc}
            </p>
            <div style={{ display:'flex', flexWrap:'wrap', gap:7, marginBottom:24 }}>
              {info.tags.map(t => (
                <span key={t} style={{ padding:'5px 13px', background:'rgba(79,195,247,.08)', border:'1px solid rgba(79,195,247,.22)', borderRadius:100, color:ACC, fontSize:11 }}>{t}</span>
              ))}
            </div>
            <button
              onClick={() => navigateTo('contact')}
              style={{ padding:'12px 28px', background:'linear-gradient(135deg,rgba(79,195,247,.16),rgba(79,195,247,.04))', border:'1px solid rgba(79,195,247,.38)', borderRadius:100, color:ACC, cursor:'pointer', fontFamily:"'Space Mono',monospace", fontSize:10, letterSpacing:2, textTransform:'uppercase', transition:'all .3s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(79,195,247,.2)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'linear-gradient(135deg,rgba(79,195,247,.16),rgba(79,195,247,.04))' }}
            >
              Book Consultation →
            </button>
          </div>
        )}

        {/* Services */}
        <div style={{ borderTop:'1px solid rgba(79,195,247,.08)', paddingTop:20 }}>
          <div style={{ fontSize:9, letterSpacing:5, color:'rgba(79,195,247,.3)', fontFamily:"'Space Mono',monospace", marginBottom:12 }}>SERVICES</div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:7 }}>
            {PHYSIO_SERVICES.map(s => (
              <span key={s} style={{ padding:'4px 11px', background:'rgba(79,195,247,.04)', border:'1px solid rgba(79,195,247,.08)', borderRadius:100, color:'rgba(255,255,255,.38)', fontSize:10.5 }}>{s}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Ambient glow */}
      <div style={{ position:'absolute', top:'30%', left:'22%', width:320, height:320, borderRadius:'50%', background:'radial-gradient(circle,rgba(79,195,247,.06) 0%,transparent 70%)', pointerEvents:'none', animation:'breathe 5s ease-in-out infinite' }} />
    </div>
  )
}


// import { useState } from 'react'
// import { useWorld }      from '@/context/WorldContext'
// import { useWindowSize } from '@/hooks/useWindowSize'
// import { BackButton }    from '@/components/ui/BackButton'
// import { BodyModel3D }   from '@/features/physio/components/BodyModel3D'
// import { BODY_DATA, PHYSIO_SERVICES, PHYSIO_STATS } from '@/features/physio/data'
// import type { BodyRegionId } from '@/services/types'

// const ACC = '#4FC3F7'

// export const PhysioPage: React.FC = () => {
//   const { navigateTo }  = useWorld()
//   const { isMobile }    = useWindowSize()
//   const [sel, setSel]   = useState<BodyRegionId | null>(null)
//   const [_hov, setHov]  = useState<BodyRegionId | null>(null)

//   const info = sel ? BODY_DATA[sel] : null

//   /* ════════════════════════════════════════
//      MOBILE LAYOUT
//      Stats bar (always visible) → 3D model
//      → scrollable info panel below
//   ════════════════════════════════════════ */
//   if (isMobile) {
//     return (
//       <div style={{
//         position:      'fixed',
//         inset:          0,
//         zIndex:         5,
//         display:       'flex',
//         flexDirection: 'column',
//         animation:     'worldIn .65s ease forwards',
//         background:    'radial-gradient(ellipse at 28% 55%,rgba(5,20,45,.97) 0%,rgba(0,2,10,.99) 100%)',
//         overflow:      'hidden',
//       }}>
//         {/* Grid + scan */}
//         <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(79,195,247,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(79,195,247,.04) 1px,transparent 1px)', backgroundSize:'55px 55px', pointerEvents:'none' }} />
//         <div style={{ position:'absolute', left:0, right:0, height:2, background:'linear-gradient(90deg,transparent,rgba(79,195,247,.28),transparent)', pointerEvents:'none', zIndex:2, animation:'scan 5.5s linear infinite' }} />

//         <BackButton onClick={() => navigateTo('hub')} accent={ACC} />

//         {/* World label — centred, sits beside back button */}
//         <div style={{ paddingTop:10, textAlign:'center', zIndex:10, flexShrink:0 }}>
//           <div style={{ fontFamily:"'Space Mono',monospace", fontSize:8, letterSpacing:5, color:'rgba(79,195,247,.4)' }}>WORLD 01</div>
//           <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:20, color:'#fff', marginTop:2 }}>Physiotherapy</h2>
//         </div>

//         {/* Stats strip — always above the fold */}
//         <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:6, padding:'10px 14px 0', flexShrink:0, zIndex:5 }}>
//           {PHYSIO_STATS.map(s => (
//             <div key={s.label} style={{ padding:'8px 6px', background:'rgba(79,195,247,.04)', border:'1px solid rgba(79,195,247,.1)', borderRadius:9, textAlign:'center' }}>
//               <div style={{ fontFamily:"'Syne',sans-serif", fontSize:16, fontWeight:800, color:ACC }}>{s.value}</div>
//               <div style={{ fontSize:8, color:'rgba(255,255,255,.35)', fontFamily:"'Space Mono',monospace", lineHeight:1.4, marginTop:2 }}>{s.label}</div>
//             </div>
//           ))}
//         </div>

//         {/* Hint strip */}
//         <div style={{ textAlign:'center', padding:'6px 0 0', flexShrink:0, zIndex:5 }}>
//           <span style={{ fontFamily:"'Space Mono',monospace", fontSize:8, letterSpacing:2, color:'rgba(79,195,247,.35)', animation:'pulse 2.5s ease-in-out infinite' }}>
//             Swipe to rotate · Tap to select
//           </span>
//         </div>

//         {/* 3D model — fixed height */}
//         <div style={{ flex:'0 0 260px', position:'relative', zIndex:5, margin:'0 auto', width:'100%', maxWidth:340 }}>
//           <BodyModel3D onSelect={setSel} onHover={setHov} />
//         </div>

//         {/* Scrollable info below model */}
//         <div style={{ flex:1, overflowY:'auto', padding:'14px 16px 32px', zIndex:5 }}>
//           {!info ? (
//             <div style={{ animation:'fadeUp .5s ease forwards' }}>
//               <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:26, fontWeight:800, color:'#fff', lineHeight:1.05, marginBottom:10 }}>
//                 Evidence-Based <span style={{ color:ACC }}>Physiotherapy</span>
//               </h1>
//               <p style={{ color:'rgba(255,255,255,.42)', fontSize:13, lineHeight:1.85, marginBottom:14, fontFamily:"'Syne',sans-serif" }}>
//                 Specialising in musculoskeletal rehabilitation, sports injuries, chronic pain management and movement re-education.
//               </p>
//               <p style={{ color:'rgba(79,195,247,.5)', fontSize:11, fontFamily:"'Space Mono',monospace", animation:'pulse 2s ease-in-out infinite' }}>
//                 ↑ Tap a region on the model above
//               </p>
//             </div>
//           ) : (
//             <div key={sel} style={{ animation:'fadeUp .35s ease forwards' }}>
//               <div style={{ fontSize:8, letterSpacing:5, color:'rgba(79,195,247,.5)', fontFamily:"'Space Mono',monospace", textTransform:'uppercase', marginBottom:8 }}>Treatment Focus</div>
//               <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:800, color:'#fff', marginBottom:10, lineHeight:1.15 }}>
//                 {info.label}
//               </h2>
//               <p style={{ color:'rgba(255,255,255,.46)', fontSize:13, lineHeight:1.9, marginBottom:14, fontFamily:"'Syne',sans-serif" }}>
//                 {info.desc}
//               </p>
//               <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:18 }}>
//                 {info.tags.map(t => (
//                   <span key={t} style={{ padding:'4px 11px', background:'rgba(79,195,247,.08)', border:'1px solid rgba(79,195,247,.22)', borderRadius:100, color:ACC, fontSize:10.5 }}>{t}</span>
//                 ))}
//               </div>
//               <button style={{ padding:'11px 24px', background:'linear-gradient(135deg,rgba(79,195,247,.16),rgba(79,195,247,.04))', border:'1px solid rgba(79,195,247,.38)', borderRadius:100, color:ACC, cursor:'pointer', fontFamily:"'Space Mono',monospace", fontSize:9.5, letterSpacing:1.8, textTransform:'uppercase' }}>
//                 Book Consultation →
//               </button>
//             </div>
//           )}

//           {/* Services */}
//           <div style={{ borderTop:'1px solid rgba(79,195,247,.08)', paddingTop:16, marginTop:20 }}>
//             <div style={{ fontSize:8, letterSpacing:4, color:'rgba(79,195,247,.3)', fontFamily:"'Space Mono',monospace", marginBottom:10 }}>SERVICES</div>
//             <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
//               {PHYSIO_SERVICES.map(s => (
//                 <span key={s} style={{ padding:'4px 10px', background:'rgba(79,195,247,.04)', border:'1px solid rgba(79,195,247,.08)', borderRadius:100, color:'rgba(255,255,255,.38)', fontSize:10 }}>{s}</span>
//               ))}
//             </div>
//           </div>
//         </div>

//         <div style={{ position:'absolute', top:'35%', left:'18%', width:220, height:220, borderRadius:'50%', background:'radial-gradient(circle,rgba(79,195,247,.05) 0%,transparent 70%)', pointerEvents:'none', animation:'breathe 5s ease-in-out infinite' }} />
//       </div>
//     )
//   }

//   /* ════════════════════════════════════════
//      DESKTOP LAYOUT (unchanged)
//   ════════════════════════════════════════ */
//   return (
//     <div style={{
//       position:      'fixed',
//       inset:          0,
//       zIndex:         5,
//       display:       'flex',
//       flexDirection: 'row',
//       animation:     'worldIn .65s ease forwards',
//       background:    'radial-gradient(ellipse at 28% 55%,rgba(5,20,45,.97) 0%,rgba(0,2,10,.99) 100%)',
//     }}>
//       <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(79,195,247,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(79,195,247,.04) 1px,transparent 1px)', backgroundSize:'60px 60px', pointerEvents:'none', zIndex:0 }} />
//       <div style={{ position:'absolute', left:0, right:0, height:2, background:'linear-gradient(90deg,transparent,rgba(79,195,247,.28),transparent)', pointerEvents:'none', zIndex:2, animation:'scan 5.5s linear infinite' }} />

//       <BackButton onClick={() => navigateTo('hub')} accent={ACC} />

//       <div style={{ position:'absolute', top:24, left:'50%', transform:'translateX(-50%)', textAlign:'center', zIndex:10, pointerEvents:'none' }}>
//         <div style={{ fontFamily:"'Space Mono',monospace", fontSize:9, letterSpacing:6, color:'rgba(79,195,247,.4)', marginBottom:4 }}>WORLD 01</div>
//         <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:'clamp(18px,2.4vw,30px)', color:'#fff' }}>Physiotherapy</h2>
//       </div>

//       {/* 3D column */}
//       <div style={{ flex:'0 0 44%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', paddingTop:72, position:'relative', zIndex:5, animation:'fadeUp .8s .2s ease both' }}>
//         <BodyModel3D onSelect={setSel} onHover={setHov} />
//         <div style={{ position:'absolute', bottom:28, left:'50%', transform:'translateX(-50%)', fontFamily:"'Space Mono',monospace", fontSize:9, letterSpacing:3, color:'rgba(79,195,247,.3)', textTransform:'uppercase', textAlign:'center', animation:'pulse 2.5s ease-in-out infinite', whiteSpace:'nowrap' }}>
//           Drag · Rotate · Click
//         </div>
//       </div>

//       {/* Info column */}
//       <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center', padding:'88px 44px 40px', zIndex:5, gap:22, overflowY:'auto', animation:'fadeUp .8s .35s ease both' }}>
//         <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8 }}>
//           {PHYSIO_STATS.map(s => (
//             <div key={s.label} style={{ padding:'10px', background:'rgba(79,195,247,.04)', border:'1px solid rgba(79,195,247,.1)', borderRadius:10, textAlign:'center' }}>
//               <div style={{ fontFamily:"'Syne',sans-serif", fontSize:20, fontWeight:800, color:ACC, marginBottom:3 }}>{s.value}</div>
//               <div style={{ fontSize:9.5, color:'rgba(255,255,255,.35)', fontFamily:"'Space Mono',monospace", lineHeight:1.5 }}>{s.label}</div>
//             </div>
//           ))}
//         </div>

//         {!info ? (
//           <div>
//             <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:'clamp(28px,3.5vw,50px)', fontWeight:800, color:'#fff', lineHeight:1.05, marginBottom:16 }}>
//               Evidence-Based<br /><span style={{ color:ACC }}>Physiotherapy</span>
//             </h1>
//             <p style={{ color:'rgba(255,255,255,.4)', fontSize:13.5, lineHeight:1.9, maxWidth:400, marginBottom:20, fontFamily:"'Syne',sans-serif" }}>
//               Specialising in musculoskeletal rehabilitation, sports injuries, chronic pain management and movement re-education.
//             </p>
//             <p style={{ color:'rgba(79,195,247,.5)', fontSize:12, fontFamily:"'Space Mono',monospace", animation:'pulse 2s ease-in-out infinite' }}>
//               ← Click a body region on the model
//             </p>
//           </div>
//         ) : (
//           <div key={sel} style={{ animation:'fadeUp .4s ease forwards' }}>
//             <div style={{ fontSize:9, letterSpacing:6, color:'rgba(79,195,247,.5)', fontFamily:"'Space Mono',monospace", textTransform:'uppercase', marginBottom:10 }}>Treatment Focus</div>
//             <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:'clamp(22px,2.8vw,38px)', fontWeight:800, color:'#fff', marginBottom:14, lineHeight:1.1 }}>{info.label}</h2>
//             <p style={{ color:'rgba(255,255,255,.46)', fontSize:13.5, lineHeight:1.95, marginBottom:20, maxWidth:420, fontFamily:"'Syne',sans-serif" }}>{info.desc}</p>
//             <div style={{ display:'flex', flexWrap:'wrap', gap:7, marginBottom:24 }}>
//               {info.tags.map(t => (
//                 <span key={t} style={{ padding:'5px 13px', background:'rgba(79,195,247,.08)', border:'1px solid rgba(79,195,247,.22)', borderRadius:100, color:ACC, fontSize:11 }}>{t}</span>
//               ))}
//             </div>
//             <button style={{ padding:'12px 28px', background:'linear-gradient(135deg,rgba(79,195,247,.16),rgba(79,195,247,.04))', border:'1px solid rgba(79,195,247,.38)', borderRadius:100, color:ACC, cursor:'pointer', fontFamily:"'Space Mono',monospace", fontSize:10, letterSpacing:2, textTransform:'uppercase', transition:'all .3s' }}>
//               Book Consultation →
//             </button>
//           </div>
//         )}

//         <div style={{ borderTop:'1px solid rgba(79,195,247,.08)', paddingTop:20 }}>
//           <div style={{ fontSize:9, letterSpacing:5, color:'rgba(79,195,247,.3)', fontFamily:"'Space Mono',monospace", marginBottom:12 }}>SERVICES</div>
//           <div style={{ display:'flex', flexWrap:'wrap', gap:7 }}>
//             {PHYSIO_SERVICES.map(s => (
//               <span key={s} style={{ padding:'4px 11px', background:'rgba(79,195,247,.04)', border:'1px solid rgba(79,195,247,.08)', borderRadius:100, color:'rgba(255,255,255,.38)', fontSize:10.5 }}>{s}</span>
//             ))}
//           </div>
//         </div>
//       </div>

//       <div style={{ position:'absolute', top:'30%', left:'22%', width:320, height:320, borderRadius:'50%', background:'radial-gradient(circle,rgba(79,195,247,.06) 0%,transparent 70%)', pointerEvents:'none', animation:'breathe 5s ease-in-out infinite' }} />
//     </div>
//   )
// }

