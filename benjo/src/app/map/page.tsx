'use client'

import { useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Nav from '@/components/Nav'
import { createClient } from '@/lib/supabase/client'

export default function MapPage() {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const searchParams = useSearchParams()
  const routeId = searchParams.get('route')

  useEffect(() => {
    const supabase = createClient()

    const handleMessage = async (event: MessageEvent) => {
      if (event.data?.type === 'SAVE_ROUTE') {
        const { payload } = event.data
        const { data: { user } } = await supabase.auth.getUser()
        const { data, error } = await supabase
          .from('routes')
          .insert({
            title: payload?.title || 'My Route',
            description: payload?.description ?? null,
            distance_km: payload?.distance_km ?? null,
            route_data: payload?.route_data ?? null,
            date: payload?.date ?? null,
            user_id: user?.id ?? null,
          })
          .select('id')
          .single()

        if (!error && data) {
          iframeRef.current?.contentWindow?.postMessage(
            { type: 'ROUTE_SAVED', id: data.id },
            '*'
          )
        } else {
          iframeRef.current?.contentWindow?.postMessage(
            { type: 'ROUTE_SAVE_ERROR', error: error?.message },
            '*'
          )
        }
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  // Once iframe loads, send any route ID from URL so the map can display it
  const handleIframeLoad = async () => {
    if (!routeId || !iframeRef.current?.contentWindow) return
    const supabase = createClient()
    const { data } = await supabase
      .from('routes')
      .select('route_data, title')
      .eq('id', routeId)
      .single()
    if (data?.route_data?.coordinates) {
      const points = data.route_data.coordinates.map((c: number[]) => [c[0], c[1]])
      iframeRef.current.contentWindow.postMessage(
        { type: 'LOAD_ROUTE', points, name: data.title },
        '*'
      )
    }
  }

  return (
    <div className="relative w-full bg-black" style={{ height: '100dvh' }}>
      <Nav />
      <iframe
        ref={iframeRef}
        src="/cesium-map/index.html"
        className="absolute inset-0 w-full h-full border-0"
        title="Wales 3D Map"
        allowFullScreen
        onLoad={handleIframeLoad}
      />
    </div>
  )
}
