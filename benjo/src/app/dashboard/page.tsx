import Link from 'next/link'
import { Map, Image, BarChart2, BookOpen, Calendar, Plus } from 'lucide-react'
import Nav from '@/components/Nav'
import { createClient } from '@/lib/supabase/server'

const CARDS = [
  { label: 'Routes',  href: '/carneddau', icon: Map,      desc: 'Explore the 3D terrain' },
  { label: 'Gallery', href: '/gallery',   icon: Image,    desc: 'Your mountain photos' },
  { label: 'Stats',   href: '/stats',     icon: BarChart2,desc: 'Distance, ascent & more' },
  { label: 'Journal', href: '/journal',   icon: BookOpen, desc: 'Trip reports & notes' },
  { label: 'Plans',   href: '/plans',     icon: Calendar, desc: 'Routes on the wishlist' },
]

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const name = (user?.user_metadata?.full_name as string | undefined)?.split(' ')[0] ?? 'there'

  return (
    <div className="min-h-screen bg-[#0a0a0c]">
      <Nav user={user} active="Dashboard" />

      {/* Header */}
      <div className="pt-28 pb-16 px-5 md:px-14 max-w-5xl mx-auto">
        <p className="text-[#e8702a] text-xs tracking-[.3em] uppercase mb-3">Your dashboard</p>
        <h1 className="font-playfair italic text-4xl sm:text-5xl md:text-6xl text-white" style={{ letterSpacing: '-0.03em' }}>
          Welcome back, {name}
        </h1>
        <p className="text-white/50 text-sm mt-4 max-w-md leading-relaxed">
          One hike logged so far — the Carneddau circular. Keep going.
        </p>
      </div>

      {/* Quick stats */}
      <div className="px-5 md:px-14 max-w-5xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-12">
          {[
            { v: '18.4', u: 'km', l: 'Total distance' },
            { v: '1,240', u: 'm', l: 'Total ascent' },
            { v: '5', u: '', l: 'Summits bagged' },
            { v: '1', u: '', l: 'Routes logged' },
          ].map(({ v, u, l }) => (
            <div key={l} className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <div className="text-2xl font-semibold text-white tabular-nums">{v}<span className="text-sm text-white/40 ml-1">{u}</span></div>
              <div className="text-xs text-white/40 tracking-wider uppercase mt-1">{l}</div>
            </div>
          ))}
        </div>

        {/* Nav cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pb-16">
          {CARDS.map(({ label, href, icon: Icon, desc }) => (
            <Link key={label} href={href}
              className="group bg-white/5 hover:bg-white/8 border border-white/10 hover:border-[#e8702a]/30 rounded-2xl p-6 no-underline transition-all duration-200">
              <Icon size={22} className="text-[#e8702a] mb-4" strokeWidth={1.6} />
              <div className="text-white font-medium mb-1">{label}</div>
              <div className="text-white/40 text-sm">{desc}</div>
            </Link>
          ))}
          <div className="bg-white/3 border border-dashed border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-3">
            <Plus size={22} className="text-white/20" />
            <div className="text-white/30 text-sm">Log a new hike</div>
            <span className="text-xs text-white/20">Coming soon</span>
          </div>
        </div>
      </div>
    </div>
  )
}
