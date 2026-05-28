import { api } from '@/lib/api'
import {
    CreateDollConfigurationRequest,
    CreateDollIngredientRequest,
    DollIngredient,
    DollIngredientCategory,
    PopulatedDollConfiguration,
    SeekPage,
    UpdateDollConfigurationRequest,
    UpdateDollIngredientRequest,
} from '@activepieces/shared'

export const dollIngredientsApi = {
    async list(params?: { category?: DollIngredientCategory; cursor?: string; limit?: number }) {
        return api.get<SeekPage<DollIngredient>>('/v1/doll-ingredients', params)
    },

    async listAll(category?: DollIngredientCategory) {
        return api.get<DollIngredient[]>('/v1/doll-ingredients/all', category ? { category } : undefined)
    },

    async get(id: string) {
        return api.get<DollIngredient>(`/v1/doll-ingredients/${id}`)
    },

    async create(body: CreateDollIngredientRequest) {
        return api.post<DollIngredient>('/v1/doll-ingredients', body)
    },

    async update(id: string, body: UpdateDollIngredientRequest) {
        return api.patch<DollIngredient>(`/v1/doll-ingredients/${id}`, body)
    },

    async delete(id: string) {
        return api.delete<void>(`/v1/doll-ingredients/${id}`)
    },
}

export const dollConfigurationsApi = {
    async list(params?: { cursor?: string; limit?: number }) {
        return api.get<SeekPage<PopulatedDollConfiguration>>('/v1/doll-configurations', params)
    },

    async get(id: string) {
        return api.get<PopulatedDollConfiguration>(`/v1/doll-configurations/${id}`)
    },

    async create(body: CreateDollConfigurationRequest) {
        return api.post<PopulatedDollConfiguration>('/v1/doll-configurations', body)
    },

    async update(id: string, body: UpdateDollConfigurationRequest) {
        return api.patch<PopulatedDollConfiguration>(`/v1/doll-configurations/${id}`, body)
    },

    async submit(id: string) {
        return api.post<PopulatedDollConfiguration>(`/v1/doll-configurations/${id}/submit`, {})
    },

    async delete(id: string) {
        return api.delete<void>(`/v1/doll-configurations/${id}`)
    },
}
