import Link from 'next/link'
import { notFound } from 'next/navigation'
import Nav from '@/components/Nav'
import TerrainPanel from '@/components/TerrainPanel'
import RangeDetailSections from '@/components/RangeDetailSections'
import { RANGES, getRangeBySlug } from '@/data/ranges'

export function generateStaticParams() {
  return RANGES.map(r => ({ slug: r.slug }))
}

export default async function RangePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const range = getRangeBySlug(slug)
  if (!range) notFound()

  return (
    <div className="bg-void min-h-screen">
      <Nav active="Routes" />

      {/* Hero */}
      <div className="relative w-full pt-28 pb-10 px-5 sm:px-10 md:px-16 overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${range.gradient} opacity-60`} />
        <div className="relative max-w-5xl">
          <Link href="/routes" className="text-xs font-medium text-white/60 hover:text-white no-underline">← All nine ranges</Link>
          <h1 className="font-playfair italic text-white text-4xl sm:text-6xl md:text-7xl mt-3" style={{ letterSpacing: '-0.04em' }}>
            {range.name}
          </h1>
          {range.welshName && <p className="text-white/50 text-base mt-1">{range.welshName} · {range.region}</p>}
          <p className="text-white/75 text-base sm:text-lg leading-relaxed mt-5 max-w-3xl">{range.longDescription}</p>
        </div>
      </div>

      <div className="px-5 sm:px-10 md:px-16 max-w-7xl mx-auto">
        <TerrainPanel range={range} />
      </div>

      <RangeDetailSections range={range} />
    </div>
  )
}
