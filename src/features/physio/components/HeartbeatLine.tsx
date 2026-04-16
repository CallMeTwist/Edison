import { useEffect, useRef } from 'react'
import gsap from '@/lib/gsap'

interface Props {
  active: boolean
  color?: string
}

export const HeartbeatLine: React.FC<Props> = ({ active, color = '#4FC3F7' }) => {
  const pathRef = useRef<SVGPathElement>(null)
  const tweenRef = useRef<gsap.core.Tween | null>(null)

  useEffect(() => {
    if (!pathRef.current) return

    const noMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (noMotion) return

    const path = pathRef.current
    const len = path.getTotalLength()

    if (!active) {
      tweenRef.current?.kill()
      gsap.set(path, { strokeDasharray: len, strokeDashoffset: len, opacity: 1 })
      return
    }

    tweenRef.current?.kill()
    gsap.set(path, { strokeDasharray: len, strokeDashoffset: len, opacity: 1 })
    tweenRef.current = gsap.to(path, {
      strokeDashoffset: 0,
      duration: 0.9,
      ease: 'power1.out',
      onComplete: () => {
        tweenRef.current = gsap.to(path, { opacity: 0, duration: 0.6, delay: 0.3 })
      },
    })

    return () => {
      tweenRef.current?.kill()
    }
  }, [active])

  return (
    <svg
      viewBox="0 0 300 40"
      width="100%"
      height={40}
      style={{ display: 'block', overflow: 'visible' }}
    >
      <path
        ref={pathRef}
        d="M0,20 L40,20 L50,5 L60,35 L70,20 L120,20 L130,10 L140,30 L150,20 L300,20"
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
