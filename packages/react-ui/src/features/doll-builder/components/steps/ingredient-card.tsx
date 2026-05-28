import { DollIngredient } from '@activepieces/shared'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

type Props = {
    ingredient: DollIngredient
    selected: boolean
    disabled?: boolean
    onToggle: (id: string) => void
}

export function IngredientCard({ ingredient, selected, disabled, onToggle }: Props) {
    return (
        <button
            type="button"
            disabled={disabled && !selected}
            onClick={() => onToggle(ingredient.id)}
            className={cn(
                'flex flex-col gap-2 rounded-lg border-2 p-4 text-left transition-all w-full',
                selected ? 'border-primary bg-primary/5' : 'border-border bg-card hover:border-primary/40',
                disabled && !selected ? 'opacity-40 cursor-not-allowed' : '',
            )}
        >
            <div className="flex items-start justify-between gap-2">
                <span className="font-medium text-sm leading-tight">{ingredient.name}</span>
                {ingredient.extraCost && ingredient.extraCost !== 'No' && (
                    <Badge variant="outline" className="shrink-0 text-xs">
                        {ingredient.extraCost === 'Yes' ? '+cost' : ingredient.extraCost.toLowerCase()}
                    </Badge>
                )}
                {ingredient.hexCode && (
                    <span
                        className="w-4 h-4 rounded-full border border-border shrink-0 mt-0.5"
                        style={{ backgroundColor: ingredient.hexCode }}
                    />
                )}
            </div>
            {ingredient.metaphysicalUses && (
                <p className="text-xs text-muted-foreground line-clamp-3">{ingredient.metaphysicalUses}</p>
            )}
            {ingredient.warnings.length > 0 && !ingredient.warnings.includes('None') && (
                <p className="text-xs text-destructive font-medium">⚠ {ingredient.warnings.join(', ')}</p>
            )}
        </button>
    )
}
