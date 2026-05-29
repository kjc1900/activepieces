export type IngredientCategory = 'ROCK' | 'HERB_OIL' | 'COLOR' | 'ARCHETYPE'
export type DollLine = 'YOU_DO_YOU_VOODOO' | 'SOUL_STITCH' | 'JOJOS_ODDITIES'
export type DollFormula = 'ONE_ROCK_TWO_HERBS' | 'TWO_ROCKS_ONE_HERB' | 'THREE_ROCKS_TWO_HERBS'
export type RecipeStatus = 'draft' | 'submitted'

export const FORMULA_ROCKS: Record<DollFormula, number> = {
  ONE_ROCK_TWO_HERBS: 1,
  TWO_ROCKS_ONE_HERB: 2,
  THREE_ROCKS_TWO_HERBS: 3,
}

export const FORMULA_HERBS: Record<DollFormula, number> = {
  ONE_ROCK_TWO_HERBS: 2,
  TWO_ROCKS_ONE_HERB: 1,
  THREE_ROCKS_TWO_HERBS: 2,
}

export const DOLL_LINE_LABELS: Record<DollLine, string> = {
  YOU_DO_YOU_VOODOO: 'You-Do-You Voodoo™',
  SOUL_STITCH: 'SoulStitch™',
  JOJOS_ODDITIES: "JoJo's Oddities™",
}

export const DOLL_LINE_DESCRIPTIONS: Record<DollLine, string> = {
  YOU_DO_YOU_VOODOO: 'Self-discovery, personal power, and radical authenticity.',
  SOUL_STITCH: 'Healing, connection, and emotional depth.',
  JOJOS_ODDITIES: 'Weird, playful, and wonderfully anything-goes.',
}

export const FORMULA_LABELS: Record<DollFormula, string> = {
  ONE_ROCK_TWO_HERBS: '1 Stone + 2 Herbs',
  TWO_ROCKS_ONE_HERB: '2 Stones + 1 Herb',
  THREE_ROCKS_TWO_HERBS: '3 Stones + 2 Herbs',
}

export interface Ingredient {
  id: string
  notion_id: string | null
  category: IngredientCategory
  name: string
  description: string | null
  extra_data: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface Recipe {
  id: string
  user_id: string
  name: string
  doll_line: DollLine
  formula: DollFormula
  rock_ids: string[]
  herb_ids: string[]
  color_ids: string[]
  archetype_ids: string[]
  intention: string | null
  status: RecipeStatus
  created_at: string
  updated_at: string
}

export interface PopulatedRecipe extends Omit<Recipe, 'rock_ids' | 'herb_ids' | 'color_ids' | 'archetype_ids'> {
  rocks: Ingredient[]
  herbs: Ingredient[]
  colors: Ingredient[]
  archetypes: Ingredient[]
}
