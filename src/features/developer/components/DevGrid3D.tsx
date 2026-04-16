import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useMouse } from '@/hooks/useMouse'
import gsap from '@/lib/gsap'

export const DevGrid3D: React.FC = () => {
  const cvs   = useRef<HTMLCanvasElement>(null)
  const mouse = useMouse()

  useEffect(() => {
    const canvas = cvs.current!
    const W = window.innerWidth, H = window.innerHeight

    const scene    = new THREE.Scene()
    const cam      = new THREE.PerspectiveCamera(52, W / H, 0.1, 100)
    cam.position.set(0, 3.8, 10)
    cam.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false })
    renderer.setSize(W, H)
    renderer.setPixelRatio(1)

    /* Grid floor */
    const grid     = new THREE.GridHelper(50, 50, 0x00ff88, 0x003322)
    ;(grid.material as THREE.Material & { opacity: number; transparent: boolean }).opacity = 0.22
    ;(grid.material as THREE.Material & { transparent: boolean }).transparent = true
    scene.add(grid)

    // Vertical grid (behind the scene)
    const vertGrid = new THREE.GridHelper(50, 25, 0x00ff88, 0x001f0e)
    vertGrid.rotation.x = Math.PI / 2
    vertGrid.position.z = -18
    ;(vertGrid.material as THREE.Material & { opacity: number; transparent: boolean }).opacity = 0.09
    ;(vertGrid.material as THREE.Material & { transparent: boolean }).transparent = true
    scene.add(vertGrid)

    // GSAP grid pulse
    const gsapTweens: gsap.core.Tween[] = []

    const gridMat  = grid.material as THREE.Material & { opacity: number }
    const vGridMat = vertGrid.material as THREE.Material & { opacity: number }

    gsapTweens.push(
      gsap.to(gridMat, { opacity: 0.28, duration: 2.2, repeat: -1, yoyo: true, ease: 'sine.inOut' }),
      gsap.to(vGridMat, { opacity: 0.18, duration: 2.2, delay: 0.8, repeat: -1, yoyo: true, ease: 'sine.inOut' }),
    )

    // Neon horizontal scan lines
    for (let i = 0; i < 6; i++) {
      const points = [
        new THREE.Vector3(-25, i * 1.2 - 3, -15),
        new THREE.Vector3( 25, i * 1.2 - 3, -15),
      ]
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points)
      const lineMat = new THREE.LineBasicMaterial({ color: 0x00ff88, transparent: true, opacity: 0.08 })
      const line    = new THREE.Line(lineGeo, lineMat)
      scene.add(line)
      gsapTweens.push(
        gsap.to(lineMat, { opacity: 0.22, duration: 1.6 + i * 0.3, repeat: -1, yoyo: true, ease: 'sine.inOut' })
      )
    }

    /* Floating wireframe cubes (data nodes) */
    const cubeGeo = new THREE.BoxGeometry(0.22, 0.22, 0.22)
    const cubes: THREE.Mesh[] = []
    for (let i = 0; i < 28; i++) {
      const mat  = new THREE.MeshBasicMaterial({ color: 0x00ff88, wireframe: true, transparent: true, opacity: 0.35 })
      const cube = new THREE.Mesh(cubeGeo, mat)
      cube.position.set((Math.random() - 0.5) * 22, Math.random() * 4 + 0.5, (Math.random() - 0.5) * 18)
      cube.userData.speed = 0.4 + Math.random() * 0.9
      cube.userData.phase = Math.random() * Math.PI * 2
      cube.userData.rotSpd = (Math.random() - 0.5) * 0.04
      scene.add(cube)
      cubes.push(cube)
    }

    /* Neon particle field */
    const N   = 1400
    const geo = new THREE.BufferGeometry()
    const pos = new Float32Array(N * 3)
    for (let i = 0; i < N; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 42
      pos[i * 3 + 1] = Math.random() * 9
      pos[i * 3 + 2] = (Math.random() - 0.5) * 32
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    const ptsMat = new THREE.PointsMaterial({ color: 0x00ff88, size: 0.07, transparent: true, opacity: 0.4 })
    const pts    = new THREE.Points(geo, ptsMat)
    scene.add(pts)

    /* Thin connecting lines */
    const lineMat  = new THREE.LineBasicMaterial({ color: 0x00ff88, transparent: true, opacity: 0.06 })
    for (let i = 0; i < 12; i++) {
      const points = [
        new THREE.Vector3((Math.random() - 0.5) * 22, Math.random() * 4, (Math.random() - 0.5) * 18),
        new THREE.Vector3((Math.random() - 0.5) * 22, Math.random() * 4, (Math.random() - 0.5) * 18),
      ]
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points)
      scene.add(new THREE.Line(lineGeo, lineMat))
    }

    let t = 0, raf: number
    const tick = () => {
      raf = requestAnimationFrame(tick)
      t += 0.005
      cam.position.x = Math.sin(t * 0.2) * 1.8 + mouse.current.nx * 0.9
      cam.position.y = 3.8 + mouse.current.ny * 0.45
      cam.lookAt(0, 0, 0)
      pts.rotation.y   = t * 0.04
      ptsMat.opacity   = 0.32 + Math.sin(t * 1.8) * 0.08
      cubes.forEach(c => {
        c.position.y  = 0.5 + Math.sin(t * c.userData.speed + c.userData.phase) * 2.4 + 2
        c.rotation.y += c.userData.rotSpd
        c.rotation.x += c.userData.rotSpd * 0.6
      })
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
      gsapTweens.forEach(t => t.kill())
      renderer.dispose()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <canvas
      ref={cvs}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.6 }}
    />
  )
}
