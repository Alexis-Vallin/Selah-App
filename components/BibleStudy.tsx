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
  Search,
  Send,
  User,
  UserPlus,
  Users,
  Video,
  X,
} from 'lucide-react';
import { UserProfile } from '../types';
import { BIBLE_BOOKS, OLD_TESTAMENT_BOOKS, NEW_TESTAMENT_BOOKS } from '../constants';

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
  isOnline: boolean;
  location?: string;
  zip?: string;
  testament: 'Old Testament' | 'New Testament';
}

const MODERATORS = [
  'Maya T.', 'Sarah L.', 'Jordan K.', 'Daniel R.', 'Esther M.',
  'Chris B.', 'Rachel H.', 'Naomi G.', 'Pauline S.', 'David K.',
  'Grace M.', 'Thomas W.', 'Ruth A.', 'Michael K.', 'Esther L.',
  'Paul M.', 'Martha J.', 'Samuel O.', 'Rebekah P.', 'Andrew J.',
  'Anna S.', 'Joel B.', 'Hannah K.', 'Luke W.', 'Miriam N.',
  'Stephen D.', 'Deborah A.', 'Timothy R.', 'Lydia F.', 'Gideon M.',
];

const MEETING_TIMES = [
  'Sundays, 9:00 AM', 'Sundays, 6:00 PM', 'Mondays, 8:00 PM',
  'Tuesdays, 7:00 PM', 'Wednesdays, 7:30 PM', 'Thursdays, 6:00 PM',
  'Thursdays, 8:00 PM', 'Fridays, 12:00 PM', 'Fridays, 7:00 PM',
  'Saturdays, 10:00 AM',
];

const LOCATIONS = [
  'Austin, TX', 'Portland, OR', 'Atlanta, GA', 'Phoenix, AZ', 'Denver, CO',
  'London, UK', 'Manchester, UK', 'Nashville, TN', 'Seattle, WA', 'Chicago, IL',
  'Dallas, TX', 'Miami, FL', 'Boston, MA', 'San Diego, CA', 'Minneapolis, MN',
  'Toronto, ON',
];

const TOPIC_TEMPLATES = [
  "Discovering God's heart in {book}",
  'Finding hope and wisdom in {book}',
  'Walking through {book} together',
  'Deep dive into {book}',
  'Life lessons from {book}',
  'Growing in faith through {book}',
];

const DISPLAY_SUFFIXES = ['Journey', 'Reflections', 'Foundations', 'Encounters', 'Awakening', 'Anchored'];

const generateGroups = (): BibleStudyGroup[] => {
  const groups: BibleStudyGroup[] = [];
  const popularExtras: Record<string, number> = {
    Psalms: 2, John: 2, Romans: 2, Genesis: 2, Proverbs: 2,
  };

  BIBLE_BOOKS.forEach((book, index) => {
    const isOld = OLD_TESTAMENT_BOOKS.includes(book);
    const count = 1 + (popularExtras[book] || 0);
    for (let i = 0; i < count; i++) {
      const mod = MODERATORS[(index * 3 + i) % MODERATORS.length];
      const time = MEETING_TIMES[(index + i) % MEETING_TIMES.length];
      const members = 3 + ((index * 7 + i * 13) % 12);
      const isOnline = ((index + i) % 5) >= 3;
      const location = isOnline ? undefined : LOCATIONS[(index + i) % LOCATIONS.length];
      const zip = isOnline ? undefined : String(10000 + ((index * 137 + i * 53) % 89999));
      const topic = TOPIC_TEMPLATES[index % TOPIC_TEMPLATES.length].replace('{book}', book);
      const status: BibleStudyGroup['status'] =
        members >= 15 ? 'full' : (i === 0 && index % 8 === 0 ? 'live' : 'open');
      const suffix = DISPLAY_SUFFIXES[(index + i) % DISPLAY_SUFFIXES.length];

      groups.push({
        id: `study-${book.toLowerCase().replace(/[^a-z0-9]/g, '-')}${i > 0 ? `-${i + 1}` : ''}`,
        displayName: `${book}: ${suffix}`,
        book,
        topic,
        capacity: 15,
        activeMemberCount: members,
        moderatorName: mod,
        meetingTime: time,
        status,
        isOnline,
        location,
        zip,
        testament: isOld ? 'Old Testament' : 'New Testament',
      });
    }
  });

  return groups;
};

const SEED_GROUPS = generateGroups();

interface BibleStudyProps {
  user: UserProfile;
}

const MAX_GROUPS = 2;

const getChapterForBook = (book: string): string => {
  const knownChapters: Record<string, string> = {
    Genesis: 'Genesis 1', Exodus: 'Exodus 14', Leviticus: 'Leviticus 19',
    Numbers: 'Numbers 6', Deuteronomy: 'Deuteronomy 6', Joshua: 'Joshua 1',
    Judges: 'Judges 6', Ruth: 'Ruth 1', '1 Samuel': '1 Samuel 16',
    '2 Samuel': '2 Samuel 7', '1 Kings': '1 Kings 3', '2 Kings': '2 Kings 2',
    '1 Chronicles': '1 Chronicles 16', '2 Chronicles': '2 Chronicles 7',
    Ezra: 'Ezra 7', Nehemiah: 'Nehemiah 8', Esther: 'Esther 4',
    Job: 'Job 38', Psalms: 'Psalms 23', Proverbs: 'Proverbs 3',
    Ecclesiastes: 'Ecclesiastes 3', 'Song of Solomon': 'Song of Solomon 1',
    Isaiah: 'Isaiah 40', Jeremiah: 'Jeremiah 29', Lamentations: 'Lamentations 3',
    Ezekiel: 'Ezekiel 37', Daniel: 'Daniel 3', Hosea: 'Hosea 6',
    Joel: 'Joel 2', Amos: 'Amos 5', Obadiah: 'Obadiah 1', Jonah: 'Jonah 1',
    Micah: 'Micah 6', Nahum: 'Nahum 1', Habakkuk: 'Habakkuk 3',
    Zephaniah: 'Zephaniah 3', Haggai: 'Haggai 2', Zechariah: 'Zechariah 4',
    Malachi: 'Malachi 3',
    Matthew: 'Matthew 5', Mark: 'Mark 4', Luke: 'Luke 15', John: 'John 8',
    Acts: 'Acts 2', Romans: 'Romans 8', '1 Corinthians': '1 Corinthians 13',
    '2 Corinthians': '2 Corinthians 5', Galatians: 'Galatians 5',
    Ephesians: 'Ephesians 3', Philippians: 'Philippians 4', Colossians: 'Colossians 3',
    '1 Thessalonians': '1 Thessalonians 5', '2 Thessalonians': '2 Thessalonians 3',
    '1 Timothy': '1 Timothy 6', '2 Timothy': '2 Timothy 4', Titus: 'Titus 2',
    Philemon: 'Philemon 1', Hebrews: 'Hebrews 11', James: 'James 1',
    '1 Peter': '1 Peter 5', '2 Peter': '2 Peter 3', '1 John': '1 John 4',
    '2 John': '2 John 1', '3 John': '3 John 1', Jude: 'Jude 1',
    Revelation: 'Revelation 21',
  };
  return knownChapters[book] || `${book} 1`;
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
    live: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    full: 'bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400',
    open: 'bg-warm-amber/10 text-warm-amber dark:bg-warm-amber/20 dark:text-warm-amber',
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
      <div className={`w-full rounded-full bg-stone-100 dark:bg-stone-800 ${barHeight}`}>
        <div
          className={`rounded-full bg-primary transition-all duration-500 ${barHeight}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className={`text-gray-500 dark:text-stone-400 ${compact ? 'text-[11px] mt-1' : 'text-xs mt-1.5'}`}>
        {active}/{capacity} members
      </p>
    </div>
  );
};

const GroupCapChip: React.FC = () => (
  <span className="inline-flex items-center text-[10px] uppercase tracking-wider text-gray-400 dark:text-stone-400">
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

  const currentChapter = getChapterForBook(group.book);
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
    <main className="relative flex flex-col h-[calc(100vh-5rem)] bg-cream dark:bg-stone-950">
      <div className="bg-white dark:bg-stone-900 border-b dark:border-stone-700 px-5 py-4 flex items-center gap-3 shrink-0">
        <button
          onClick={onBack}
          aria-label="Back to dashboard"
          className="w-10 h-10 rounded-full bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shadow-md text-stone-700 dark:text-stone-200 flex items-center justify-center hover:scale-105 active:scale-95 transition-all shrink-0"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => setDrawerOpen((open) => !open)}
          className="flex-1 min-w-0 text-left group"
        >
          <h2 className="font-serif text-xl font-bold text-gray-900 dark:text-amber-100 truncate group-hover:text-primary transition">
            {group.displayName}
          </h2>
          <div className="flex items-center gap-1.5 mt-0.5">
            <BookOpen className="w-3.5 h-3.5 text-primary/70" />
            <span className="text-xs text-primary/70">{group.book}</span>
            <span className="text-gray-300 dark:text-stone-400">·</span>
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
              <div className="w-8 h-8 rounded-full bg-primary/10 dark:bg-stone-800 text-primary dark:text-amber-100 flex items-center justify-center text-[11px] font-bold shrink-0">
                {msg.initials}
              </div>
            )}
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                msg.self
                  ? 'bg-primary text-white rounded-tr-none'
                  : 'bg-white dark:bg-stone-800 text-gray-800 dark:text-stone-200 rounded-tl-none shadow-sm border dark:border-stone-700'
              }`}
            >
              {!msg.self && (
                <p className="text-[11px] font-semibold text-primary dark:text-warm-amber mb-0.5">
                  {msg.author}
                </p>
              )}
              <p className="text-sm leading-relaxed dark:text-amber-100">{msg.text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-stone-900 border-t dark:border-stone-700 px-5 py-4 shrink-0">
        <div className="flex items-center gap-3 max-w-2xl mx-auto">
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Share a thought..."
            className="flex-1 bg-cream dark:bg-stone-800 text-sm text-gray-900 dark:text-amber-100 placeholder-gray-400 dark:placeholder-stone-400 rounded-full px-5 py-3 outline-none focus:ring-2 focus:ring-primary/20 transition"
          />
          <button
            onClick={sendMessage}
            disabled={!draft.trim()}
            aria-label="Send message"
            className="w-11 h-11 rounded-full bg-primary text-white flex items-center justify-center shadow-sm hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>

      {drawerOpen && (
        <div className="absolute inset-0 z-40 flex flex-col">
          <button
            className="flex-1 bg-black/40 backdrop-blur-sm"
            aria-label="Close drawer"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="bg-white dark:bg-stone-900 rounded-t-3xl shadow-2xl p-6 max-h-[80%] overflow-y-auto">
            <div className="w-12 h-1.5 rounded-full bg-gray-200 dark:bg-stone-700 mx-auto mb-5" />
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setDrawerOpen(false)}
                className="text-sm font-semibold text-gray-500 dark:text-stone-300 hover:text-primary transition"
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
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 dark:bg-stone-800 text-gray-600 dark:text-stone-200 hover:bg-gray-200 dark:hover:bg-stone-700'
                  }`}
                >
                  {tab === 'overview' ? 'Overview' : 'Resources & Info'}
                </button>
              ))}
            </div>

            {drawerTab === 'overview' ? (
              <div className="space-y-5">
                <div className="bg-primary/5 dark:bg-stone-800 rounded-2xl p-5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-primary/70 dark:text-warm-amber">
                    Current Chapter
                  </p>
                  <p className="font-serif text-2xl font-bold text-primary dark:text-amber-100 mt-1">
                    {currentChapter}
                  </p>
                </div>

                <div className="flex items-start gap-4 bg-white dark:bg-stone-800 rounded-2xl p-5 border dark:border-stone-700 shadow-sm">
                  <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold shrink-0">
                    {getInitials(group.moderatorName)}
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-primary/70 dark:text-warm-amber">
                      Moderator
                    </p>
                    <p className="font-serif text-lg font-bold text-gray-900 dark:text-amber-100">
                      {group.moderatorName}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-stone-200 mt-1 leading-relaxed">
                      {modFirstName} has walked with this circle for two seasons, holding
                      space for honest questions.
                    </p>
                  </div>
                </div>

                <div className="bg-primary/5 dark:bg-stone-800 rounded-2xl p-5">
                  <p className="text-sm font-semibold text-primary dark:text-warm-amber">
                    This week's focus: {group.topic}
                  </p>
                  <ul className="mt-3 space-y-2">
                    <li className="flex items-start gap-2 text-sm text-gray-700 dark:text-stone-200">
                      <span className="mt-1.5 w-1 h-1 rounded-full bg-primary shrink-0" />
                      What word or phrase are you carrying into this week?
                    </li>
                    <li className="flex items-start gap-2 text-sm text-gray-700 dark:text-stone-200">
                      <span className="mt-1.5 w-1 h-1 rounded-full bg-primary shrink-0" />
                      Where did you sense God's presence recently?
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="bg-white dark:bg-stone-800 rounded-2xl p-5 border dark:border-stone-700 shadow-sm">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-primary/70 dark:text-warm-amber mb-3">
                    Group Details
                  </p>
                  <div className="space-y-2 text-sm text-gray-700 dark:text-stone-200">
                    <p>
                      <span className="text-gray-500 dark:text-stone-400">Topic:</span> {group.topic}
                    </p>
                    <p>
                      <span className="text-gray-500 dark:text-stone-400">Meets:</span> {group.meetingTime}
                    </p>
                    <p>
                      <span className="text-gray-500 dark:text-stone-400">Members:</span>{' '}
                      {group.activeMemberCount}/{group.capacity}
                    </p>
                    <p>
                      <span className="text-gray-500 dark:text-stone-400">Length:</span> 6-week study · ~60 min
                      sessions
                    </p>
                  </div>
                </div>

                <a
                  href="https://zoom.us/j/000000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-primary text-white text-sm font-semibold rounded-xl py-3 hover:bg-primary/90 transition shadow-sm"
                >
                  <Video className="w-4 h-4" />
                  Join Zoom Session
                </a>

                <div className="bg-white dark:bg-stone-800 rounded-2xl border dark:border-stone-700 shadow-sm overflow-hidden">
                  {[
                    { label: 'Study guide (PDF)', icon: FileText },
                    { label: 'Reading plan', icon: Link },
                    { label: 'Worship playlist', icon: Link },
                  ].map((resource, idx) => (
                    <button
                      key={idx}
                      className="w-full flex items-center gap-3 px-5 py-3.5 text-left text-sm font-semibold text-gray-700 dark:text-stone-200 hover:bg-primary/5 dark:hover:bg-stone-700 transition border-b dark:border-stone-700 last:border-0"
                    >
                      <resource.icon className="w-4 h-4 text-primary dark:text-warm-amber" />
                      {resource.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 space-y-3">
              <button
                onClick={handleInvite}
                className="w-full flex items-center justify-center gap-2 border border-primary/20 dark:border-warm-amber/30 text-primary dark:text-warm-amber text-sm font-semibold rounded-xl py-3 hover:bg-primary/5 dark:hover:bg-stone-800 transition"
              >
                <UserPlus className="w-4 h-4" />
                {invited ? 'Invite link copied ✓' : 'Invite Others'}
              </button>

              <button
                onClick={() => setConfirmLeaveId(group.id)}
                className="w-full flex items-center justify-center gap-2 text-gray-500 dark:text-stone-300 text-sm font-semibold rounded-xl py-3 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-300 transition"
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
          <div className="relative w-full max-w-sm bg-white dark:bg-stone-900 rounded-3xl p-7 shadow-2xl text-center">
            <p className="text-[10px] font-bold uppercase tracking-wider text-primary/70 dark:text-warm-amber mb-2">
              Leaving circle
            </p>
            <h3 className="font-serif text-2xl font-bold text-gray-900 dark:text-amber-100">
              Are you sure you want to leave this circle?
            </h3>
            <p className="text-sm text-gray-600 dark:text-stone-300 mt-3 leading-relaxed">
              You can always rejoin if space opens up.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                onClick={() => setConfirmLeaveId(null)}
                className="w-full bg-gray-100 dark:bg-stone-800 text-gray-700 dark:text-stone-200 text-sm font-semibold rounded-xl py-3 hover:bg-gray-200 dark:hover:bg-stone-700 transition"
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
  const [browseSearch, setBrowseSearch] = useState('');
  const [filters, setFilters] = useState({
    local: true,
    online: true,
    oldTestament: true,
    newTestament: true,
  });
  const [joinedIds, setJoinedIds] = useState<string[]>(() => {
    try {
      if (!user.email) return [];
      const raw = localStorage.getItem(`user_${user.email.toLowerCase()}`);
      if (!raw) return [];
      const blob = JSON.parse(raw);
      const stored: string[] = blob.joinedStudyGroups || [];
      return Array.from(new Set(stored))
        .filter((id) => SEED_GROUPS.some((g) => g.id === id))
        .slice(0, MAX_GROUPS);
    } catch {
      return [];
    }
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
    if (typeof window === 'undefined' || !user.email) return;
    try {
      const key = `user_${user.email.toLowerCase()}`;
      const raw = localStorage.getItem(key);
      const blob = raw ? JSON.parse(raw) : {};
      blob.joinedStudyGroups = joinedIds;
      localStorage.setItem(key, JSON.stringify(blob));
    } catch {
      /* ignore write errors */
    }
  }, [joinedIds, user.email]);

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
    <header className="bg-white dark:bg-stone-900 border-b dark:border-stone-700 px-6 py-5 sticky top-0 z-30">
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-primary/10 dark:bg-stone-800 text-primary dark:text-warm-amber flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-serif text-xl font-bold text-gray-900 dark:text-amber-100">Bible Study</h1>
            <p className="text-xs text-gray-500 dark:text-stone-300 mt-0.5">Find your circle. Grow in the Word.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600 dark:text-stone-300 hidden sm:inline">Hi, {getFirstName(user.name)}</span>
          {!browseOpen && (
            <button
              onClick={() => setBrowseOpen(true)}
              aria-label="Browse bible study groups"
              className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-sm hover:bg-primary/90 hover:shadow-md active:scale-95 transition"
            >
              <Plus className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );

  const ActiveGroupCard = ({ group }: { group: BibleStudyGroup }) => (
    <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 shadow-sm border dark:border-stone-700 relative overflow-hidden">
      <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-primary/30 via-primary/60 to-primary/30" />
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wider text-primary/70 dark:text-warm-amber">
            {group.book}
          </p>
          <h2 className="font-serif text-2xl font-bold text-gray-900 dark:text-amber-100 mt-1 leading-tight">
            {group.displayName}
          </h2>
        </div>
        <StatusPill status={group.status} />
      </div>

      <p className="text-sm text-gray-500 dark:text-stone-300 mt-3 leading-relaxed">{group.topic}</p>

      <div className="mt-5 flex flex-col gap-3 text-sm text-gray-600 dark:text-stone-200">
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-full bg-primary/10 dark:bg-stone-800 text-primary dark:text-warm-amber flex items-center justify-center shrink-0">
            <User className="w-4 h-4" />
          </span>
          <span className="truncate">Led by {group.moderatorName}</span>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-full bg-primary/10 dark:bg-stone-800 text-primary dark:text-warm-amber flex items-center justify-center shrink-0">
            <Clock className="w-4 h-4" />
          </span>
          <span>{group.meetingTime}</span>
        </div>
      </div>

      <div className="mt-6">
        <CapacityBar active={group.activeMemberCount} capacity={group.capacity} />
      </div>

      {atGroupLimit && (
        <div className="mt-5 text-xs text-amber-700 dark:text-amber-200 bg-amber-50 dark:bg-amber-900/30 rounded-xl px-3 py-2 inline-flex items-center">
          You're at the {MAX_GROUPS}-group limit — leave one to join another.
        </div>
      )}

      <button
        onClick={() => onOpenGroup(group)}
        className="mt-6 w-full bg-primary text-white text-sm font-semibold rounded-xl py-3 hover:bg-primary/90 active:scale-[0.98] transition shadow-sm"
      >
        Open Circle
      </button>

      <div className="mt-4 text-center">
        <button
          onClick={() => setBrowseOpen(true)}
          className="text-sm font-semibold text-primary dark:text-warm-amber underline underline-offset-4 hover:text-primary/90 dark:hover:text-warm-amber/80 transition"
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
      <div className="bg-white dark:bg-card-warm rounded-2xl p-5 shadow-sm border dark:border-stone-700 hover:shadow-md transition relative">
        <div className="absolute top-5 right-5">
          <StatusPill status={group.status} />
        </div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-primary/70 dark:text-warm-amber">
          {group.book}
        </p>
        <h3 className="font-serif text-lg font-bold text-gray-900 dark:text-amber-100 mt-1 pr-16">
          {group.displayName}
        </h3>
        <p className="text-xs text-gray-500 dark:text-stone-300 mt-1">
          Led by {group.moderatorName} · {group.meetingTime}
        </p>
        <div className="mt-4 max-w-[180px]">
          <CapacityBar active={group.activeMemberCount} capacity={group.capacity} compact />
        </div>
        <div className="mt-4">
          {joined ? (
            <button
              onClick={() => handleLeave(group.id)}
              className="w-full bg-primary/10 dark:bg-stone-800 text-primary dark:text-warm-amber text-xs font-bold rounded-xl py-2.5 hover:bg-primary/15 dark:hover:bg-stone-700 transition"
            >
              Leave this circle
            </button>
          ) : full ? (
            <button
              disabled
              className="w-full bg-stone-800 dark:bg-stone-700 text-stone-400 dark:text-stone-500 text-xs font-bold rounded-xl py-2.5 cursor-not-allowed"
            >
              This circle is full
            </button>
          ) : (
            <button
              onClick={() => setConfirmJoinId(group.id)}
              className="w-full bg-primary text-white text-xs font-bold rounded-xl py-2.5 hover:bg-primary/90 transition"
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
        <div className="relative w-full max-w-md bg-white dark:bg-stone-900 rounded-3xl p-7 sm:p-8 shadow-2xl">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-primary/70 dark:text-warm-amber">
                Drop to swap
              </p>
              <h3
                id="swap-modal-heading"
                className="font-serif text-2xl font-bold text-gray-900 dark:text-amber-100 mt-1"
              >
                Swap an Active Circle
              </h3>
            </div>
            <button
              onClick={() => setSwapCandidateId(null)}
              aria-label="Cancel swap"
              className="w-9 h-9 rounded-full bg-stone-800 dark:bg-stone-700 text-stone-400 dark:text-stone-300 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-stone-600 transition shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-sm text-gray-600 dark:text-stone-200 leading-relaxed">
            You can be part of {MAX_GROUPS} circles at a time. Choose one to drop to
            make room for{' '}
            <span className="font-semibold text-primary dark:text-warm-amber">{candidate?.displayName}</span>.
          </p>

          <div className="mt-6 space-y-3">
            {currentGroups.map((g) => (
              <button
                key={g.id}
                onClick={() => handleSwap(g.id)}
                className="w-full flex items-center justify-between gap-4 bg-primary/5 dark:bg-stone-800 hover:bg-primary/10 dark:hover:bg-stone-700 rounded-2xl p-4 transition text-left"
              >
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-primary/70 dark:text-warm-amber">
                    {g.book}
                  </p>
                  <p className="font-serif text-base font-semibold text-gray-900 dark:text-amber-100 truncate">
                    {g.displayName}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-stone-300 mt-1">
                    {g.activeMemberCount}/{g.capacity} members
                  </p>
                </div>
                <span className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shrink-0 shadow-sm">
                  <ArrowLeftRight className="w-4 h-4" />
                </span>
              </button>
            ))}
          </div>

          <button
            onClick={() => setSwapCandidateId(null)}
            className="mt-6 w-full bg-stone-800 dark:bg-stone-700 text-gray-700 dark:text-stone-200 text-sm font-semibold rounded-xl py-3 hover:bg-gray-200 dark:hover:bg-stone-600 transition"
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
        <div className="w-full">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h2 className="font-serif text-2xl font-bold text-gray-900 dark:text-amber-100">Your Circles</h2>
              <p className="text-xs text-gray-500 dark:text-stone-300 mt-0.5">Step into the group that gathered.</p>
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
      <div className="w-full flex flex-col items-center text-center">
        <div className="w-24 h-24 rounded-full bg-primary/10 dark:bg-stone-800 text-primary dark:text-warm-amber flex items-center justify-center shadow-sm">
          <Users className="w-10 h-10" />
        </div>
        <h2 className="font-serif text-3xl font-bold text-gray-900 dark:text-amber-100 mt-7">
          Not in any groups currently
        </h2>
        <p className="text-sm text-gray-500 dark:text-stone-300 leading-relaxed max-w-xs mt-4">
          press the plus sign to look at any bible study groups you may be interested in.
        </p>
        <button
          onClick={() => setBrowseOpen(true)}
          className="mt-8 w-16 h-16 rounded-full bg-primary text-white shadow-xl shadow-primary/20 hover:bg-primary/90 hover:shadow-primary/30 hover:-translate-y-0.5 active:scale-95 transition flex items-center justify-center"
          aria-label="Browse bible study groups"
        >
          <Plus className="w-7 h-7" />
        </button>
      </div>
    </main>
  );

  const Scenario3 = () => {
    const book = user.bibleBook || '';
    const userLocation = (user.location || '').toLowerCase();
    const matches = SEED_GROUPS.filter(
      (g) => g.book.toLowerCase() === book.toLowerCase()
    );
    const localMatches = matches.filter(
      (g) => !g.isOnline && g.location?.toLowerCase().includes(userLocation)
    );
    const onlineMatches = matches.filter((g) => g.isOnline);
    const hasLocalNearUser = localMatches.length > 0;

    const renderedGroups = hasLocalNearUser
      ? localMatches
      : onlineMatches.length > 0
        ? onlineMatches
        : SEED_GROUPS.filter((g) => g.status !== 'full').slice(0, 3);

    const showFallback = !hasLocalNearUser && matches.length > 0;
    const noBookMatch = matches.length === 0;

    return (
      <main className="px-6 py-8">
        <div className="w-full">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-primary/70 dark:text-warm-amber">
                Matched to your book
              </p>
              <h2 className="font-serif text-2xl font-bold text-gray-900 dark:text-amber-100 mt-1">
                Spaces studying {book}
              </h2>
            </div>
            <GroupCapChip />
          </div>
          <p className="text-sm text-gray-500 dark:text-stone-300 mb-6">
            Pick a circle to start growing together.
          </p>
          {showFallback && (
            <div className="mb-6 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40 px-4 py-3 text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
              No local study found for <strong>{book}</strong> near <strong>{user.location || 'your location'}</strong> at the moment. Check out the Online option below, or use the search/'+' button to explore other books!
            </div>
          )}
          {noBookMatch && (
            <div className="mb-6 rounded-xl bg-stone-100 dark:bg-stone-800 px-4 py-3 text-xs text-gray-600 dark:text-stone-300 leading-relaxed">
              We don't have a {book} circle open right now, but these groups are starting soon. Use the search/'+' button to explore other books!
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

  const Browse = () => {
    const filteredGroups = useMemo(() => {
      let result = SEED_GROUPS;

      // Apply toggle filters
      if (!filters.local || !filters.online) {
        result = result.filter(g => {
          if (g.isOnline && !filters.online) return false;
          if (!g.isOnline && !filters.local) return false;
          return true;
        });
      }
      if (!filters.oldTestament || !filters.newTestament) {
        result = result.filter(g => {
          if (g.testament === 'Old Testament' && !filters.oldTestament) return false;
          if (g.testament === 'New Testament' && !filters.newTestament) return false;
          return true;
        });
      }

      // Apply search query
      const query = browseSearch.trim().toLowerCase();
      if (query) {
        result = result.filter(g =>
          g.book.toLowerCase().includes(query) ||
          g.moderatorName.toLowerCase().includes(query) ||
          g.topic.toLowerCase().includes(query) ||
          g.displayName.toLowerCase().includes(query)
        );
      }

      return result;
    }, [browseSearch, filters]);

    return (
      <main className="px-6 py-8">
        <div className="w-full">
          <button
            onClick={() => setBrowseOpen(false)}
            className="group flex items-center gap-1.5 text-sm text-gray-500 dark:text-stone-300 hover:text-primary transition mb-6 active:scale-95"
          >
            <span className="w-10 h-10 rounded-full bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shadow-md flex items-center justify-center text-stone-700 dark:text-stone-200 group-hover:scale-105 transition-all">
              <ArrowLeft className="w-4 h-4" />
            </span>
            Back
          </button>
          <p className="text-[10px] font-bold uppercase tracking-wider text-primary/70 dark:text-warm-amber">
            All circles
          </p>
          <h2 className="font-serif text-2xl font-bold text-gray-900 dark:text-amber-100 mt-1">
            Browse Bible study groups
          </h2>
          <p className="text-sm text-gray-500 dark:text-stone-300 mt-1 mb-6">
            Choose a circle to begin your journey.
          </p>

          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={browseSearch}
              onChange={(e) => setBrowseSearch(e.target.value)}
              placeholder="Search by book, leader, or topic..."
              className="w-full bg-white dark:bg-card-warm text-sm text-gray-900 dark:text-stone-100 placeholder-stone-400 rounded-full pl-11 pr-5 py-3 outline-none focus:ring-2 focus:ring-primary/20 transition border border-gray-200 dark:border-stone-700"
            />
          </div>

          {/* 4 Filter Chips */}
          <div className="flex flex-wrap gap-2 mb-6">
            {([
              { key: 'local', label: 'Local' },
              { key: 'online', label: 'Online' },
              { key: 'oldTestament', label: 'Old Testament' },
              { key: 'newTestament', label: 'New Testament' },
            ] as const).map(chip => (
              <button
                key={chip.key}
                onClick={() => setFilters(prev => ({ ...prev, [chip.key]: !prev[chip.key] }))}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition active:scale-95 ${
                  filters[chip.key]
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-stone-100 dark:bg-stone-800 text-gray-500 dark:text-stone-400 border border-gray-200 dark:border-stone-700'
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Results count */}
          <p className="text-xs text-gray-500 dark:text-stone-400 mb-4">
            {filteredGroups.length} {filteredGroups.length === 1 ? 'circle' : 'circles'} found
          </p>

          {/* Results */}
          {filteredGroups.length === 0 ? (
            <div className="flex flex-col items-center text-center py-16">
              <div className="w-16 h-16 rounded-full bg-primary/10 dark:bg-stone-800 text-primary dark:text-warm-amber flex items-center justify-center mb-4">
                <Search className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-amber-100">
                No circles found
              </h3>
              <p className="text-sm text-gray-500 dark:text-stone-300 mt-2 max-w-xs">
                No study groups match your filters at the moment. Try adjusting your search or toggling different filters.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredGroups.map((g) => (
                <GroupCard key={g.id} group={g} />
              ))}
            </div>
          )}
        </div>
      </main>
    );
  };

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
    <section className="min-h-screen bg-cream dark:bg-stone-950 text-gray-900 dark:text-amber-100 font-sans overflow-x-hidden select-none">
      <Header />
      {renderContent()}
      <SwapModal />

      {confirmJoinId && joinCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setConfirmJoinId(null)}
          />
          <div className="relative w-full max-w-sm bg-white dark:bg-stone-900 rounded-3xl p-7 shadow-2xl text-center">
            <p className="text-[10px] font-bold uppercase tracking-wider text-primary/70 dark:text-warm-amber mb-2">
              Join circle
            </p>
            <h3 className="font-serif text-2xl font-bold text-gray-900 dark:text-amber-100">
              Join this circle?
            </h3>
            <p className="font-serif text-lg text-primary dark:text-warm-amber mt-1">
              {joinCandidate.displayName}
            </p>
            <p className="text-sm text-gray-600 dark:text-stone-300 mt-3 leading-relaxed">
              You'll grow alongside {joinCandidate.activeMemberCount} others.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                onClick={() => setConfirmJoinId(null)}
                className="w-full bg-gray-100 dark:bg-stone-800 text-gray-700 dark:text-stone-200 text-sm font-semibold rounded-xl py-3 hover:bg-gray-200 dark:hover:bg-stone-700 transition"
              >
                Not yet
              </button>
              <button
                onClick={() => {
                  handleJoin(confirmJoinId);
                  setConfirmJoinId(null);
                }}
                className="w-full bg-primary text-white text-sm font-semibold rounded-xl py-3 hover:bg-primary/90 transition"
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
