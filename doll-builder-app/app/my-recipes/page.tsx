import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { RecipesClient } from '@/components/recipes-client'

export default async function MyRecipesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?next=/my-recipes')
  }

  const { data: recipes } = await supabase
    .from('doll_recipes')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  // Collect all ingredient IDs
  const allIds = new Set<string>()
  for (const r of recipes ?? []) {
    ;[...r.rock_ids, ...r.herb_ids, ...r.color_ids, ...r.archetype_ids].forEach((id: string) => allIds.add(id))
  }

  let ingredients: Record<string, { id: string; name: string; category: string; extra_data: Record<string, unknown> }> = {}
  if (allIds.size > 0) {
    const { data } = await supabase
      .from('doll_ingredients')
      .select('id, name, category, extra_data')
      .in('id', Array.from(allIds))
    for (const i of data ?? []) {
      ingredients[i.id] = i
    }
  }

  const populated = (recipes ?? []).map((r: any) => ({
    ...r,
    rocks: r.rock_ids.map((id: string) => ingredients[id]).filter(Boolean),
    herbs: r.herb_ids.map((id: string) => ingredients[id]).filter(Boolean),
    colors: r.color_ids.map((id: string) => ingredients[id]).filter(Boolean),
    archetypes: r.archetype_ids.map((id: string) => ingredients[id]).filter(Boolean),
  }))

  return (
    <div>
      <div className="bg-gradient-to-b from-purple-900 to-purple-800 text-white">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <h1 className="text-2xl font-bold">My Recipes</h1>
          <p className="text-purple-200 text-sm mt-1">
            Your saved doll recipes — draft them, refine them, then send to Kellie Jo when you're ready.
          </p>
        </div>
      </div>

      <RecipesClient initialRecipes={populated} />
    </div>
  )
}
