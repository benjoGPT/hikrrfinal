'use client'
import { useEffect, useRef, useState } from 'react'

const R = 260

function RevealMask({ cursorX, cursorY, children }: { cursorX: number; cursorY: number; children: React.ReactNode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const divRef    = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const resize = () => {
      const c = canvasRef.current; if (!c) return
      const parent = c.parentElement
      c.width = parent?.clientWidth || window.innerWidth
      c.height = parent?.clientHeight || window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current; const reveal = divRef.current
    if (!canvas || !reveal) return
    const ctx = canvas.getContext('2d'); if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    const g = ctx.createRadialGradient(cursorX, cursorY, 0, cursorX, cursorY, R)
    g.addColorStop(0,    'rgba(255,255,255,1)')
    g.addColorStop(0.4,  'rgba(255,255,255,1)')
    g.addColorStop(0.6,  'rgba(255,255,255,0.75)')
    g.addColorStop(0.75, 'rgba(255,255,255,0.4)')
    g.addColorStop(0.88, 'rgba(255,255,255,0.12)')
    g.addColorStop(1,    'rgba(255,255,255,0)')
    ctx.fillStyle = g
    ctx.beginPath(); ctx.arc(cursorX, cursorY, R, 0, Math.PI * 2); ctx.fill()
    const url = canvas.toDataURL()
    reveal.style.maskImage = `url(${url})`
    ;(reveal.style as unknown as Record<string, string>).webkitMaskImage = `url(${url})`
    reveal.style.maskSize = '100% 100%'
    ;(reveal.style as unknown as Record<string, string>).webkitMaskSize = '100% 100%'
  }, [cursorX, cursorY])

  return (
    <>
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" style={{ display: 'none' }} />
      <div ref={divRef} className="absolute inset-0 pointer-events-none">{children}</div>
    </>
  )
}

/**
 * The hero's signature interaction: a soft cursor-tracked spotlight that
 * unveils a brighter/richer layer wherever you move. `base` renders behind
 * at all times; `revealed` is masked so it only shows inside the spotlight.
 */
export default function SpotlightReveal({ base, revealed, className = '' }: {
  base: React.ReactNode
  revealed: React.ReactNode
  className?: string
}) {
  const mouseRef  = useRef({ x: -999, y: -999 })
  const smoothRef = useRef({ x: -999, y: -999 })
  const rafRef    = useRef<number>(0)
  const [pos, setPos] = useState({ x: -999, y: -999 })
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const rect = wrapRef.current?.getBoundingClientRect()
      mouseRef.current = rect
        ? { x: e.clientX - rect.left, y: e.clientY - rect.top }
        : { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('mousemove', onMove)
    const tick = () => {
      smoothRef.current.x += (mouseRef.current.x - smoothRef.current.x) * 0.1
      smoothRef.current.y += (mouseRef.current.y - smoothRef.current.y) * 0.1
      setPos({ x: smoothRef.current.x, y: smoothRef.current.y })
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(rafRef.current) }
  }, [])

  return (
    <div ref={wrapRef} className={`relative overflow-hidden ${className}`}>
      <div className="absolute inset-0 z-10">{base}</div>
      <div className="absolute inset-0 z-30">
        <RevealMask cursorX={pos.x} cursorY={pos.y}>{revealed}</RevealMask>
      </div>
    </div>
  )
}
