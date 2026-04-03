import { useState, useEffect } from 'react'
import { BP } from '@/config/constants'

interface WindowSize {
  width:    number
  height:   number
  isSm:     boolean   // < 480
  isMd:     boolean   // < 768
  isLg:     boolean   // < 1024
  isMobile: boolean   // < 768
}

export function useWindowSize(): WindowSize {
  const [size, setSize] = useState<WindowSize>(() => {
    const w = window.innerWidth
    const h = window.innerHeight
    return {
      width: w, height: h,
      isSm:     w < BP.sm,
      isMd:     w < BP.md,
      isLg:     w < BP.lg,
      isMobile: w < BP.md,
    }
  })

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      setSize({
        width: w, height: h,
        isSm:     w < BP.sm,
        isMd:     w < BP.md,
        isLg:     w < BP.lg,
        isMobile: w < BP.md,
      })
    }
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return size
}
