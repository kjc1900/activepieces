import type { Metadata } from 'next'
import './globals.css'
import { Nav } from '@/components/nav'

export const metadata: Metadata = {
  title: 'Custom Doll Builder · KellieJo Art',
  description: 'Build your custom doll recipe — stones, herbs, colors, archetypes, and the intention that holds it all together.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Nav />
        <main className="flex-1">
          {children}
        </main>
        <footer className="py-6 text-center text-xs text-stone-400 border-t border-stone-200">
          © KellieJo Art · All recipes are personal keepsakes
        </footer>
      </body>
    </html>
  )
}
