'use client'

import {
  Ingredient,
  DollLine,
  DollFormula,
  DOLL_LINE_LABELS,
  DOLL_LINE_DESCRIPTIONS,
  FORMULA_LABELS,
  FORMULA_ROCKS,
  FORMULA_HERBS,
} from '@/types'
import { IngredientCard } from './ingredient-card'
import { createClient } from '@/lib/supabase/client'
import { ChevronLeft, ChevronRight, Check, Save } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Step = 'line' | 'formula' | 'rocks' | 'herbs' | 'intention' | 'colors' | 'archetypes' | 'review'

const STEPS: Step[] = ['line', 'formula', 'rocks', 'herbs', 'intention', 'colors', 'archetypes', 'review']
const STEP_LABELS: Record<Step, string> = {
  line: 'Doll Line',
  formula: 'Formula',
  rocks: 'Stones',
  herbs: 'Herbs',
  intention: 'Intention',
  colors: 'Colors',
  archetypes: 'Archetypes',
  review: 'Review',
}

const DOLL_LINES: DollLine[] = ['YOU_DO_YOU_VOODOO', 'SOUL_STITCH', 'JOJOS_ODDITIES']
const FORMULAS: DollFormula[] = ['ONE_ROCK_TWO_HERBS', 'TWO_ROCKS_ONE_HERB', 'THREE_ROCKS_TWO_HERBS']

interface Props {
  rocks: Ingredient[]
  herbs: Ingredient[]
  colors: Ingredient[]
  archetypes: Ingredient[]
}

export function BuilderWizard({ rocks, herbs, colors, archetypes }: Props) {
  const [stepIdx, setStepIdx] = useState(0)
  const [dollLine, setDollLine] = useState<DollLine | null>(null)
  const [formula, setFormula] = useState<DollFormula | null>(null)
  const [selectedRocks, setSelectedRocks] = useState<string[]>([])
  const [selectedHerbs, setSelectedHerbs] = useState<string[]>([])
  const [intention, setIntention] = useState('')
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [selectedArchetypes, setSelectedArchetypes] = useState<string[]>([])
  const [recipeName, setRecipeName] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [authRequired, setAuthRequired] = useState(false)
  const [error, setError] = useState('')

  const router = useRouter()
  const step = STEPS[stepIdx]
  const maxRocks = formula ? FORMULA_ROCKS[formula] : 0
  const maxHerbs = formula ? FORMULA_HERBS[formula] : 0

  function toggleSelect(id: string, current: string[], set: (v: string[]) => void, max: number) {
    if (current.includes(id)) {
      set(current.filter((x) => x !== id))
    } else if (current.length < max) {
      set([...current, id])
    }
  }

  function canAdvance() {
    if (step === 'line') return !!dollLine
    if (step === 'formula') return !!formula
    if (step === 'rocks') return selectedRocks.length === maxRocks
    if (step === 'herbs') return selectedHerbs.length === maxHerbs
    return true
  }

  function advance() {
    if (stepIdx < STEPS.length - 1) setStepIdx(stepIdx + 1)
  }

  function back() {
    if (stepIdx > 0) setStepIdx(stepIdx - 1)
  }

  async function handleSave() {
    if (!dollLine || !formula || !recipeName.trim()) return
    setSaving(true)
    setError('')
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      setAuthRequired(true)
      setSaving(false)
      return
    }

    const { data, error: saveError } = await supabase.from('doll_recipes').insert({
      name: recipeName.trim(),
      doll_line: dollLine,
      formula,
      rock_ids: selectedRocks,
      herb_ids: selectedHerbs,
      color_ids: selectedColors,
      archetype_ids: selectedArchetypes,
      intention: intention.trim() || null,
      status: 'draft',
    }).select().single()

    if (saveError) {
      setError(saveError.message)
    } else {
      setSaved(true)
      setTimeout(() => router.push('/my-recipes'), 1500)
    }
    setSaving(false)
  }

  if (authRequired) {
    return (
      <div className="text-center py-12">
        <p className="text-2xl mb-2">🔐</p>
        <h2 className="text-lg font-semibold mb-1">Sign in to save your recipe</h2>
        <p className="text-stone-500 text-sm mb-6">Create a free account to save and submit your custom doll recipe.</p>
        <a
          href={`/login?next=/builder`}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-800 text-white rounded-lg font-medium hover:bg-purple-900 transition-colors"
        >
          Sign in / Create account
        </a>
        <button
          onClick={() => setAuthRequired(false)}
          className="block mt-3 mx-auto text-sm text-stone-400 hover:text-stone-600"
        >
          Go back
        </button>
      </div>
    )
  }

  if (saved) {
    return (
      <div className="text-center py-12">
        <p className="text-4xl mb-3">🪆</p>
        <h2 className="text-lg font-semibold text-green-700">Recipe saved!</h2>
        <p className="text-stone-500 text-sm mt-1">Taking you to your recipes…</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress bar */}
      <div className="flex gap-1 mb-6 overflow-x-auto pb-1">
        {STEPS.map((s, i) => (
          <div
            key={s}
            className={`flex-1 h-1.5 rounded-full min-w-[20px] transition-colors ${
              i < stepIdx ? 'bg-purple-600' : i === stepIdx ? 'bg-purple-400' : 'bg-stone-200'
            }`}
          />
        ))}
      </div>
      <p className="text-xs text-stone-400 mb-4 font-medium uppercase tracking-wide">
        Step {stepIdx + 1} of {STEPS.length} · {STEP_LABELS[step]}
      </p>

      {/* Step content */}
      {step === 'line' && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-stone-800">Which doll line calls to you?</h2>
          {DOLL_LINES.map((line) => (
            <button
              key={line}
              type="button"
              onClick={() => setDollLine(line)}
              className={`w-full text-left p-4 rounded-xl border transition-all ${
                dollLine === line
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-stone-200 bg-white hover:border-stone-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-stone-800">{DOLL_LINE_LABELS[line]}</p>
                  <p className="text-sm text-stone-500 mt-0.5">{DOLL_LINE_DESCRIPTIONS[line]}</p>
                </div>
                {dollLine === line && (
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-purple-600 shrink-0">
                    <Check className="w-3 h-3 text-white" />
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {step === 'formula' && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-stone-800">Choose your formula</h2>
          <p className="text-sm text-stone-500">This sets how many stones and herbs go into your doll.</p>
          {FORMULAS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => {
                setFormula(f)
                setSelectedRocks([])
                setSelectedHerbs([])
              }}
              className={`w-full text-left p-4 rounded-xl border transition-all ${
                formula === f
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-stone-200 bg-white hover:border-stone-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-stone-800">{FORMULA_LABELS[f]}</p>
                  <p className="text-sm text-stone-500 mt-0.5">
                    {FORMULA_ROCKS[f]} stone{FORMULA_ROCKS[f] > 1 ? 's' : ''} · {FORMULA_HERBS[f]} herb{FORMULA_HERBS[f] > 1 ? 's' : ''}
                  </p>
                </div>
                {formula === f && (
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-purple-600 shrink-0">
                    <Check className="w-3 h-3 text-white" />
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {step === 'rocks' && (
        <div>
          <h2 className="text-lg font-semibold text-stone-800">Choose your stone{maxRocks > 1 ? 's' : ''}</h2>
          <p className="text-sm text-stone-500 mb-4">
            Select {maxRocks} stone{maxRocks > 1 ? 's' : ''} · {selectedRocks.length}/{maxRocks} chosen
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {rocks.map((r) => (
              <IngredientCard
                key={r.id}
                ingredient={r}
                selected={selectedRocks.includes(r.id)}
                onClick={() => toggleSelect(r.id, selectedRocks, setSelectedRocks, maxRocks)}
                disabled={selectedRocks.length >= maxRocks && !selectedRocks.includes(r.id)}
              />
            ))}
          </div>
        </div>
      )}

      {step === 'herbs' && (
        <div>
          <h2 className="text-lg font-semibold text-stone-800">Choose your herb{maxHerbs > 1 ? 's' : ''} or oil{maxHerbs > 1 ? 's' : ''}</h2>
          <p className="text-sm text-stone-500 mb-4">
            Select {maxHerbs} herb{maxHerbs > 1 ? 's' : ''} · {selectedHerbs.length}/{maxHerbs} chosen
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {herbs.map((h) => (
              <IngredientCard
                key={h.id}
                ingredient={h}
                selected={selectedHerbs.includes(h.id)}
                onClick={() => toggleSelect(h.id, selectedHerbs, setSelectedHerbs, maxHerbs)}
                disabled={selectedHerbs.length >= maxHerbs && !selectedHerbs.includes(h.id)}
              />
            ))}
          </div>
        </div>
      )}

      {step === 'intention' && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-stone-800">Write your intention</h2>
          <p className="text-sm text-stone-500">What do you want this doll to hold for you? (optional)</p>
          <textarea
            value={intention}
            onChange={(e) => setIntention(e.target.value)}
            placeholder="e.g. I call in clarity, courage, and the ability to trust myself…"
            rows={5}
            className="w-full p-3 text-sm border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300 resize-none bg-white"
          />
        </div>
      )}

      {step === 'colors' && (
        <div>
          <h2 className="text-lg font-semibold text-stone-800">Choose your colors</h2>
          <p className="text-sm text-stone-500 mb-4">
            Select up to 3 · {selectedColors.length}/3 chosen · (optional)
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {colors.map((c) => (
              <IngredientCard
                key={c.id}
                ingredient={c}
                selected={selectedColors.includes(c.id)}
                onClick={() => toggleSelect(c.id, selectedColors, setSelectedColors, 3)}
                disabled={selectedColors.length >= 3 && !selectedColors.includes(c.id)}
              />
            ))}
          </div>
        </div>
      )}

      {step === 'archetypes' && (
        <div>
          <h2 className="text-lg font-semibold text-stone-800">Choose your archetypes</h2>
          <p className="text-sm text-stone-500 mb-4">
            Select up to 2 · {selectedArchetypes.length}/2 chosen · (optional)
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {archetypes.map((a) => (
              <IngredientCard
                key={a.id}
                ingredient={a}
                selected={selectedArchetypes.includes(a.id)}
                onClick={() => toggleSelect(a.id, selectedArchetypes, setSelectedArchetypes, 2)}
                disabled={selectedArchetypes.length >= 2 && !selectedArchetypes.includes(a.id)}
              />
            ))}
          </div>
        </div>
      )}

      {step === 'review' && dollLine && formula && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-stone-800">Review your recipe</h2>

          <div className="bg-white rounded-xl border border-stone-200 p-4 space-y-3 text-sm">
            <div className="flex gap-2">
              <span className="text-stone-400 w-24 shrink-0">Doll Line</span>
              <span className="font-medium text-purple-800">{DOLL_LINE_LABELS[dollLine]}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-stone-400 w-24 shrink-0">Formula</span>
              <span className="font-medium">{FORMULA_LABELS[formula]}</span>
            </div>
            <div className="flex gap-2 flex-wrap">
              <span className="text-stone-400 w-24 shrink-0">Stones</span>
              <div className="flex flex-wrap gap-1">
                {selectedRocks.map((id) => {
                  const r = rocks.find((x) => x.id === id)
                  return r ? <span key={id} className="bg-purple-50 text-purple-800 text-xs px-2 py-0.5 rounded-full">{r.name}</span> : null
                })}
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <span className="text-stone-400 w-24 shrink-0">Herbs</span>
              <div className="flex flex-wrap gap-1">
                {selectedHerbs.map((id) => {
                  const h = herbs.find((x) => x.id === id)
                  return h ? <span key={id} className="bg-green-50 text-green-800 text-xs px-2 py-0.5 rounded-full">{h.name}</span> : null
                })}
              </div>
            </div>
            {selectedColors.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                <span className="text-stone-400 w-24 shrink-0">Colors</span>
                <div className="flex flex-wrap gap-1">
                  {selectedColors.map((id) => {
                    const c = colors.find((x) => x.id === id)
                    const hex = c ? String(c.extra_data.hex ?? '') : ''
                    return c ? (
                      <span key={id} className="flex items-center gap-1 bg-amber-50 text-amber-800 text-xs px-2 py-0.5 rounded-full">
                        {hex && <span className="w-2.5 h-2.5 rounded-full border border-stone-200 inline-block" style={{ backgroundColor: hex }} />}
                        {c.name}
                      </span>
                    ) : null
                  })}
                </div>
              </div>
            )}
            {selectedArchetypes.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                <span className="text-stone-400 w-24 shrink-0">Archetypes</span>
                <div className="flex flex-wrap gap-1">
                  {selectedArchetypes.map((id) => {
                    const a = archetypes.find((x) => x.id === id)
                    return a ? <span key={id} className="bg-blue-50 text-blue-800 text-xs px-2 py-0.5 rounded-full">{a.name}</span> : null
                  })}
                </div>
              </div>
            )}
            {intention && (
              <div className="flex gap-2">
                <span className="text-stone-400 w-24 shrink-0">Intention</span>
                <p className="italic text-stone-600 text-xs">{intention}</p>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Name your recipe</label>
            <input
              type="text"
              value={recipeName}
              onChange={(e) => setRecipeName(e.target.value)}
              placeholder="e.g. My Summer Clarity Doll"
              className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            onClick={handleSave}
            disabled={!recipeName.trim() || saving}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-800 text-white rounded-xl font-medium hover:bg-purple-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving…' : 'Save My Recipe'}
          </button>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-8 pt-4 border-t border-stone-100">
        <button
          onClick={back}
          disabled={stepIdx === 0}
          className="flex items-center gap-1.5 px-4 py-2 text-sm text-stone-600 hover:text-stone-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>

        {step !== 'review' && (
          <button
            onClick={advance}
            disabled={!canAdvance()}
            className="flex items-center gap-1.5 px-5 py-2 text-sm font-medium bg-purple-800 text-white rounded-lg hover:bg-purple-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}
