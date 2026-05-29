import { PopulatedDollConfiguration } from '@activepieces/shared'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useToast } from '@/components/ui/use-toast'
import { DollBuilderWizard } from '@/features/doll-builder/components/doll-builder-wizard'
import { DollConfigCard } from '@/features/doll-builder/components/doll-config-card'
import { dollConfigurationsHooks, dollIngredientsHooks } from '@/features/doll-builder/lib/doll-builder-hooks'
import { Plus, RefreshCw, Sparkles } from 'lucide-react'
import { useState } from 'react'

export function DollBuilderPage() {
    const { data, isLoading } = dollConfigurationsHooks.useList()
    const deleteMutation = dollConfigurationsHooks.useDelete()
    const syncMutation = dollIngredientsHooks.useSyncFromNotion()
    const { toast } = useToast()

    const [builderOpen, setBuilderOpen] = useState(false)
    const [editing, setEditing] = useState<PopulatedDollConfiguration | undefined>()

    const configs = data?.data ?? []

    function openNew() {
        setEditing(undefined)
        setBuilderOpen(true)
    }

    function openEdit(config: PopulatedDollConfiguration) {
        setEditing(config)
        setBuilderOpen(true)
    }

    async function handleSync() {
        const result = await syncMutation.mutateAsync()
        const totals = result.results.reduce((acc, r) => ({ upserted: acc.upserted + r.upserted, deleted: acc.deleted + r.deleted }), { upserted: 0, deleted: 0 })
        const errors = result.results.filter((r) => r.error)
        if (errors.length > 0) {
            toast({ title: 'Sync completed with errors', description: errors.map((e) => `${e.category}: ${e.error}`).join('\n'), variant: 'destructive' })
        }
        else {
            toast({ title: 'Synced from Notion', description: `${totals.upserted} updated · ${totals.deleted} removed` })
        }
    }

    async function handleDelete(id: string) {
        await deleteMutation.mutateAsync(id)
        toast({ title: 'Doll recipe deleted' })
    }

    function handleSaved(config: PopulatedDollConfiguration) {
        setEditing(config)
    }

    function handleSubmitted() {
        setBuilderOpen(false)
        setEditing(undefined)
    }

    return (
        <div className="flex flex-col gap-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Sparkles className="w-6 h-6 text-primary" />
                        Custom Doll Builder
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Build your doll recipe — stones, herbs, colors, archetypes, and the intention that holds it all together.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleSync} disabled={syncMutation.isPending} className="gap-1.5">
                        <RefreshCw className={`w-3.5 h-3.5 ${syncMutation.isPending ? 'animate-spin' : ''}`} />
                        {syncMutation.isPending ? 'Syncing…' : 'Sync from Notion'}
                    </Button>
                    <Button onClick={openNew} className="gap-2">
                        <Plus className="w-4 h-4" />
                        New Recipe
                    </Button>
                </div>
            </div>

            {isLoading && (
                <div className="text-sm text-muted-foreground">Loading your recipes...</div>
            )}

            {!isLoading && configs.length === 0 && (
                <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
                    <div className="text-5xl">🪆</div>
                    <div>
                        <h2 className="text-lg font-semibold">No recipes yet</h2>
                        <p className="text-muted-foreground text-sm mt-1 max-w-xs">
                            Start building your first custom doll recipe. Choose your line, pick your stones and herbs, and write your intention.
                        </p>
                    </div>
                    <Button onClick={openNew} className="gap-2">
                        <Plus className="w-4 h-4" />
                        Start Building
                    </Button>
                </div>
            )}

            {configs.length > 0 && (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {configs.map((config) => (
                        <DollConfigCard
                            key={config.id}
                            config={config}
                            onEdit={openEdit}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}

            <Dialog open={builderOpen} onOpenChange={setBuilderOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0">
                    <DialogHeader className="px-6 pt-6 pb-0">
                        <DialogTitle>{editing ? `Editing: ${editing.name}` : 'New Doll Recipe'}</DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="flex-1 px-6 pb-6 overflow-y-auto">
                        <div className="pt-4">
                            <DollBuilderWizard
                                initial={editing}
                                onSaved={handleSaved}
                                onSubmitted={handleSubmitted}
                            />
                        </div>
                    </ScrollArea>
                </DialogContent>
            </Dialog>
        </div>
    )
}
