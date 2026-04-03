import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useMouse } from '@/hooks/useMouse'
import { WORLD_CONFIG } from '@/config/constants'
import type { WorldId } from '@/services/types'

interface Props { world: WorldId }

export const ParticleBackground: React.FC<Props> = ({ world }) => {
  const cvs    = useRef<HTMLCanvasElement>(null)
  const three  = useRef<Record<string, any>>({})
  const mouse  = useMouse()

  /* ─── Initial Three.js setup ─── */
  useEffect(() => {
    const canvas = cvs.current!
    const W = window.innerWidth, H = window.innerHeight
    const scene  = new THREE.Scene()
    const cam    = new THREE.PerspectiveCamera(65, W / H, 0.1, 200)
    cam.position.set(0, 0, 7)

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false })
    renderer.setSize(W, H)
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5))

    /* Outer galaxy ring — 5 500 particles */
    const N1  = 5500
    const g1  = new THREE.BufferGeometry()
    const p1  = new Float32Array(N1 * 3)
    const c1  = new Float32Array(N1 * 3)
    for (let i = 0; i < N1; i++) {
      const angle  = Math.random() * Math.PI * 2
      const r      = 3.5 + Math.random() * 7
      const spread = (Math.random() - 0.5) * 2.4
      p1[i*3]   = Math.cos(angle) * r
      p1[i*3+1] = spread * (1 - r / 12)
      p1[i*3+2] = Math.sin(angle) * r * 0.45 - 2
      c1[i*3] = c1[i*3+1] = c1[i*3+2] = 0.8 + Math.random() * 0.2
    }
    g1.setAttribute('position', new THREE.BufferAttribute(p1, 3))
    g1.setAttribute('color',    new THREE.BufferAttribute(c1, 3))
    const m1  = new THREE.PointsMaterial({ size: 0.028, vertexColors: true, transparent: true, opacity: 0.55, sizeAttenuation: true })
    const pt1 = new THREE.Points(g1, m1)
    scene.add(pt1)

    /* Inner core swarm — 900 particles */
    const N2  = 900
    const g2  = new THREE.BufferGeometry()
    const p2  = new Float32Array(N2 * 3)
    const c2  = new Float32Array(N2 * 3)
    for (let i = 0; i < N2; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi   = Math.acos(2 * Math.random() - 1)
      const r     = Math.random() * 2.2
      p2[i*3]   = r * Math.sin(phi) * Math.cos(theta)
      p2[i*3+1] = r * Math.sin(phi) * Math.sin(theta) * 0.6
      p2[i*3+2] = r * Math.cos(phi)
      c2[i*3] = c2[i*3+1] = c2[i*3+2] = 1
    }
    g2.setAttribute('position', new THREE.BufferAttribute(p2, 3))
    g2.setAttribute('color',    new THREE.BufferAttribute(c2, 3))
    const m2  = new THREE.PointsMaterial({ size: 0.015, vertexColors: true, transparent: true, opacity: 0.4 })
    const pt2 = new THREE.Points(g2, m2)
    scene.add(pt2)

    three.current = { scene, cam, renderer, pt1, pt2, m1, m2, ca1: g1.attributes.color, ca2: g2.attributes.color, t: 0 }

    let raf: number
    const tick = () => {
      raf = requestAnimationFrame(tick)
      const s = three.current
      s.t += 0.002
      const nx = mouse.current.nx, ny = mouse.current.ny
      pt1.rotation.y = s.t * 0.04  + nx * 0.04
      pt1.rotation.x = s.t * 0.016 + ny * 0.025
      pt2.rotation.y = -s.t * 0.07 + nx * 0.03
      pt2.rotation.x = s.t * 0.03  + ny * 0.018
      m1.opacity = 0.45 + Math.sin(s.t * 1.2) * 0.08
      m2.opacity = 0.30 + Math.sin(s.t * 2.0) * 0.10
      renderer.render(scene, cam)
    }
    raf = requestAnimationFrame(tick)

    const onResize = () => {
      cam.aspect = innerWidth / innerHeight
      cam.updateProjectionMatrix()
      renderer.setSize(innerWidth, innerHeight)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* ─── Shift particle colour per world ─── */
  useEffect(() => {
    const s = three.current
    if (!s.ca1) return
    const [r, g, b] = WORLD_CONFIG[world].particleColor
    for (let i = 0; i < s.ca1.count; i++) s.ca1.setXYZ(i, r, g, b)
    for (let i = 0; i < s.ca2.count; i++) s.ca2.setXYZ(i, r, g, b)
    s.ca1.needsUpdate = true
    s.ca2.needsUpdate = true
  }, [world])

  return (
    <canvas
      ref={cvs}
      style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}
    />
  )
}
