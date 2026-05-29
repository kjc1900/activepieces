import { createClient } from '@/lib/supabase/server'
import { BuilderWizard } from '@/components/builder-wizard'
import { Wand2 } from 'lucide-react'

export default async function BuilderPage() {
  const supabase = await createClient()

  const [rocks, herbs, colors, archetypes] = await Promise.all([
    supabase.from('doll_ingredients').select('*').eq('category', 'ROCK').order('name'),
    supabase.from('doll_ingredients').select('*').eq('category', 'HERB_OIL').order('name'),
    supabase.from('doll_ingredients').select('*').eq('category', 'COLOR').order('name'),
    supabase.from('doll_ingredients').select('*').eq('category', 'ARCHETYPE').order('name'),
  ])

  const hasIngredients = (rocks.data?.length ?? 0) > 0

  return (
    <div>
      <div className="bg-gradient-to-b from-purple-900 to-purple-800 text-white">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <div className="flex items-center gap-3 mb-1">
            <Wand2 className="w-6 h-6 text-purple-200" />
            <h1 className="text-2xl font-bold">Build Your Doll</h1>
          </div>
          <p className="text-purple-200 text-sm max-w-md">
            Choose your line, pick your stones and herbs, write your intention, and save your recipe.
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {!hasIngredients ? (
          <div className="text-center py-16 text-stone-400">
            <p className="text-4xl mb-3">🪴</p>
            <p className="font-medium text-stone-600">No ingredients loaded yet</p>
            <p className="text-sm mt-1">Go to the Ingredient Library and click "Sync from Notion" to load your ingredient data.</p>
          </div>
        ) : (
          <BuilderWizard
            rocks={rocks.data ?? []}
            herbs={herbs.data ?? []}
            colors={colors.data ?? []}
            archetypes={archetypes.data ?? []}
          />
        )}
      </div>
    </div>
  )
}
