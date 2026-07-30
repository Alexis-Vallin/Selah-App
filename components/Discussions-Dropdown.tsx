"use client"

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"
import { ChevronUp } from "lucide-react"
import * as React from "react"

interface DiscussionsDropdownProps {
    title: string
    selectedCount: number
    children?: React.ReactNode
    defaultOpen?: boolean
    className?: string
}

export function DiscussionsDropdown({
    title,
    selectedCount,
    children,
    defaultOpen = true,
    className,
}: DiscussionsDropdownProps) {
    const [open, setOpen] = React.useState(defaultOpen)

    return (
        <Collapsible
            open={open}
            onOpenChange={setOpen}
            className={cn("w-full", className)}
        >
            <CollapsibleTrigger className="flex w-full items-center justify-between py-1 text-left">
                <span className="flex items-center gap-2">
                    <span className="text-sm font-bold uppercase tracking-wider text-slate-700">
                        {title}
                    </span>
                    <ChevronUp
                        className={cn(
                            "h-4 w-4 text-slate-700 transition-transform duration-200",
                            !open && "rotate-180"
                        )}
                        strokeWidth={3}
                    />
                </span>
                <span className="text-sm font-bold uppercase tracking-wide text-emerald-950">
                    {selectedCount} selected
                </span>
            </CollapsibleTrigger>

            <CollapsibleContent className="pt-3">{children}</CollapsibleContent>
        </Collapsible>
    )
}

export default function DiscussionsDropdownDemo() {
    return (
        <div className="max-w-sm p-6">
            <DiscussionsDropdown title="My Focus Areas" selectedCount={4} />
        </div>
    )
}