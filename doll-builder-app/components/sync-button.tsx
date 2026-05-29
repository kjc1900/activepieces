'use client'

import { RefreshCw } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function SyncButton() {
  const [syncing, setSyncing] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const router = useRouter()

  async function handleSync() {
    setSyncing(true)
    setResult(null)
    try {
      const res = await fetch('/api/sync', { method: 'POST' })
      const data = await res.json() as { results: Array<{ category: string; upserted: number; deleted: number; error?: string }> }
      const totals = data.results.reduce((acc, r) => ({ upserted: acc.upserted + r.upserted, deleted: acc.deleted + r.deleted }), { upserted: 0, deleted: 0 })
      const errors = data.results.filter((r) => r.error)
      if (errors.length > 0) {
        setResult(`⚠ Sync had errors: ${errors.map((e) => `${e.category}: ${e.error}`).join(', ')}`)
      } else {
        setResult(`✓ Synced · ${totals.upserted} updated · ${totals.deleted} removed`)
        router.refresh()
      }
    } catch (err) {
      setResult('Sync failed — check your Notion key')
    } finally {
      setSyncing(false)
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={handleSync}
        disabled={syncing}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/20 disabled:opacity-60 transition-colors"
      >
        <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
        {syncing ? 'Syncing…' : 'Sync from Notion'}
      </button>
      {result && (
        <p className="text-xs text-purple-200">{result}</p>
      )}
    </div>
  )
}
