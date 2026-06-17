'use client'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { Mountain, ArrowRight } from 'lucide-react'
import type { MountainRange } from '@/data/ranges'

const RangeTerrainCanvas = dynamic(() => import('./three/RangeTerrainCanvas'), { ssr: false })

export default function RangeCard({ range, index }: { range: MountainRange; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotateX: -6 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.6, delay: Math.min(index, 6) * 0.06, ease: 'easeOut' }}
      style={{ perspective: 1000 }}
    >
      <Link href={`/ranges/${range.slug}`} className="no-underline group block h-full">
        <div className="relative h-[26rem] sm:h-[30rem] rounded-3xl overflow-hidden border border-white/25 transition-transform duration-500 group-hover:scale-[1.015] group-hover:border-white/40 shadow-xl">
          {/* image layer — TODO: real photography, currently a generated placeholder */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${range.heroImage})` }}
          />
          <div className={`absolute inset-0 bg-gradient-to-b ${range.gradient} mix-blend-multiply opacity-80`} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/10" />

          {/* glass layer */}
          <div className="absolute inset-0 backdrop-blur-[2px]" />

          {/* light sweep on hover */}
          <motion.div
            aria-hidden
            className="absolute inset-y-0 -left-1/2 w-1/2 bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none"
            initial={{ x: '0%' }}
            whileHover={{ x: '220%' }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
          />

          {/* mist */}
          <motion.div
            className="absolute inset-x-0 bottom-0 h-1/3 bg-white/10"
            style={{ filter: 'blur(30px)' }}
            animate={{ x: ['-6%', '6%', '-6%'] }}
            transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* 3D terrain preview */}
          <div className="absolute inset-x-0 top-0 h-[55%] opacity-90 group-hover:opacity-100 transition-opacity">
            <RangeTerrainCanvas seed={range.modelSeed} style={range.modelStyle} accentColor={range.accentColor} />
          </div>

          <div className="relative h-full flex flex-col justify-between p-6 sm:p-7">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1 rounded-full bg-black/55 border border-white/20 backdrop-blur-md px-2.5 py-1 text-[10px] font-semibold text-white/85 uppercase tracking-wide">
                {range.peakCount} peaks
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-black/55 border border-white/20 backdrop-blur-md px-2.5 py-1 text-[10px] font-semibold text-white/85 uppercase tracking-wide">
                <Mountain size={11} /> {range.highestPeak.heightMetres}m
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-black/55 border border-white/20 backdrop-blur-md px-2.5 py-1 text-[10px] font-semibold text-white/85 uppercase tracking-wide">
                {range.difficulty}
              </span>
            </div>

            <div>
              <h3 className="font-playfair italic text-white text-3xl sm:text-4xl leading-tight">{range.name}</h3>
              {range.welshName && <p className="text-white/50 text-sm mt-0.5">{range.welshName}</p>}
              <p className="text-white/45 text-xs mt-1 uppercase tracking-wide">{range.terrainProfile}</p>
              <p className="text-white/70 text-sm mt-3 leading-relaxed max-w-sm">{range.shortDescription}</p>

              <span
                className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/20 group-hover:border-white/40 bg-[#0e2a28]/50 backdrop-blur-md px-5 py-2.5 text-xs font-medium text-[#ffd9a0]
                  shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] transition-colors duration-300"
              >
                Explore peaks
                <motion.span className="inline-flex" initial={false} animate={{ x: 0 }} whileHover={{ x: 3 }}>
                  <ArrowRight size={14} />
                </motion.span>
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
