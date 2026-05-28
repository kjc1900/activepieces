import { DollConfiguration } from '@activepieces/shared'
import { EntitySchema } from 'typeorm'
import { ApIdSchema, BaseColumnSchemaPart, JSONB_COLUMN_TYPE } from '../database/database-common'

export const DollConfigurationEntity = new EntitySchema<DollConfiguration>({
    name: 'doll_configuration',
    columns: {
        ...BaseColumnSchemaPart,
        userId: {
            ...ApIdSchema,
            nullable: false,
        },
        projectId: {
            ...ApIdSchema,
            nullable: false,
        },
        name: {
            type: String,
            nullable: false,
        },
        dollLine: {
            type: String,
            nullable: false,
        },
        formula: {
            type: String,
            nullable: false,
        },
        selectedRockIds: {
            type: JSONB_COLUMN_TYPE,
            nullable: false,
            default: '[]',
        },
        selectedHerbOilIds: {
            type: JSONB_COLUMN_TYPE,
            nullable: false,
            default: '[]',
        },
        selectedColorIds: {
            type: JSONB_COLUMN_TYPE,
            nullable: false,
            default: '[]',
        },
        selectedArchetypeIds: {
            type: JSONB_COLUMN_TYPE,
            nullable: false,
            default: '[]',
        },
        writtenIntention: {
            type: String,
            nullable: false,
            default: '',
        },
        seekerNotes: {
            type: String,
            nullable: true,
        },
        status: {
            type: String,
            nullable: false,
        },
        submittedAt: {
            type: String,
            nullable: true,
        },
    },
    indices: [
        {
            name: 'idx_doll_config_project_id',
            columns: ['projectId'],
        },
        {
            name: 'idx_doll_config_user_id',
            columns: ['userId'],
        },
    ],
})
