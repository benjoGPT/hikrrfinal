export type ModelStyle =
  | 'broad-plateau'
  | 'jagged-ridge'
  | 'horseshoe-massif'
  | 'compact-rugged'
  | 'slate-pyramids'
  | 'broken-wild'
  | 'cliff-bowl'
  | 'long-ridge'
  | 'rolling-hills'

function hash(x: number, y: number, seed: number) {
  let h = Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453
  h = h - Math.floor(h)
  return h * 2 - 1
}

function valueNoise(x: number, y: number, seed: number) {
  const x0 = Math.floor(x), y0 = Math.floor(y)
  const x1 = x0 + 1, y1 = y0 + 1
  const sx = x - x0, sy = y - y0
  const n00 = hash(x0, y0, seed)
  const n10 = hash(x1, y0, seed)
  const n01 = hash(x0, y1, seed)
  const n11 = hash(x1, y1, seed)
  const ix0 = n00 + (n10 - n00) * (sx * sx * (3 - 2 * sx))
  const ix1 = n01 + (n11 - n01) * (sx * sx * (3 - 2 * sx))
  return ix0 + (ix1 - ix0) * (sy * sy * (3 - 2 * sy))
}

function fbm(x: number, y: number, seed: number, octaves = 4) {
  let total = 0, amp = 1, freq = 1, max = 0
  for (let i = 0; i < octaves; i++) {
    total += valueNoise(x * freq, y * freq, seed + i * 13.7) * amp
    max += amp
    amp *= 0.5
    freq *= 2
  }
  return total / max
}

function gaussian(dx: number, dy: number, radius: number) {
  const d2 = dx * dx + dy * dy
  return Math.exp(-d2 / (2 * radius * radius))
}

/** Builds a deterministic height function for a given style + seed, sampling x/y in roughly [-1, 1]. */
export function buildHeightFn(seed: number, style: ModelStyle) {
  const base = (x: number, y: number, octaves = 4, scale = 1.6) => fbm(x * scale, y * scale, seed, octaves)

  switch (style) {
    case 'broad-plateau':
      return (x: number, y: number) => {
        const n = base(x, y, 3, 1.1)
        const plateau = Math.tanh(n * 1.6) * 0.5
        const ridgeTilt = -y * 0.12
        return plateau * 0.55 + ridgeTilt
      }
    case 'jagged-ridge':
      return (x: number, y: number) => {
        const n = base(x, y, 5, 2.2)
        const spike = Math.sign(n) * Math.pow(Math.abs(n), 0.55)
        const ridge = 1 - Math.min(1, Math.abs(y) * 1.4)
        return spike * 0.85 * (0.4 + ridge * 0.6)
      }
    case 'horseshoe-massif':
      return (x: number, y: number) => {
        const dist = Math.sqrt(x * x + y * y)
        const angle = Math.atan2(y, x)
        const rim = gaussian(dist - 0.55, 0, 0.18) * (0.6 + 0.4 * Math.sin(angle * 3 + seed))
        const centralPeak = gaussian(x, y, 0.35) * 1.0
        const texture = base(x, y, 3, 2.4) * 0.12
        return centralPeak * 0.9 + rim * 0.7 + texture
      }
    case 'compact-rugged':
      return (x: number, y: number) => {
        const n = base(x, y, 6, 3.0)
        return Math.sign(n) * Math.pow(Math.abs(n), 0.7) * 0.8
      }
    case 'slate-pyramids': {
      const peaks = [0, 1, 2, 3].map(i => ({
        x: (hash(i, 0, seed) * 0.6),
        y: (hash(0, i, seed) * 0.6),
        r: 0.22 + Math.abs(hash(i, i, seed)) * 0.18,
        h: 0.7 + Math.abs(hash(i, seed, i)) * 0.5,
      }))
      return (x: number, y: number) => {
        let h = 0
        for (const p of peaks) {
          const d = Math.sqrt((x - p.x) ** 2 + (y - p.y) ** 2)
          h += Math.max(0, p.r - d) / p.r * p.h
        }
        return h * 0.6 + base(x, y, 2, 2.0) * 0.08
      }
    }
    case 'broken-wild':
      return (x: number, y: number) => {
        const warpX = x + fbm(x * 2, y * 2, seed + 50, 2) * 0.4
        const warpY = y + fbm(x * 2 + 5, y * 2 + 5, seed + 90, 2) * 0.4
        return base(warpX, warpY, 6, 2.6) * 0.75
      }
    case 'cliff-bowl':
      return (x: number, y: number) => {
        const cliff = 1 / (1 + Math.exp(-(x - 0.1) * 6))
        const bowl = -gaussian(x + 0.1, y, 0.35) * 0.5
        const texture = base(x, y, 3, 2.0) * 0.15
        return cliff * 0.9 + bowl + texture
      }
    case 'long-ridge':
      return (x: number, y: number) => {
        const ridge = gaussian(0, y, 0.22) * 0.9
        const lengthwise = 0.7 + 0.3 * Math.sin(x * 2.5 + seed)
        return ridge * lengthwise + base(x, y, 3, 1.8) * 0.1
      }
    case 'rolling-hills':
    default:
      return (x: number, y: number) => base(x, y, 3, 1.0) * 0.32
  }
}
