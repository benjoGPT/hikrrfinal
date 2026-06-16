import Nav from '@/components/Nav'
import SpotlightReveal from '@/components/SpotlightReveal'
import RangeCard from '@/components/RangeCard'
import { RANGES } from '@/data/ranges'

export default function RoutesPage() {
  return (
    <div className="bg-void min-h-screen">
      <Nav active="Routes" />

      <SpotlightReveal
        className="w-full h-[70dvh] pt-16"
        base={
          <div className="w-full h-full bg-black flex flex-col items-center justify-center text-center px-5">
            <h1 className="text-white" style={{ lineHeight: 0.95 }}>
              <span className="block font-playfair italic font-normal text-4xl sm:text-6xl md:text-7xl"
                style={{ letterSpacing: '-0.05em' }}>
                The Nine Ranges
              </span>
              <span className="block font-normal text-4xl sm:text-6xl md:text-7xl -mt-1"
                style={{ letterSpacing: '-0.08em' }}>
                of Wales
              </span>
            </h1>
            <p className="mt-5 max-w-lg text-sm text-white/60 leading-relaxed">
              Move your cursor to reveal the relief beneath. Every major Snowdonia and Mid-Wales
              massif, mapped peak by peak — pick a range to drag, orbit and walk it for real.
            </p>
          </div>
        }
        revealed={
          <div className="w-full h-full flex flex-col items-center justify-center text-center px-5"
            style={{ background: 'radial-gradient(circle at center, #e8702a33, transparent 70%), #0a0a0c' }}>
            <h1 className="text-white" style={{ lineHeight: 0.95 }}>
              <span className="block font-playfair italic font-normal text-4xl sm:text-6xl md:text-7xl"
                style={{ letterSpacing: '-0.05em', textShadow: '0 0 40px rgba(232,112,42,0.6)' }}>
                The Nine Ranges
              </span>
              <span className="block font-normal text-4xl sm:text-6xl md:text-7xl -mt-1"
                style={{ letterSpacing: '-0.08em', textShadow: '0 0 40px rgba(232,112,42,0.6)' }}>
                of Wales
              </span>
            </h1>
          </div>
        }
      />

      <div className="px-5 sm:px-10 md:px-16 pb-24 -mt-6 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 max-w-7xl mx-auto">
          {RANGES.map((r, i) => (
            <RangeCard key={r.slug} range={r} index={i} />
          ))}
        </div>
      </div>
    </div>
  )
}
