import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import type { BodyRegionId } from '@/services/types'

interface Props {
  onSelect: (region: BodyRegionId | null) => void
  onHover:  (region: BodyRegionId | null) => void
}

export const BodyModel3D: React.FC<Props> = ({ onSelect, onHover }) => {
  const cvs        = useRef<HTMLCanvasElement>(null)
  const stateRef   = useRef({ selRegion: null as BodyRegionId | null })

  useEffect(() => {
    const canvas = cvs.current!
    const W = canvas.parentElement!.clientWidth  || 420
    const H = canvas.parentElement!.clientHeight || 620

    /* ── Scene ── */
    const scene  = new THREE.Scene()
    const cam    = new THREE.PerspectiveCamera(48, W / H, 0.1, 60)
    cam.position.set(0, 1.6, 5.8)
    cam.lookAt(0, 1.4, 0)

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
    renderer.setSize(W, H)
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2))

    /* ── Lights ── */
    scene.add(new THREE.AmbientLight(0x4FC3F7, 0.35))
    const dLight = new THREE.DirectionalLight(0x4FC3F7, 0.9)
    dLight.position.set(3, 6, 4); scene.add(dLight)
    const bLight = new THREE.DirectionalLight(0x81D4FA, 0.4)
    bLight.position.set(-3, 2, -3); scene.add(bLight)
    const pLight = new THREE.PointLight(0x4FC3F7, 1.2, 12)
    pLight.position.set(0, 5, 4); scene.add(pLight)

    /* ── Material factory ── */
    const makeMat = (emI = 0.12) =>
      new THREE.MeshPhongMaterial({
        color: 0x4FC3F7, emissive: 0x0D47A1, emissiveIntensity: emI,
        shininess: 85, specular: 0x81D4FA, transparent: true, opacity: 0.88,
      })

    /* ── Body group ── */
    const bodyGroup = new THREE.Group()
    scene.add(bodyGroup)
    const meshes: THREE.Mesh[] = []

    const add = (region: BodyRegionId, geo: THREE.BufferGeometry, x: number, y: number, z = 0, rotZ = 0) => {
      const m = new THREE.Mesh(geo, makeMat())
      m.position.set(x, y, z)
      if (rotZ) m.rotation.z = rotZ
      m.userData.region = region
      bodyGroup.add(m)
      meshes.push(m)
      return m
    }

    /* Head */ add('head',     new THREE.SphereGeometry(0.22, 20, 20),             0, 3.18)
    /* Neck */ add('head',     new THREE.CylinderGeometry(0.08, 0.09, 0.18, 14),   0, 2.93)
    /* Torso upper */ add('chest', new THREE.CylinderGeometry(0.28, 0.24, 0.52, 18), 0, 2.52)
    /* Abdomen */ add('core',  new THREE.CylinderGeometry(0.24, 0.26, 0.44, 18),   0, 1.98)
    /* Pelvis */  add('hip',   new THREE.CylinderGeometry(0.26, 0.22, 0.34, 18),   0, 1.60)
    /* L shoulder */ add('shoulder', new THREE.SphereGeometry(0.115, 14, 14),    -0.42, 2.74)
    /* R shoulder */ add('shoulder', new THREE.SphereGeometry(0.115, 14, 14),     0.42, 2.74)
    /* L upper arm */ add('shoulder', new THREE.CylinderGeometry(0.075, 0.068, 0.52, 12), -0.52, 2.38)
    /* R upper arm */ add('shoulder', new THREE.CylinderGeometry(0.075, 0.068, 0.52, 12),  0.52, 2.38)
    /* L elbow */    add('shoulder', new THREE.SphereGeometry(0.075, 12, 12),    -0.52, 2.08)
    /* R elbow */    add('shoulder', new THREE.SphereGeometry(0.075, 12, 12),     0.52, 2.08)
    /* L forearm */  add('shoulder', new THREE.CylinderGeometry(0.065, 0.055, 0.48, 12), -0.62, 1.74, 0, -0.2)
    /* R forearm */  add('shoulder', new THREE.CylinderGeometry(0.065, 0.055, 0.48, 12),  0.62, 1.74, 0,  0.2)
    /* L hip jt */   add('hip',     new THREE.SphereGeometry(0.10, 12, 12),       -0.22, 1.42)
    /* R hip jt */   add('hip',     new THREE.SphereGeometry(0.10, 12, 12),        0.22, 1.42)
    /* L thigh */    add('knee',    new THREE.CylinderGeometry(0.10, 0.088, 0.56, 14), -0.22, 1.08)
    /* R thigh */    add('knee',    new THREE.CylinderGeometry(0.10, 0.088, 0.56, 14),  0.22, 1.08)
    /* L knee */     add('knee',    new THREE.SphereGeometry(0.092, 12, 12),      -0.22, 0.78)
    /* R knee */     add('knee',    new THREE.SphereGeometry(0.092, 12, 12),       0.22, 0.78)
    /* L shin */     add('ankle',   new THREE.CylinderGeometry(0.078, 0.065, 0.54, 12), -0.22, 0.44)
    /* R shin */     add('ankle',   new THREE.CylinderGeometry(0.078, 0.065, 0.54, 12),  0.22, 0.44)
    /* L ankle */    add('ankle',   new THREE.SphereGeometry(0.068, 12, 12),      -0.22, 0.14)
    /* R ankle */    add('ankle',   new THREE.SphereGeometry(0.068, 12, 12),       0.22, 0.14)
    /* L foot */     add('ankle',   new THREE.BoxGeometry(0.13, 0.07, 0.28),      -0.22, 0.04, 0.09)
    /* R foot */     add('ankle',   new THREE.BoxGeometry(0.13, 0.07, 0.28),       0.22, 0.04, 0.09)

    /* Body glow sphere */
    const glowMat = new THREE.MeshBasicMaterial({ color: 0x4FC3F7, transparent: true, opacity: 0.03, side: THREE.BackSide })
    bodyGroup.add(new THREE.Mesh(new THREE.SphereGeometry(1.6, 16, 16), glowMat))

    /* ── Raycaster ── */
    const raycaster = new THREE.Raycaster()
    const mpos      = new THREE.Vector2()
    let isDragging = false, dragStarted = false, lastX = 0, rotY = 0

    const updateAppearance = (hovR: string | null, selR: string | null) => {
      meshes.forEach(m => {
        const r   = m.userData.region as string
        const mat = m.material as THREE.MeshPhongMaterial
        if (r === selR)      { mat.emissiveIntensity = 0.78; mat.opacity = 1;    mat.color.setHex(0x81D4FA) }
        else if (r === hovR) { mat.emissiveIntensity = 0.45; mat.opacity = 0.96; mat.color.setHex(0x67D1F0) }
        else                 { mat.emissiveIntensity = 0.12; mat.opacity = 0.82; mat.color.setHex(0x4FC3F7) }
      })
    }

    const getRegion = (e: MouseEvent): BodyRegionId | null => {
      const rect = canvas.getBoundingClientRect()
      mpos.x =  ((e.clientX - rect.left) / rect.width)  * 2 - 1
      mpos.y = -((e.clientY - rect.top)  / rect.height) * 2 + 1
      raycaster.setFromCamera(mpos, cam)
      const hits = raycaster.intersectObjects(meshes)
      return (hits.length ? hits[0].object.userData.region : null) as BodyRegionId | null
    }

    const onMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const dx = e.clientX - lastX
        rotY += dx * 0.012
        lastX = e.clientX
        if (Math.abs(dx) > 2) dragStarted = true
      }
      const r = getRegion(e)
      onHover(r)
      updateAppearance(r, stateRef.current.selRegion)
    }
    const onMouseDown = (e: MouseEvent) => { isDragging = true; lastX = e.clientX; dragStarted = false }
    const onMouseUp   = (e: MouseEvent) => {
      if (!dragStarted) {
        const r = getRegion(e)
        if (r) {
          const next = stateRef.current.selRegion === r ? null : r
          stateRef.current.selRegion = next
          onSelect(next)
          updateAppearance(r, next)
        }
      }
      isDragging = false
    }

    canvas.addEventListener('mousemove', onMouseMove)
    canvas.addEventListener('mousedown', onMouseDown)
    canvas.addEventListener('mouseup',   onMouseUp)

    /* ── Render loop ── */
    let t = 0, raf: number
    const tick = () => {
      raf = requestAnimationFrame(tick)
      t += 0.008
      bodyGroup.rotation.y = rotY + Math.sin(t * 0.35) * 0.08
      pLight.position.x    = Math.sin(t * 0.55) * 3.5
      pLight.position.z    = Math.cos(t * 0.55) * 2.5 + 2
      renderer.render(scene, cam)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      canvas.removeEventListener('mousemove', onMouseMove)
      canvas.removeEventListener('mousedown', onMouseDown)
      canvas.removeEventListener('mouseup',   onMouseUp)
      renderer.dispose()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <canvas
      ref={cvs}
      style={{ width: '100%', height: '100%', cursor: 'grab', display: 'block' }}
    />
  )
}
