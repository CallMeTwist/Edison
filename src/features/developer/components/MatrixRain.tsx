import { useEffect, useRef } from 'react'

interface Props {
  opacity?: number
}

const MatrixRain: React.FC<Props> = ({ opacity = 0.18 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const FONT_SIZE = 11
    const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789アイウエオカキクケコサシスセソ'

    // Size canvas to container
    const resize = () => {
      canvas.width  = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    let drops: number[] = Array(Math.floor(canvas.width / FONT_SIZE)).fill(1)

    const draw = () => {
      // Re-sync drops array if width changed
      const cols = Math.floor(canvas.width / FONT_SIZE)
      if (drops.length !== cols) drops = Array(cols).fill(1)

      ctx.fillStyle = 'rgba(0,0,0,0.06)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.font = `${FONT_SIZE}px 'Space Mono', monospace`

      drops.forEach((y, i) => {
        const char = CHARS[Math.floor(Math.random() * CHARS.length)]
        const isHead = y * FONT_SIZE < 40
        ctx.fillStyle   = isHead ? '#ffffff' : '#00FF88'
        ctx.globalAlpha = isHead ? 0.9 : 0.45
        ctx.fillText(char, i * FONT_SIZE, y * FONT_SIZE)
        if (y * FONT_SIZE > canvas.height && Math.random() > 0.975) drops[i] = 0
        drops[i]++
      })
      ctx.globalAlpha = 1
    }

    const interval = setInterval(draw, 55)

    return () => {
      clearInterval(interval)
      ro.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position:      'absolute',
        inset:          0,
        width:         '100%',
        height:        '100%',
        opacity,
        pointerEvents: 'none',
        display:       'block',
      }}
    />
  )
}

export default MatrixRain
