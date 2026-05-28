import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'

type Props = {
    name: string
    intention: string
    seekerNotes: string
    onNameChange: (v: string) => void
    onIntentionChange: (v: string) => void
    onNotesChange: (v: string) => void
}

export function StepIntentions({ name, intention, seekerNotes, onNameChange, onIntentionChange, onNotesChange }: Props) {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold">Name Your Doll & Write Your Intention</h2>
                <p className="text-sm text-muted-foreground mt-1">
                    Give your doll a name, then speak directly to what you want it to hold.
                </p>
            </div>

            <div className="space-y-2">
                <Label htmlFor="doll-name">Doll Name</Label>
                <Input
                    id="doll-name"
                    placeholder="e.g. My Shadow Keeper, The Protector, Brave Heart..."
                    value={name}
                    onChange={(e) => onNameChange(e.target.value)}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="intention">Written Intention</Label>
                <Textarea
                    id="intention"
                    placeholder="Write your intention here. Be as specific as you feel called to be — what do you want this doll to hold, witness, or anchor for you?"
                    value={intention}
                    onChange={(e) => onIntentionChange(e.target.value)}
                    className="min-h-[140px] resize-none"
                />
                <p className="text-xs text-muted-foreground">
                    This becomes part of the doll's record and is seen only by Kellie Jo.
                </p>
            </div>

            <div className="space-y-2">
                <Label htmlFor="notes">Notes for Kellie Jo <span className="text-muted-foreground">(optional)</span></Label>
                <Textarea
                    id="notes"
                    placeholder="Any additional context, backstory, sensitivities, or requests..."
                    value={seekerNotes}
                    onChange={(e) => onNotesChange(e.target.value)}
                    className="min-h-[100px] resize-none"
                />
            </div>
        </div>
    )
}
