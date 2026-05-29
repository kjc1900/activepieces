import { NextResponse } from 'next/server'

// Vercel calls this on the 1st of every month (see vercel.json)
export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL ? new URL(request.url).origin : 'http://localhost:3000'}/api/sync`, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${process.env.CRON_SECRET}`,
      'content-type': 'application/json',
    },
  })

  const data = await res.json()
  return NextResponse.json(data)
}
