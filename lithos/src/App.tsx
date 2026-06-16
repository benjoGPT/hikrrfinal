import { useEffect, useRef, useState } from 'react'
import { Menu, X, Mountain } from 'lucide-react'
import './index.css'

const HIKE_MAP_URL = '/carneddau'   // the Three.js map lives here

const BG_IMAGE_1 =
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260609_195923_b0ba8ace-1d1d-4f2c-9a28-1ab84b330680.png&w=1280&q=85'
const BG_IMAGE_2 =
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260609_201152_bba90a12-bf12-459f-91f0-51f237dbaf3b.png&w=1280&q=85'

const SPOTLIGHT_R = 260

// ── Reveal layer: canvas-based soft spotlight mask ──────────────────────────
interface RevealLayerProps {
  image: string
  cursorX: number
  cursorY: number
}

function RevealLayer({ image, cursorX, cursorY }: RevealLayerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const divRef = useRef<HTMLDivElement>(null)

  // size canvas to viewport
  useEffect(() => {
    const resize = () => {
      const c = canvasRef.current
      if (!c) return
      c.width = window.innerWidth
      c.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  // repaint mask every time cursor moves
  useEffect(() => {
    const canvas = canvasRef.current
    const reveal = divRef.current
    if (!canvas || !reveal) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const grad = ctx.createRadialGradient(
      cursorX, cursorY, 0,
      cursorX, cursorY, SPOTLIGHT_R,
    )
    grad.addColorStop(0,    'rgba(255,255,255,1)')
    grad.addColorStop(0.4,  'rgba(255,255,255,1)')
    grad.addColorStop(0.6,  'rgba(255,255,255,0.75)')
    grad.addColorStop(0.75, 'rgba(255,255,255,0.4)')
    grad.addColorStop(0.88, 'rgba(255,255,255,0.12)')
    grad.addColorStop(1,    'rgba(255,255,255,0)')

    ctx.fillStyle = grad
    ctx.beginPath()
    ctx.arc(cursorX, cursorY, SPOTLIGHT_R, 0, Math.PI * 2)
    ctx.fill()

    const dataURL = canvas.toDataURL()
    reveal.style.maskImage = `url(${dataURL})`
    reveal.style.webkitMaskImage = `url(${dataURL})`
    reveal.style.maskSize = '100% 100%'
    reveal.style.webkitMaskSize = '100% 100%'
  }, [cursorX, cursorY])

  return (
    <>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ display: 'none' }}
      />
      <div
        ref={divRef}
        className="absolute inset-0 bg-center bg-cover bg-no-repeat z-30 pointer-events-none"
        style={{ backgroundImage: `url(${image})` }}
      />
    </>
  )
}

// ── Nav ──────────────────────────────────────────────────────────────────────
const NAV_LINKS = ['Routes', 'Gallery', 'Stats', 'Journal', 'Plans']

function Nav() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between p-4 sm:p-5">
        {/* Logo + wordmark */}
        <div className="flex items-center gap-2.5">
          <Mountain className="text-white" size={22} strokeWidth={1.8} />
          <span className="text-white text-2xl font-playfair italic">Benjo</span>
        </div>

        {/* Center pill (desktop only) */}
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-2 py-2 items-center gap-1">
          {NAV_LINKS.map((link) => (
            <button
              key={link}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                link === 'Routes'
                  ? 'bg-white text-gray-900'
                  : 'text-white/80 hover:bg-white/20 hover:text-white'
              }`}
            >
              {link}
            </button>
          ))}
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          <a
            href={HIKE_MAP_URL}
            className="hidden md:block bg-white text-gray-900 text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-gray-100 transition-colors"
          >
            Open Map
          </a>
          <button
            className="md:hidden text-white p-1"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen(v => !v)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile slide-down drawer */}
      <div
        className={`fixed inset-x-0 top-0 z-[90] bg-black/90 backdrop-blur-xl transition-all duration-300 ease-in-out md:hidden ${
          menuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col gap-1 pt-24 pb-8 px-6">
          {NAV_LINKS.map((link) => (
            <button
              key={link}
              onClick={() => setMenuOpen(false)}
              className="text-left text-white/80 hover:text-white text-lg font-medium py-3 border-b border-white/10 last:border-0 transition-colors"
            >
              {link}
            </button>
          ))}
          <a
            href={HIKE_MAP_URL}
            className="mt-6 bg-[#e8702a] text-white text-sm font-semibold px-6 py-3.5 rounded-full text-center hover:bg-[#d2611f] transition-colors"
          >
            Open the Carneddau Map →
          </a>
        </div>
      </div>
    </>
  )
}

// ── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  const mouseRef  = useRef({ x: -999, y: -999 })
  const smoothRef = useRef({ x: -999, y: -999 })
  const rafRef    = useRef<number>(0)
  const [cursorPos, setCursorPos] = useState({ x: -999, y: -999 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('mousemove', onMove)

    const tick = () => {
      smoothRef.current.x += (mouseRef.current.x - smoothRef.current.x) * 0.1
      smoothRef.current.y += (mouseRef.current.y - smoothRef.current.y) * 0.1
      setCursorPos({ x: smoothRef.current.x, y: smoothRef.current.y })
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <section
      className="relative w-full overflow-hidden h-screen bg-black"
      style={{ height: '100dvh' }}
    >
      {/* 1. Base image */}
      <div
        className="absolute inset-0 bg-center bg-cover bg-no-repeat z-10 hero-zoom"
        style={{ backgroundImage: `url(${BG_IMAGE_1})` }}
      />

      {/* 2. Reveal layer */}
      <div className="absolute inset-0 z-30 pointer-events-none">
        <RevealLayer image={BG_IMAGE_2} cursorX={cursorPos.x} cursorY={cursorPos.y} />
      </div>

      {/* 3. Heading */}
      <div className="absolute top-[14%] left-0 right-0 z-50 flex flex-col items-center text-center px-5 pointer-events-none">
        <h1 className="text-white leading-[0.95]">
          <span
            className="block font-playfair italic font-normal text-5xl sm:text-7xl md:text-8xl hero-anim hero-reveal"
            style={{ letterSpacing: '-0.05em', animationDelay: '0.25s' }}
          >
            Every summit,
          </span>
          <span
            className="block font-normal text-5xl sm:text-7xl md:text-8xl -mt-1 hero-anim hero-reveal"
            style={{ letterSpacing: '-0.08em', animationDelay: '0.42s' }}
          >
            carved in 3D
          </span>
        </h1>
      </div>

      {/* 4. Bottom-left paragraph */}
      <div
        className="hidden sm:block absolute bottom-14 left-10 md:left-14 max-w-[260px] z-50 hero-anim hero-fade"
        style={{ animationDelay: '0.7s' }}
      >
        <p className="text-sm text-white/80 leading-relaxed">
          A personal log of routes walked, ridges crossed and summits bagged — rendered as interactive 3D terrain you can orbit, explore and relive.
        </p>
      </div>

      {/* 5. Bottom-right block */}
      <div
        className="absolute bottom-10 sm:bottom-24 left-5 right-5 sm:left-auto sm:right-10 md:right-14 max-w-full sm:max-w-[260px] z-50 flex flex-col items-start gap-4 sm:gap-5 hero-anim hero-fade"
        style={{ animationDelay: '0.85s' }}
      >
        <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
          Move your cursor to reveal the terrain beneath. Tap a summit to inspect it, or hit play to walk the route from above.
        </p>
        <a
          href={HIKE_MAP_URL}
          className="bg-[#e8702a] hover:bg-[#d2611f] text-white text-sm font-medium px-7 py-3 rounded-full transition-all hover:scale-[1.03] active:scale-95 hover:shadow-lg hover:shadow-[#e8702a]/30"
        >
          Walk the Carneddau →
        </a>
      </div>
    </section>
  )
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <div className="min-h-screen bg-black tracking-[-0.02em]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Nav />
      <Hero />
    </div>
  )
}
