import { DollIngredient, DollIngredientCategory, DollLine } from '@activepieces/shared'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { dollIngredientsHooks } from '../../lib/doll-builder-hooks'

type Props = {
    dollLine: DollLine
    selectedIds: string[]
    onChange: (ids: string[]) => void
}

export function StepArchetypes({ dollLine, selectedIds, onChange }: Props) {
    const [search, setSearch] = useState('')
    const { data: archetypes, isLoading } = dollIngredientsHooks.useAll(DollIngredientCategory.ARCHETYPE)
    const isSoulStitch = dollLine === DollLine.SOUL_STITCH

    const filtered = (archetypes ?? []).filter((a) => !search || a.name.toLowerCase().includes(search.toLowerCase()))

    function toggle(id: string) {
        if (selectedIds.includes(id)) {
            onChange(selectedIds.filter((s) => s !== id))
        }
        else if (!isSoulStitch || selectedIds.length < 1) {
            onChange([...selectedIds, id])
        }
        else {
            onChange([id])
        }
    }

    return (
        <div className="space-y-4">
            <div>
                <h2 className="text-xl font-semibold">Choose Your Archetype{isSoulStitch ? '' : 's'}</h2>
                <p className="text-sm text-muted-foreground mt-1">
                    {isSoulStitch
                        ? 'SoulStitch dolls are built around one archetype — the primary energetic conductor. Choose the one that anchors your doll\'s spirit.'
                        : 'Archetypes give your doll its psychological and symbolic depth. Choose any that resonate.'}
                    {selectedIds.length > 0 && <span className="font-medium"> {selectedIds.length} selected</span>}
                </p>
            </div>
            <Input
                placeholder="Search archetypes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="max-w-sm"
            />
            {isLoading && <p className="text-sm text-muted-foreground">Loading...</p>}
            <div className="grid gap-3 sm:grid-cols-2">
                {filtered.map((archetype: DollIngredient) => {
                    const selected = selectedIds.includes(archetype.id)
                    const disabledExtra = isSoulStitch && selectedIds.length >= 1 && !selected
                    return (
                        <button
                            key={archetype.id}
                            type="button"
                            disabled={disabledExtra}
                            onClick={() => toggle(archetype.id)}
                            className={cn(
                                'flex flex-col gap-2 rounded-lg border-2 p-4 text-left transition-all',
                                selected ? 'border-primary bg-primary/5' : 'border-border bg-card hover:border-primary/40',
                                disabledExtra ? 'opacity-40 cursor-not-allowed' : '',
                            )}
                        >
                            <div className="font-medium text-sm">{archetype.name}</div>
                            {archetype.description && (
                                <div className="text-xs text-muted-foreground line-clamp-3">{archetype.description}</div>
                            )}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
