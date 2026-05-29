import { IngredientCategory } from '@/types'

const NOTION_VERSION = '2022-06-28'

const DB_IDS: Record<IngredientCategory, string> = {
  ROCK: '2545a871-3df2-817f-a006-000b68789d0e',
  HERB_OIL: '2515a871-3df2-813b-856e-000be51afa7d',
  COLOR: '2525a871-3df2-80a3-9973-000b3de8301a',
  ARCHETYPE: '2515a871-3df2-8052-8b00-000b0dee85e6',
}

interface NotionPage {
  id: string
  properties: Record<string, NotionProperty>
  archived: boolean
}

type NotionProperty =
  | { type: 'title'; title: Array<{ plain_text: string }> }
  | { type: 'rich_text'; rich_text: Array<{ plain_text: string }> }
  | { type: 'checkbox'; checkbox: boolean }
  | { type: 'select'; select: { name: string } | null }
  | { type: 'multi_select'; multi_select: Array<{ name: string }> }
  | { type: 'url'; url: string | null }
  | { type: 'number'; number: number | null }
  | { type: 'formula'; formula: { string?: string; number?: number } }

function getText(prop: NotionProperty | undefined): string {
  if (!prop) return ''
  if (prop.type === 'title') return prop.title.map((t) => t.plain_text).join('')
  if (prop.type === 'rich_text') return prop.rich_text.map((t) => t.plain_text).join('')
  if (prop.type === 'select') return prop.select?.name ?? ''
  if (prop.type === 'url') return prop.url ?? ''
  if (prop.type === 'formula') return prop.formula.string ?? String(prop.formula.number ?? '')
  return ''
}

function getBoolean(prop: NotionProperty | undefined): boolean {
  if (!prop || prop.type !== 'checkbox') return false
  return prop.checkbox
}

async function queryDatabase(dbId: string, token: string): Promise<NotionPage[]> {
  const pages: NotionPage[] = []
  let cursor: string | undefined

  do {
    const body: Record<string, unknown> = { page_size: 100 }
    if (cursor) body.start_cursor = cursor

    const res = await fetch(`https://api.notion.com/v1/databases/${dbId}/query`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Notion-Version': NOTION_VERSION,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const err = await res.text()
      throw new Error(`Notion API error ${res.status}: ${err}`)
    }

    const data = await res.json() as { results: NotionPage[]; has_more: boolean; next_cursor: string | null }
    pages.push(...data.results.filter((p) => !p.archived))
    cursor = data.has_more && data.next_cursor ? data.next_cursor : undefined
  } while (cursor)

  return pages
}

export interface SyncedIngredient {
  notion_id: string
  category: IngredientCategory
  name: string
  description: string | null
  extra_data: Record<string, unknown>
}

function mapRock(page: NotionPage): SyncedIngredient {
  const p = page.properties
  return {
    notion_id: page.id,
    category: 'ROCK',
    name: getText(p['The Rock'] ?? p['Name'] ?? p['Rock']),
    description: getText(p['Rock Definition']) || null,
    extra_data: {
      metaphysical_uses: getText(p['Rock Metaphysical Uses']),
      extra_cost: getBoolean(p['Extra Cost']),
      type: getText(p['Type of Rock']),
    },
  }
}

function mapHerb(page: NotionPage): SyncedIngredient {
  const p = page.properties
  return {
    notion_id: page.id,
    category: 'HERB_OIL',
    name: getText(p['Herbs'] ?? p['Name'] ?? p['Herb']),
    description: getText(p['Herb Metaphysical Uses']) || null,
    extra_data: {
      ho_notes: getText(p['H/O Notes']),
      primary_uses: getText(p['Primary Uses']),
      warnings: getText(p['Herb/Oil Warnings']),
    },
  }
}

function mapColor(page: NotionPage): SyncedIngredient {
  const p = page.properties
  return {
    notion_id: page.id,
    category: 'COLOR',
    name: getText(p['Color'] ?? p['Name']),
    description: getText(p['Color Summary']) || getText(p['Color Core']) || null,
    extra_data: {
      hex: getText(p['Hex Code']),
      core: getText(p['Color Core']),
    },
  }
}

function mapArchetype(page: NotionPage): SyncedIngredient {
  const p = page.properties
  return {
    notion_id: page.id,
    category: 'ARCHETYPE',
    name: getText(p['Archetype'] ?? p['Name']),
    description: getText(p['Archetype Short Description']) || null,
    extra_data: {
      definition: getText(p['Definition of the Archetype']),
    },
  }
}

const MAPPERS: Record<IngredientCategory, (page: NotionPage) => SyncedIngredient> = {
  ROCK: mapRock,
  HERB_OIL: mapHerb,
  COLOR: mapColor,
  ARCHETYPE: mapArchetype,
}

export async function syncCategory(
  category: IngredientCategory,
  token: string,
): Promise<{ category: IngredientCategory; ingredients: SyncedIngredient[]; error?: string }> {
  try {
    const pages = await queryDatabase(DB_IDS[category], token)
    const ingredients = pages.map(MAPPERS[category]).filter((i) => i.name.length > 0)
    return { category, ingredients }
  } catch (err) {
    return { category, ingredients: [], error: String(err) }
  }
}

export async function syncAll(token: string) {
  const categories: IngredientCategory[] = ['ROCK', 'HERB_OIL', 'COLOR', 'ARCHETYPE']
  return Promise.all(categories.map((cat) => syncCategory(cat, token)))
}
