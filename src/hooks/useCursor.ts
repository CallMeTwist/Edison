import { useEffect } from 'react'

export function useCursor() {
  useEffect(() => {
    // Skip entirely on touch / coarse-pointer devices (mobile, tablet)
    if (typeof window === 'undefined') return
    const isTouch =
      window.matchMedia?.('(hover: none), (pointer: coarse)').matches ||
      'ontouchstart' in window ||
      (navigator as Navigator & { maxTouchPoints?: number }).maxTouchPoints > 0
    if (isTouch) return

    // Create elements
    const dot  = document.createElement('div')
    const ring = document.createElement('div')
    dot.id  = 'pf-dot'
    ring.id = 'pf-ring'
    document.body.append(dot, ring)

    let rx = window.innerWidth  / 2
    let ry = window.innerHeight / 2
    let mx = rx, my = ry
    let raf: number

    const onMove = (e: MouseEvent) => {
      mx = e.clientX
      my = e.clientY
    }
    window.addEventListener('mousemove', onMove)

    // Enlarge on interactive elements
    const onEnter = () => {
      dot.style.width  = '18px'
      dot.style.height = '18px'
      ring.style.width  = '52px'
      ring.style.height = '52px'
    }
    const onLeave = () => {
      dot.style.width  = '10px'
      dot.style.height = '10px'
      ring.style.width  = '36px'
      ring.style.height = '36px'
    }
    document.querySelectorAll('button, a, [role="button"]').forEach(el => {
      el.addEventListener('mouseenter', onEnter)
      el.addEventListener('mouseleave', onLeave)
    })

    // Smooth ring lag via RAF
    const tick = () => {
      dot.style.left = `${mx}px`
      dot.style.top  = `${my}px`
      rx += (mx - rx) * 0.1
      ry += (my - ry) * 0.1
      ring.style.left = `${rx}px`
      ring.style.top  = `${ry}px`
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      dot.remove()
      ring.remove()
    }
  }, [])
}
