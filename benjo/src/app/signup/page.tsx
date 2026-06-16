'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Mountain } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: name } },
    })
    if (error) { setError(error.message); setLoading(false); return }
    setDone(true)
  }

  const inputCls = "w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm outline-none focus:border-[#e8702a]/60 transition-colors"

  return (
    <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center gap-2 mb-10">
          <Mountain size={28} color="#e8702a" strokeWidth={1.6} />
          <span className="font-playfair italic text-white text-3xl">Benjo</span>
          <p className="text-white/40 text-sm mt-1">Create your account</p>
        </div>

        {done ? (
          <div className="text-center">
            <div className="text-4xl mb-4">⛰️</div>
            <h2 className="text-white font-semibold text-lg mb-2">Check your email</h2>
            <p className="text-white/50 text-sm leading-relaxed">We sent a confirmation link to <span className="text-white/80">{email}</span>. Click it to activate your account.</p>
            <Link href="/login" className="inline-block mt-6 text-[#e8702a] text-sm no-underline hover:underline">Back to sign in</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input type="text" placeholder="Full name" value={name} onChange={e => setName(e.target.value)} className={inputCls} required />
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className={inputCls} required />
            <input type="password" placeholder="Password (min 8 chars)" value={password} onChange={e => setPassword(e.target.value)} className={inputCls} minLength={8} required />
            {error && <p className="text-red-400 text-xs">{error}</p>}
            <button type="submit" disabled={loading}
              className="mt-1 bg-[#e8702a] hover:bg-[#d2611f] disabled:opacity-50 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-colors">
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
            <p className="text-center text-white/40 text-xs mt-1">
              Already have an account?{' '}
              <Link href="/login" className="text-[#e8702a] no-underline hover:underline">Sign in</Link>
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
