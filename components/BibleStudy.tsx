import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowLeftRight,
  BookOpen,
  Clock,
  FileText,
  Link,
  LogOut,
  Plus,
  Send,
  User,
  UserPlus,
  Users,
  Video,
  X,
} from 'lucide-react';
import { UserProfile } from '../types';

interface BibleStudyGroup {
  id: string;
  displayName: string;
  book: string;
  topic: string;
  capacity: number;
  activeMemberCount: number;
  moderatorName: string;
  meetingTime: string;
  status: 'open' | 'full' | 'live';
}

const SEED_GROUPS: BibleStudyGroup[] = [
  {
    id: 'psalms-songs-night',
    displayName: 'Psalms: Songs in the Night',
    book: 'Psalms',
    topic: 'Comfort and praise through the Psalms',
    capacity: 15,
    activeMemberCount: 7,
    moderatorName: 'Maya T.',
    meetingTime: 'Sundays, 9:00 AM',
    status: 'open',
  },
  {
    id: 'romans-grace-anchors',
    displayName: 'Romans: Grace and Anchors',
    book: 'Romans',
    topic: "Walking through Paul's letter together",
    capacity: 15,
    activeMemberCount: 12,
    moderatorName: 'Sarah L.',
    meetingTime: 'Thursdays, 6:00 PM',
    status: 'open',
  },
  {
    id: 'john-light-darkness',
    displayName: 'John: Light in the Darkness',
    book: 'John',
    topic: 'The signs and "I am" sayings of Jesus',
    capacity: 15,
    activeMemberCount: 9,
    moderatorName: 'Jordan K.',
    meetingTime: 'Mondays, 8:00 PM',
    status: 'live',
  },
  {
    id: 'joshua-courage-unknown',
    displayName: 'Joshua: Courage in the Unknown',
    book: 'Joshua',
    topic: 'Stepping forward when the path is unclear',
    capacity: 15,
    activeMemberCount: 6,
    moderatorName: 'Daniel R.',
    meetingTime: 'Tuesdays, 7:00 PM',
    status: 'open',
  },
  {
    id: 'genesis-beginning-belonging',
    displayName: 'Genesis: In the Beginning, Belonging',
    book: 'Genesis',
    topic: 'Finding identity in the first book of the Bible',
    capacity: 15,
    activeMemberCount: 4,
    moderatorName: 'Esther M.',
    meetingTime: 'Saturdays, 10:00 AM',
    status: 'open',
  },
  {
    id: 'proverbs-wisdom-restless',
    displayName: 'Proverbs: Wisdom for the Restless',
    book: 'Proverbs',
    topic: 'Applying Proverbs to everyday decisions',
    capacity: 15,
    activeMemberCount: 15,
    moderatorName: 'Chris B.',
    meetingTime: 'Wednesdays, 7:30 PM',
    status: 'full',
  },
  {
    id: 'ephesians-rooted-grounded',
    displayName: 'Ephesians: Rooted and Grounded',
    book: 'Ephesians',
    topic: 'Discovering who we are in Christ together',
    capacity: 15,
    activeMemberCount: 10,
    moderatorName: 'Rachel H.',
    meetingTime: 'Fridays, 12:00 PM',
    status: 'open',
  },
  {
    id: 'ruth-loyalty-harvest',
    displayName: 'Ruth: Loyalty in the Harvest',
    book: 'Ruth',
    topic: 'Faithfulness, loss, and unexpected belonging',
    capacity: 15,
    activeMemberCount: 8,
    moderatorName: 'Naomi G.',
    meetingTime: 'Sundays, 6:00 PM',
    status: 'open',
  },
  {
    id: 'philippians-joy-odds',
    displayName: 'Philippians: Joy Against the Odds',
    book: 'Philippians',
    topic: 'Choosing joy in every season',
    capacity: 15,
    activeMemberCount: 14,
    moderatorName: 'Pauline S.',
    meetingTime: 'Thursdays, 8:00 PM',
    status: 'open',
  },
];

interface BibleStudyProps {
  user: UserProfile;
}

const MAX_GROUPS = 2;

const JOINED_GROUPS_STORAGE_KEY = 'selah_joined_groups';

const readStoredJoinedIds = (): string[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(JOINED_GROUPS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return Array.from(new Set(parsed.filter((x): x is string => typeof x === 'string')))
      .filter((id) => SEED_GROUPS.some((g) => g.id === id))
      .slice(0, MAX_GROUPS);
  } catch {
    return [];
  }
};

const CHAPTER_BY_BOOK: Record<string, string> = {
  Psalms: 'Psalms 23',
  Romans: 'Romans 8',
  John: 'John 8',
  Joshua: 'Joshua 1',
  Genesis: 'Genesis 1',
  Proverbs: 'Proverbs 3',
  Ephesians: 'Ephesians 3',
  Ruth: 'Ruth 1',
  Philippians: 'Philippians 4',
};

const getFirstName = (name: string) => {
  const trimmed = name.trim();
  return trimmed.split(' ')[0] || trimmed || 'Friend';
};

const getInitials = (name: string) => {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('');
};

interface ChatMessage {
  id: string;
  author: string;
  initials: string;
  text: string;
  self: boolean;
}

const seedMessagesFor = (group: BibleStudyGroup): ChatMessage[] => {
  const mod = group.moderatorName;
  const modInitials = getInitials(mod);
  return [
    {
      id: `${group.id}-welcome`,
      author: mod,
      initials: modInitials,
      text: `Welcome to ${group.displayName}. I'm so glad you're here — we'll be walking through ${group.book} together, watching how the Spirit speaks through ${group.topic.toLowerCase()}.`,
      self: false,
    },
    {
      id: `${group.id}-member1`,
      author: 'Ruth A.',
      initials: 'RA',
      text: `Thankful for this space. ${group.book} has been teaching me to slow down and listen.`,
      self: false,
    },
    {
      id: `${group.id}-member2`,
      author: 'David M.',
      initials: 'DM',
      text: `Looking forward to gathering this week. Does anyone want to share prayer requests ahead of time?`,
      self: false,
    },
  ];
};

const StatusPill: React.FC<{ status: BibleStudyGroup['status'] }> = ({ status }) => {
  const styles = {
    live: 'bg-amber-100 text-amber-700',
    full: 'bg-gray-100 text-gray-500',
    open: 'bg-[#243421]/10 text-[#243421]',
  };
  return (
    <span
      className={`inline-flex items-center text-[10px] font-bold uppercase tracking-wider rounded-full px-2.5 py-1 ${styles[status]}`}
    >
      {status === 'live' && (
        <>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5 animate-pulse" />
          Live
        </>
      )}
      {status === 'full' && 'Full'}
      {status === 'open' && 'Open'}
    </span>
  );
};

interface CapacityBarProps {
  active: number;
  capacity: number;
  compact?: boolean;
}

const CapacityBar: React.FC<CapacityBarProps> = ({ active, capacity, compact }) => {
  const pct = Math.max(0, Math.min(100, (active / capacity) * 100));
  const barHeight = compact ? 'h-1.5' : 'h-2';
  return (
    <div className="w-full">
      <div className={`w-full rounded-full bg-gray-100 ${barHeight}`}>
        <div
          className={`rounded-full bg-[#243421] transition-all duration-500 ${barHeight}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className={`text-gray-500 ${compact ? 'text-[11px] mt-1' : 'text-xs mt-1.5'}`}>
        {active}/{capacity} members
      </p>
    </div>
  );
};

const GroupCapChip: React.FC = () => (
  <span className="inline-flex items-center text-[10px] uppercase tracking-wider text-gray-400">
    {MAX_GROUPS} groups max
  </span>
);

interface GroupInteriorProps {
  group: BibleStudyGroup;
  user: UserProfile;
  messagesByGroup: Record<string, ChatMessage[]>;
  setMessagesByGroup: React.Dispatch<
    React.SetStateAction<Record<string, ChatMessage[]>>
  >;
  drawerOpen: boolean;
  setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  drawerTab: 'overview' | 'resources';
  setDrawerTab: React.Dispatch<React.SetStateAction<'overview' | 'resources'>>;
  confirmLeaveId: string | null;
  setConfirmLeaveId: React.Dispatch<React.SetStateAction<string | null>>;
  onBack: () => void;
  onLeaveConfirmed: () => void;
}

const GroupInterior: React.FC<GroupInteriorProps> = ({
  group,
  user,
  messagesByGroup,
  setMessagesByGroup,
  drawerOpen,
  setDrawerOpen,
  drawerTab,
  setDrawerTab,
  confirmLeaveId,
  setConfirmLeaveId,
  onBack,
  onLeaveConfirmed,
}) => {
  const messages = useMemo(
    () => messagesByGroup[group.id] ?? seedMessagesFor(group),
    [group.id, messagesByGroup[group.id]]
  );
  const [draft, setDraft] = useState('');
  const [invited, setInvited] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const sendMessage = () => {
    const text = draft.trim();
    if (!text) return;
    const selfName = getFirstName(user.name);
    const newMsg: ChatMessage = {
      id: `${group.id}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      author: selfName,
      initials: getInitials(user.name),
      text,
      self: true,
    };
    setMessagesByGroup((prev) => {
      const existing = prev[group.id] ?? seedMessagesFor(group);
      return { ...prev, [group.id]: [...existing, newMsg] };
    });
    setDraft('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') sendMessage();
  };

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages]);

  useEffect(() => {
    setDraft('');
    setInvited(false);
  }, [group.id]);

  const currentChapter = CHAPTER_BY_BOOK[group.book] || `${group.book} 1`;
  const modFirstName = getFirstName(group.moderatorName);

  const handleInvite = () => {
    const link = `https://selah.app/circles/${group.id}`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(link).catch(() => undefined);
    }
    setInvited(true);
    setTimeout(() => setInvited(false), 2500);
  };

  return (
    <main className="relative flex flex-col h-[calc(100vh-5rem)] bg-gray-50">
      <div className="bg-white border-b border-gray-100 px-5 py-4 flex items-center gap-3 shrink-0">
        <button
          onClick={onBack}
          aria-label="Back to dashboard"
          className="w-10 h-10 rounded-full bg-gray-50 text-gray-700 flex items-center justify-center hover:bg-[#243421]/10 hover:text-[#243421] transition shrink-0"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => setDrawerOpen((open) => !open)}
          className="flex-1 min-w-0 text-left group"
        >
          <h2 className="font-serif text-xl font-bold text-gray-900 truncate group-hover:text-[#243421] transition">
            {group.displayName}
          </h2>
          <div className="flex items-center gap-1.5 mt-0.5">
            <BookOpen className="w-3.5 h-3.5 text-[#243421]/70" />
            <span className="text-xs text-[#243421]/70">{group.book}</span>
            <span className="text-gray-300">·</span>
            <StatusPill status={group.status} />
          </div>
        </button>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-5 py-5 space-y-4"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-end gap-2.5 ${
              msg.self ? 'justify-end' : 'justify-start'
            }`}
          >
            {!msg.self && (
              <div className="w-8 h-8 rounded-full bg-[#243421]/10 text-[#243421] flex items-center justify-center text-[11px] font-bold shrink-0">
                {msg.initials}
              </div>
            )}
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                msg.self
                  ? 'bg-[#243421] text-white rounded-tr-none'
                  : 'bg-white text-gray-800 rounded-tl-none shadow-sm border border-gray-100'
              }`}
            >
              {!msg.self && (
                <p className="text-[11px] font-semibold text-[#243421] mb-0.5">
                  {msg.author}
                </p>
              )}
              <p className="text-sm leading-relaxed">{msg.text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white border-t border-gray-100 px-5 py-4 shrink-0">
        <div className="flex items-center gap-3 max-w-2xl mx-auto">
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Share a thought..."
            className="flex-1 bg-gray-50 text-sm text-gray-900 placeholder-gray-400 rounded-full px-5 py-3 outline-none focus:ring-2 focus:ring-[#243421]/20 transition"
          />
          <button
            onClick={sendMessage}
            disabled={!draft.trim()}
            aria-label="Send message"
            className="w-11 h-11 rounded-full bg-[#243421] text-white flex items-center justify-center shadow-sm hover:bg-[#1a2618] disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>

      {drawerOpen && (
        <div className="absolute inset-0 z-40 flex flex-col">
          <button
            className="flex-1 bg-black/20 backdrop-blur-sm"
            aria-label="Close drawer"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="bg-white rounded-t-3xl shadow-2xl p-6 max-h-[80%] overflow-y-auto">
            <div className="w-12 h-1.5 rounded-full bg-gray-200 mx-auto mb-5" />
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setDrawerOpen(false)}
                className="text-sm font-semibold text-gray-500 hover:text-[#243421] transition"
              >
                Close
              </button>
            </div>

            <div className="flex items-center gap-2 mb-6">
              {(['overview', 'resources'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setDrawerTab(tab)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                    drawerTab === tab
                      ? 'bg-[#243421] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {tab === 'overview' ? 'Overview' : 'Resources & Info'}
                </button>
              ))}
            </div>

            {drawerTab === 'overview' ? (
              <div className="space-y-5">
                <div className="bg-[#243421]/5 rounded-2xl p-5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#243421]/70">
                    Current Chapter
                  </p>
                  <p className="font-serif text-2xl font-bold text-[#243421] mt-1">
                    {currentChapter}
                  </p>
                </div>

                <div className="flex items-start gap-4 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                  <div className="w-12 h-12 rounded-full bg-[#243421] text-white flex items-center justify-center text-sm font-bold shrink-0">
                    {getInitials(group.moderatorName)}
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#243421]/70">
                      Moderator
                    </p>
                    <p className="font-serif text-lg font-bold text-gray-900">
                      {group.moderatorName}
                    </p>
                    <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                      {modFirstName} has walked with this circle for two seasons, holding
                      space for honest questions.
                    </p>
                  </div>
                </div>

                <div className="bg-[#243421]/5 rounded-2xl p-5">
                  <p className="text-sm font-semibold text-[#243421]">
                    This week's focus: {group.topic}
                  </p>
                  <ul className="mt-3 space-y-2">
                    <li className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="mt-1.5 w-1 h-1 rounded-full bg-[#243421] shrink-0" />
                      What word or phrase are you carrying into this week?
                    </li>
                    <li className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="mt-1.5 w-1 h-1 rounded-full bg-[#243421] shrink-0" />
                      Where did you sense God's presence recently?
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#243421]/70 mb-3">
                    Group Details
                  </p>
                  <div className="space-y-2 text-sm text-gray-700">
                    <p>
                      <span className="text-gray-500">Topic:</span> {group.topic}
                    </p>
                    <p>
                      <span className="text-gray-500">Meets:</span> {group.meetingTime}
                    </p>
                    <p>
                      <span className="text-gray-500">Members:</span>{' '}
                      {group.activeMemberCount}/{group.capacity}
                    </p>
                    <p>
                      <span className="text-gray-500">Length:</span> 6-week study · ~60 min
                      sessions
                    </p>
                  </div>
                </div>

                <a
                  href="https://zoom.us/j/000000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-[#243421] text-white text-sm font-semibold rounded-xl py-3 hover:bg-[#1a2618] transition shadow-sm"
                >
                  <Video className="w-4 h-4" />
                  Join Zoom Session
                </a>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  {[
                    { label: 'Study guide (PDF)', icon: FileText },
                    { label: 'Reading plan', icon: Link },
                    { label: 'Worship playlist', icon: Link },
                  ].map((resource, idx) => (
                    <button
                      key={idx}
                      className="w-full flex items-center gap-3 px-5 py-3.5 text-left text-sm font-semibold text-gray-700 hover:bg-[#243421]/5 transition border-b border-gray-100 last:border-0"
                    >
                      <resource.icon className="w-4 h-4 text-[#243421]" />
                      {resource.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 space-y-3">
              <button
                onClick={handleInvite}
                className="w-full flex items-center justify-center gap-2 border border-[#243421]/20 text-[#243421] text-sm font-semibold rounded-xl py-3 hover:bg-[#243421]/5 transition"
              >
                <UserPlus className="w-4 h-4" />
                {invited ? 'Invite link copied ✓' : 'Invite Others'}
              </button>

              <button
                onClick={() => setConfirmLeaveId(group.id)}
                className="w-full flex items-center justify-center gap-2 text-gray-500 text-sm font-semibold rounded-xl py-3 hover:bg-red-50 hover:text-red-700 transition"
              >
                <LogOut className="w-4 h-4" />
                Leave Group
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmLeaveId === group.id && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setConfirmLeaveId(null)}
          />
          <div className="relative w-full max-w-sm bg-white rounded-3xl p-7 shadow-2xl text-center">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#243421]/70 mb-2">
              Leaving circle
            </p>
            <h3 className="font-serif text-2xl font-bold text-gray-900">
              Are you sure you want to leave this circle?
            </h3>
            <p className="text-sm text-gray-600 mt-3 leading-relaxed">
              You can always rejoin if space opens up.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                onClick={() => setConfirmLeaveId(null)}
                className="w-full bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl py-3 hover:bg-gray-200 transition"
              >
                Stay
              </button>
              <button
                onClick={onLeaveConfirmed}
                className="w-full bg-red-600 text-white text-sm font-semibold rounded-xl py-3 hover:bg-red-700 transition"
              >
                Yes, leave
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export const BibleStudy: React.FC<BibleStudyProps> = ({ user }) => {
  const [browseOpen, setBrowseOpen] = useState(false);
  const [joinedIds, setJoinedIds] = useState<string[]>(() => {
    const stored = readStoredJoinedIds();
    return Array.from(
      new Set([user.bibleStudyGroupId, ...stored].filter(Boolean) as string[])
    )
      .filter((id) => SEED_GROUPS.some((g) => g.id === id))
      .slice(0, MAX_GROUPS);
  });
  const [swapCandidateId, setSwapCandidateId] = useState<string | null>(null);
  const [openedGroupId, setOpenedGroupId] = useState<string | null>(null);
  const [messagesByGroup, setMessagesByGroup] = useState<Record<string, ChatMessage[]>>({});
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerTab, setDrawerTab] = useState<'overview' | 'resources'>('overview');
  const [confirmLeaveId, setConfirmLeaveId] = useState<string | null>(null);
  const [confirmJoinId, setConfirmJoinId] = useState<string | null>(null);

  const activeGroupIds = Array.from(
    new Set([user.bibleStudyGroupId, ...joinedIds].filter(Boolean) as string[])
  ).slice(0, MAX_GROUPS);
  const activeGroups = SEED_GROUPS.filter((g) => activeGroupIds.includes(g.id));

  const atGroupLimit = joinedIds.length >= MAX_GROUPS;

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(
        JOINED_GROUPS_STORAGE_KEY,
        JSON.stringify(joinedIds)
      );
    } catch {
      /* ignore write errors (e.g. storage disabled) */
    }
  }, [joinedIds]);

  useEffect(() => {
    setDrawerOpen(false);
    setDrawerTab('overview');
  }, [openedGroupId]);

  useEffect(() => {
    if (!openedGroupId) return;
    const openedGroup = SEED_GROUPS.find((g) => g.id === openedGroupId);
    const isMember = openedGroup && joinedIds.includes(openedGroup.id);
    if (!openedGroup || !isMember) {
      setOpenedGroupId(null);
      setDrawerOpen(false);
    }
  }, [openedGroupId, joinedIds]);

  const handleJoin = (id: string) => {
    const group = SEED_GROUPS.find((g) => g.id === id);
    if (!group) return;
    if (joinedIds.includes(id)) return;
    if (group.activeMemberCount >= group.capacity) return;

    if (joinedIds.length < MAX_GROUPS) {
      setJoinedIds((prev) => [...prev, id]);
      setBrowseOpen(false);
    } else {
      setSwapCandidateId(id);
    }
  };

  const handleLeave = (id: string) => {
    setJoinedIds((prev) => prev.filter((joinedId) => joinedId !== id));
  };

  const onOpenGroup = (group: BibleStudyGroup) => {
    setOpenedGroupId(group.id);
  };

  const handleSwap = (dropId: string) => {
    if (!swapCandidateId) return;
    setJoinedIds((prev) =>
      [...prev.filter((id) => id !== dropId), swapCandidateId]
    );
    setSwapCandidateId(null);
    setBrowseOpen(false);
  };

  const Header = () => (
    <header className="bg-white border-b border-gray-100 px-6 py-5 sticky top-0 z-30">
      <div className="max-w-2xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-[#243421]/10 text-[#243421] flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-serif text-xl font-bold text-gray-900">Bible Study</h1>
            <p className="text-xs text-gray-500 mt-0.5">Find your circle. Grow in the Word.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600 hidden sm:inline">Hi, {getFirstName(user.name)}</span>
          {!browseOpen && (
            <button
              onClick={() => setBrowseOpen(true)}
              aria-label="Browse bible study groups"
              className="w-10 h-10 rounded-full bg-[#243421] text-white flex items-center justify-center shadow-sm hover:bg-[#1a2618] hover:shadow-md active:scale-95 transition"
            >
              <Plus className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );

  const ActiveGroupCard = ({ group }: { group: BibleStudyGroup }) => (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 relative overflow-hidden">
      <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-[#243421]/30 via-[#243421]/60 to-[#243421]/30" />
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#243421]/70">
            {group.book}
          </p>
          <h2 className="font-serif text-2xl font-bold text-gray-900 mt-1 leading-tight">
            {group.displayName}
          </h2>
        </div>
        <StatusPill status={group.status} />
      </div>

      <p className="text-sm text-gray-500 mt-3 leading-relaxed">{group.topic}</p>

      <div className="mt-5 flex flex-col gap-3 text-sm text-gray-600">
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-full bg-[#243421]/10 text-[#243421] flex items-center justify-center shrink-0">
            <User className="w-4 h-4" />
          </span>
          <span className="truncate">Led by {group.moderatorName}</span>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-full bg-[#243421]/10 text-[#243421] flex items-center justify-center shrink-0">
            <Clock className="w-4 h-4" />
          </span>
          <span>{group.meetingTime}</span>
        </div>
      </div>

      <div className="mt-6">
        <CapacityBar active={group.activeMemberCount} capacity={group.capacity} />
      </div>

      {atGroupLimit && (
        <div className="mt-5 text-xs text-amber-700 bg-amber-50 rounded-xl px-3 py-2 inline-flex items-center">
          You're at the {MAX_GROUPS}-group limit — leave one to join another.
        </div>
      )}

      <button
        onClick={() => onOpenGroup(group)}
        className="mt-6 w-full bg-[#243421] text-white text-sm font-semibold rounded-xl py-3 hover:bg-[#1a2618] active:scale-[0.98] transition shadow-sm"
      >
        Open Circle
      </button>

      <div className="mt-4 text-center">
        <button
          onClick={() => setBrowseOpen(true)}
          className="text-sm font-semibold text-[#243421] underline underline-offset-4 hover:text-[#1a2618] transition"
        >
          Find another group
        </button>
      </div>
    </div>
  );

  const GroupCard: React.FC<{ group: BibleStudyGroup }> = ({ group }) => {
    const joined = joinedIds.includes(group.id);
    const full = group.activeMemberCount >= group.capacity;
    return (
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition relative">
        <div className="absolute top-5 right-5">
          <StatusPill status={group.status} />
        </div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-[#243421]/70">
          {group.book}
        </p>
        <h3 className="font-serif text-lg font-bold text-gray-900 mt-1 pr-16">
          {group.displayName}
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          Led by {group.moderatorName} · {group.meetingTime}
        </p>
        <div className="mt-4 max-w-[180px]">
          <CapacityBar active={group.activeMemberCount} capacity={group.capacity} compact />
        </div>
        <div className="mt-4">
          {joined ? (
            <button
              onClick={() => handleLeave(group.id)}
              className="w-full bg-[#243421]/10 text-[#243421] text-xs font-bold rounded-xl py-2.5 hover:bg-[#243421]/15 transition"
            >
              Leave this circle
            </button>
          ) : full ? (
            <button
              disabled
              className="w-full bg-gray-100 text-gray-400 text-xs font-bold rounded-xl py-2.5 cursor-not-allowed"
            >
              This circle is full
            </button>
          ) : (
            <button
              onClick={() => setConfirmJoinId(group.id)}
              className="w-full bg-[#243421] text-white text-xs font-bold rounded-xl py-2.5 hover:bg-[#1a2618] transition"
            >
              {atGroupLimit ? 'Swap to join' : 'Join this circle'}
            </button>
          )}
        </div>
      </div>
    );
  };

  const SwapModal = () => {
    if (!swapCandidateId) return null;
    const candidate = SEED_GROUPS.find((g) => g.id === swapCandidateId);
    const currentGroups = SEED_GROUPS.filter((g) => joinedIds.includes(g.id));

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="swap-modal-heading"
      >
        <div
          className="absolute inset-0 bg-black/40"
          onClick={() => setSwapCandidateId(null)}
        />
        <div className="relative w-full max-w-md bg-white rounded-3xl p-7 sm:p-8 shadow-2xl">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#243421]/70">
                Drop to swap
              </p>
              <h3
                id="swap-modal-heading"
                className="font-serif text-2xl font-bold text-gray-900 mt-1"
              >
                Swap an Active Circle
              </h3>
            </div>
            <button
              onClick={() => setSwapCandidateId(null)}
              aria-label="Cancel swap"
              className="w-9 h-9 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center hover:bg-gray-200 transition shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-sm text-gray-600 leading-relaxed">
            You can be part of {MAX_GROUPS} circles at a time. Choose one to drop to
            make room for{' '}
            <span className="font-semibold text-[#243421]">{candidate?.displayName}</span>.
          </p>

          <div className="mt-6 space-y-3">
            {currentGroups.map((g) => (
              <button
                key={g.id}
                onClick={() => handleSwap(g.id)}
                className="w-full flex items-center justify-between gap-4 bg-[#243421]/5 hover:bg-[#243421]/10 rounded-2xl p-4 transition text-left"
              >
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#243421]/70">
                    {g.book}
                  </p>
                  <p className="font-serif text-base font-semibold text-gray-900 truncate">
                    {g.displayName}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {g.activeMemberCount}/{g.capacity} members
                  </p>
                </div>
                <span className="w-10 h-10 rounded-full bg-[#243421] text-white flex items-center justify-center shrink-0 shadow-sm">
                  <ArrowLeftRight className="w-4 h-4" />
                </span>
              </button>
            ))}
          </div>

          <button
            onClick={() => setSwapCandidateId(null)}
            className="mt-6 w-full bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl py-3 hover:bg-gray-200 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  };

  const Scenario1 = () => {
    if (activeGroups.length === 0) return <Scenario2 />;
    return (
      <main className="px-6 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h2 className="font-serif text-2xl font-bold text-gray-900">Your Circles</h2>
              <p className="text-xs text-gray-500 mt-0.5">Step into the group that gathered.</p>
            </div>
            <GroupCapChip />
          </div>
          <div className="space-y-6">
            {activeGroups.map((group) => (
              <ActiveGroupCard key={group.id} group={group} />
            ))}
          </div>
        </div>
      </main>
    );
  };

  const Scenario2 = () => (
    <main className="px-6 py-20">
      <div className="max-w-md mx-auto flex flex-col items-center text-center">
        <div className="w-24 h-24 rounded-full bg-[#243421]/10 text-[#243421] flex items-center justify-center shadow-sm">
          <Users className="w-10 h-10" />
        </div>
        <h2 className="font-serif text-3xl font-bold text-gray-900 mt-7">
          Not in any groups currently
        </h2>
        <p className="text-sm text-gray-500 leading-relaxed max-w-xs mt-4">
          press the plus sign to look at any bible study groups you may be interested in.
        </p>
        <button
          onClick={() => setBrowseOpen(true)}
          className="mt-8 w-16 h-16 rounded-full bg-[#243421] text-white shadow-xl shadow-[#243421]/20 hover:bg-[#1a2618] hover:shadow-[#243421]/30 hover:-translate-y-0.5 active:scale-95 transition flex items-center justify-center"
          aria-label="Browse bible study groups"
        >
          <Plus className="w-7 h-7" />
        </button>
      </div>
    </main>
  );

  const Scenario3 = () => {
    const book = user.bibleBook || '';
    const matches = SEED_GROUPS.filter(
      (g) => g.book.toLowerCase() === book.toLowerCase()
    );
    const fallback = matches.length === 0;
    const renderedGroups = fallback
      ? SEED_GROUPS.filter((g) => g.status !== 'full').slice(0, 3)
      : matches;

    return (
      <main className="px-6 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#243421]/70">
                Matched to your book
              </p>
              <h2 className="font-serif text-2xl font-bold text-gray-900 mt-1">
                Spaces studying {book}
              </h2>
            </div>
            <GroupCapChip />
          </div>
          <p className="text-sm text-gray-500 mb-6">
            Pick a circle to start growing together.
          </p>
          {fallback && (
            <div className="mb-6 rounded-xl bg-gray-100/70 px-4 py-3 text-xs text-gray-600">
              We don't have a {book} circle open right now, but these groups are starting soon.
            </div>
          )}
          <div className="space-y-4">
            {renderedGroups.map((g) => (
              <GroupCard key={g.id} group={g} />
            ))}
          </div>
        </div>
      </main>
    );
  };

  const Browse = () => (
    <main className="px-6 py-8">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => setBrowseOpen(false)}
          className="group flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#243421] transition mb-6"
        >
          <span className="w-7 h-7 rounded-full bg-gray-100 group-hover:bg-[#243421]/10 flex items-center justify-center transition">
            <ArrowLeft className="w-4 h-4" />
          </span>
          Back
        </button>
        <p className="text-[10px] font-bold uppercase tracking-wider text-[#243421]/70">
          All circles
        </p>
        <h2 className="font-serif text-2xl font-bold text-gray-900 mt-1">
          Browse Bible study groups
        </h2>
        <p className="text-sm text-gray-500 mt-1 mb-6">
          Choose a circle to begin your journey.
        </p>
        <div className="space-y-4">
          {SEED_GROUPS.map((g) => (
            <GroupCard key={g.id} group={g} />
          ))}
        </div>
      </div>
    </main>
  );

  const renderContent = () => {
    if (openedGroupId) {
      const openedGroup = SEED_GROUPS.find((g) => g.id === openedGroupId);
      if (!openedGroup || !joinedIds.includes(openedGroup.id)) return null;
      return (
        <GroupInterior
          group={openedGroup}
          user={user}
          messagesByGroup={messagesByGroup}
          setMessagesByGroup={setMessagesByGroup}
          drawerOpen={drawerOpen}
          setDrawerOpen={setDrawerOpen}
          drawerTab={drawerTab}
          setDrawerTab={setDrawerTab}
          confirmLeaveId={confirmLeaveId}
          setConfirmLeaveId={setConfirmLeaveId}
          onBack={() => {
            setOpenedGroupId(null);
            setDrawerOpen(false);
          }}
          onLeaveConfirmed={() => {
            handleLeave(openedGroup.id);
            setOpenedGroupId(null);
            setDrawerOpen(false);
            setConfirmLeaveId(null);
          }}
        />
      );
    }
    if (browseOpen) return <Browse />;
    if (user.bibleStudyGroupId || joinedIds.length > 0) return <Scenario1 />;
    if (!user.bibleBook) return <Scenario2 />;
    return <Scenario3 />;
  };

  const joinCandidate = confirmJoinId
    ? SEED_GROUPS.find((g) => g.id === confirmJoinId)
    : undefined;

  return (
    <section className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <Header />
      {renderContent()}
      <SwapModal />

      {confirmJoinId && joinCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setConfirmJoinId(null)}
          />
          <div className="relative w-full max-w-sm bg-white rounded-3xl p-7 shadow-2xl text-center">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#243421]/70 mb-2">
              Join circle
            </p>
            <h3 className="font-serif text-2xl font-bold text-gray-900">
              Join this circle?
            </h3>
            <p className="font-serif text-lg text-[#243421] mt-1">
              {joinCandidate.displayName}
            </p>
            <p className="text-sm text-gray-600 mt-3 leading-relaxed">
              You'll grow alongside {joinCandidate.activeMemberCount} others.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                onClick={() => setConfirmJoinId(null)}
                className="w-full bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl py-3 hover:bg-gray-200 transition"
              >
                Not yet
              </button>
              <button
                onClick={() => {
                  handleJoin(confirmJoinId);
                  setConfirmJoinId(null);
                }}
                className="w-full bg-[#243421] text-white text-sm font-semibold rounded-xl py-3 hover:bg-[#1a2618] transition"
              >
                Yes, join
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
