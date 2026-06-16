// Bakes a model.js terrain file (same format as carneddau-map/model.js) for an
// arbitrary bounding box, using the public AWS "elevation-tiles-prod" Terrarium
// PNG dataset (https://github.com/tilezen/joerd) — no API key, CORS-enabled,
// real SRTM/derived elevation data. Decodes PNGs by hand (zlib + unfilter)
// since no image library is installed in this project.
//
// Usage: node scripts/build-mountain-model.mjs <config.json> <out/model.js>

import zlib from 'node:zlib'
import fs from 'node:fs'

function lon2tileX(lon, z) { return Math.floor((lon + 180) / 360 * 2 ** z) }
function lat2tileY(lat, z) {
  const r = lat * Math.PI / 180
  return Math.floor((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2 * 2 ** z)
}
function tileX2lon(x, z) { return x / 2 ** z * 360 - 180 }
function tileY2lat(y, z) {
  const n = Math.PI - 2 * Math.PI * y / 2 ** z
  return 180 / Math.PI * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)))
}

// ---- minimal PNG decoder (8-bit RGB, no interlace) ----
function paeth(a, b, c) {
  const p = a + b - c
  const pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c)
  if (pa <= pb && pa <= pc) return a
  if (pb <= pc) return b
  return c
}
function decodePNG(buf) {
  if (buf.readUInt32BE(0) !== 0x89504e47) throw new Error('not a PNG')
  let off = 8
  let width = 0, height = 0, bitDepth = 0, colorType = 0
  const idatChunks = []
  while (off < buf.length) {
    const len = buf.readUInt32BE(off)
    const type = buf.toString('ascii', off + 4, off + 8)
    const data = buf.subarray(off + 8, off + 8 + len)
    if (type === 'IHDR') {
      width = data.readUInt32BE(0); height = data.readUInt32BE(4)
      bitDepth = data[8]; colorType = data[9]
    } else if (type === 'IDAT') {
      idatChunks.push(data)
    } else if (type === 'IEND') break
    off += 12 + len
  }
  if (bitDepth !== 8) throw new Error('unsupported bit depth ' + bitDepth)
  const channels = colorType === 2 ? 3 : colorType === 6 ? 4 : colorType === 0 ? 1 : (() => { throw new Error('unsupported color type ' + colorType) })()
  const raw = zlib.inflateSync(Buffer.concat(idatChunks))
  const stride = width * channels
  const out = Buffer.alloc(stride * height)
  let rp = 0
  for (let y = 0; y < height; y++) {
    const filter = raw[rp++]
    const rowStart = y * stride
    const prevStart = (y - 1) * stride
    for (let x = 0; x < stride; x++) {
      const raw_x = raw[rp + x]
      let val
      const a = x >= channels ? out[rowStart + x - channels] : 0
      const b = y > 0 ? out[prevStart + x] : 0
      const c = (x >= channels && y > 0) ? out[prevStart + x - channels] : 0
      if (filter === 0) val = raw_x
      else if (filter === 1) val = raw_x + a
      else if (filter === 2) val = raw_x + b
      else if (filter === 3) val = raw_x + ((a + b) >> 1)
      else if (filter === 4) val = raw_x + paeth(a, b, c)
      else throw new Error('bad filter ' + filter)
      out[rowStart + x] = val & 0xff
    }
    rp += stride
  }
  return { width, height, channels, data: out }
}

async function fetchTilePng(z, x, y) {
  const url = `https://s3.amazonaws.com/elevation-tiles-prod/terrarium/${z}/${x}/${y}.png`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`tile ${z}/${x}/${y} -> ${res.status}`)
  return Buffer.from(await res.arrayBuffer())
}

function terrariumElevation(r, g, b) {
  return (r * 256 + g + b / 256) - 32768
}

async function buildDem({ west, east, south, north, gridW, gridH, zoom }) {
  const tx0 = lon2tileX(west, zoom), tx1 = lon2tileX(east, zoom)
  const ty0 = lat2tileY(north, zoom), ty1 = lat2tileY(south, zoom)
  const cols = tx1 - tx0 + 1, rows = ty1 - ty0 + 1
  console.log(`fetching ${cols * rows} tiles at z${zoom}…`)
  const tiles = new Map()
  for (let ty = ty0; ty <= ty1; ty++) {
    for (let tx = tx0; tx <= tx1; tx++) {
      const png = await fetchTilePng(zoom, tx, ty)
      tiles.set(`${tx},${ty}`, decodePNG(png))
    }
  }
  // pixel-space bounds of the requested lon/lat box within the tile mosaic
  function lonToPx(lon) { return (lon2tileX(lon, zoom + 8) / 256) * 256 } // not used; use direct math below
  function pxX(lon) {
    const fx = (lon + 180) / 360 * 2 ** zoom // tile units
    return (fx - tx0) * 256
  }
  function pxY(lat) {
    const r = lat * Math.PI / 180
    const fy = (1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2 * 2 ** zoom
    return (fy - ty0) * 256
  }
  const px0 = pxX(west), px1 = pxX(east)
  const py0 = pxY(north), py1 = pxY(south)

  function sampleElevation(px, py) {
    const tx = tx0 + Math.floor(px / 256), ty = ty0 + Math.floor(py / 256)
    const tile = tiles.get(`${tx},${ty}`)
    if (!tile) return 0
    let lx = Math.floor(px % 256), ly = Math.floor(py % 256)
    lx = Math.max(0, Math.min(255, lx)); ly = Math.max(0, Math.min(255, ly))
    const idx = (ly * tile.width + lx) * tile.channels
    return terrariumElevation(tile.data[idx], tile.data[idx + 1], tile.data[idx + 2])
  }

  const dem = new Array(gridW * gridH)
  let emin = Infinity, emax = -Infinity
  for (let gy = 0; gy < gridH; gy++) {
    for (let gx = 0; gx < gridW; gx++) {
      const px = px0 + (px1 - px0) * (gx / (gridW - 1))
      const py = py0 + (py1 - py0) * (gy / (gridH - 1))
      const e = sampleElevation(px, py)
      dem[gy * gridW + gx] = Math.round(e * 10) / 10
      if (e < emin) emin = e
      if (e > emax) emax = e
    }
  }
  return { w: gridW, h: gridH, west, east, south, north, emin, emax, dem }
}

function elevAt(model, lon, lat) {
  const u = (lon - model.west) / (model.east - model.west)
  const v = (model.north - lat) / (model.north - model.south)
  const fx = u * (model.w - 1), fy = v * (model.h - 1)
  const x0 = Math.max(0, Math.min(model.w - 1, Math.floor(fx)))
  const y0 = Math.max(0, Math.min(model.h - 1, Math.floor(fy)))
  return model.dem[y0 * model.w + x0]
}

async function main() {
  const [configPath, outPath] = process.argv.slice(2)
  if (!configPath || !outPath) {
    console.error('Usage: node build-mountain-model.mjs <config.json> <out/model.js>')
    process.exit(1)
  }
  const cfg = JSON.parse(fs.readFileSync(configPath, 'utf8'))
  const dem = await buildDem(cfg.bbox)

  // route track: interpolate straight-line segments between named waypoints,
  // sampling real elevation along the way, in (u, v, elevationMetres) form
  const STEPS_PER_SEG = 40
  const track = []
  const wps = cfg.waypoints
  for (let i = 0; i < wps.length - 1; i++) {
    const a = wps[i], b = wps[i + 1]
    const steps = i === wps.length - 2 ? STEPS_PER_SEG + 1 : STEPS_PER_SEG
    for (let s = 0; s < steps; s++) {
      const t = s / STEPS_PER_SEG
      const lon = a.lon + (b.lon - a.lon) * t
      const lat = a.lat + (b.lat - a.lat) * t
      const u = (lon - dem.west) / (dem.east - dem.west)
      const v = (dem.north - lat) / (dem.north - dem.south)
      track.push([u, v, elevAt(dem, lon, lat)])
    }
  }

  const pois = cfg.waypoints.filter(w => w.poi).map(w => {
    const u = (w.lon - dem.west) / (dem.east - dem.west)
    const v = (dem.north - w.lat) / (dem.north - dem.south)
    return { u, v, name: w.name, ele: Math.round(elevAt(dem, w.lon, w.lat)), type: w.type || 'Summit' }
  })

  const model = { ...dem, track, pois }
  fs.writeFileSync(outPath, 'window.MODEL=' + JSON.stringify(model) + ';\n')
  console.log(`wrote ${outPath} (${dem.w}x${dem.h}, ${Math.round(dem.emin)}–${Math.round(dem.emax)}m, ${pois.length} pois)`)
}

main().catch(e => { console.error(e); process.exit(1) })
