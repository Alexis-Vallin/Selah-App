import { cn } from '@/lib/utils';
import { verseToUsfm } from '@/lib/verseToUsfm';
import { BibleCard } from '@youversion/platform-react-ui';
import { ArrowLeft, BookOpen, Send, Star } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { UserProfile } from '../types';
import { Discussion, Message, TagPill } from './Discussion-Card';

/* ─────────────────────────────────────────────
   Helpers
   ───────────────────────────────────────────── */

/** Extract up to two initials from a full name. */
function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

/* ─────────────────────────────────────────────
   Props
   ───────────────────────────────────────────── */

interface ChatThreadProps {
  /** The full discussion object, including its message history. */
  discussion: Discussion;
  /** Messages array — may include user-appended messages beyond the seed data. */
  messages: Message[];
  /** Current signed-in user (for "own" bubble alignment + avatar initials). */
  user: UserProfile;
  /** Navigate back to the discussions feed. */
  onBack: () => void;
  /** Called when the user sends a new message. */
  onSendMessage: (text: string) => void;
}

/* ─────────────────────────────────────────────
   Component
   ───────────────────────────────────────────── */

export const ChatThread: React.FC<ChatThreadProps> = ({
  discussion,
  messages,
  user,
  onBack,
  onSendMessage,
}) => {
  const [draft, setDraft] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  /* Auto-scroll to newest message */
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages]);

  /* Reset draft when switching discussions */
  useEffect(() => {
    setDraft('');
  }, [discussion.id]);

  const handleSend = () => {
    const text = draft.trim();
    if (!text) return;
    onSendMessage(text);
    setDraft('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSend();
  };

  /* ── Determine member count from unique authors ── */
  const uniqueAuthors = new Set(messages.map((m) => m.author));
  const memberCount = uniqueAuthors.size;

  return (
    <main className="relative flex flex-col h-[calc(100vh-5rem)] bg-gray-50">
      {/* ─── Header Bar ─── */}
      <div className="bg-white border-b border-gray-100 px-5 py-4 flex items-center gap-3 shrink-0">
        <button
          onClick={onBack}
          aria-label="Back to discussions"
          className="w-10 h-10 rounded-full bg-gray-50 text-gray-700 flex items-center justify-center hover:bg-[#243421]/10 hover:text-[#243421] transition shrink-0"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-xl font-bold text-gray-900 truncate">
              {discussion.verse}
            </h2>
          </div>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <TagPill tag={discussion.tag} />
            <span className="text-gray-300">·</span>
            <span className="inline-flex items-center gap-1 bg-gray-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
              {discussion.author} · Lead
            </span>
            <span className="text-gray-300">·</span>
            <span className="text-xs text-gray-400 tabular-nums">
              {discussion.time}
            </span>
          </div>
        </div>
      </div>

      {/* ─── Verse Context Banner (BibleCard) ─── */}
      {(() => {
        const usfmRef = verseToUsfm(discussion.verse);
        if (usfmRef) {
          return (
            <div className="border-b border-gray-100  shrink-0">
              <BibleCard
                reference={usfmRef}
                versionId={111}
                background="light"
              />
            </div>
          );
        }
        /* Fallback: plain-text snippet when USFM conversion fails */
        return (
          <div className="bg-[#243421]/[0.03] border-b border-gray-100 px-5 py-3 shrink-0">
            <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
              <span className="font-semibold text-[#243421]">
                {discussion.verse}
              </span>{' '}
              — {discussion.snippet}
            </p>
          </div>
        );
      })()}

      {/* ─── Message Area ─── */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-5 py-5 space-y-4"
      >
        {messages.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center h-full text-center gap-3 opacity-60">
            <div className="w-14 h-14 rounded-full bg-[#243421]/10 flex items-center justify-center">
              <BookOpen className="w-7 h-7 text-[#243421]" />
            </div>
            <p className="text-sm text-gray-500 font-medium max-w-[240px]">
              Be the first to share a thought on this verse.
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isOwn = msg.isOwn ?? false;
            const isLeader = msg.author === discussion.author && !isOwn;

            return (
              <div
                key={msg.id}
                className={cn(
                  'flex items-end gap-2.5',
                  isOwn ? 'justify-end' : 'justify-start'
                )}
              >
                {/* Incoming avatar */}
                {!isOwn && (
                  <div
                    className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0',
                      isLeader
                        ? 'bg-gray-900 text-white ring-2 ring-amber-400/60'
                        : 'bg-[#243421]/10 text-[#243421]'
                    )}
                  >
                    {getInitials(msg.author)}
                  </div>
                )}

                {/* Bubble */}
                <div
                  className={cn(
                    'max-w-[75%] rounded-2xl px-4 py-2.5',
                    isOwn
                      ? 'bg-[#243421] text-white rounded-tr-none'
                      : isLeader
                        ? 'bg-gray-900 text-white rounded-tl-none shadow-md'
                        : 'bg-white text-gray-800 rounded-tl-none shadow-sm border border-gray-100'
                  )}
                >
                  {/* Author name + leader badge on incoming */}
                  {!isOwn && (
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <p
                        className={cn(
                          'text-[11px] font-semibold',
                          isLeader ? 'text-white' : 'text-[#243421]'
                        )}
                      >
                        {msg.author}
                      </p>
                      {isLeader && (
                        <span className="inline-flex items-center gap-0.5 bg-amber-400/20 text-amber-300 text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                          <Star className="w-2 h-2 fill-amber-400 text-amber-400" />
                          Lead
                        </span>
                      )}
                    </div>
                  )}
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                  <p
                    className={cn(
                      'text-[10px] mt-1 text-right',
                      isOwn || isLeader ? 'text-white/60' : 'text-gray-400'
                    )}
                  >
                    {msg.time}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ─── Send Bar ─── */}
      <div className="bg-white border-t border-gray-100 px-5 py-4 shrink-0">
        <div className="flex items-center gap-3 max-w-2xl mx-auto">
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Message ${discussion.verse}…`}
            aria-label="Message input"
            className="flex-1 bg-gray-50 text-sm text-gray-900 placeholder-gray-400 rounded-full px-5 py-3 outline-none focus:ring-2 focus:ring-[#243421]/20 transition"
          />
          <button
            onClick={handleSend}
            disabled={!draft.trim()}
            aria-label="Send message"
            className="w-11 h-11 rounded-full bg-[#243421] text-white flex items-center justify-center shadow-sm hover:bg-[#1a2618] disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </main>
  );
};
