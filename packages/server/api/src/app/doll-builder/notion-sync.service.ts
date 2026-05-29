import { apId, DollIngredientCategory, isNil } from '@activepieces/shared'
import axios from 'axios'
import { FastifyBaseLogger } from 'fastify'
import { AppSystemProp } from '@activepieces/server-shared'
import { repoFactory } from '../core/db/repo-factory'
import { system } from '../helper/system/system'
import { DollIngredientEntity } from './ingredient.entity'

// Notion data-source collection IDs (the UUID portion after "collection://")
const NOTION_DB_IDS = {
    [DollIngredientCategory.ROCK]: '2545a871-3df2-817f-a006-000b68789d0e',
    [DollIngredientCategory.HERB_OIL]: '2515a871-3df2-813b-856e-000be51afa7d',
    [DollIngredientCategory.COLOR]: '2525a871-3df2-80a3-9973-000b3de8301a',
    [DollIngredientCategory.ARCHETYPE]: '2515a871-3df2-8052-8b00-000b0dee85e6',
}

function getText(prop: NotionProperty | undefined): string | null {
    if (!prop) return null
    if (prop.type === 'title') return prop.title?.map((t) => t.plain_text).join('') || null
    if (prop.type === 'rich_text') return prop.rich_text?.map((t) => t.plain_text).join('') || null
    return null
}

function getSelect(prop: NotionProperty | undefined): string | null {
    if (!prop || prop.type !== 'select') return null
    return prop.select?.name ?? null
}

function getMultiSelect(prop: NotionProperty | undefined): string[] {
    if (!prop || prop.type !== 'multi_select') return []
    return prop.multi_select?.map((s) => s.name) ?? []
}

type NotionTextContent = { plain_text: string }
type NotionProperty = {
    type: string
    title?: NotionTextContent[]
    rich_text?: NotionTextContent[]
    select?: { name: string }
    multi_select?: { name: string }[]
}

type NotionPage = {
    id: string
    properties: Record<string, NotionProperty>
}

async function queryAllPages(apiKey: string, databaseId: string): Promise<NotionPage[]> {
    const pages: NotionPage[] = []
    let cursor: string | undefined

    do {
        const response = await axios.post<{ results: NotionPage[]; has_more: boolean; next_cursor: string | null }>(
            `https://api.notion.com/v1/databases/${databaseId}/query`,
            cursor ? { start_cursor: cursor } : {},
            {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    'Notion-Version': '2022-06-28',
                    'Content-Type': 'application/json',
                },
                timeout: 30_000,
            },
        )
        pages.push(...response.data.results)
        cursor = response.data.has_more && response.data.next_cursor ? response.data.next_cursor : undefined
    } while (cursor)

    return pages
}

function mapRock(page: NotionPage, sortOrder: number) {
    const p = page.properties
    return {
        name: getText(p['The Rock']) ?? 'Unknown',
        category: DollIngredientCategory.ROCK,
        description: getText(p['Rock Definition']),
        metaphysicalUses: getText(p['Rock Metaphysical Uses']),
        notes: getText(p['Rock General Notes']),
        warnings: getText(p['Warnings (not incl. lapidaries)'])?.split(/[,;]/).map((w) => w.trim()).filter(Boolean) ?? [],
        hexCode: null,
        typeOfRock: getMultiSelect(p['Type of Rock']),
        primaryUses: [],
        extraCost: getSelect(p['Extra Cost']),
        availability: null,
        notionId: page.id,
        sortOrder,
    }
}

function mapHerb(page: NotionPage, sortOrder: number) {
    const p = page.properties
    return {
        name: getText(p['Herbs']) ?? 'Unknown',
        category: DollIngredientCategory.HERB_OIL,
        description: getText(p['Scientific Name']),
        metaphysicalUses: getText(p['Herb Metaphysical Uses']),
        notes: getText(p['H/O Notes']),
        warnings: getMultiSelect(p['Herb/Oil Warnings']),
        hexCode: null,
        typeOfRock: [],
        primaryUses: getMultiSelect(p['Primary Uses']),
        extraCost: null,
        availability: getSelect(p['Availability']),
        notionId: page.id,
        sortOrder,
    }
}

function mapColor(page: NotionPage, sortOrder: number) {
    const p = page.properties
    return {
        name: getText(p['Color']) ?? 'Unknown',
        category: DollIngredientCategory.COLOR,
        description: getText(p['Color Core']),
        metaphysicalUses: getText(p['Color Summary']),
        notes: getText(p['Color Meaning Defined']),
        warnings: [],
        hexCode: getText(p['Hex Code']),
        typeOfRock: [],
        primaryUses: [],
        extraCost: null,
        availability: null,
        notionId: page.id,
        sortOrder,
    }
}

function mapArchetype(page: NotionPage, sortOrder: number) {
    const p = page.properties
    return {
        name: getText(p['Archetype']) ?? 'Unknown',
        category: DollIngredientCategory.ARCHETYPE,
        description: getText(p['Archetype Short Description']),
        metaphysicalUses: getText(p['Definition of the Archetype']),
        notes: getText(p['Virtue Analysis']),
        warnings: [],
        hexCode: null,
        typeOfRock: [],
        primaryUses: [],
        extraCost: null,
        availability: null,
        notionId: page.id,
        sortOrder,
    }
}

const MAPPERS: Record<DollIngredientCategory, (page: NotionPage, sortOrder: number) => object> = {
    [DollIngredientCategory.ROCK]: mapRock,
    [DollIngredientCategory.HERB_OIL]: mapHerb,
    [DollIngredientCategory.COLOR]: mapColor,
    [DollIngredientCategory.ARCHETYPE]: mapArchetype,
}

const ingredientRepo = repoFactory(DollIngredientEntity)

export type SyncResult = {
    category: DollIngredientCategory
    upserted: number
    deleted: number
    error?: string
}

export const notionSyncService = {
    async syncAll(log: FastifyBaseLogger): Promise<SyncResult[]> {
        const apiKey = system.get(AppSystemProp.NOTION_API_KEY)
        if (isNil(apiKey) || apiKey.trim() === '') {
            log.warn('NOTION_API_KEY is not set — skipping ingredient sync')
            return []
        }

        const results: SyncResult[] = []

        for (const category of Object.values(DollIngredientCategory)) {
            results.push(await this.syncCategory(apiKey, category, log))
        }

        return results
    },

    async syncCategory(apiKey: string, category: DollIngredientCategory, log: FastifyBaseLogger): Promise<SyncResult> {
        const databaseId = NOTION_DB_IDS[category]
        const mapper = MAPPERS[category]

        try {
            const pages = await queryAllPages(apiKey, databaseId)
            const notionIds = pages.map((p) => p.id)

            let upserted = 0
            for (let i = 0; i < pages.length; i++) {
                const mapped = mapper(pages[i], i) as Record<string, unknown>
                if (!mapped['name'] || (mapped['name'] as string).trim() === 'Unknown') continue

                const existing = await ingredientRepo().findOneBy({ notionId: pages[i].id })
                if (existing) {
                    await ingredientRepo().update({ id: existing.id }, { ...mapped, sortOrder: i })
                }
                else {
                    await ingredientRepo().save({ id: apId(), ...mapped })
                }
                upserted++
            }

            // Remove entries that no longer exist in Notion
            const all = await ingredientRepo().findBy({ category })
            const toDelete = all.filter((e) => e.notionId && !notionIds.includes(e.notionId))
            let deleted = 0
            for (const entry of toDelete) {
                await ingredientRepo().delete({ id: entry.id })
                deleted++
            }

            log.info({ category, upserted, deleted }, 'Notion ingredient sync complete')
            return { category, upserted, deleted }
        }
        catch (err) {
            const error = err instanceof Error ? err.message : String(err)
            log.error({ category, error }, 'Notion ingredient sync failed')
            return { category, upserted: 0, deleted: 0, error }
        }
    },
}
