import { DollIngredient } from '@activepieces/shared'
import { EntitySchema } from 'typeorm'
import { BaseColumnSchemaPart, JSONB_COLUMN_TYPE } from '../database/database-common'

export const DollIngredientEntity = new EntitySchema<DollIngredient>({
    name: 'doll_ingredient',
    columns: {
        ...BaseColumnSchemaPart,
        name: {
            type: String,
            nullable: false,
        },
        category: {
            type: String,
            nullable: false,
        },
        description: {
            type: String,
            nullable: true,
        },
        metaphysicalUses: {
            type: String,
            nullable: true,
        },
        notes: {
            type: String,
            nullable: true,
        },
        warnings: {
            type: JSONB_COLUMN_TYPE,
            nullable: false,
            default: '[]',
        },
        hexCode: {
            type: String,
            nullable: true,
        },
        typeOfRock: {
            type: JSONB_COLUMN_TYPE,
            nullable: false,
            default: '[]',
        },
        primaryUses: {
            type: JSONB_COLUMN_TYPE,
            nullable: false,
            default: '[]',
        },
        extraCost: {
            type: String,
            nullable: true,
        },
        availability: {
            type: String,
            nullable: true,
        },
        notionId: {
            type: String,
            nullable: true,
        },
        sortOrder: {
            type: Number,
            nullable: false,
            default: 0,
        },
    },
    indices: [
        {
            name: 'idx_doll_ingredient_category',
            columns: ['category'],
        },
        {
            name: 'idx_doll_ingredient_name',
            columns: ['name'],
        },
    ],
})
