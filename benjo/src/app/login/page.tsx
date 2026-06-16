'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Mountain } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); setLoading(false); return }
    router.push('/dashboard')
  }

  async function handleGoogle() {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${location.origin}/dashboard` } })
  }

  const inputCls = "w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm outline-none focus:border-[#e8702a]/60 transition-colors"

  return (
    <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center gap-2 mb-10">
          <Mountain size={28} color="#e8702a" strokeWidth={1.6} />
          <span className="font-playfair italic text-white text-3xl">Benjo</span>
          <p className="text-white/40 text-sm mt-1">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
            className={inputCls} required />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}
            className={inputCls} required />
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <button type="submit" disabled={loading}
            className="mt-1 bg-[#e8702a] hover:bg-[#d2611f] disabled:opacity-50 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-colors">
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-white/30 text-xs">or</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        <button onClick={handleGoogle}
          className="w-full border border-white/15 text-white/80 hover:text-white hover:border-white/30 text-sm font-medium px-6 py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Continue with Google
        </button>

        <p className="text-center text-white/40 text-sm mt-8">
          No account?{' '}
          <Link href="/signup" className="text-[#e8702a] hover:text-[#d2611f] transition-colors no-underline">Sign up</Link>
        </p>

        <div className="flex items-center gap-3 mt-4">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-white/30 text-xs">or</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>
        <Link href="/dashboard" className="block text-center text-white/40 hover:text-white/70 text-sm mt-4 transition-colors no-underline">
          Continue as guest →
        </Link>
      </div>
    </div>
  )
}
