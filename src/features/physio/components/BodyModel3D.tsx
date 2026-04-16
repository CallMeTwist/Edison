// src/features/physio/components/BodyModel3D.tsx
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import type { BodyRegionId } from '@/services/types'

interface Props {
  onSelect: (region: BodyRegionId | null) => void
  onHover: (region: BodyRegionId | null) => void
}

export const BodyModel3D: React.FC<Props> = ({ onSelect, onHover }) => {
  const cvs = useRef<HTMLCanvasElement>(null)
  const stateRef = useRef({ selRegion: null as BodyRegionId | null })

  useEffect(() => {
    const canvas = cvs.current!
    const W = canvas.parentElement!.clientWidth || 420
    const H = canvas.parentElement!.clientHeight || 620

    /* ─── Scene ─── */
    const scene = new THREE.Scene()
    // ── Slightly bigger: FOV 44 (was 48), camera z 5.2 (was 5.8) ──
    const cam = new THREE.PerspectiveCamera(44, W / H, 0.1, 60)
    cam.position.set(0, 1.6, 5.2)
    cam.lookAt(0, 1.4, 0)

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
    renderer.setSize(W, H)
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2))

    scene.add(new THREE.AmbientLight(0x4FC3F7, 0.35))
    const dLight = new THREE.DirectionalLight(0x4FC3F7, 0.9)
    dLight.position.set(3, 6, 4); scene.add(dLight)
    const bLight = new THREE.DirectionalLight(0x81D4FA, 0.4)
    bLight.position.set(-3, 2, -3); scene.add(bLight)
    const pLight = new THREE.PointLight(0x4FC3F7, 1.2, 12)
    pLight.position.set(0, 5, 4); scene.add(pLight)

    const makeMat = (emI = 0.12) => new THREE.MeshPhongMaterial({
      color: 0x4FC3F7, emissive: 0x0D47A1, emissiveIntensity: emI,
      shininess: 85, specular: 0x81D4FA, transparent: true, opacity: 0.88,
    })

    const bodyGroup = new THREE.Group()
    scene.add(bodyGroup)
    const meshes: THREE.Mesh[] = []

    const add = (
      region: BodyRegionId,
      geo: THREE.BufferGeometry,
      x: number, y: number, z = 0, rotZ = 0,
    ) => {
      const m = new THREE.Mesh(geo, makeMat())
      m.position.set(x, y, z)
      if (rotZ) m.rotation.z = rotZ
      m.userData.region = region
      bodyGroup.add(m); meshes.push(m); return m
    }

    // Head + neck
    add('head', new THREE.SphereGeometry(0.22, 20, 20), 0, 3.18)
    add('head', new THREE.CylinderGeometry(0.08, 0.09, 0.18, 14), 0, 2.93)

    // Torso
    add('chest', new THREE.CylinderGeometry(0.28, 0.24, 0.52, 18), 0, 2.52)
    add('core', new THREE.CylinderGeometry(0.24, 0.26, 0.44, 18), 0, 1.98)
    add('hip', new THREE.CylinderGeometry(0.26, 0.22, 0.34, 18), 0, 1.60)

    // Shoulder joints (ball)
    add('shoulder', new THREE.SphereGeometry(0.115, 14, 14), -0.42, 2.74)
    add('shoulder', new THREE.SphereGeometry(0.115, 14, 14), 0.42, 2.74)

    // Upper arms
    add('shoulder', new THREE.CylinderGeometry(0.075, 0.068, 0.52, 12), -0.52, 2.38)
    add('shoulder', new THREE.CylinderGeometry(0.075, 0.068, 0.52, 12), 0.52, 2.38)

    // ── Elbow joints (was 'shoulder', now 'elbow') ──
    add('elbow', new THREE.SphereGeometry(0.075, 12, 12), -0.52, 2.08)
    add('elbow', new THREE.SphereGeometry(0.075, 12, 12), 0.52, 2.08)

    // ── Forearms / wrist area (was 'shoulder', now 'hand') ──
    add('hand', new THREE.CylinderGeometry(0.065, 0.055, 0.48, 12), -0.62, 1.74, 0, -0.2)
    add('hand', new THREE.CylinderGeometry(0.065, 0.055, 0.48, 12), 0.62, 1.74, 0, 0.2)

    // Hip joints
    add('hip', new THREE.SphereGeometry(0.10, 12, 12), -0.22, 1.42)
    add('hip', new THREE.SphereGeometry(0.10, 12, 12), 0.22, 1.42)

    // Thighs + knee joints
    add('knee', new THREE.CylinderGeometry(0.10, 0.088, 0.56, 14), -0.22, 1.08)
    add('knee', new THREE.CylinderGeometry(0.10, 0.088, 0.56, 14), 0.22, 1.08)
    add('knee', new THREE.SphereGeometry(0.092, 12, 12), -0.22, 0.78)
    add('knee', new THREE.SphereGeometry(0.092, 12, 12), 0.22, 0.78)

    // Shins + ankles + feet
    add('ankle', new THREE.CylinderGeometry(0.078, 0.065, 0.54, 12), -0.22, 0.44)
    add('ankle', new THREE.CylinderGeometry(0.078, 0.065, 0.54, 12), 0.22, 0.44)
    add('ankle', new THREE.SphereGeometry(0.068, 12, 12), -0.22, 0.14)
    add('ankle', new THREE.SphereGeometry(0.068, 12, 12), 0.22, 0.14)
    add('ankle', new THREE.BoxGeometry(0.13, 0.07, 0.28), -0.22, 0.04, 0.09)
    add('ankle', new THREE.BoxGeometry(0.13, 0.07, 0.28), 0.22, 0.04, 0.09)

    /* Glow shell */
    bodyGroup.add(new THREE.Mesh(
      new THREE.SphereGeometry(1.6, 16, 16),
      new THREE.MeshBasicMaterial({
        color: 0x4FC3F7, transparent: true, opacity: 0.03, side: THREE.BackSide,
      }),
    ))

    /* ─── Raycaster ─── */
    const raycaster = new THREE.Raycaster()
    const mpos = new THREE.Vector2()

    const updateAppearance = (hovR: string | null, selR: string | null) => {
      meshes.forEach(m => {
        const r = m.userData.region as string
        const mat = m.material as THREE.MeshPhongMaterial
        if (r === selR) {
          mat.emissiveIntensity = 0.78; mat.opacity = 1; mat.color.setHex(0x81D4FA)
        } else if (r === hovR) {
          mat.emissiveIntensity = 0.45; mat.opacity = 0.96; mat.color.setHex(0x67D1F0)
        } else {
          mat.emissiveIntensity = 0.12; mat.opacity = 0.82; mat.color.setHex(0x4FC3F7)
        }
      })
    }

    const getRegionXY = (cx: number, cy: number): BodyRegionId | null => {
      const rect = canvas.getBoundingClientRect()
      mpos.x = ((cx - rect.left) / rect.width) * 2 - 1
      mpos.y = -((cy - rect.top) / rect.height) * 2 + 1
      raycaster.setFromCamera(mpos, cam)
      const hits = raycaster.intersectObjects(meshes)
      return (hits.length ? hits[0].object.userData.region : null) as BodyRegionId | null
    }

    /* ════════════════════════════════════════════════════
       GHOST CLICK GUARD
       ─────────────────────────────────────────────────
       Mobile browsers fire synthetic mousedown + mouseup
       ~300ms after every touchend, to support old code
       that only listened for mouse events.
       
       We stamp the time of every real touchend and block
       any mouse event that arrives within 600ms of it.
       600ms comfortably covers the browser's 300ms delay
       plus any device-specific jitter.
    ════════════════════════════════════════════════════ */
    let lastTouchEndTime = 0
    const GHOST_THRESHOLD_MS = 600

    const isGhostMouseEvent = (): boolean =>
      Date.now() - lastTouchEndTime < GHOST_THRESHOLD_MS

    /* ─── Mouse events (desktop only) ─── */
    let isDragging = false
    let dragStarted = false
    let lastMouseX = 0
    let rotY = 0

    const onMouseMove = (e: MouseEvent) => {
      // On mobile the mouse move events after a touch are also synthetic —
      // but we still want them to update the hover highlight on desktop,
      // so only skip if it's clearly a ghost (no actual pointer is moving).
      if (isGhostMouseEvent()) return

      if (isDragging) {
        const dx = e.clientX - lastMouseX
        rotY += dx * 0.012
        lastMouseX = e.clientX
        if (Math.abs(dx) > 2) dragStarted = true
      }
      const r = getRegionXY(e.clientX, e.clientY)
      onHover(r)
      updateAppearance(r, stateRef.current.selRegion)
    }

    const onMouseDown = (e: MouseEvent) => {
      // ← THE KEY FIX: discard synthetic ghost mouse events from touch
      if (isGhostMouseEvent()) return
      isDragging = true
      lastMouseX = e.clientX
      dragStarted = false
    }

    const onMouseUp = (e: MouseEvent) => {
      // ← THE KEY FIX: discard synthetic ghost mouse events from touch
      if (isGhostMouseEvent()) return
      if (!dragStarted) {
        const r = getRegionXY(e.clientX, e.clientY)
        if (r) {
          const next = stateRef.current.selRegion === r ? null : r
          stateRef.current.selRegion = next
          onSelect(next)
          window.dispatchEvent(new CustomEvent('physio:region-selected', { detail: { region: next } }))
          updateAppearance(r, next)
        }
      }
      isDragging = false
    }

    /* ─── Touch events (mobile) ─── */
    let touchStartX = 0
    let touchStartY = 0
    let touchMoved = false

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return
      touchStartX = e.touches[0].clientX
      touchStartY = e.touches[0].clientY
      touchMoved = false
    }

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 1) return
      const dx = e.touches[0].clientX - touchStartX
      const dy = e.touches[0].clientY - touchStartY

      // Rotate if the gesture is more horizontal than vertical
      if (Math.abs(dx) > Math.abs(dy) * 0.8) {
        e.preventDefault()                // prevent page scroll while rotating
        rotY += dx * 0.014
        touchStartX = e.touches[0].clientX
        touchStartY = e.touches[0].clientY
      }
      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) touchMoved = true
    }

    const onTouchEnd = (e: TouchEvent) => {
      // ← STAMP THE TIME FIRST, before any other logic.
      //   This ensures the ghost guard is set even if we return early.
      lastTouchEndTime = Date.now()

      if (!touchMoved) {
        // Pure tap — select/deselect the tapped region
        const touch = e.changedTouches[0]
        const r = getRegionXY(touch.clientX, touch.clientY)
        if (r) {
          const next = stateRef.current.selRegion === r ? null : r
          stateRef.current.selRegion = next
          onSelect(next)
          window.dispatchEvent(new CustomEvent('physio:region-selected', { detail: { region: next } }))
          updateAppearance(null, next)
        }
      }
      touchMoved = false
    }

    /* ─── Register events ─── */
    canvas.addEventListener('mousemove', onMouseMove)
    canvas.addEventListener('mousedown', onMouseDown)
    canvas.addEventListener('mouseup', onMouseUp)
    canvas.addEventListener('touchstart', onTouchStart, { passive: true })
    canvas.addEventListener('touchmove', onTouchMove, { passive: false })
    canvas.addEventListener('touchend', onTouchEnd, { passive: true })

    /* ─── Render loop ─── */
    let t = 0, raf: number
    const tick = () => {
      raf = requestAnimationFrame(tick)
      t += 0.008
      bodyGroup.rotation.y = rotY + Math.sin(t * 0.35) * 0.08
      pLight.position.x = Math.sin(t * 0.55) * 3.5
      pLight.position.z = Math.cos(t * 0.55) * 2.5 + 2
      renderer.render(scene, cam)
    }
    raf = requestAnimationFrame(tick)

    /* ─── Cleanup ─── */
    return () => {
      cancelAnimationFrame(raf)
      canvas.removeEventListener('mousemove', onMouseMove)
      canvas.removeEventListener('mousedown', onMouseDown)
      canvas.removeEventListener('mouseup', onMouseUp)
      canvas.removeEventListener('touchstart', onTouchStart)
      canvas.removeEventListener('touchmove', onTouchMove)
      canvas.removeEventListener('touchend', onTouchEnd)
      renderer.dispose()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <canvas
      ref={cvs}
      style={{
        width: '100%',
        height: '100%',
        cursor: 'grab',
        display: 'block',
        touchAction: 'pan-y',    // allow vertical scroll, our code handles horizontal
      }}
    />
  )
}