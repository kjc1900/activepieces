'use client'

import { PopulatedRecipe, DOLL_LINE_LABELS } from '@/types'
import { Trash2, Send, Clock, CheckCircle2 } from 'lucide-react'

interface Props {
  recipe: PopulatedRecipe
  onDelete: (id: string) => void
  onSubmit: (id: string) => void
}

export function RecipeCard({ recipe, onDelete, onSubmit }: Props) {
  const isSubmitted = recipe.status === 'submitted'

  return (
    <div className="bg-white border border-stone-200 rounded-xl p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-stone-800">{recipe.name}</h3>
          <p className="text-xs text-purple-700 font-medium mt-0.5">{DOLL_LINE_LABELS[recipe.doll_line]}</p>
        </div>
        <span className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium shrink-0 ${
          isSubmitted ? 'bg-green-100 text-green-700' : 'bg-stone-100 text-stone-600'
        }`}>
          {isSubmitted ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
          {isSubmitted ? 'Submitted' : 'Draft'}
        </span>
      </div>

      {/* Ingredients summary */}
      <div className="space-y-1.5 text-sm">
        {recipe.rocks.length > 0 && (
          <div className="flex gap-1.5 flex-wrap">
            <span className="text-xs text-stone-400 w-16 shrink-0 pt-0.5">Stones</span>
            {recipe.rocks.map((r) => (
              <span key={r.id} className="text-xs bg-purple-50 text-purple-800 px-2 py-0.5 rounded-full">{r.name}</span>
            ))}
          </div>
        )}
        {recipe.herbs.length > 0 && (
          <div className="flex gap-1.5 flex-wrap">
            <span className="text-xs text-stone-400 w-16 shrink-0 pt-0.5">Herbs</span>
            {recipe.herbs.map((h) => (
              <span key={h.id} className="text-xs bg-green-50 text-green-800 px-2 py-0.5 rounded-full">{h.name}</span>
            ))}
          </div>
        )}
        {recipe.colors.length > 0 && (
          <div className="flex gap-1.5 flex-wrap items-center">
            <span className="text-xs text-stone-400 w-16 shrink-0">Colors</span>
            {recipe.colors.map((c) => {
              const hex = String(c.extra_data.hex ?? '')
              return (
                <span key={c.id} className="flex items-center gap-1 text-xs bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full">
                  {hex && <span className="w-2.5 h-2.5 rounded-full border border-stone-200 inline-block" style={{ backgroundColor: hex }} />}
                  {c.name}
                </span>
              )
            })}
          </div>
        )}
        {recipe.archetypes.length > 0 && (
          <div className="flex gap-1.5 flex-wrap">
            <span className="text-xs text-stone-400 w-16 shrink-0 pt-0.5">Soul</span>
            {recipe.archetypes.map((a) => (
              <span key={a.id} className="text-xs bg-blue-50 text-blue-800 px-2 py-0.5 rounded-full">{a.name}</span>
            ))}
          </div>
        )}
        {recipe.intention && (
          <div className="flex gap-1.5">
            <span className="text-xs text-stone-400 w-16 shrink-0 pt-0.5">Intent</span>
            <p className="text-xs text-stone-600 italic line-clamp-2">{recipe.intention}</p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-1 border-t border-stone-100">
        {!isSubmitted && (
          <button
            onClick={() => onSubmit(recipe.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-purple-800 text-white rounded-lg hover:bg-purple-900 transition-colors"
          >
            <Send className="w-3 h-3" />
            Send to Kellie Jo
          </button>
        )}
        <button
          onClick={() => onDelete(recipe.id)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-auto"
        >
          <Trash2 className="w-3 h-3" />
          Delete
        </button>
      </div>
    </div>
  )
}
