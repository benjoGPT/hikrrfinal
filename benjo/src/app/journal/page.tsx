import { BookOpen, PenLine } from 'lucide-react'
import Nav from '@/components/Nav'
import { createClient } from '@/lib/supabase/server'

export default async function JournalPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-[#0a0a0c]">
      <Nav user={user} active="Journal" />
      <div className="pt-28 pb-16 px-5 md:px-14 max-w-5xl mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[#e8702a] text-xs tracking-[.3em] uppercase mb-3">Trip reports</p>
            <h1 className="font-playfair italic text-4xl sm:text-5xl text-white" style={{ letterSpacing: '-0.03em' }}>Journal</h1>
          </div>
          <button className="flex items-center gap-2 bg-[#e8702a] hover:bg-[#d2611f] text-white text-sm font-medium px-5 py-2.5 rounded-full transition-colors">
            <PenLine size={15} /> Write
          </button>
        </div>

        <div className="border border-dashed border-white/10 rounded-3xl p-20 flex flex-col items-center text-center gap-4">
          <BookOpen size={40} className="text-white/15" strokeWidth={1.2} />
          <div>
            <p className="text-white/50 font-medium mb-1">No entries yet</p>
            <p className="text-white/25 text-sm max-w-xs leading-relaxed">Write up a trip report after a hike — what the weather was like, how the ridge felt, which summits you bagged.</p>
          </div>
          <button className="mt-2 bg-white/8 hover:bg-white/12 border border-white/10 text-white/70 text-sm px-6 py-2.5 rounded-full transition-colors">
            Write your first entry
          </button>
        </div>
      </div>
    </div>
  )
}
