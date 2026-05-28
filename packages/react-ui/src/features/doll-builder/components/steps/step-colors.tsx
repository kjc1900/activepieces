import { DollIngredient, DollIngredientCategory } from '@activepieces/shared'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { dollIngredientsHooks } from '../../lib/doll-builder-hooks'

type Props = {
    selectedIds: string[]
    onChange: (ids: string[]) => void
}

export function StepColors({ selectedIds, onChange }: Props) {
    const [search, setSearch] = useState('')
    const { data: colors, isLoading } = dollIngredientsHooks.useAll(DollIngredientCategory.COLOR)

    const filtered = (colors ?? []).filter((c) => !search || c.name.toLowerCase().includes(search.toLowerCase()))

    function toggle(id: string) {
        if (selectedIds.includes(id)) {
            onChange(selectedIds.filter((s) => s !== id))
        }
        else {
            onChange([...selectedIds, id])
        }
    }

    return (
        <div className="space-y-4">
            <div>
                <h2 className="text-xl font-semibold">Choose Your Colors</h2>
                <p className="text-sm text-muted-foreground mt-1">
                    Colors carry energetic meaning. Select any that feel right — you can choose more than one.{' '}
                    {selectedIds.length > 0 && <span className="font-medium">{selectedIds.length} selected</span>}
                </p>
            </div>
            <Input
                placeholder="Search colors..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="max-w-sm"
            />
            {isLoading && <p className="text-sm text-muted-foreground">Loading...</p>}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((color: DollIngredient) => {
                    const selected = selectedIds.includes(color.id)
                    return (
                        <button
                            key={color.id}
                            type="button"
                            onClick={() => toggle(color.id)}
                            className={cn(
                                'flex items-center gap-3 rounded-lg border-2 p-4 text-left transition-all',
                                selected ? 'border-primary bg-primary/5' : 'border-border bg-card hover:border-primary/40',
                            )}
                        >
                            <span
                                className="w-8 h-8 rounded-full border border-border shrink-0"
                                style={{ backgroundColor: color.hexCode ?? '#888' }}
                            />
                            <div className="min-w-0">
                                <div className="font-medium text-sm truncate">{color.name}</div>
                                {color.description && (
                                    <div className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{color.description}</div>
                                )}
                            </div>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
