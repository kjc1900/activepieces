import { DollConfigStatus, DollFormula, DollIngredient, DollIngredientCategory, DollLine, FORMULA_HERBS, FORMULA_ROCKS, PopulatedDollConfiguration } from '@activepieces/shared'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { useState } from 'react'
import { dollConfigurationsHooks, dollIngredientsHooks } from '../lib/doll-builder-hooks'
import { StepArchetypes } from './steps/step-archetypes'
import { StepColors } from './steps/step-colors'
import { StepDollLine } from './steps/step-doll-line'
import { StepFormula } from './steps/step-formula'
import { StepHerbs } from './steps/step-herbs'
import { StepIntentions } from './steps/step-intentions'
import { StepReview } from './steps/step-review'
import { StepRocks } from './steps/step-rocks'

const STEPS = ['doll-line', 'formula', 'rocks', 'herbs', 'intentions', 'colors', 'archetypes', 'review'] as const
type Step = (typeof STEPS)[number]

const STEP_LABELS: Record<Step, string> = {
    'doll-line': 'Doll Line',
    formula: 'Recipe',
    rocks: 'Stones',
    herbs: 'Herbs / Oils',
    intentions: 'Intention',
    colors: 'Colors',
    archetypes: 'Archetype',
    review: 'Review',
}

type Props = {
    initial?: PopulatedDollConfiguration
    onSaved?: (config: PopulatedDollConfiguration) => void
    onSubmitted?: (config: PopulatedDollConfiguration) => void
}

type DraftState = {
    name: string
    dollLine: DollLine | null
    formula: DollFormula | null
    selectedRockIds: string[]
    selectedHerbOilIds: string[]
    selectedColorIds: string[]
    selectedArchetypeIds: string[]
    writtenIntention: string
    seekerNotes: string
}

function emptyDraft(): DraftState {
    return {
        name: '',
        dollLine: null,
        formula: null,
        selectedRockIds: [],
        selectedHerbOilIds: [],
        selectedColorIds: [],
        selectedArchetypeIds: [],
        writtenIntention: '',
        seekerNotes: '',
    }
}

function fromConfig(config: PopulatedDollConfiguration): DraftState {
    return {
        name: config.name,
        dollLine: config.dollLine,
        formula: config.formula,
        selectedRockIds: config.selectedRockIds,
        selectedHerbOilIds: config.selectedHerbOilIds,
        selectedColorIds: config.selectedColorIds,
        selectedArchetypeIds: config.selectedArchetypeIds,
        writtenIntention: config.writtenIntention,
        seekerNotes: config.seekerNotes ?? '',
    }
}

export function DollBuilderWizard({ initial, onSaved, onSubmitted }: Props) {
    const { toast } = useToast()
    const [step, setStep] = useState<Step>('doll-line')
    const [draft, setDraft] = useState<DraftState>(initial ? fromConfig(initial) : emptyDraft())
    const [savedId, setSavedId] = useState<string | undefined>(initial?.id)

    const { data: allRocks } = dollIngredientsHooks.useAll(DollIngredientCategory.ROCK)
    const { data: allHerbs } = dollIngredientsHooks.useAll(DollIngredientCategory.HERB_OIL)
    const { data: allColors } = dollIngredientsHooks.useAll(DollIngredientCategory.COLOR)
    const { data: allArchetypes } = dollIngredientsHooks.useAll(DollIngredientCategory.ARCHETYPE)

    const createMutation = dollConfigurationsHooks.useCreate()
    const updateMutation = dollConfigurationsHooks.useUpdate()
    const submitMutation = dollConfigurationsHooks.useSubmit()

    const stepIndex = STEPS.indexOf(step)
    const isFirst = stepIndex === 0
    const isLast = step === 'review'

    function update(patch: Partial<DraftState>) {
        setDraft((d) => ({ ...d, ...patch }))
    }

    function canAdvance(): boolean {
        switch (step) {
            case 'doll-line':
                return !!draft.dollLine
            case 'formula':
                return !!draft.formula
            case 'rocks':
                return draft.formula !== null && draft.selectedRockIds.length === FORMULA_ROCKS[draft.formula]
            case 'herbs':
                return draft.formula !== null && draft.selectedHerbOilIds.length === FORMULA_HERBS[draft.formula]
            default:
                return true
        }
    }

    function goNext() {
        setStep(STEPS[stepIndex + 1])
    }

    function goBack() {
        setStep(STEPS[stepIndex - 1])
    }

    function getIngredients(ids: string[], all?: DollIngredient[]): DollIngredient[] {
        if (!all) return []
        const map = Object.fromEntries(all.map((i) => [i.id, i]))
        return ids.map((id) => map[id]).filter(Boolean) as DollIngredient[]
    }

    async function handleSave() {
        if (!draft.dollLine || !draft.formula) return
        const body = {
            name: draft.name || 'My Doll',
            dollLine: draft.dollLine,
            formula: draft.formula,
            selectedRockIds: draft.selectedRockIds,
            selectedHerbOilIds: draft.selectedHerbOilIds,
            selectedColorIds: draft.selectedColorIds,
            selectedArchetypeIds: draft.selectedArchetypeIds,
            writtenIntention: draft.writtenIntention,
            seekerNotes: draft.seekerNotes || undefined,
        }
        if (savedId) {
            const result = await updateMutation.mutateAsync({ id: savedId, ...body })
            toast({ title: 'Draft saved' })
            onSaved?.(result)
        }
        else {
            const result = await createMutation.mutateAsync(body)
            setSavedId(result.id)
            toast({ title: 'Draft saved' })
            onSaved?.(result)
        }
    }

    async function handleSubmit() {
        let id = savedId
        if (!id) {
            const result = await createMutation.mutateAsync({
                name: draft.name || 'My Doll',
                dollLine: draft.dollLine!,
                formula: draft.formula!,
                selectedRockIds: draft.selectedRockIds,
                selectedHerbOilIds: draft.selectedHerbOilIds,
                selectedColorIds: draft.selectedColorIds,
                selectedArchetypeIds: draft.selectedArchetypeIds,
                writtenIntention: draft.writtenIntention,
                seekerNotes: draft.seekerNotes || undefined,
            })
            id = result.id
            setSavedId(id)
        }
        const result = await submitMutation.mutateAsync(id)
        toast({ title: 'Doll recipe submitted!', description: 'Kellie Jo will be in touch.' })
        onSubmitted?.(result)
    }

    const isComplete =
        !!draft.dollLine &&
        !!draft.formula &&
        draft.selectedRockIds.length === FORMULA_ROCKS[draft.formula] &&
        draft.selectedHerbOilIds.length === FORMULA_HERBS[draft.formula] &&
        draft.name.trim().length > 0 &&
        draft.writtenIntention.trim().length > 0

    return (
        <div className="flex flex-col gap-6">
            {/* Step indicator */}
            <div className="flex items-center gap-1 flex-wrap">
                {STEPS.map((s, i) => (
                    <div key={s} className="flex items-center gap-1">
                        <button
                            type="button"
                            onClick={() => i < stepIndex && setStep(s)}
                            className={`text-xs px-2.5 py-1 rounded-full transition-colors ${
                                s === step
                                    ? 'bg-primary text-primary-foreground font-semibold'
                                    : i < stepIndex
                                    ? 'bg-primary/20 text-primary cursor-pointer hover:bg-primary/30'
                                    : 'bg-muted text-muted-foreground cursor-default'
                            }`}
                        >
                            {STEP_LABELS[s]}
                        </button>
                        {i < STEPS.length - 1 && <span className="text-muted-foreground text-xs">›</span>}
                    </div>
                ))}
            </div>

            {/* Step content */}
            <div className="min-h-[400px]">
                {step === 'doll-line' && (
                    <StepDollLine value={draft.dollLine} onChange={(dollLine) => update({ dollLine, selectedRockIds: [], selectedHerbOilIds: [], selectedArchetypeIds: [] })} />
                )}
                {step === 'formula' && (
                    <StepFormula value={draft.formula} onChange={(formula) => update({ formula, selectedRockIds: [], selectedHerbOilIds: [] })} />
                )}
                {step === 'rocks' && draft.formula && (
                    <StepRocks formula={draft.formula} selectedIds={draft.selectedRockIds} onChange={(selectedRockIds) => update({ selectedRockIds })} />
                )}
                {step === 'herbs' && draft.formula && (
                    <StepHerbs formula={draft.formula} selectedIds={draft.selectedHerbOilIds} onChange={(selectedHerbOilIds) => update({ selectedHerbOilIds })} />
                )}
                {step === 'intentions' && (
                    <StepIntentions
                        name={draft.name}
                        intention={draft.writtenIntention}
                        seekerNotes={draft.seekerNotes}
                        onNameChange={(name) => update({ name })}
                        onIntentionChange={(writtenIntention) => update({ writtenIntention })}
                        onNotesChange={(seekerNotes) => update({ seekerNotes })}
                    />
                )}
                {step === 'colors' && (
                    <StepColors selectedIds={draft.selectedColorIds} onChange={(selectedColorIds) => update({ selectedColorIds })} />
                )}
                {step === 'archetypes' && draft.dollLine && (
                    <StepArchetypes dollLine={draft.dollLine} selectedIds={draft.selectedArchetypeIds} onChange={(selectedArchetypeIds) => update({ selectedArchetypeIds })} />
                )}
                {step === 'review' && draft.dollLine && draft.formula && (
                    <StepReview
                        name={draft.name}
                        dollLine={draft.dollLine}
                        formula={draft.formula}
                        rocks={getIngredients(draft.selectedRockIds, allRocks)}
                        herbOils={getIngredients(draft.selectedHerbOilIds, allHerbs)}
                        colors={getIngredients(draft.selectedColorIds, allColors)}
                        archetypes={getIngredients(draft.selectedArchetypeIds, allArchetypes)}
                        intention={draft.writtenIntention}
                        seekerNotes={draft.seekerNotes}
                    />
                )}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-2 border-t">
                <Button variant="outline" onClick={goBack} disabled={isFirst}>
                    Back
                </Button>
                <div className="flex gap-2">
                    {isLast ? (
                        <>
                            <Button
                                variant="outline"
                                onClick={handleSave}
                                disabled={createMutation.isPending || updateMutation.isPending}
                            >
                                Save Draft
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                disabled={!isComplete || submitMutation.isPending || createMutation.isPending}
                            >
                                Submit Order
                            </Button>
                        </>
                    ) : (
                        <Button onClick={goNext} disabled={!canAdvance()}>
                            Continue
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}
