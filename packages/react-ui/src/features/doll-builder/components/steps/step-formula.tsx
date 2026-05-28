import { DollFormula, FORMULA_HERBS, FORMULA_ROCKS } from '@activepieces/shared'
import { cn } from '@/lib/utils'

type Props = {
    value: DollFormula | null
    onChange: (formula: DollFormula) => void
}

const FORMULA_LABELS: Record<DollFormula, string> = {
    [DollFormula.ONE_ROCK_TWO_HERBS]: '1 Stone · 2 Herbs / Oils',
    [DollFormula.TWO_ROCKS_ONE_HERB]: '2 Stones · 1 Herb / Oil',
    [DollFormula.THREE_ROCKS_TWO_HERBS]: '3 Stones · 2 Herbs / Oils',
}

const FORMULA_DESCRIPTIONS: Record<DollFormula, string> = {
    [DollFormula.ONE_ROCK_TWO_HERBS]: 'Let the plant medicines take the lead — one anchor stone to ground them.',
    [DollFormula.TWO_ROCKS_ONE_HERB]: 'Two stones form a bridge; one herb or oil moves the energy through.',
    [DollFormula.THREE_ROCKS_TWO_HERBS]: 'A full foundation of stones with two plant allies — the most layered recipe.',
}

export function StepFormula({ value, onChange }: Props) {
    return (
        <div className="space-y-4">
            <div>
                <h2 className="text-xl font-semibold">Choose Your Recipe</h2>
                <p className="text-sm text-muted-foreground mt-1">
                    The formula determines how many stones and herbs go into your doll's recipe.
                </p>
            </div>
            <div className="grid gap-4">
                {Object.values(DollFormula).map((formula) => (
                    <button
                        key={formula}
                        type="button"
                        onClick={() => onChange(formula)}
                        className={cn(
                            'flex items-start gap-4 rounded-lg border-2 p-5 text-left transition-all hover:border-primary/60',
                            value === formula ? 'border-primary bg-primary/5' : 'border-border bg-card',
                        )}
                    >
                        <div className="flex gap-3 mt-0.5">
                            <span className="text-2xl">{FORMULA_ROCKS[formula] > 1 ? '💎💎' : '💎'}{formula === DollFormula.THREE_ROCKS_TWO_HERBS ? '💎' : ''}</span>
                            <span className="text-2xl">{FORMULA_HERBS[formula] > 1 ? '🌿🌿' : '🌿'}</span>
                        </div>
                        <div>
                            <div className="font-semibold text-base">{FORMULA_LABELS[formula]}</div>
                            <div className="text-sm text-muted-foreground mt-1">{FORMULA_DESCRIPTIONS[formula]}</div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    )
}
