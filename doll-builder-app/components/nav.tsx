'use client'

import { createClient } from '@/lib/supabase/client'
import { Sparkles, BookOpen, Wand2, LogIn, LogOut, User } from 'lucide-react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import type { User as SupabaseUser } from '@supabase/supabase-js'

export function Nav() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [authOpen, setAuthOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.refresh()
  }

  const links = [
    { href: '/', label: 'Ingredients', icon: BookOpen },
    { href: '/builder', label: 'Build a Doll', icon: Wand2 },
    ...(user ? [{ href: '/my-recipes', label: 'My Recipes', icon: Sparkles }] : []),
  ]

  return (
    <nav className="border-b border-stone-200 bg-parchment-50 sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 font-semibold text-purple-900 shrink-0">
          <span className="text-lg">🪆</span>
          <span className="hidden sm:inline text-sm">KellieJo Art</span>
        </Link>

        <div className="flex items-center gap-1">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                pathname === href
                  ? 'bg-purple-100 text-purple-900'
                  : 'text-stone-600 hover:text-purple-900 hover:bg-stone-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{label}</span>
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {user ? (
            <div className="flex items-center gap-2">
              <span className="hidden sm:flex items-center gap-1 text-xs text-stone-500">
                <User className="w-3 h-3" />
                {user.email?.split('@')[0]}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-stone-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign out</span>
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-purple-800 text-white hover:bg-purple-900 rounded-lg transition-colors"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign in</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
