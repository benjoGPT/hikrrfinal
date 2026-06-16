'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Mountain, ArrowRight } from 'lucide-react'
import type { MountainRange } from '@/data/ranges'

export default function RangeCard({ range, index }: { range: MountainRange; index: number }) {
  const highest = range.keyPeaks.reduce((a, b) => (b.heightMetres > a.heightMetres ? b : a), range.keyPeaks[0])

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotateX: -6 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.6, delay: Math.min(index, 6) * 0.06, ease: 'easeOut' }}
      style={{ perspective: 1000 }}
    >
      <Link href={`/ranges/${range.slug}`} className="no-underline group block h-full">
        <div className={`relative h-[22rem] sm:h-[26rem] rounded-3xl overflow-hidden border border-white/25 bg-gradient-to-br ${range.gradient} transition-transform duration-500 group-hover:scale-[1.015] group-hover:border-white/40 shadow-xl`}>
          {/* mountain silhouette */}
          <svg className="absolute inset-x-0 bottom-0 w-full h-1/2 opacity-25" viewBox="0 0 100 50" preserveAspectRatio="none">
            <polygon points="0,50 0,32 14,14 26,30 38,10 52,28 64,6 78,24 90,16 100,32 100,50" fill="white" />
          </svg>

          {/* animated mist */}
          <motion.div
            className="absolute inset-x-0 bottom-0 h-1/3 bg-white/10"
            style={{ filter: 'blur(30px)' }}
            animate={{ x: ['-6%', '6%', '-6%'] }}
            transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* gradient glow */}
          <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-[#e8702a]/20 blur-3xl" />

          <div className="absolute inset-0 bg-black/25 group-hover:bg-black/10 transition-colors" />

          <div className="relative h-full flex flex-col justify-between p-6 sm:p-7">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1 rounded-full bg-black/50 border border-white/20 backdrop-blur-md px-2.5 py-1 text-[10px] font-semibold text-white/80 uppercase tracking-wide">
                {range.keyPeaks.length} peaks
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-black/50 border border-white/20 backdrop-blur-md px-2.5 py-1 text-[10px] font-semibold text-white/80 uppercase tracking-wide">
                <Mountain size={11} /> {highest.heightMetres}m
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-black/50 border border-white/20 backdrop-blur-md px-2.5 py-1 text-[10px] font-semibold text-white/80 uppercase tracking-wide">
                {range.difficulty}
              </span>
            </div>

            <div>
              <h3 className="font-playfair italic text-white text-3xl sm:text-4xl leading-tight">{range.name}</h3>
              {range.welshName && <p className="text-white/50 text-sm mt-0.5">{range.welshName}</p>}
              <p className="text-white/70 text-sm mt-3 leading-relaxed max-w-sm">{range.shortDescription}</p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-[#ffd9a0] group-hover:gap-2.5 transition-all">
                Explore peaks <ArrowRight size={15} />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
