'use client'
import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { buildHeightFn, type ModelStyle } from './terrainShapes'

const SEGMENTS = 48

function buildGeometry(seed: number, style: ModelStyle, accent: THREE.Color) {
  const size = 4
  const geometry = new THREE.PlaneGeometry(size, size, SEGMENTS, SEGMENTS)
  geometry.rotateX(-Math.PI / 2)
  const heightFn = buildHeightFn(seed, style)
  const pos = geometry.attributes.position
  const colors = new Float32Array(pos.count * 3)
  const rock = new THREE.Color('#6b6359')
  const snow = new THREE.Color('#e9e4da')
  const grass = new THREE.Color('#4a5638')

  let maxH = 0
  const heights: number[] = []
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i) / size
    const z = pos.getZ(i) / size
    const h = heightFn(x, z)
    heights.push(h)
    if (Math.abs(h) > maxH) maxH = Math.abs(h)
  }
  for (let i = 0; i < pos.count; i++) {
    const h = heights[i] / (maxH || 1)
    pos.setY(i, h * 0.9)
    const t = Math.max(0, Math.min(1, (h + 1) / 2))
    let c: THREE.Color
    if (t > 0.72) c = snow.clone().lerp(accent, 0.08)
    else if (t > 0.42) c = rock.clone().lerp(accent, 0.18)
    else c = grass.clone().lerp(accent, 0.1)
    colors[i * 3] = c.r
    colors[i * 3 + 1] = c.g
    colors[i * 3 + 2] = c.b
  }
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geometry.computeVertexNormals()
  return geometry
}

export default function TerrainMesh({
  seed,
  style,
  accentColor = '#e8702a',
  interactive = true,
  scrollRef,
}: {
  seed: number
  style: ModelStyle
  accentColor?: string
  interactive?: boolean
  scrollRef?: { current: number }
}) {
  const groupRef = useRef<THREE.Group>(null)
  const hoverTarget = useRef({ x: 0, z: 0 })
  const accent = useMemo(() => new THREE.Color(accentColor), [accentColor])
  const geometry = useMemo(() => buildGeometry(seed, style, accent), [seed, style, accent])

  useFrame((_, delta) => {
    const g = groupRef.current
    if (!g) return
    g.rotation.y += delta * 0.12
    const scroll = scrollRef?.current ?? 0
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, -0.5 + hoverTarget.current.x + scroll * 0.4, 0.08)
    g.rotation.z = THREE.MathUtils.lerp(g.rotation.z, hoverTarget.current.z, 0.08)
  })

  return (
    <group
      ref={groupRef}
      rotation={[-0.5, 0, 0]}
      onPointerMove={interactive ? (e) => {
        hoverTarget.current = { x: 0, z: (e.point.x ?? 0) * 0.08 }
      } : undefined}
      onPointerLeave={interactive ? () => { hoverTarget.current = { x: 0, z: 0 } } : undefined}
    >
      <mesh geometry={geometry}>
        <meshStandardMaterial vertexColors flatShading roughness={0.85} metalness={0.05} />
      </mesh>
      <ambientLight intensity={0.55} />
      <directionalLight position={[3, 4, 2]} intensity={1.1} />
      <directionalLight position={[-3, 2, -2]} intensity={0.35} color="#88aaff" />
    </group>
  )
}
