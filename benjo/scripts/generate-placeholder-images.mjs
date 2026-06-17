// Generates simple gradient + silhouette placeholder hero images for each
// mountain range. These are PNG-encoded (saved under .jpg filenames so the
// paths match data/ranges.ts) and exist only until real photography is
// sourced — see the TODO comments next to each heroImage field.
import { writeFileSync, mkdirSync } from 'node:fs'
import { deflateSync } from 'node:zlib'

const W = 960, H = 540

const RANGES = [
  { file: 'carneddau.jpg', stops: ['#2c2a26', '#3c4a30', '#0a0a0c'] },
  { file: 'glyderau.jpg', stops: ['#2a2118', '#6e7a3f', '#0a0a0c'] },
  { file: 'yr-wyddfa.jpg', stops: ['#1c2433', '#3c5570', '#0a0a0c'] },
  { file: 'moel-hebog.jpg', stops: ['#262321', '#4a4030', '#0a0a0c'] },
  { file: 'moelwynion.jpg', stops: ['#252220', '#5a5240', '#0a0a0c'] },
  { file: 'rhinogydd.jpg', stops: ['#211f1c', '#46523a', '#0a0a0c'] },
  { file: 'cadair-idris.jpg', stops: ['#1f1d1a', '#4a4a3a', '#0a0a0c'] },
  { file: 'aran-fawddwy.jpg', stops: ['#201e1b', '#414a36', '#0a0a0c'] },
  { file: 'dyfi-hills.jpg', stops: ['#1d1c19', '#4a5238', '#0a0a0c'] },
]

function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

function lerp(a, b, t) { return a + (b - a) * t }

function gradientColor(stops, t) {
  const segs = stops.length - 1
  const seg = Math.min(segs - 1, Math.floor(t * segs))
  const localT = t * segs - seg
  const [r0, g0, b0] = hexToRgb(stops[seg])
  const [r1, g1, b1] = hexToRgb(stops[seg + 1])
  return [lerp(r0, r1, localT), lerp(g0, g1, localT), lerp(b0, b1, localT)]
}

function silhouette(x, w) {
  // a simple jagged ridge line, deterministic per x
  const f = Math.sin(x / w * 9) * 0.5 + Math.sin(x / w * 23 + 2) * 0.3 + Math.sin(x / w * 5) * 0.4
  return 0.62 + f * 0.12
}

function buildPng(stops) {
  const raw = Buffer.alloc((W * 3 + 1) * H)
  let offset = 0
  for (let y = 0; y < H; y++) {
    raw[offset++] = 0 // no filter
    const t = y / (H - 1)
    for (let x = 0; x < W; x++) {
      const [r, g, b] = gradientColor(stops, t)
      const ridgeY = silhouette(x, W) * H
      const inSilhouette = y > ridgeY
      const shade = inSilhouette ? 0.55 : 1
      raw[offset++] = Math.round(r * shade)
      raw[offset++] = Math.round(g * shade)
      raw[offset++] = Math.round(b * shade)
    }
  }

  const idat = deflateSync(raw)

  function chunk(type, data) {
    const len = Buffer.alloc(4); len.writeUInt32BE(data.length, 0)
    const typeBuf = Buffer.from(type, 'ascii')
    const crcBuf = Buffer.alloc(4)
    crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0)
    return Buffer.concat([len, typeBuf, data, crcBuf])
  }

  const CRC_TABLE = (() => {
    const table = new Uint32Array(256)
    for (let n = 0; n < 256; n++) {
      let c = n
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
      table[n] = c
    }
    return table
  })()
  function crc32(buf) {
    let crc = 0xffffffff
    for (let i = 0; i < buf.length; i++) crc = CRC_TABLE[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8)
    return (crc ^ 0xffffffff) >>> 0
  }

  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(W, 0)
  ihdr.writeUInt32BE(H, 4)
  ihdr[8] = 8 // bit depth
  ihdr[9] = 2 // color type RGB
  ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0

  return Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', idat), chunk('IEND', Buffer.alloc(0))])
}

mkdirSync('public/images/ranges', { recursive: true })
for (const r of RANGES) {
  const png = buildPng(r.stops)
  writeFileSync(`public/images/ranges/${r.file}`, png)
  console.log(`wrote public/images/ranges/${r.file} (${png.length} bytes)`)
}
