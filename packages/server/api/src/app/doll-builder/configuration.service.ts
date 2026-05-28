import { ActivepiecesError, apId, CreateDollConfigurationRequest, DollConfigStatus, DollConfiguration, DollIngredient, ErrorCode, PopulatedDollConfiguration, SeekPage, UpdateDollConfigurationRequest } from '@activepieces/shared'
import { repoFactory } from '../core/db/repo-factory'
import { buildPaginator } from '../helper/pagination/build-paginator'
import { paginationHelper } from '../helper/pagination/pagination-utils'
import { Order } from '../helper/pagination/paginator'
import { DollConfigurationEntity } from './configuration.entity'
import { ingredientService } from './ingredient.service'

const configRepo = repoFactory(DollConfigurationEntity)

async function populate(config: DollConfiguration): Promise<PopulatedDollConfiguration> {
    const [rocks, herbOils, colors, archetypes] = await Promise.all([
        ingredientService.getManyByIds(config.selectedRockIds),
        ingredientService.getManyByIds(config.selectedHerbOilIds),
        ingredientService.getManyByIds(config.selectedColorIds),
        ingredientService.getManyByIds(config.selectedArchetypeIds),
    ])
    const reorder = (ids: string[], items: DollIngredient[]) => {
        const map = Object.fromEntries(items.map((i) => [i.id, i]))
        return ids.map((id) => map[id]).filter(Boolean) as DollIngredient[]
    }
    return {
        ...config,
        rocks: reorder(config.selectedRockIds, rocks),
        herbOils: reorder(config.selectedHerbOilIds, herbOils),
        colors: reorder(config.selectedColorIds, colors),
        archetypes: reorder(config.selectedArchetypeIds, archetypes),
    }
}

export const configurationService = {
    async create(params: CreateDollConfigurationRequest & { userId: string; projectId: string }): Promise<PopulatedDollConfiguration> {
        const config = await configRepo().save({
            id: apId(),
            status: DollConfigStatus.DRAFT,
            submittedAt: null,
            selectedColorIds: params.selectedColorIds ?? [],
            selectedArchetypeIds: params.selectedArchetypeIds ?? [],
            seekerNotes: params.seekerNotes ?? null,
            ...params,
        })
        return populate(config)
    },

    async getById(params: { id: string; userId: string; projectId: string }): Promise<PopulatedDollConfiguration> {
        const config = await configRepo().findOneBy({
            id: params.id,
            userId: params.userId,
            projectId: params.projectId,
        })
        if (!config) {
            throw new ActivepiecesError({
                code: ErrorCode.ENTITY_NOT_FOUND,
                params: { entityType: 'doll_configuration', entityId: params.id },
            })
        }
        return populate(config)
    },

    async update(params: { id: string; userId: string; projectId: string } & UpdateDollConfigurationRequest): Promise<PopulatedDollConfiguration> {
        const { id, userId, projectId, ...updates } = params
        await configRepo().update({ id, userId, projectId }, updates)
        return this.getById({ id, userId, projectId })
    },

    async submit(params: { id: string; userId: string; projectId: string }): Promise<PopulatedDollConfiguration> {
        await configRepo().update(
            { id: params.id, userId: params.userId, projectId: params.projectId },
            { status: DollConfigStatus.SUBMITTED, submittedAt: new Date().toISOString() },
        )
        return this.getById(params)
    },

    async delete(params: { id: string; userId: string; projectId: string }): Promise<void> {
        await configRepo().delete({ id: params.id, userId: params.userId, projectId: params.projectId })
    },

    async list(params: { userId: string; projectId: string; cursor: string | null; limit: number }): Promise<SeekPage<PopulatedDollConfiguration>> {
        const decodedCursor = paginationHelper.decodeCursor(params.cursor)
        const paginator = buildPaginator<DollConfiguration>({
            entity: DollConfigurationEntity,
            query: {
                limit: params.limit,
                order: Order.DESC,
                afterCursor: decodedCursor.nextPageCursor,
                beforeCursor: decodedCursor.previousPageCursor,
            },
        })
        const queryBuilder = configRepo()
            .createQueryBuilder('doll_configuration')
            .where('doll_configuration.userId = :userId', { userId: params.userId })
            .andWhere('doll_configuration.projectId = :projectId', { projectId: params.projectId })
        const { data, cursor } = await paginator.paginate(queryBuilder)
        const populated = await Promise.all(data.map(populate))
        return paginationHelper.createPage<PopulatedDollConfiguration>(populated, cursor)
    },
}
