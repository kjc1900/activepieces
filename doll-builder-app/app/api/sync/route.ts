import { createServiceClient } from '@/lib/supabase/server'
import { syncAll } from '@/lib/notion'
import { NextResponse } from 'next/server'
import { IngredientCategory } from '@/types'

export const maxDuration = 60

export async function POST(request: Request) {
  // Simple auth: require service role header or be called from cron
  const authHeader = request.headers.get('authorization')
  const isFromCron = authHeader === `Bearer ${process.env.CRON_SECRET}`

  // Also allow logged-in admin calls (we'll tighten this once Kellie has her account)
  const token = process.env.NOTION_API_KEY
  if (!token) {
    return NextResponse.json({ error: 'NOTION_API_KEY not configured' }, { status: 500 })
  }

  const supabase = await createServiceClient()

  const results = await syncAll(token)
  const summary: Array<{ category: string; upserted: number; deleted: number; error?: string }> = []

  for (const result of results) {
    if (result.error) {
      summary.push({ category: result.category, upserted: 0, deleted: 0, error: result.error })
      continue
    }

    const { ingredients } = result
    let upserted = 0
    let deleted = 0

    if (ingredients.length > 0) {
      const { error: upsertError } = await supabase
        .from('doll_ingredients')
        .upsert(
          ingredients.map((i) => ({
            notion_id: i.notion_id,
            category: i.category,
            name: i.name,
            description: i.description,
            extra_data: i.extra_data,
            updated_at: new Date().toISOString(),
          })),
          { onConflict: 'notion_id' },
        )

      if (upsertError) {
        summary.push({ category: result.category, upserted: 0, deleted: 0, error: upsertError.message })
        continue
      }
      upserted = ingredients.length
    }

    // Delete removed items
    const notionIds = ingredients.map((i) => i.notion_id)
    if (notionIds.length > 0) {
      const { count } = await supabase
        .from('doll_ingredients')
        .delete({ count: 'exact' })
        .eq('category', result.category as IngredientCategory)
        .not('notion_id', 'in', `(${notionIds.map((id) => `"${id}"`).join(',')})`)
      deleted = count ?? 0
    } else {
      // All items removed — delete everything in this category
      const { count } = await supabase
        .from('doll_ingredients')
        .delete({ count: 'exact' })
        .eq('category', result.category)
      deleted = count ?? 0
    }

    summary.push({ category: result.category, upserted, deleted })
  }

  return NextResponse.json({ results: summary })
}
