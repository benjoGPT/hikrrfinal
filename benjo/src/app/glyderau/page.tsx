import Nav from '@/components/Nav'

export default function GlyderauPage() {
  return (
    <div className="relative w-full bg-black" style={{ height: '100dvh' }}>
      <Nav />
      <iframe
        src="/glyderau-map/index.html"
        className="absolute inset-0 w-full h-full border-0"
        title="Glyderau 3D Map"
        allowFullScreen
      />
    </div>
  )
}
