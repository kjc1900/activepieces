import { createClient } from '@/lib/supabase/server'
import { IngredientBrowser } from '@/components/ingredient-browser'
import { SyncButton } from '@/components/sync-button'

export const revalidate = 60 // revalidate page every 60 seconds

export default async function HomePage() {
  const supabase = await createClient()
  const { data: ingredients } = await supabase
    .from('doll_ingredients')
    .select('*')
    .order('name')

  return (
    <div>
      <div className="bg-gradient-to-b from-purple-900 to-purple-800 text-white">
        <div className="max-w-5xl mx-auto px-4 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Ingredient Library</h1>
            <p className="text-purple-200 text-sm mt-1 max-w-md">
              Browse the full collection of stones, herbs, colors, and archetypes that bring your custom doll to life.
            </p>
          </div>
          <SyncButton />
        </div>
      </div>
      <IngredientBrowser ingredients={ingredients ?? []} />
    </div>
  )
}
