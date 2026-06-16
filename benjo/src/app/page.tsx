'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Nav from '@/components/Nav'

const BG1 = 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260609_195923_b0ba8ace-1d1d-4f2c-9a28-1ab84b330680.png&w=1280&q=85'
const BG2 = 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260609_201152_bba90a12-bf12-459f-91f0-51f237dbaf3b.png&w=1280&q=85'
const R = 260

function RevealLayer({ cursorX, cursorY }: { cursorX: number; cursorY: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const divRef    = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const resize = () => {
      const c = canvasRef.current; if (!c) return
      c.width = window.innerWidth; c.height = window.innerHeight
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
    ;(reveal.style as unknown as Record<string,string>).webkitMaskImage = `url(${url})`
    reveal.style.maskSize = '100% 100%'
    ;(reveal.style as unknown as Record<string,string>).webkitMaskSize = '100% 100%'
  }, [cursorX, cursorY])

  return (
    <>
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" style={{ display: 'none' }} />
      <div ref={divRef} className="absolute inset-0 bg-center bg-cover bg-no-repeat pointer-events-none"
        style={{ backgroundImage: `url(${BG2})` }} />
    </>
  )
}

export default function HomePage() {
  const mouseRef  = useRef({ x: -999, y: -999 })
  const smoothRef = useRef({ x: -999, y: -999 })
  const rafRef    = useRef<number>(0)
  const [pos, setPos] = useState({ x: -999, y: -999 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => { mouseRef.current = { x: e.clientX, y: e.clientY } }
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
    <div className="bg-void">
      <Nav />
      <section className="relative w-full overflow-hidden bg-black" style={{ height: '100dvh' }}>
        {/* Base image */}
        <div className="absolute inset-0 bg-center bg-cover bg-no-repeat z-10 hero-zoom"
          style={{ backgroundImage: `url(${BG1})` }} />
        {/* Reveal layer */}
        <div className="absolute inset-0 z-30 pointer-events-none">
          <RevealLayer cursorX={pos.x} cursorY={pos.y} />
        </div>
        {/* Heading */}
        <div className="absolute top-[14%] left-0 right-0 z-50 flex flex-col items-center text-center px-5 pointer-events-none">
          <h1 className="text-white" style={{ lineHeight: 0.95 }}>
            <span className="block font-playfair italic font-normal text-5xl sm:text-7xl md:text-8xl hero-anim hero-reveal"
              style={{ letterSpacing: '-0.05em', animationDelay: '0.25s' }}>
              Every summit,
            </span>
            <span className="block font-normal text-5xl sm:text-7xl md:text-8xl -mt-1 hero-anim hero-reveal"
              style={{ letterSpacing: '-0.08em', animationDelay: '0.42s' }}>
              carved in 3D
            </span>
          </h1>
        </div>
        {/* Bottom-left */}
        <div className="hidden sm:block absolute bottom-14 left-10 md:left-14 max-w-[260px] z-50 hero-anim hero-fade"
          style={{ animationDelay: '0.7s' }}>
          <p className="text-sm text-white/80 leading-relaxed">
            A personal log of routes walked, ridges crossed and summits bagged — rendered as interactive 3D terrain you can orbit, explore and relive.
          </p>
        </div>
        {/* Bottom-right */}
        <div className="absolute bottom-10 sm:bottom-24 left-5 right-5 sm:left-auto sm:right-10 md:right-14 max-w-full sm:max-w-[260px] z-50 flex flex-col items-start gap-4 sm:gap-5 hero-anim hero-fade"
          style={{ animationDelay: '0.85s' }}>
          <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
            Move your cursor to reveal the terrain beneath. Tap a summit to inspect it, or hit play to walk the route from above.
          </p>
          <Link href="/carneddau"
            className="bg-[#e8702a] hover:bg-[#d2611f] text-white text-sm font-medium px-7 py-3 rounded-full transition-all hover:scale-[1.03] active:scale-95 no-underline inline-block"
            style={{ boxShadow: '0 0 24px rgba(232,112,42,0.35)' }}>
            Walk the Carneddau →
          </Link>
        </div>
      </section>
    </div>
  )
}
