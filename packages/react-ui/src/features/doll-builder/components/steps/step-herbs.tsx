import { DollIngredient, DollIngredientCategory, FORMULA_HERBS, DollFormula } from '@activepieces/shared'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { dollIngredientsHooks } from '../../lib/doll-builder-hooks'
import { IngredientCard } from './ingredient-card'

type Props = {
    formula: DollFormula
    selectedIds: string[]
    onChange: (ids: string[]) => void
}

export function StepHerbs({ formula, selectedIds, onChange }: Props) {
    const [search, setSearch] = useState('')
    const { data: herbs, isLoading } = dollIngredientsHooks.useAll(DollIngredientCategory.HERB_OIL)
    const max = FORMULA_HERBS[formula]

    const filtered = (herbs ?? []).filter((h) => !search || h.name.toLowerCase().includes(search.toLowerCase()))

    function toggle(id: string) {
        if (selectedIds.includes(id)) {
            onChange(selectedIds.filter((s) => s !== id))
        }
        else if (selectedIds.length < max) {
            onChange([...selectedIds, id])
        }
    }

    return (
        <div className="space-y-4">
            <div>
                <h2 className="text-xl font-semibold">Choose Your Herb{max > 1 ? 's' : ''} / Oil{max > 1 ? 's' : ''}</h2>
                <p className="text-sm text-muted-foreground mt-1">
                    Select {max === 1 ? '1 herb or oil' : `up to ${max} herbs or oils`} for your recipe.{' '}
                    <span className="font-medium">{selectedIds.length} / {max} selected</span>
                </p>
            </div>
            <Input
                placeholder="Search herbs and oils..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="max-w-sm"
            />
            {isLoading && <p className="text-sm text-muted-foreground">Loading...</p>}
            <div className="grid gap-3 sm:grid-cols-2">
                {filtered.map((herb: DollIngredient) => (
                    <IngredientCard
                        key={herb.id}
                        ingredient={herb}
                        selected={selectedIds.includes(herb.id)}
                        disabled={selectedIds.length >= max}
                        onToggle={toggle}
                    />
                ))}
            </div>
        </div>
    )
}
