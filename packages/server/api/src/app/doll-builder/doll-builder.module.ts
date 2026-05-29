import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { SystemJobName } from '../helper/system-jobs/common'
import { systemJobHandlers } from '../helper/system-jobs/job-handlers'
import { systemJobsSchedule } from '../helper/system-jobs/system-job'
import { configurationController } from './configuration.controller'
import { ingredientController } from './ingredient.controller'
import { notionSyncService } from './notion-sync.service'

// 0 0 1 * * = first day of every month at midnight
const MONTHLY_CRON = '0 0 1 * *'

export const dollBuilderModule: FastifyPluginAsyncTypebox = async (fastify) => {
    systemJobHandlers.registerJobHandler(SystemJobName.NOTION_INGREDIENT_SYNC, async () => {
        await notionSyncService.syncAll(fastify.log)
    })

    await systemJobsSchedule(fastify.log).upsertJob({
        job: { name: SystemJobName.NOTION_INGREDIENT_SYNC, data: {} },
        schedule: { type: 'repeated', cron: MONTHLY_CRON },
    })

    await fastify.register(ingredientController, { prefix: '/v1/doll-ingredients' })
    await fastify.register(configurationController, { prefix: '/v1/doll-configurations' })
}
