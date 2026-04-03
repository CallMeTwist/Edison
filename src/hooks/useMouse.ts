import { useEffect, useRef } from 'react'

export interface MouseState {
  x:  number   // raw px
  y:  number   // raw px
  nx: number   // normalised -1 to 1
  ny: number   // normalised -1 to 1
}

export function useMouse() {
  const mouse = useRef<MouseState>({ x: 0, y: 0, nx: 0, ny: 0 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current = {
        x:  e.clientX,
        y:  e.clientY,
        nx: (e.clientX / window.innerWidth  - 0.5) * 2,
        ny: -(e.clientY / window.innerHeight - 0.5) * 2,
      }
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return mouse
}
