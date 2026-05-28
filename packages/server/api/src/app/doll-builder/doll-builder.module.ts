import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { configurationController } from './configuration.controller'
import { ingredientController } from './ingredient.controller'

export const dollBuilderModule: FastifyPluginAsyncTypebox = async (fastify) => {
    await fastify.register(ingredientController, { prefix: '/v1/doll-ingredients' })
    await fastify.register(configurationController, { prefix: '/v1/doll-configurations' })
}
