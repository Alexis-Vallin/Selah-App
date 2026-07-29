import { Button } from "@/components/ShadCN Components/button"
import { cn } from "@/lib/utils"
import { Hash } from "lucide-react"
import React from "react"

/**
 * TagPillButton
 *
 * Pill-shaped tag button, composed from the shadcn/ui `Button` primitive
 * and styled directly with Tailwind CSS utility classes.
 */

interface TagPillButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    label: string
    isSelected?: boolean
}

export function TagPillButton({
    label,
    isSelected = false,
    className,
    ...props
}: TagPillButtonProps) {
    return (
        <Button
            className={cn(
                "h-8 rounded-full px-4 gap-1.5",
                "text-sm font-bold tracking-tight transition-colors",
                isSelected
                    ? "bg-emerald-950 text-white hover:bg-emerald-800"
                    : "bg-transparent border border-emerald-950 text-emerald-950 hover:bg-emerald-50",
                className
            )}
            {...props}
        >
            <Hash className="h-3.5 w-3.5 shrink-0" strokeWidth={3} />
            {label}
        </Button>
    )
}


/* button in action

export default function TagPillButtonDemo() {
    return (
        <div className="flex items-center justify-center p-10">
            <TagPillButton label="Faith Doubts" />
        </div>
    )
}

*/