'use client'

import { Ingredient, IngredientCategory } from '@/types'
import { IngredientCard } from './ingredient-card'
import { Search } from 'lucide-react'
import { useState } from 'react'

const TABS: { key: IngredientCategory; label: string; emoji: string }[] = [
  { key: 'ROCK', label: 'Stones', emoji: '💎' },
  { key: 'HERB_OIL', label: 'Herbs & Oils', emoji: '🌿' },
  { key: 'COLOR', label: 'Colors', emoji: '🎨' },
  { key: 'ARCHETYPE', label: 'Archetypes', emoji: '✨' },
]

export function IngredientBrowser({ ingredients }: { ingredients: Ingredient[] }) {
  const [activeTab, setActiveTab] = useState<IngredientCategory>('ROCK')
  const [search, setSearch] = useState('')

  const byCategory = (cat: IngredientCategory) =>
    ingredients
      .filter((i) => i.category === cat)
      .filter((i) => !search || i.name.toLowerCase().includes(search.toLowerCase()) || (i.description ?? '').toLowerCase().includes(search.toLowerCase()))

  const current = byCategory(activeTab)

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-stone-800 flex items-center gap-2">
          <span>🪆</span> Ingredient Library
        </h1>
        <p className="text-stone-500 text-sm mt-1">
          Browse everything that goes into your custom doll. Each ingredient carries its own energy.
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
        <input
          type="text"
          placeholder="Search ingredients…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-sm border border-stone-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-400"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 overflow-x-auto pb-1">
        {TABS.map(({ key, label, emoji }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === key
                ? 'bg-purple-800 text-white'
                : 'bg-white border border-stone-200 text-stone-600 hover:border-stone-300'
            }`}
          >
            <span>{emoji}</span>
            {label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === key ? 'bg-purple-700 text-purple-100' : 'bg-stone-100 text-stone-500'}`}>
              {byCategory(key).length}
            </span>
          </button>
        ))}
      </div>

      {/* Grid */}
      {current.length === 0 ? (
        <div className="py-16 text-center text-stone-400">
          {search ? 'No ingredients match your search.' : 'No ingredients yet — sync from Notion to populate.'}
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {current.map((ingredient) => (
            <IngredientCard key={ingredient.id} ingredient={ingredient} />
          ))}
        </div>
      )}
    </div>
  )
}
