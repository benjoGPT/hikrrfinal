'use client'
import { useEffect, useState } from 'react'
import { Mountain, Camera } from 'lucide-react'
import Nav from '@/components/Nav'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [name, setName] = useState('')
  const [bio, setBio] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) return
      setUser(data.user)
      setName((data.user.user_metadata?.full_name as string) ?? '')
    })
  }, [])

  async function save(e: React.FormEvent) {
    e.preventDefault()
    const supabase = createClient()
    await supabase.auth.updateUser({ data: { full_name: name } })
    setSaved(true); setTimeout(() => setSaved(false), 2500)
  }

  async function signOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    location.href = '/'
  }

  const inputCls = "w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm outline-none focus:border-[#e8702a]/60 transition-colors"

  return (
    <div className="min-h-screen bg-[#0a0a0c]">
      <Nav user={user} />
      <div className="pt-28 pb-16 px-5 md:px-14 max-w-lg mx-auto">
        <p className="text-[#e8702a] text-xs tracking-[.3em] uppercase mb-3">Account</p>
        <h1 className="font-playfair italic text-4xl text-white mb-10" style={{ letterSpacing: '-0.03em' }}>Profile</h1>

        {/* Avatar */}
        <div className="flex items-center gap-5 mb-8">
          <div className="w-16 h-16 rounded-full bg-white/8 border border-white/15 flex items-center justify-center relative">
            <Mountain size={24} className="text-white/30" strokeWidth={1.4} />
            <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#e8702a] rounded-full flex items-center justify-center">
              <Camera size={11} color="white" />
            </button>
          </div>
          <div>
            <p className="text-white font-medium text-sm">{name || 'Your name'}</p>
            <p className="text-white/40 text-xs mt-0.5">{user?.email}</p>
          </div>
        </div>

        <form onSubmit={save} className="flex flex-col gap-4">
          <div>
            <label className="text-white/40 text-xs tracking-wider uppercase block mb-2">Full name</label>
            <input value={name} onChange={e => setName(e.target.value)} className={inputCls} placeholder="Your name" />
          </div>
          <div>
            <label className="text-white/40 text-xs tracking-wider uppercase block mb-2">Bio</label>
            <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3}
              className={inputCls + ' resize-none'} placeholder="A few words about your hiking…" />
          </div>
          <button type="submit"
            className="bg-[#e8702a] hover:bg-[#d2611f] text-white text-sm font-semibold px-6 py-3 rounded-xl transition-colors">
            {saved ? '✓ Saved' : 'Save changes'}
          </button>
        </form>

        <button onClick={signOut} className="mt-8 text-white/25 hover:text-white/50 text-sm transition-colors">
          Sign out
        </button>
      </div>
    </div>
  )
}
