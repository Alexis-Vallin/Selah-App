import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/**
 * Tag → accent color map.
 * Each tag gets a single accent color used sparingly (dot + label only),
 * keeping the card itself neutral and quiet.
 */
export const TAG_STYLES: Record<string, { dot: string; text: string }> = {
    "Faith Doubts": { dot: "bg-orange-500", text: "text-orange-600" },
    Addiction: { dot: "bg-violet-500", text: "text-violet-600" },
    Relationships: { dot: "bg-pink-500", text: "text-pink-600" },
    "Career Path": { dot: "bg-teal-500", text: "text-teal-600" },
    Parenting: { dot: "bg-sky-500", text: "text-sky-600" },
    "Grief & Loss": { dot: "bg-slate-500", text: "text-slate-600" },
    Evangelism: { dot: "bg-green-500", text: "text-green-600" },
};

export function TagPill({ tag }: { tag: string }) {
    const style = TAG_STYLES[tag] ?? { dot: "bg-neutral-400", text: "text-neutral-600" };
    return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium tracking-wide">
            <span className={cn("h-1.5 w-1.5 rounded-full", style.dot)} />
            <span className={style.text}>{tag}</span>
        </span>
    );
}

/** A single message within a discussion's ongoing conversation. */
export interface Message {
    id: string;
    author: string;
    text: string;
    time: string;
    isOwn?: boolean;
}

/** A discussion thread: the preview shown on the card, plus its full message history. */
export interface Discussion {
    id: string;
    verse: string;
    tag: string;
    time: string;
    author: string;
    snippet: string;
    messages: Message[];
}

interface DiscussionCardProps {
    verse: string;
    tag: string;
    time: string;
    author: string;
    snippet: string;
    /** Called when the card is tapped/clicked — the parent decides what happens (e.g. open ChatThread). */
    onClick?: () => void;
}

/**
 * DiscussionCard
 *
 * Modern, minimal preview card for a scripture discussion feed. Purely
 * presentational — it doesn't know about ChatThread at all. The connection
 * to ChatThread lives one level up: the parent passes `onClick`, and when
 * it fires, the parent opens the corresponding ChatThread. This keeps
 * DiscussionCard reusable anywhere, not just in this one flow.
 */
export function DiscussionCard({
    verse,
    tag,
    time,
    author,
    snippet,
    onClick,
}: DiscussionCardProps) {
    return (
        <Card
            onClick={onClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") onClick?.();
            }}
            className={cn(
                "group cursor-pointer border-neutral-200 bg-white shadow-none transition-colors",
                "hover:border-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-300"
            )}
        >
            <CardContent className="px-5">
                <div className="flex items-start justify-between gap-4">
                    <h3 className="text-[15px] font-semibold text-neutral-900 leading-snug">
                        {verse}
                    </h3>
                    <span className="shrink-0 text-xs text-neutral-400 tabular-nums">
                        {time}
                    </span>
                </div>

                <div className="mt-1">
                    <TagPill tag={tag} />
                </div>

                <div className="mt-2">
                    <p className="text-[13px] text-neutral-800">
                        <span className="font-medium text-neutral-900">{author}</span>
                    </p>
                    <p className="mt-0.5 text-xs text-neutral-500 leading-relaxed line-clamp-2">
                        {snippet}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}