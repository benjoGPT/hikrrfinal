'use client'
import { useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { useScroll, useMotionValueEvent, useReducedMotion } from 'framer-motion'
import { useInView } from '@/hooks/useInView'
import TerrainMesh from './TerrainMesh'
import type { ModelStyle } from './terrainShapes'

export default function RangeTerrainCanvas({
  seed,
  style,
  accentColor,
  className = '',
  scrollLinked = false,
}: {
  seed: number
  style: ModelStyle
  accentColor?: string
  className?: string
  scrollLinked?: boolean
}) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const { ref: viewRef, inView } = useInView<HTMLDivElement>('150px')
  const scrollRef = useRef(0)
  const reducedMotion = useReducedMotion()
  const { scrollYProgress } = useScroll(scrollLinked ? { target: wrapRef, offset: ['start end', 'end start'] } : {})

  useMotionValueEvent(scrollYProgress, 'change', v => {
    if (scrollLinked) scrollRef.current = v - 0.5
  })

  return (
    <div
      ref={node => { wrapRef.current = node; viewRef.current = node }}
      className={`relative w-full h-full ${className}`}
    >
      {inView && (
        <Canvas
          dpr={[1, 1.5]}
          camera={{ position: [0, 1.6, 3.4], fov: 42 }}
          gl={{ antialias: true, alpha: true }}
        >
          <TerrainMesh
            seed={seed}
            style={style}
            accentColor={accentColor}
            interactive={!reducedMotion}
            scrollRef={scrollLinked ? scrollRef : undefined}
          />
        </Canvas>
      )}
    </div>
  )
}
