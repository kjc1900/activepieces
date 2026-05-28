import { ActivepiecesError, apId, CreateDollIngredientRequest, DollIngredient, DollIngredientCategory, ErrorCode, SeekPage, UpdateDollIngredientRequest } from '@activepieces/shared'
import { In } from 'typeorm'
import { repoFactory } from '../core/db/repo-factory'
import { buildPaginator } from '../helper/pagination/build-paginator'
import { paginationHelper } from '../helper/pagination/pagination-utils'
import { Order } from '../helper/pagination/paginator'
import { DollIngredientEntity } from './ingredient.entity'

const ingredientRepo = repoFactory(DollIngredientEntity)

export const ingredientService = {
    async create(params: CreateDollIngredientRequest): Promise<DollIngredient> {
        return ingredientRepo().save({
            id: apId(),
            warnings: params.warnings ?? [],
            typeOfRock: params.typeOfRock ?? [],
            primaryUses: params.primaryUses ?? [],
            sortOrder: params.sortOrder ?? 0,
            description: params.description ?? null,
            metaphysicalUses: params.metaphysicalUses ?? null,
            notes: params.notes ?? null,
            hexCode: params.hexCode ?? null,
            extraCost: params.extraCost ?? null,
            availability: params.availability ?? null,
            notionId: params.notionId ?? null,
            ...params,
        })
    },

    async getById(id: string): Promise<DollIngredient> {
        const ingredient = await ingredientRepo().findOneBy({ id })
        if (!ingredient) {
            throw new ActivepiecesError({
                code: ErrorCode.ENTITY_NOT_FOUND,
                params: { entityType: 'doll_ingredient', entityId: id },
            })
        }
        return ingredient
    },

    async getManyByIds(ids: string[]): Promise<DollIngredient[]> {
        if (ids.length === 0) {
            return []
        }
        return ingredientRepo().findBy({ id: In(ids) })
    },

    async update(id: string, params: UpdateDollIngredientRequest): Promise<DollIngredient> {
        await ingredientRepo().update({ id }, params)
        return this.getById(id)
    },

    async delete(id: string): Promise<void> {
        await ingredientRepo().delete({ id })
    },

    async list(params: {
        category?: DollIngredientCategory
        cursor: string | null
        limit: number
    }): Promise<SeekPage<DollIngredient>> {
        const decodedCursor = paginationHelper.decodeCursor(params.cursor)
        const paginator = buildPaginator<DollIngredient>({
            entity: DollIngredientEntity,
            query: {
                limit: params.limit,
                order: Order.ASC,
                afterCursor: decodedCursor.nextPageCursor,
                beforeCursor: decodedCursor.previousPageCursor,
            },
        })
        const queryBuilder = ingredientRepo().createQueryBuilder('doll_ingredient')
        if (params.category) {
            queryBuilder.where('doll_ingredient.category = :category', { category: params.category })
        }
        queryBuilder.orderBy('doll_ingredient.sortOrder', 'ASC').addOrderBy('doll_ingredient.name', 'ASC')
        const { data, cursor } = await paginator.paginate(queryBuilder)
        return paginationHelper.createPage<DollIngredient>(data, cursor)
    },

    async listAll(category?: DollIngredientCategory): Promise<DollIngredient[]> {
        const query = ingredientRepo().createQueryBuilder('doll_ingredient')
        if (category) {
            query.where('doll_ingredient.category = :category', { category })
        }
        return query.orderBy('doll_ingredient.sortOrder', 'ASC').addOrderBy('doll_ingredient.name', 'ASC').getMany()
    },
}
