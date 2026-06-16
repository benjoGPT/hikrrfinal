import Nav from '@/components/Nav'

export default function SnowdonPage() {
  return (
    <div className="relative w-full bg-black" style={{ height: '100dvh' }}>
      <Nav />
      <iframe
        src="/snowdon-map/index.html"
        className="absolute inset-0 w-full h-full border-0"
        title="Yr Wyddfa 3D Map"
        allowFullScreen
      />
    </div>
  )
}
