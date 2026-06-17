'use client'
import { forwardRef } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

type Variant = 'primary' | 'subtle' | 'icon'

interface GlassButtonProps {
  children?: React.ReactNode
  href?: string
  onClick?: () => void
  variant?: Variant
  showArrow?: boolean
  className?: string
  'aria-label'?: string
  type?: 'button' | 'submit'
}

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    'px-7 py-3.5 text-sm font-semibold bg-[#0e2a28]/60 text-white border-white/25 hover:border-white/45',
  subtle:
    'px-5 py-2.5 text-xs font-medium bg-black/40 text-[#ffd9a0] border-white/20 hover:border-white/40',
  icon:
    'w-9 h-9 p-0 justify-center bg-black/50 text-white border-white/30 hover:border-white/50',
}

const GlassButton = forwardRef<HTMLButtonElement, GlassButtonProps>(function GlassButton(
  { children, href, onClick, variant = 'primary', showArrow = false, className = '', type = 'button', ...rest },
  ref
) {
  const classes = `relative inline-flex items-center gap-2 rounded-full border backdrop-blur-md
    transition-colors duration-300 no-underline
    shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_4px_18px_rgba(0,0,0,0.35)]
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8702a]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black
    ${VARIANT_CLASSES[variant]} ${className}`

  const content = (
    <>
      <span className="relative z-10">{children}</span>
      {showArrow && (
        <motion.span className="relative z-10 inline-flex" initial={false}>
          <ArrowRight size={15} />
        </motion.span>
      )}
      <motion.span
        aria-hidden
        className="absolute inset-0 rounded-full bg-[#e8702a]/0 group-hover:bg-[#e8702a]/10 pointer-events-none"
      />
    </>
  )

  const motionProps = {
    whileHover: { y: -2, scale: 1.01 },
    whileTap: { scale: 0.96 },
    transition: { type: 'spring' as const, stiffness: 400, damping: 24 },
  }

  if (href) {
    return (
      <motion.div {...motionProps} className="inline-block group">
        <Link href={href} className={classes} aria-label={rest['aria-label']}>
          {content}
        </Link>
      </motion.div>
    )
  }

  return (
    <motion.button
      ref={ref}
      type={type}
      onClick={onClick}
      className={`${classes} group`}
      aria-label={rest['aria-label']}
      {...motionProps}
    >
      {content}
    </motion.button>
  )
})

export default GlassButton
