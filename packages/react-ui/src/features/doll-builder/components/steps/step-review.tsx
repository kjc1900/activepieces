import { DollFormula, DollIngredient, DollLine, DOLL_LINE_LABELS, FORMULA_HERBS, FORMULA_ROCKS } from '@activepieces/shared'
import { Separator } from '@/components/ui/separator'

type Props = {
    name: string
    dollLine: DollLine
    formula: DollFormula
    rocks: DollIngredient[]
    herbOils: DollIngredient[]
    colors: DollIngredient[]
    archetypes: DollIngredient[]
    intention: string
    seekerNotes: string
}

function Section({ label, items, emptyText }: { label: string; items: { name: string; description?: string | null }[]; emptyText?: string }) {
    return (
        <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">{label}</h3>
            {items.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">{emptyText ?? 'None selected'}</p>
            ) : (
                <ul className="space-y-1">
                    {items.map((item) => (
                        <li key={item.name} className="text-sm">
                            <span className="font-medium">{item.name}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export function StepReview({ name, dollLine, formula, rocks, herbOils, colors, archetypes, intention, seekerNotes }: Props) {
    const rocksNeeded = FORMULA_ROCKS[formula]
    const herbsNeeded = FORMULA_HERBS[formula]
    const rocksOk = rocks.length === rocksNeeded
    const herbsOk = herbOils.length === herbsNeeded
    const intentionOk = intention.trim().length > 0
    const nameOk = name.trim().length > 0

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold">Review Your Recipe</h2>
                <p className="text-sm text-muted-foreground mt-1">
                    Look everything over before saving or submitting.
                </p>
            </div>

            {(!rocksOk || !herbsOk || !intentionOk || !nameOk) && (
                <div className="rounded-md bg-destructive/10 border border-destructive/30 p-4 text-sm text-destructive space-y-1">
                    <p className="font-semibold">Please complete the following before submitting:</p>
                    {!nameOk && <p>• Give your doll a name</p>}
                    {!rocksOk && <p>• Select {rocksNeeded} stone{rocksNeeded > 1 ? 's' : ''} (have {rocks.length})</p>}
                    {!herbsOk && <p>• Select {herbsNeeded} herb/oil{herbsNeeded > 1 ? 's' : ''} (have {herbOils.length})</p>}
                    {!intentionOk && <p>• Write your intention</p>}
                </div>
            )}

            <div className="rounded-lg border bg-card p-5 space-y-5">
                <div>
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-1">Doll Name</h3>
                    <p className="font-semibold text-lg">{name || <span className="italic text-muted-foreground">Unnamed</span>}</p>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-muted-foreground font-medium">Doll Line</p>
                        <p className="font-semibold mt-0.5">{DOLL_LINE_LABELS[dollLine]}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground font-medium">Recipe</p>
                        <p className="font-semibold mt-0.5">
                            {rocksNeeded} stone{rocksNeeded > 1 ? 's' : ''} · {herbsNeeded} herb{herbsNeeded > 1 ? 's' : ''}/oil{herbsNeeded > 1 ? 's' : ''}
                        </p>
                    </div>
                </div>

                <Separator />

                <Section label={`Stones (${rocks.length}/${rocksNeeded})`} items={rocks} />
                <Section label={`Herbs / Oils (${herbOils.length}/${herbsNeeded})`} items={herbOils} />
                <Section label={`Colors (${colors.length})`} items={colors} emptyText="No colors chosen (optional)" />
                <Section label={`Archetypes (${archetypes.length})`} items={archetypes} emptyText="No archetype chosen (optional)" />

                <Separator />

                <div>
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">Intention</h3>
                    {intention ? (
                        <p className="text-sm whitespace-pre-wrap">{intention}</p>
                    ) : (
                        <p className="text-sm italic text-muted-foreground">No intention written yet</p>
                    )}
                </div>

                {seekerNotes && (
                    <>
                        <Separator />
                        <div>
                            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">Notes for Kellie Jo</h3>
                            <p className="text-sm whitespace-pre-wrap">{seekerNotes}</p>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
