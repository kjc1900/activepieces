import { DollLine, DOLL_LINE_DESCRIPTIONS, DOLL_LINE_LABELS } from '@activepieces/shared'
import { cn } from '@/lib/utils'

type Props = {
    value: DollLine | null
    onChange: (line: DollLine) => void
}

const LINE_ICONS: Record<DollLine, string> = {
    [DollLine.YOU_DO_YOU_VOODOO]: '🪆',
    [DollLine.SOUL_STITCH]: '🌀',
    [DollLine.JOJOS_ODDITIES]: '🖤',
}

export function StepDollLine({ value, onChange }: Props) {
    return (
        <div className="space-y-4">
            <div>
                <h2 className="text-xl font-semibold">Choose Your Doll Line</h2>
                <p className="text-sm text-muted-foreground mt-1">
                    Each line holds a different kind of energy. Choose the one that calls to you.
                </p>
            </div>
            <div className="grid gap-4">
                {Object.values(DollLine).map((line) => (
                    <button
                        key={line}
                        type="button"
                        onClick={() => onChange(line)}
                        className={cn(
                            'flex items-start gap-4 rounded-lg border-2 p-5 text-left transition-all hover:border-primary/60',
                            value === line ? 'border-primary bg-primary/5' : 'border-border bg-card',
                        )}
                    >
                        <span className="text-3xl mt-0.5">{LINE_ICONS[line]}</span>
                        <div>
                            <div className="font-semibold text-base">{DOLL_LINE_LABELS[line]}</div>
                            <div className="text-sm text-muted-foreground mt-1">{DOLL_LINE_DESCRIPTIONS[line]}</div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    )
}
