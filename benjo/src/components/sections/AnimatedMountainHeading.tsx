'use client'
import { motion, useReducedMotion } from 'framer-motion'

interface AnimatedMountainHeadingProps {
  lines: string[]
  subtitle?: string
  className?: string
}

const RIDGE_PATH = 'M0,28 L40,28 L70,8 L110,28 L150,4 L190,28 L230,12 L270,28 L320,28'
const PEAK_POSITIONS = [70, 150, 230]

export default function AnimatedMountainHeading({ lines, subtitle, className = '' }: AnimatedMountainHeadingProps) {
  const reducedMotion = useReducedMotion()

  const words = lines.flatMap((line, li) => line.split(' ').map((w, wi) => ({ word: w, line: li, key: `${li}-${wi}` })))

  if (reducedMotion) {
    return (
      <div className={`text-center ${className}`}>
        <h1 className="text-white" style={{ lineHeight: 0.95 }}>
          {lines.map((line, i) => (
            <span key={i} className="block font-playfair italic font-normal text-4xl sm:text-6xl md:text-7xl" style={{ letterSpacing: '-0.05em' }}>
              {line}
            </span>
          ))}
        </h1>
        {subtitle && <p className="mt-5 max-w-lg mx-auto text-sm text-white/60 leading-relaxed">{subtitle}</p>}
      </div>
    )
  }

  return (
    <div className={`relative text-center ${className}`}>
      {/* drifting mist */}
      <motion.div
        aria-hidden
        className="absolute -inset-x-10 top-1/3 h-32 bg-white/5 pointer-events-none"
        style={{ filter: 'blur(50px)' }}
        animate={{ x: ['-4%', '4%', '-4%'] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />

      <h1 className="relative text-white" style={{ lineHeight: 0.95 }}>
        {lines.map((line, li) => (
          <span key={li} className="block font-playfair italic font-normal text-4xl sm:text-6xl md:text-7xl" style={{ letterSpacing: '-0.05em' }}>
            {words.filter(w => w.line === li).map((w, i) => (
              <motion.span
                key={w.key}
                className="inline-block mr-[0.28em] last:mr-0"
                initial={{ opacity: 0, y: 18, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.6, delay: 0.08 * (i + li * 4), ease: 'easeOut' }}
              >
                {w.word}
              </motion.span>
            ))}
          </span>
        ))}
      </h1>

      {/* glowing ridge underline */}
      <motion.svg
        viewBox="0 0 320 32"
        className="mx-auto mt-4 w-48 sm:w-64 h-6 sm:h-8 overflow-visible"
        aria-hidden
      >
        <motion.path
          d={RIDGE_PATH}
          fill="none"
          stroke="#e8702a"
          strokeWidth={1.5}
          strokeLinecap="round"
          style={{ filter: 'drop-shadow(0 0 6px rgba(232,112,42,0.7))' }}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.1, delay: 0.5, ease: 'easeInOut' }}
        />
        {PEAK_POSITIONS.map((x, i) => (
          <motion.circle
            key={x}
            cx={x}
            cy={x === 150 ? 4 : x === 70 ? 8 : 12}
            r={2.5}
            fill="#ffd9a0"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 1.4 + i * 0.15, ease: 'easeOut' }}
          />
        ))}
      </motion.svg>

      {subtitle && (
        <motion.p
          className="mt-5 max-w-lg mx-auto text-sm text-white/60 leading-relaxed"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.6 }}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  )
}
