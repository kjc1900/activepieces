import { DollConfigStatus, DOLL_LINE_LABELS, PopulatedDollConfiguration } from '@activepieces/shared'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type Props = {
    config: PopulatedDollConfiguration
    onEdit: (config: PopulatedDollConfiguration) => void
    onDelete: (id: string) => void
}

export function DollConfigCard({ config, onEdit, onDelete }: Props) {
    const isSubmitted = config.status === DollConfigStatus.SUBMITTED

    return (
        <div className={cn('rounded-lg border bg-card p-5 flex flex-col gap-3', isSubmitted ? 'opacity-80' : '')}>
            <div className="flex items-start justify-between gap-3">
                <div>
                    <h3 className="font-semibold">{config.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{DOLL_LINE_LABELS[config.dollLine]}</p>
                </div>
                <Badge variant={isSubmitted ? 'default' : 'outline'}>
                    {isSubmitted ? 'Submitted' : 'Draft'}
                </Badge>
            </div>

            <div className="text-xs text-muted-foreground space-y-1">
                {config.rocks.length > 0 && (
                    <p>💎 {config.rocks.map((r) => r.name).join(', ')}</p>
                )}
                {config.herbOils.length > 0 && (
                    <p>🌿 {config.herbOils.map((h) => h.name).join(', ')}</p>
                )}
                {config.colors.length > 0 && (
                    <p>🎨 {config.colors.map((c) => c.name).join(', ')}</p>
                )}
                {config.archetypes.length > 0 && (
                    <p>🌀 {config.archetypes.map((a) => a.name).join(', ')}</p>
                )}
            </div>

            {config.writtenIntention && (
                <p className="text-xs italic text-muted-foreground line-clamp-2 border-t pt-2">
                    "{config.writtenIntention}"
                </p>
            )}

            {!isSubmitted && (
                <div className="flex gap-2 pt-1">
                    <Button size="sm" variant="outline" onClick={() => onEdit(config)}>
                        Edit
                    </Button>
                    <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => onDelete(config.id)}>
                        Delete
                    </Button>
                </div>
            )}

            {isSubmitted && config.submittedAt && (
                <p className="text-xs text-muted-foreground pt-1 border-t">
                    Submitted {new Date(config.submittedAt).toLocaleDateString()}
                </p>
            )}
        </div>
    )
}
