import Link from 'next/link'
import { TrendingUp, Mountain, Route, CalendarDays } from 'lucide-react'
import Nav from '@/components/Nav'
import { createClient } from '@/lib/supabase/server'

const BIG_STATS = [
  { v: '18.4 km',  l: 'Total distance',  icon: Route,      sub: 'across 1 route' },
  { v: '1,240 m',  l: 'Total ascent',    icon: TrendingUp, sub: '~4,068 ft climbed' },
  { v: '5',        l: 'Summits bagged',  icon: Mountain,   sub: 'Carneddau circuit' },
  { v: '1',        l: 'Days out',        icon: CalendarDays,sub: 'so far this year' },
]

export default async function StatsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-[#0a0a0c]">
      <Nav user={user} active="Stats" />
      <div className="pt-28 pb-16 px-5 md:px-14 max-w-5xl mx-auto">
        <p className="text-[#e8702a] text-xs tracking-[.3em] uppercase mb-3">Your numbers</p>
        <h1 className="font-playfair italic text-4xl sm:text-5xl text-white mb-10" style={{ letterSpacing: '-0.03em' }}>Stats</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
          {BIG_STATS.map(({ v, l, icon: Icon, sub }) => (
            <div key={l} className="bg-white/5 border border-white/10 rounded-2xl p-7 flex items-start gap-5">
              <div className="bg-[#e8702a]/10 rounded-xl p-3 mt-0.5">
                <Icon size={20} className="text-[#e8702a]" strokeWidth={1.6} />
              </div>
              <div>
                <div className="text-3xl font-semibold text-white tabular-nums">{v}</div>
                <div className="text-white/60 text-sm mt-0.5">{l}</div>
                <div className="text-white/25 text-xs mt-1">{sub}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="border border-dashed border-white/10 rounded-2xl p-10 text-center">
          <p className="text-white/40 text-sm leading-relaxed max-w-sm mx-auto">
            Log more hikes to unlock elevation charts, monthly breakdowns and personal records.
          </p>
          <Link href="/carneddau" className="inline-block mt-5 text-[#e8702a] text-sm no-underline hover:underline">
            Explore the Carneddau route →
          </Link>
        </div>
      </div>
    </div>
  )
}
