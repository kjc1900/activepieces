import { Ingredient } from '@/types'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

interface Props {
  ingredient: Ingredient
  selected?: boolean
  onClick?: () => void
  disabled?: boolean
}

export function IngredientCard({ ingredient, selected, onClick, disabled }: Props) {
  const isColor = ingredient.category === 'COLOR'
  const hex = isColor ? String(ingredient.extra_data.hex ?? '') : ''

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled && !selected}
      className={cn(
        'relative w-full text-left rounded-xl border p-3 transition-all',
        onClick ? 'cursor-pointer' : 'cursor-default',
        selected
          ? 'border-purple-500 bg-purple-50 shadow-sm shadow-purple-100'
          : 'border-stone-200 bg-white hover:border-stone-300 hover:shadow-sm',
        disabled && !selected && 'opacity-40 cursor-not-allowed',
      )}
    >
      {selected && (
        <span className="absolute top-2 right-2 flex items-center justify-center w-5 h-5 rounded-full bg-purple-600">
          <Check className="w-3 h-3 text-white" />
        </span>
      )}

      <div className="flex items-start gap-2.5">
        {isColor && hex && (
          <span
            className="mt-0.5 w-5 h-5 rounded-full border border-stone-200 shrink-0"
            style={{ backgroundColor: hex }}
          />
        )}
        {!isColor && (
          <span className="mt-0.5 text-base shrink-0">
            {ingredient.category === 'ROCK' ? '💎' : ingredient.category === 'HERB_OIL' ? '🌿' : '✨'}
          </span>
        )}
        <div className="min-w-0">
          <p className="font-semibold text-sm text-stone-800 leading-tight">{ingredient.name}</p>
          {ingredient.description && (
            <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">{ingredient.description}</p>
          )}
          {ingredient.category === 'ROCK' && ingredient.extra_data.extra_cost && (
            <span className="inline-block mt-1.5 text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-medium">
              + add-on cost
            </span>
          )}
          {ingredient.category === 'HERB_OIL' && ingredient.extra_data.warnings && (
            <p className="text-xs text-red-500 mt-1">⚠ {String(ingredient.extra_data.warnings)}</p>
          )}
        </div>
      </div>
    </button>
  )
}
