import { CreateDollConfigurationRequest, PrincipalType, UpdateDollConfigurationRequest } from '@activepieces/shared'
import { FastifyPluginAsyncTypebox, Type } from '@fastify/type-provider-typebox'
import { configurationService } from './configuration.service'

const DEFAULT_LIMIT = 20
const DEFAULT_CURSOR = null

export const configurationController: FastifyPluginAsyncTypebox = async (app) => {
    app.get('/', ListConfigurationsRequest, async (request) => {
        return configurationService.list({
            userId: request.principal.id,
            projectId: request.principal.projectId,
            cursor: request.query.cursor ?? DEFAULT_CURSOR,
            limit: request.query.limit ?? DEFAULT_LIMIT,
        })
    })

    app.get('/:id', GetConfigurationRequest, async (request) => {
        return configurationService.getById({
            id: request.params.id,
            userId: request.principal.id,
            projectId: request.principal.projectId,
        })
    })

    app.post('/', CreateConfigurationRequest, async (request) => {
        return configurationService.create({
            ...request.body,
            userId: request.principal.id,
            projectId: request.principal.projectId,
        })
    })

    app.patch('/:id', UpdateConfigurationRequest, async (request) => {
        return configurationService.update({
            id: request.params.id,
            userId: request.principal.id,
            projectId: request.principal.projectId,
            ...request.body,
        })
    })

    app.post('/:id/submit', SubmitConfigurationRequest, async (request) => {
        return configurationService.submit({
            id: request.params.id,
            userId: request.principal.id,
            projectId: request.principal.projectId,
        })
    })

    app.delete('/:id', DeleteConfigurationRequest, async (request) => {
        await configurationService.delete({
            id: request.params.id,
            userId: request.principal.id,
            projectId: request.principal.projectId,
        })
        return {}
    })
}

const ListConfigurationsRequest = {
    schema: {
        querystring: Type.Object({
            cursor: Type.Optional(Type.String()),
            limit: Type.Optional(Type.Number()),
        }),
    },
    config: {
        allowedPrincipals: [PrincipalType.USER],
    },
}

const GetConfigurationRequest = {
    schema: {
        params: Type.Object({ id: Type.String() }),
    },
    config: {
        allowedPrincipals: [PrincipalType.USER],
    },
}

const CreateConfigurationRequest = {
    schema: {
        body: CreateDollConfigurationRequest,
    },
    config: {
        allowedPrincipals: [PrincipalType.USER],
    },
}

const UpdateConfigurationRequest = {
    schema: {
        params: Type.Object({ id: Type.String() }),
        body: UpdateDollConfigurationRequest,
    },
    config: {
        allowedPrincipals: [PrincipalType.USER],
    },
}

const SubmitConfigurationRequest = {
    schema: {
        params: Type.Object({ id: Type.String() }),
    },
    config: {
        allowedPrincipals: [PrincipalType.USER],
    },
}

const DeleteConfigurationRequest = {
    schema: {
        params: Type.Object({ id: Type.String() }),
    },
    config: {
        allowedPrincipals: [PrincipalType.USER],
    },
}
