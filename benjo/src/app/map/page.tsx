import Nav from '@/components/Nav'

export default function MapPage() {
  return (
    <div className="relative w-full bg-black" style={{ height: '100dvh' }}>
      <Nav />
      <iframe
        src="/cesium-map/index.html"
        className="absolute inset-0 w-full h-full border-0"
        title="Wales 3D Map"
        allowFullScreen
      />
    </div>
  )
}
