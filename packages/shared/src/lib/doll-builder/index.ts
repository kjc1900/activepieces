import { Static, Type } from '@sinclair/typebox'
import { BaseModelSchema, Nullable } from '../common'

export enum DollIngredientCategory {
    ROCK = 'ROCK',
    HERB_OIL = 'HERB_OIL',
    COLOR = 'COLOR',
    ARCHETYPE = 'ARCHETYPE',
}

export enum DollLine {
    YOU_DO_YOU_VOODOO = 'YOU_DO_YOU_VOODOO',
    SOUL_STITCH = 'SOUL_STITCH',
    JOJOS_ODDITIES = 'JOJOS_ODDITIES',
}

export enum DollFormula {
    ONE_ROCK_TWO_HERBS = 'ONE_ROCK_TWO_HERBS',
    TWO_ROCKS_ONE_HERB = 'TWO_ROCKS_ONE_HERB',
    THREE_ROCKS_TWO_HERBS = 'THREE_ROCKS_TWO_HERBS',
}

export enum DollConfigStatus {
    DRAFT = 'DRAFT',
    SUBMITTED = 'SUBMITTED',
}

export const DOLL_LINE_LABELS: Record<DollLine, string> = {
    [DollLine.YOU_DO_YOU_VOODOO]: 'You-Do-You Voodoo™',
    [DollLine.SOUL_STITCH]: 'SoulStitch™',
    [DollLine.JOJOS_ODDITIES]: "JoJo's Oddities™",
}

export const DOLL_LINE_DESCRIPTIONS: Record<DollLine, string> = {
    [DollLine.YOU_DO_YOU_VOODOO]:
        'Dolls built around a specific intention — protection, empowerment, shadow work. A personal talisman made for the person who owns it.',
    [DollLine.SOUL_STITCH]:
        'Dolls built around a specific archetype, elemental force, or mythical spirit. Each is one of a kind, with its own presence and personality.',
    [DollLine.JOJOS_ODDITIES]:
        'Character dolls drawn from folklore, horror, fairy tales, gothic literature, history, fiction, and mythology. Strange, darkly playful, and celebratory of the bizarre.',
}

export const FORMULA_ROCKS: Record<DollFormula, number> = {
    [DollFormula.ONE_ROCK_TWO_HERBS]: 1,
    [DollFormula.TWO_ROCKS_ONE_HERB]: 2,
    [DollFormula.THREE_ROCKS_TWO_HERBS]: 3,
}

export const FORMULA_HERBS: Record<DollFormula, number> = {
    [DollFormula.ONE_ROCK_TWO_HERBS]: 2,
    [DollFormula.TWO_ROCKS_ONE_HERB]: 1,
    [DollFormula.THREE_ROCKS_TWO_HERBS]: 2,
}

export const DollIngredient = Type.Object({
    ...BaseModelSchema,
    name: Type.String(),
    category: Type.Enum(DollIngredientCategory),
    description: Nullable(Type.String()),
    metaphysicalUses: Nullable(Type.String()),
    notes: Nullable(Type.String()),
    warnings: Type.Array(Type.String()),
    hexCode: Nullable(Type.String()),
    typeOfRock: Type.Array(Type.String()),
    primaryUses: Type.Array(Type.String()),
    extraCost: Nullable(Type.String()),
    availability: Nullable(Type.String()),
    notionId: Nullable(Type.String()),
    sortOrder: Type.Number(),
})

export type DollIngredient = Static<typeof DollIngredient>

export const DollConfiguration = Type.Object({
    ...BaseModelSchema,
    userId: Type.String(),
    projectId: Type.String(),
    name: Type.String(),
    dollLine: Type.Enum(DollLine),
    formula: Type.Enum(DollFormula),
    selectedRockIds: Type.Array(Type.String()),
    selectedHerbOilIds: Type.Array(Type.String()),
    selectedColorIds: Type.Array(Type.String()),
    selectedArchetypeIds: Type.Array(Type.String()),
    writtenIntention: Type.String(),
    seekerNotes: Nullable(Type.String()),
    status: Type.Enum(DollConfigStatus),
    submittedAt: Nullable(Type.String()),
})

export type DollConfiguration = Static<typeof DollConfiguration>

export const PopulatedDollConfiguration = Type.Composite([
    DollConfiguration,
    Type.Object({
        rocks: Type.Array(DollIngredient),
        herbOils: Type.Array(DollIngredient),
        colors: Type.Array(DollIngredient),
        archetypes: Type.Array(DollIngredient),
    }),
])

export type PopulatedDollConfiguration = Static<typeof PopulatedDollConfiguration>

export const CreateDollIngredientRequest = Type.Object({
    name: Type.String({ minLength: 1 }),
    category: Type.Enum(DollIngredientCategory),
    description: Type.Optional(Type.String()),
    metaphysicalUses: Type.Optional(Type.String()),
    notes: Type.Optional(Type.String()),
    warnings: Type.Optional(Type.Array(Type.String())),
    hexCode: Type.Optional(Type.String()),
    typeOfRock: Type.Optional(Type.Array(Type.String())),
    primaryUses: Type.Optional(Type.Array(Type.String())),
    extraCost: Type.Optional(Type.String()),
    availability: Type.Optional(Type.String()),
    notionId: Type.Optional(Type.String()),
    sortOrder: Type.Optional(Type.Number()),
})

export type CreateDollIngredientRequest = Static<typeof CreateDollIngredientRequest>

export const UpdateDollIngredientRequest = Type.Partial(CreateDollIngredientRequest)
export type UpdateDollIngredientRequest = Static<typeof UpdateDollIngredientRequest>

export const ListDollIngredientsRequest = Type.Object({
    category: Type.Optional(Type.Enum(DollIngredientCategory)),
    cursor: Type.Optional(Type.String()),
    limit: Type.Optional(Type.Number({ minimum: 1, maximum: 100 })),
})

export type ListDollIngredientsRequest = Static<typeof ListDollIngredientsRequest>

export const CreateDollConfigurationRequest = Type.Object({
    name: Type.String({ minLength: 1 }),
    dollLine: Type.Enum(DollLine),
    formula: Type.Enum(DollFormula),
    selectedRockIds: Type.Array(Type.String()),
    selectedHerbOilIds: Type.Array(Type.String()),
    selectedColorIds: Type.Optional(Type.Array(Type.String())),
    selectedArchetypeIds: Type.Optional(Type.Array(Type.String())),
    writtenIntention: Type.String(),
    seekerNotes: Type.Optional(Type.String()),
})

export type CreateDollConfigurationRequest = Static<typeof CreateDollConfigurationRequest>

export const UpdateDollConfigurationRequest = Type.Partial(CreateDollConfigurationRequest)
export type UpdateDollConfigurationRequest = Static<typeof UpdateDollConfigurationRequest>
