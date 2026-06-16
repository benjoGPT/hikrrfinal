import { Map, Plus } from 'lucide-react'
import Nav from '@/components/Nav'
import { createClient } from '@/lib/supabase/server'

const COLS = [
  { id: 'wishlist',  label: '⭐ Wishlist' },
  { id: 'planned',   label: '📅 Planned' },
  { id: 'completed', label: '✅ Completed' },
]

export default async function PlansPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-[#0a0a0c]">
      <Nav user={user} active="Plans" />
      <div className="pt-28 pb-16 px-5 md:px-14 max-w-5xl mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[#e8702a] text-xs tracking-[.3em] uppercase mb-3">Future routes</p>
            <h1 className="font-playfair italic text-4xl sm:text-5xl text-white" style={{ letterSpacing: '-0.03em' }}>Plans</h1>
          </div>
          <button className="flex items-center gap-2 bg-[#e8702a] hover:bg-[#d2611f] text-white text-sm font-medium px-5 py-2.5 rounded-full transition-colors">
            <Plus size={15} /> Add route
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {COLS.map(({ id, label }) => (
            <div key={id} className="bg-white/3 border border-white/8 rounded-2xl p-5 min-h-[320px]">
              <h2 className="text-white/60 text-xs font-semibold tracking-wider uppercase mb-4">{label}</h2>
              <div className="flex flex-col items-center justify-center h-48 gap-3">
                <Map size={28} className="text-white/10" strokeWidth={1.2} />
                <p className="text-white/20 text-xs text-center">No routes here yet</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
