'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Mountain, Menu, X } from 'lucide-react'

const NAV_LINKS = [
  { label: 'Map',     href: '/map' },
  { label: 'Routes',  href: '/carneddau' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Stats',   href: '/stats' },
  { label: 'Journal', href: '/journal' },
  { label: 'Plans',   href: '/plans' },
]

interface NavProps {
  active?: string
  user?: { email?: string } | null
}

export default function Nav({ active, user }: NavProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between p-4 sm:p-5">
        {/* Wordmark */}
        <Link href="/" className="flex items-center gap-2.5 no-underline">
          <Mountain size={22} color="#fff" strokeWidth={1.8} />
          <span className="font-playfair italic text-white text-2xl leading-none">Benjo</span>
        </Link>

        {/* Centre pill — desktop */}
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-2 py-2 items-center gap-1">
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors no-underline ${
                active === label
                  ? 'bg-white text-gray-900'
                  : 'text-white/80 hover:bg-white/20 hover:text-white'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Right — desktop */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <Link href="/profile" className="bg-white text-gray-900 text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-gray-100 transition-colors no-underline">
              Profile
            </Link>
          ) : (
            <>
              <Link href="/login" className="text-white/80 text-sm font-medium hover:text-white transition-colors no-underline">Sign In</Link>
              <Link href="/signup" className="bg-[#e8702a] hover:bg-[#d2611f] text-white text-sm font-semibold px-6 py-2.5 rounded-full transition-colors no-underline">Sign Up</Link>
            </>
          )}
        </div>

        {/* Hamburger — mobile */}
        <button className="md:hidden text-white p-1" onClick={() => setOpen(v => !v)} aria-label="Menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile drawer */}
      <div className={`fixed inset-x-0 top-0 z-[90] bg-black/95 backdrop-blur-xl transition-all duration-300 md:hidden ${open ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'}`}>
        <div className="flex flex-col gap-1 pt-24 pb-8 px-6">
          {NAV_LINKS.map(({ label, href }) => (
            <Link key={label} href={href} onClick={() => setOpen(false)}
              className="text-white/80 hover:text-white text-lg font-medium py-3 border-b border-white/10 last:border-0 transition-colors no-underline block">
              {label}
            </Link>
          ))}
          <div className="mt-6 flex flex-col gap-3">
            {user ? (
              <Link href="/profile" onClick={() => setOpen(false)} className="bg-[#e8702a] text-white text-sm font-semibold px-6 py-3.5 rounded-full text-center no-underline">Profile</Link>
            ) : (
              <>
                <Link href="/login"  onClick={() => setOpen(false)} className="border border-white/30 text-white text-sm font-medium px-6 py-3.5 rounded-full text-center no-underline">Sign In</Link>
                <Link href="/signup" onClick={() => setOpen(false)} className="bg-[#e8702a] text-white text-sm font-semibold px-6 py-3.5 rounded-full text-center no-underline">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
