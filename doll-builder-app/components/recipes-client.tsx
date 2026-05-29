'use client'

import { PopulatedRecipe } from '@/types'
import { RecipeCard } from './recipe-card'
import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export function RecipesClient({ initialRecipes }: { initialRecipes: PopulatedRecipe[] }) {
  const [recipes, setRecipes] = useState<PopulatedRecipe[]>(initialRecipes)
  const [notification, setNotification] = useState<string | null>(null)
  const supabase = createClient()
  const router = useRouter()

  function notify(msg: string) {
    setNotification(msg)
    setTimeout(() => setNotification(null), 3000)
  }

  async function handleDelete(id: string) {
    await supabase.from('doll_recipes').delete().eq('id', id)
    setRecipes((prev) => prev.filter((r) => r.id !== id))
    notify('Recipe deleted.')
  }

  async function handleSubmit(id: string) {
    await supabase.from('doll_recipes').update({ status: 'submitted' }).eq('id', id)
    setRecipes((prev) => prev.map((r) => r.id === id ? { ...r, status: 'submitted' as const } : r))
    notify("Submitted! Kellie Jo will see your recipe and be in touch. 🪆")
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {notification && (
        <div className="mb-4 px-4 py-3 bg-purple-50 border border-purple-200 text-purple-800 text-sm rounded-lg">
          {notification}
        </div>
      )}

      {recipes.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">🪆</p>
          <h2 className="text-lg font-semibold text-stone-700">No recipes yet</h2>
          <p className="text-stone-500 text-sm mt-1 mb-6">Head to the builder to create your first custom doll recipe.</p>
          <Link
            href="/builder"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-800 text-white rounded-lg font-medium hover:bg-purple-900 transition-colors"
          >
            Build a Doll
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onDelete={handleDelete}
              onSubmit={handleSubmit}
            />
          ))}
        </div>
      )}
    </div>
  )
}
