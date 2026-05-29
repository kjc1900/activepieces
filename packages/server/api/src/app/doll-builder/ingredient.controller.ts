import { CreateDollIngredientRequest, DollIngredientCategory, PrincipalType, UpdateDollIngredientRequest } from '@activepieces/shared'
import { FastifyPluginAsyncTypebox, Type } from '@fastify/type-provider-typebox'
import { ingredientService } from './ingredient.service'
import { notionSyncService } from './notion-sync.service'

const DEFAULT_LIMIT = 50
const DEFAULT_CURSOR = null

export const ingredientController: FastifyPluginAsyncTypebox = async (app) => {
    app.get('/', ListIngredientsRequest, async (request) => {
        return ingredientService.list({
            category: request.query.category,
            cursor: request.query.cursor ?? DEFAULT_CURSOR,
            limit: request.query.limit ?? DEFAULT_LIMIT,
        })
    })

    app.get('/all', AllIngredientsRequest, async (request) => {
        return ingredientService.listAll(request.query.category)
    })

    app.get('/:id', GetIngredientRequest, async (request) => {
        return ingredientService.getById(request.params.id)
    })

    app.post('/', CreateIngredientRequest, async (request) => {
        return ingredientService.create(request.body)
    })

    app.patch('/:id', UpdateIngredientRequest, async (request) => {
        return ingredientService.update(request.params.id, request.body)
    })

    app.delete('/:id', DeleteIngredientRequest, async (request) => {
        await ingredientService.delete(request.params.id)
        return {}
    })

    app.post('/sync', SyncFromNotionRequest, async (request) => {
        const results = await notionSyncService.syncAll(request.log)
        return { results }
    })
}

const ListIngredientsRequest = {
    schema: {
        querystring: Type.Object({
            category: Type.Optional(Type.Enum(DollIngredientCategory)),
            cursor: Type.Optional(Type.String()),
            limit: Type.Optional(Type.Number()),
        }),
    },
    config: {
        allowedPrincipals: [PrincipalType.USER, PrincipalType.SERVICE],
    },
}

const AllIngredientsRequest = {
    schema: {
        querystring: Type.Object({
            category: Type.Optional(Type.Enum(DollIngredientCategory)),
        }),
    },
    config: {
        allowedPrincipals: [PrincipalType.USER, PrincipalType.SERVICE],
    },
}

const GetIngredientRequest = {
    schema: {
        params: Type.Object({
            id: Type.String(),
        }),
    },
    config: {
        allowedPrincipals: [PrincipalType.USER, PrincipalType.SERVICE],
    },
}

const CreateIngredientRequest = {
    schema: {
        body: CreateDollIngredientRequest,
    },
    config: {
        allowedPrincipals: [PrincipalType.USER, PrincipalType.SERVICE],
    },
}

const UpdateIngredientRequest = {
    schema: {
        params: Type.Object({ id: Type.String() }),
        body: UpdateDollIngredientRequest,
    },
    config: {
        allowedPrincipals: [PrincipalType.USER, PrincipalType.SERVICE],
    },
}

const DeleteIngredientRequest = {
    schema: {
        params: Type.Object({ id: Type.String() }),
    },
    config: {
        allowedPrincipals: [PrincipalType.USER, PrincipalType.SERVICE],
    },
}

const SyncFromNotionRequest = {
    schema: {},
    config: {
        allowedPrincipals: [PrincipalType.USER, PrincipalType.SERVICE],
    },
}
