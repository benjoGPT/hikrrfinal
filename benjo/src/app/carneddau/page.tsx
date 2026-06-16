export default function CarneddauPage() {
  return (
    <div style={{ width: '100vw', height: '100dvh', overflow: 'hidden' }}>
      <iframe
        src="/carneddau-map/index.html"
        style={{ width: '100%', height: '100%', border: 'none' }}
        title="Carneddau 3D Map"
        allowFullScreen
      />
    </div>
  )
}
