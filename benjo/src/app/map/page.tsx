'use client'

import 'mapbox-gl/dist/mapbox-gl.css'
import { useEffect, useRef, useState, useCallback } from 'react'
import Nav from '@/components/Nav'
import { createClient } from '@/lib/supabase/client'

// Haversine distance in km between two [lng, lat] points
function haversine(a: [number, number], b: [number, number]): number {
  const R = 6371
  const dLat = ((b[1] - a[1]) * Math.PI) / 180
  const dLon = ((b[0] - a[0]) * Math.PI) / 180
  const lat1 = (a[1] * Math.PI) / 180
  const lat2 = (b[1] * Math.PI) / 180
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2
  return R * 2 * Math.asin(Math.sqrt(h))
}

function totalDistance(coords: [number, number][]): number {
  let d = 0
  for (let i = 1; i < coords.length; i++) d += haversine(coords[i - 1], coords[i])
  return d
}

function parseGPX(text: string): [number, number][] {
  const parser = new DOMParser()
  const doc = parser.parseFromString(text, 'application/xml')
  const trkpts = Array.from(doc.querySelectorAll('trkpt'))
  return trkpts.map((pt) => [
    parseFloat(pt.getAttribute('lon') || '0'),
    parseFloat(pt.getAttribute('lat') || '0'),
  ])
}

export default function MapPage() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const clickHandlerRef = useRef<((e: any) => void) | null>(null)

  const [drawing, setDrawing] = useState(false)
  const [coordinates, setCoordinates] = useState<[number, number][]>([])
  const [styleMode, setStyleMode] = useState<'outdoors' | 'satellite'>('outdoors')
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [saveForm, setSaveForm] = useState({ title: '', description: '', date: new Date().toISOString().split('T')[0] })
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [existingHikes, setExistingHikes] = useState<any[]>([])

  const supabase = createClient()

  const coordinatesRef = useRef<[number, number][]>([])
  const drawingRef = useRef(false)

  useEffect(() => {
    coordinatesRef.current = coordinates
  }, [coordinates])

  useEffect(() => {
    drawingRef.current = drawing
  }, [drawing])

  // Auth check
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: sub } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  // Load existing hikes when user logs in
  useEffect(() => {
    if (!user) { setExistingHikes([]); return }
    supabase
      .from('hikes')
      .select('id, title, distance_km, route_data')
      .eq('user_id', user.id)
      .then(({ data }) => {
        if (data) setExistingHikes(data.filter((h: any) => h.route_data?.coordinates?.length > 1))
      })
  }, [user])

  // Draw existing hikes on map when both are ready
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return
    const map = mapRef.current

    // Remove old hike layers
    existingHikes.forEach((hike: any) => {
      const id = `hike-${hike.id}`
      if (map.getLayer(id)) map.removeLayer(id)
      if (map.getSource(id)) map.removeSource(id)
    })

    existingHikes.forEach((hike: any) => {
      const id = `hike-${hike.id}`
      map.addSource(id, {
        type: 'geojson',
        data: { type: 'Feature', properties: {}, geometry: hike.route_data },
      })
      map.addLayer({
        id,
        type: 'line',
        source: id,
        paint: { 'line-color': '#57f0c4', 'line-width': 2, 'line-opacity': 0.7 },
      })
      map.on('click', id, (e: any) => {
        new (window as any).mapboxgl.Popup()
          .setLngLat(e.lngLat)
          .setHTML(`<div style="font-family:sans-serif;padding:4px"><strong>${hike.title}</strong><br/>${hike.distance_km?.toFixed(1)} km</div>`)
          .addTo(map)
      })
    })
  }, [existingHikes, mapLoaded])

  // Init map
  useEffect(() => {
    if (!mapContainer.current) return
    let map: any
    let mapboxgl: any

    import('mapbox-gl').then((mod) => {
      mapboxgl = mod.default
      ;(window as any).mapboxgl = mapboxgl
      mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ''

      map = new mapboxgl.Map({
        container: mapContainer.current!,
        style: 'mapbox://styles/mapbox/outdoors-v12',
        center: [-3.78, 52.13],
        zoom: 7,
      })

      mapRef.current = map

      map.on('load', () => {
        // Add route source + layer
        map.addSource('route', {
          type: 'geojson',
          data: { type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: [] } },
        })
        map.addLayer({
          id: 'route-line',
          type: 'line',
          source: 'route',
          paint: { 'line-color': '#e8702a', 'line-width': 3 },
        })
        setMapLoaded(true)
      })
    })

    return () => {
      if (map) map.remove()
    }
  }, [])

  // Update route on map when coordinates change
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return
    const map = mapRef.current
    if (map.getSource('route')) {
      map.getSource('route').setData({
        type: 'Feature',
        properties: {},
        geometry: { type: 'LineString', coordinates },
      })
    }
  }, [coordinates, mapLoaded])

  // Handle draw mode toggle
  const toggleDraw = useCallback(() => {
    const map = mapRef.current
    if (!map) return

    if (!drawing) {
      // Enter draw mode
      map.getCanvas().style.cursor = 'crosshair'
      const handler = (e: any) => {
        const coord: [number, number] = [e.lngLat.lng, e.lngLat.lat]
        const newCoords = [...coordinatesRef.current, coord]
        coordinatesRef.current = newCoords
        setCoordinates(newCoords)

        // Add marker
        const el = document.createElement('div')
        el.style.cssText = 'width:10px;height:10px;border-radius:50%;background:#e8702a;border:2px solid white;'
        const marker = new (window as any).mapboxgl.Marker({ element: el }).setLngLat(coord).addTo(map)
        markersRef.current.push(marker)
      }
      map.on('click', handler)
      clickHandlerRef.current = handler
      setDrawing(true)
    } else {
      // Exit draw mode
      map.getCanvas().style.cursor = ''
      if (clickHandlerRef.current) {
        map.off('click', clickHandlerRef.current)
        clickHandlerRef.current = null
      }
      setDrawing(false)
    }
  }, [drawing])

  const clearRoute = useCallback(() => {
    const map = mapRef.current
    if (map) {
      map.getCanvas().style.cursor = ''
      if (clickHandlerRef.current) {
        map.off('click', clickHandlerRef.current)
        clickHandlerRef.current = null
      }
    }
    markersRef.current.forEach((m) => m.remove())
    markersRef.current = []
    coordinatesRef.current = []
    setCoordinates([])
    setDrawing(false)
    if (map?.getSource('route')) {
      map.getSource('route').setData({ type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: [] } })
    }
  }, [])

  const handleGPX = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const text = ev.target?.result as string
      const coords = parseGPX(text)
      if (coords.length) {
        clearRoute()
        coordinatesRef.current = coords
        setCoordinates(coords)
        // Fit map to route
        if (mapRef.current) {
          const lngs = coords.map((c) => c[0])
          const lats = coords.map((c) => c[1])
          mapRef.current.fitBounds(
            [[Math.min(...lngs), Math.min(...lats)], [Math.max(...lngs), Math.max(...lats)]],
            { padding: 60 }
          )
        }
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }, [clearRoute])

  const toggleStyle = useCallback(() => {
    const map = mapRef.current
    if (!map) return
    const next = styleMode === 'outdoors' ? 'satellite' : 'outdoors'
    const styleUrl = next === 'outdoors'
      ? 'mapbox://styles/mapbox/outdoors-v12'
      : 'mapbox://styles/mapbox/satellite-streets-v12'
    map.setStyle(styleUrl)
    map.once('style.load', () => {
      // Re-add route source/layer after style change
      if (!map.getSource('route')) {
        map.addSource('route', {
          type: 'geojson',
          data: { type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: coordinatesRef.current } },
        })
        map.addLayer({
          id: 'route-line',
          type: 'line',
          source: 'route',
          paint: { 'line-color': '#e8702a', 'line-width': 3 },
        })
      }
      // Re-add existing hike layers
      existingHikes.forEach((hike: any) => {
        const id = `hike-${hike.id}`
        if (!map.getSource(id)) {
          map.addSource(id, { type: 'geojson', data: { type: 'Feature', properties: {}, geometry: hike.route_data } })
          map.addLayer({ id, type: 'line', source: id, paint: { 'line-color': '#57f0c4', 'line-width': 2, 'line-opacity': 0.7 } })
        }
      })
    })
    setStyleMode(next)
  }, [styleMode, existingHikes])

  const handleSave = async () => {
    if (!saveForm.title.trim()) { setSaveError('Title is required'); return }
    setSaving(true)
    setSaveError('')
    const { data: { user: currentUser } } = await supabase.auth.getUser()
    if (!currentUser) { setSaveError('Please sign in to save routes'); setSaving(false); return }

    const { error } = await supabase.from('hikes').insert({
      user_id: currentUser.id,
      title: saveForm.title.trim(),
      description: saveForm.description.trim() || null,
      date: saveForm.date,
      location: 'Wales',
      distance_km: parseFloat(totalDistance(coordinates).toFixed(2)),
      route_data: { type: 'LineString', coordinates },
    })
    setSaving(false)
    if (error) { setSaveError(error.message); return }
    setSaveSuccess(true)
    setTimeout(() => { setShowSaveModal(false); setSaveSuccess(false); setSaveForm({ title: '', description: '', date: new Date().toISOString().split('T')[0] }) }, 1500)
  }

  const dist = totalDistance(coordinates)

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      <Nav />

      {/* Map container */}
      <div ref={mapContainer} className="absolute inset-0 w-full h-full" />

      {/* Style toggle — top right below nav */}
      <button
        onClick={toggleStyle}
        className="absolute top-20 right-4 z-50 px-3 py-2 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all"
        style={{ background: 'rgba(0,0,0,0.75)', color: '#e8702a', border: '1px solid rgba(232,112,42,0.4)', backdropFilter: 'blur(8px)' }}
      >
        {styleMode === 'outdoors' ? '🛰 Satellite' : '🗺 Outdoors'}
      </button>

      {/* Left sidebar */}
      <div
        className="absolute left-4 z-50 flex flex-col gap-3 w-64"
        style={{ top: '80px' }}
      >
        <div
          className="rounded-2xl p-5 flex flex-col gap-4"
          style={{ background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(16px)', border: '1px solid rgba(232,112,42,0.18)' }}
        >
          {/* Header */}
          <div>
            <h2 className="text-white font-semibold text-base tracking-wide">Route Planner</h2>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>Wales</p>
          </div>

          {/* Draw button */}
          <button
            onClick={toggleDraw}
            className="w-full py-2.5 rounded-xl text-sm font-semibold tracking-wide transition-all active:scale-95"
            style={drawing
              ? { background: '#e8702a', color: 'white' }
              : { background: 'rgba(232,112,42,0.12)', color: '#e8702a', border: '1px solid rgba(232,112,42,0.35)' }}
          >
            {drawing ? '✓ Done Drawing' : '✏️ Draw Route'}
          </button>

          {/* GPX Upload */}
          <label className="w-full">
            <input type="file" accept=".gpx" className="hidden" onChange={handleGPX} />
            <span
              className="block w-full py-2.5 rounded-xl text-sm font-semibold tracking-wide text-center cursor-pointer transition-all active:scale-95"
              style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              ↑ Upload GPX
            </span>
          </label>

          {/* Stats — shown when coords exist */}
          {coordinates.length > 1 && (
            <div
              className="rounded-xl p-3 flex justify-between text-sm"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <div>
                <p className="text-xs mb-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>Distance</p>
                <p className="font-semibold" style={{ color: '#e8702a' }}>{dist.toFixed(2)} km</p>
              </div>
              <div className="text-right">
                <p className="text-xs mb-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>Elevation</p>
                <p className="font-semibold text-white">—</p>
              </div>
            </div>
          )}

          {/* Waypoint count */}
          {coordinates.length > 0 && (
            <p className="text-xs text-center" style={{ color: 'rgba(255,255,255,0.35)' }}>
              {coordinates.length} waypoint{coordinates.length !== 1 ? 's' : ''}
            </p>
          )}

          {/* Actions row */}
          {coordinates.length > 0 && (
            <div className="flex gap-2">
              <button
                onClick={clearRoute}
                className="flex-1 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all active:scale-95"
                style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                Clear
              </button>
              {user ? (
                <button
                  onClick={() => setShowSaveModal(true)}
                  className="flex-1 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all active:scale-95"
                  style={{ background: '#e8702a', color: 'white' }}
                >
                  Save Route
                </button>
              ) : (
                <button
                  className="flex-1 py-2 rounded-xl text-xs font-semibold tracking-wide cursor-not-allowed opacity-60"
                  style={{ background: 'rgba(232,112,42,0.2)', color: '#e8702a', border: '1px solid rgba(232,112,42,0.3)' }}
                  title="Sign in to save routes"
                >
                  Sign in to save
                </button>
              )}
            </div>
          )}

          {/* Legend */}
          <div className="flex flex-col gap-1.5 pt-1 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
            <div className="flex items-center gap-2 text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>
              <span className="inline-block w-4 h-0.5 rounded" style={{ background: '#e8702a' }} />
              Current route
            </div>
            {user && existingHikes.length > 0 && (
              <div className="flex items-center gap-2 text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>
                <span className="inline-block w-4 h-0.5 rounded" style={{ background: '#57f0c4' }} />
                Saved hikes ({existingHikes.length})
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Save Modal */}
      {showSaveModal && (
        <div className="absolute inset-0 z-[200] flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
          <div
            className="w-full max-w-sm mx-4 rounded-2xl p-6 flex flex-col gap-4"
            style={{ background: '#111', border: '1px solid rgba(232,112,42,0.25)' }}
          >
            <div className="flex justify-between items-center">
              <h3 className="text-white font-semibold text-lg">Save Route</h3>
              <button onClick={() => setShowSaveModal(false)} style={{ color: 'rgba(255,255,255,0.4)' }} className="text-xl leading-none">×</button>
            </div>

            <div className="flex flex-col gap-3">
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: 'rgba(255,255,255,0.5)' }}>Title *</label>
                <input
                  type="text"
                  value={saveForm.title}
                  onChange={(e) => setSaveForm({ ...saveForm, title: e.target.value })}
                  placeholder="e.g. Snowdon via Ranger Path"
                  className="w-full px-3 py-2.5 rounded-xl text-sm text-white outline-none placeholder:text-white/20 focus:ring-1"
                  style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', ringColor: '#e8702a' }}
                />
              </div>
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: 'rgba(255,255,255,0.5)' }}>Description</label>
                <textarea
                  value={saveForm.description}
                  onChange={(e) => setSaveForm({ ...saveForm, description: e.target.value })}
                  placeholder="Optional notes..."
                  rows={2}
                  className="w-full px-3 py-2.5 rounded-xl text-sm text-white outline-none resize-none placeholder:text-white/20"
                  style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}
                />
              </div>
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: 'rgba(255,255,255,0.5)' }}>Date</label>
                <input
                  type="date"
                  value={saveForm.date}
                  onChange={(e) => setSaveForm({ ...saveForm, date: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl text-sm text-white outline-none"
                  style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', colorScheme: 'dark' }}
                />
              </div>
            </div>

            {/* Stats summary */}
            <div className="flex gap-3 text-sm">
              <div className="flex-1 rounded-xl p-2.5 text-center" style={{ background: 'rgba(232,112,42,0.1)', border: '1px solid rgba(232,112,42,0.2)' }}>
                <p className="text-xs mb-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>Distance</p>
                <p className="font-semibold" style={{ color: '#e8702a' }}>{dist.toFixed(2)} km</p>
              </div>
              <div className="flex-1 rounded-xl p-2.5 text-center" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <p className="text-xs mb-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>Waypoints</p>
                <p className="font-semibold text-white">{coordinates.length}</p>
              </div>
            </div>

            {saveError && <p className="text-xs text-red-400">{saveError}</p>}
            {saveSuccess && <p className="text-xs" style={{ color: '#57f0c4' }}>Route saved!</p>}

            <button
              onClick={handleSave}
              disabled={saving || saveSuccess}
              className="w-full py-3 rounded-xl font-semibold text-sm tracking-wide transition-all active:scale-95 disabled:opacity-60"
              style={{ background: '#e8702a', color: 'white' }}
            >
              {saving ? 'Saving…' : saveSuccess ? 'Saved ✓' : 'Save to Benjo'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
