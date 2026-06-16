'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Mountain, AlertTriangle, Route, ArrowLeft } from 'lucide-react'
import type { MountainRange } from '@/data/ranges'

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.55, ease: 'easeOut' as const },
}

export default function RangeDetailSections({ range }: { range: MountainRange }) {
  return (
    <div className="px-5 sm:px-10 md:px-16 max-w-7xl mx-auto pb-24">
      {/* Difficulty / terrain notes */}
      <motion.div {...fadeUp} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10">
        <div className="rounded-2xl border border-white/15 bg-white/5 backdrop-blur-md p-5">
          <p className="text-[11px] uppercase tracking-wide text-white/40 font-semibold">Difficulty</p>
          <p className="text-white text-lg mt-1.5 font-medium">{range.difficulty}</p>
        </div>
        <div className="rounded-2xl border border-white/15 bg-white/5 backdrop-blur-md p-5">
          <p className="text-[11px] uppercase tracking-wide text-white/40 font-semibold">Terrain</p>
          <p className="text-white text-lg mt-1.5 font-medium">{range.terrainType}</p>
        </div>
        <div className="rounded-2xl border border-white/15 bg-white/5 backdrop-blur-md p-5">
          <p className="text-[11px] uppercase tracking-wide text-white/40 font-semibold">Best for</p>
          <p className="text-white/85 text-sm mt-1.5 leading-relaxed">{range.bestFor.join(' · ')}</p>
        </div>
      </motion.div>

      {/* Peak list */}
      <motion.div {...fadeUp} className="mt-14">
        <h2 className="font-playfair italic text-white text-2xl sm:text-3xl flex items-center gap-2">
          <Mountain size={22} className="text-[#e8702a]" /> Key peaks
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {range.keyPeaks.map(peak => (
            <div key={peak.name} className="rounded-2xl border border-white/15 bg-white/5 backdrop-blur-md p-5">
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="text-white font-medium text-base">{peak.name}</h3>
                <span className="text-[#ffd9a0] text-xs font-semibold whitespace-nowrap">{peak.heightMetres}m</span>
              </div>
              {peak.welshName && peak.welshName !== peak.name && (
                <p className="text-white/40 text-xs mt-0.5">{peak.welshName}</p>
              )}
              <p className="text-white/65 text-xs leading-relaxed mt-2">{peak.description}</p>
              <p className="text-[11px] font-medium text-[#e8702a] mt-2">{peak.difficultyNote}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Suggested routes */}
      <motion.div {...fadeUp} className="mt-14">
        <h2 className="font-playfair italic text-white text-2xl sm:text-3xl flex items-center gap-2">
          <Route size={22} className="text-[#e8702a]" /> Suggested routes
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          {range.suggestedRoutes.map(route => (
            <div key={route.name} className="rounded-2xl border border-white/15 bg-white/5 backdrop-blur-md p-5">
              <h3 className="text-white font-medium text-base">{route.name}</h3>
              <p className="text-white/65 text-xs leading-relaxed mt-2">{route.summary}</p>
              <div className="flex items-center gap-3 mt-3 text-[11px] text-white/50">
                <span>{route.distanceKm} km</span>
                <span>·</span>
                <span>{route.durationHours} hrs</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Warnings */}
      <motion.div {...fadeUp} className="mt-14 rounded-2xl border border-[#e8702a]/40 bg-[#e8702a]/10 backdrop-blur-md p-6">
        <h2 className="text-[#ffd9a0] text-lg font-semibold flex items-center gap-2">
          <AlertTriangle size={18} /> Safety &amp; weather
        </h2>
        <ul className="mt-3 space-y-2">
          {range.warnings.map(w => (
            <li key={w} className="text-white/75 text-sm leading-relaxed flex gap-2">
              <span className="text-[#e8702a]">—</span> {w}
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Gallery / model placeholder */}
      <motion.div {...fadeUp} className="mt-14">
        <h2 className="font-playfair italic text-white text-2xl sm:text-3xl">Gallery &amp; 3D model</h2>
        {range.modelAsset ? (
          <div className="relative w-full h-[50vh] rounded-3xl overflow-hidden border border-white/20 mt-6">
            <iframe src={range.modelAsset} className="absolute inset-0 w-full h-full border-0" title={`${range.name} 3D Map`} allowFullScreen />
          </div>
        ) : (
          <div className="rounded-3xl border border-white/15 bg-white/5 backdrop-blur-md p-10 mt-6 text-center">
            <p className="text-white/60 text-sm">A full draggable 3D terrain model for {range.name} is in the works.</p>
            <p className="text-white/40 text-xs mt-1.5">Photo gallery and live model coming soon.</p>
          </div>
        )}
      </motion.div>

      {/* CTA */}
      <motion.div {...fadeUp} className="mt-16 text-center">
        <Link href="/routes" className="no-underline inline-flex items-center gap-2 text-sm font-medium text-white/80 hover:text-white border border-white/25 rounded-full px-6 py-3 transition-colors">
          <ArrowLeft size={15} /> Back to all nine ranges
        </Link>
      </motion.div>
    </div>
  )
}
