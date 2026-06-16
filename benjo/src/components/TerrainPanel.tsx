'use client'
import { motion } from 'framer-motion'
import PeakMarker from './PeakMarker'
import type { MountainRange } from '@/data/ranges'

export default function TerrainPanel({ range }: { range: MountainRange }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`relative w-full h-[60vh] sm:h-[70vh] rounded-3xl overflow-hidden border border-white/20 bg-gradient-to-br ${range.gradient} shadow-2xl`}
    >
      {/* mist layers */}
      <motion.div
        className="absolute inset-x-0 bottom-0 h-1/2 bg-white/5"
        style={{ filter: 'blur(40px)' }}
        animate={{ x: ['-5%', '5%', '-5%'] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute inset-x-0 top-0 h-1/3 bg-white/5"
        style={{ filter: 'blur(60px)' }}
        animate={{ x: ['4%', '-4%', '4%'] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* mountain silhouette */}
      <svg className="absolute inset-x-0 bottom-0 w-full h-2/3 opacity-30" viewBox="0 0 100 50" preserveAspectRatio="none">
        <polygon points="0,50 0,30 15,12 28,28 40,8 55,26 68,4 80,22 92,14 100,30 100,50" fill="white" />
      </svg>

      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-black/50 border border-white/20 backdrop-blur-md px-3 py-1.5 text-[11px] font-medium text-white/70">
          Interactive terrain · tap a marker for peak info
        </span>
      </div>

      {range.keyPeaks.map(peak => (
        <PeakMarker key={peak.name} peak={peak} />
      ))}
    </motion.div>
  )
}
