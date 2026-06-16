'use client'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Info, X, Mountain } from 'lucide-react'
import type { Peak } from '@/data/ranges'

export default function PeakMarker({ peak }: { peak: Peak }) {
  const [open, setOpen] = useState(false)

  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
      style={{ left: `${peak.position.x}%`, top: `${peak.position.y}%` }}
    >
      <motion.button
        type="button"
        aria-label={`Info about ${peak.name}, ${peak.heightMetres} metres`}
        aria-expanded={open}
        onClick={() => setOpen(v => !v)}
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.92 }}
        className="group relative flex items-center justify-center"
      >
        <motion.span
          className="absolute inset-0 rounded-full bg-[#e8702a]/40"
          animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        />
        <span className="relative flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/70 border border-white/40 backdrop-blur-md text-white shadow-lg">
          <Info size={14} />
        </span>
      </motion.button>

      <span className="hidden sm:block absolute top-full left-1/2 -translate-x-1/2 mt-1 text-[10px] font-medium text-white/80 whitespace-nowrap pointer-events-none">
        {peak.name}
      </span>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-30 bg-black/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              role="dialog"
              aria-label={`${peak.name} details`}
              initial={{ opacity: 0, scale: 0.9, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 12 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              className="fixed z-40 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[88vw] max-w-sm rounded-2xl border border-white/30 bg-black/80 backdrop-blur-2xl p-6 text-left shadow-2xl"
            >
              <button
                type="button"
                aria-label="Close"
                onClick={() => setOpen(false)}
                className="absolute top-3 right-3 text-white/60 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
              <div className="flex items-center gap-2 text-[#ffd9a0]">
                <Mountain size={16} />
                <span className="text-xs font-semibold uppercase tracking-wide">{peak.heightMetres}m</span>
              </div>
              <h3 className="font-playfair italic text-white text-2xl mt-1">
                {peak.name}
                {peak.welshName && peak.welshName !== peak.name && (
                  <span className="block not-italic font-sans text-sm text-white/50 mt-0.5">{peak.welshName}</span>
                )}
              </h3>
              <p className="text-white/80 text-sm leading-relaxed mt-3">{peak.description}</p>
              <p className="text-white/60 text-xs leading-relaxed mt-3 border-t border-white/10 pt-3">{peak.infoNote}</p>
              <p className="text-xs font-medium text-[#e8702a] mt-3">{peak.difficultyNote}</p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
