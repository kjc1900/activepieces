import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { DollIngredientCategory } from '@activepieces/shared'
import { dollConfigurationsApi, dollIngredientsApi } from './doll-builder-api'

const INGREDIENTS_KEY = 'doll-ingredients'
const CONFIGURATIONS_KEY = 'doll-configurations'

export const dollIngredientsHooks = {
    useAll(category?: DollIngredientCategory) {
        return useQuery({
            queryKey: [INGREDIENTS_KEY, 'all', category],
            queryFn: () => dollIngredientsApi.listAll(category),
        })
    },

    useCreate() {
        const queryClient = useQueryClient()
        return useMutation({
            mutationFn: dollIngredientsApi.create,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: [INGREDIENTS_KEY] })
            },
        })
    },

    useUpdate() {
        const queryClient = useQueryClient()
        return useMutation({
            mutationFn: ({ id, ...body }: { id: string } & Parameters<typeof dollIngredientsApi.update>[1]) =>
                dollIngredientsApi.update(id, body),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: [INGREDIENTS_KEY] })
            },
        })
    },

    useDelete() {
        const queryClient = useQueryClient()
        return useMutation({
            mutationFn: dollIngredientsApi.delete,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: [INGREDIENTS_KEY] })
            },
        })
    },

    useSyncFromNotion() {
        const queryClient = useQueryClient()
        return useMutation({
            mutationFn: dollIngredientsApi.syncFromNotion,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: [INGREDIENTS_KEY] })
            },
        })
    },
}

export const dollConfigurationsHooks = {
    useList() {
        return useQuery({
            queryKey: [CONFIGURATIONS_KEY, 'list'],
            queryFn: () => dollConfigurationsApi.list(),
        })
    },

    useGet(id: string | undefined) {
        return useQuery({
            queryKey: [CONFIGURATIONS_KEY, id],
            queryFn: () => dollConfigurationsApi.get(id!),
            enabled: !!id,
        })
    },

    useCreate() {
        const queryClient = useQueryClient()
        return useMutation({
            mutationFn: dollConfigurationsApi.create,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: [CONFIGURATIONS_KEY] })
            },
        })
    },

    useUpdate() {
        const queryClient = useQueryClient()
        return useMutation({
            mutationFn: ({ id, ...body }: { id: string } & Parameters<typeof dollConfigurationsApi.update>[1]) =>
                dollConfigurationsApi.update(id, body),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: [CONFIGURATIONS_KEY] })
            },
        })
    },

    useSubmit() {
        const queryClient = useQueryClient()
        return useMutation({
            mutationFn: dollConfigurationsApi.submit,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: [CONFIGURATIONS_KEY] })
            },
        })
    },

    useDelete() {
        const queryClient = useQueryClient()
        return useMutation({
            mutationFn: dollConfigurationsApi.delete,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: [CONFIGURATIONS_KEY] })
            },
        })
    },
}
