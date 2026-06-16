import Link from 'next/link'
import Nav from '@/components/Nav'
import SpotlightReveal from '@/components/SpotlightReveal'

const RANGES = [
  {
    name: 'The Carneddau',
    href: '/carneddau',
    blurb: 'Carnedd Dafydd · Llewelyn · Yr Elen · Pen yr Ole Wen',
    gradient: 'from-[#2c2a26] via-[#3c4a30] to-[#0a0a0c]',
  },
  {
    name: 'Yr Wyddfa',
    href: '/snowdon',
    blurb: 'Crib Goch · Crib y Ddysgl · Yr Wyddfa · Y Lliwedd',
    gradient: 'from-[#1c2433] via-[#3c5570] to-[#0a0a0c]',
  },
  {
    name: 'The Glyderau',
    href: '/glyderau',
    blurb: 'Tryfan · Glyder Fach · Glyder Fawr · Y Garn',
    gradient: 'from-[#2a2118] via-[#6e7a3f] to-[#0a0a0c]',
  },
]

export default function RoutesPage() {
  return (
    <div className="bg-void min-h-screen">
      <Nav active="Routes" />

      <SpotlightReveal
        className="w-full"
        base={
          <div className="w-full h-full bg-black flex flex-col items-center justify-center text-center px-5"
            style={{ height: '60dvh' }}>
            <h1 className="text-white" style={{ lineHeight: 0.95 }}>
              <span className="block font-playfair italic font-normal text-4xl sm:text-6xl md:text-7xl"
                style={{ letterSpacing: '-0.05em' }}>
                Every range,
              </span>
              <span className="block font-normal text-4xl sm:text-6xl md:text-7xl -mt-1"
                style={{ letterSpacing: '-0.08em' }}>
                carved in 3D
              </span>
            </h1>
            <p className="mt-5 max-w-md text-sm text-white/60 leading-relaxed">
              Move your cursor to reveal the relief beneath. Pick a range below to drag, orbit and
              walk it for real.
            </p>
          </div>
        }
        revealed={
          <div className="w-full h-full flex flex-col items-center justify-center text-center px-5"
            style={{ height: '60dvh', background: 'radial-gradient(circle at center, #e8702a33, transparent 70%), #0a0a0c' }}>
            <h1 className="text-white" style={{ lineHeight: 0.95 }}>
              <span className="block font-playfair italic font-normal text-4xl sm:text-6xl md:text-7xl"
                style={{ letterSpacing: '-0.05em', textShadow: '0 0 40px rgba(232,112,42,0.6)' }}>
                Every range,
              </span>
              <span className="block font-normal text-4xl sm:text-6xl md:text-7xl -mt-1"
                style={{ letterSpacing: '-0.08em', textShadow: '0 0 40px rgba(232,112,42,0.6)' }}>
                carved in 3D
              </span>
            </h1>
          </div>
        }
      />

      <div className="px-5 sm:px-10 md:px-14 pb-20 -mt-10 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {RANGES.map(r => (
            <Link key={r.href} href={r.href} className="no-underline group">
              <div className={`relative h-56 rounded-2xl overflow-hidden border border-white/30 bg-gradient-to-br ${r.gradient} transition-transform duration-300 group-hover:scale-[1.02]`}>
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
                <div className="absolute inset-0 p-5 flex flex-col justify-end">
                  <h3 className="font-playfair italic text-white text-2xl">{r.name}</h3>
                  <p className="text-white/70 text-xs mt-1.5 leading-relaxed">{r.blurb}</p>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-[#ffd9a0]">
                    Drag it open →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
