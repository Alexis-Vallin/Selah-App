import {
  ArrowLeft,
  Bell,
  BookOpen,
  Check,
  ChevronRight,
  Edit2,
  Flame,
  Hash,
  Heart,
  HelpCircle,
  Home,
  LogOut,
  MessageCircle,
  Moon,
  Plus,
  Send,
  Settings,
  ShieldCheck,
  Sun,
  ThumbsUp,
  UserCircle,
  Users,
  X
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { STRUGGLES } from '../constants';
import { generateScriptureOfTheDay } from '../services/geminiService';
import { CommunityPost, StruggleType, UserProfile } from '../types';
import { Button } from './Button';
import { DiscussionsDropdown } from './Discussions-Dropdown';
import { TagPillButton } from './Pill-Button';


interface DashboardProps {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  onLogout: () => void;
}

type Tab = 'home' | 'discussions' | 'biblestudy' | 'profile';
type ProfileView = 'menu' | 'edit-profile' | 'struggles' | 'interests' | 'prayers' | 'notifications' | 'account' | 'help' | 'logout';

// Minimalist Pastoral Staff / Shepherd's Crook Icon Component
const ShepherdStaffIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6 text-primary dark:text-emerald-400" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.3"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {/* Clean Shepherd Crook curved handle at top descending to straight staff */}
    <path d="M12 21V9a4 4 0 1 1 8 0v2" />
  </svg>
);

export const Dashboard: React.FC<DashboardProps> = ({ user, setUser, onLogout }) => {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [profileView, setProfileView] = useState<ProfileView>('menu');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  const [scripture, setScripture] = useState<{ verseText: string, reference: string } | null>(null);

  // Single "Prayer Request of the Day" State
  const [dailyPrayer, setDailyPrayer] = useState({
    id: 'daily-prayer-1',
    country: 'South Africa',
    flag: '🇿🇦',
    author: 'Anonymous',
    content: "Please pray for wisdom as I navigate a difficult career change and seek God's direction for my family during this uncertain transition.",
    prayedCount: 84,
    hasPrayed: false
  });

  // Collapsible Submit Prayer Request Form State
  const [showSubmitPrayer, setShowSubmitPrayer] = useState(false);
  const [userPrayerText, setUserPrayerText] = useState('');
  const [postAnonymously, setPostAnonymously] = useState(true);
  const [prayerSubmittedNotice, setPrayerSubmittedNotice] = useState<string | null>(null);

  // Discussions state with rotating scripture & fellowship fallback streams
  const [selectedChannel, setSelectedChannel] = useState<string>('daily-verse');

  // Focus Areas pill selection state
  const focusAreas = ['Faith Doubts', 'Addiction', 'Relationships', 'Career Path', 'Parenting', 'Grief & Loss'];
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());

  const [channelPosts, setChannelPosts] = useState<Record<string, CommunityPost[]>>({
    'daily-verse': [
      { id: 'dv1', author: 'Pastor Mark', content: 'Welcome everyone! Today\'s passage calls us to trust completely in Him. What verse stood out to you in your morning reading?', timestamp: Date.now() - 3600000, likes: 14 },
      { id: 'dv2', author: 'Sarah J.', content: 'Rejoicing in hope really grounded my morning. Praying for everyone here today!', timestamp: Date.now() - 1800000, likes: 8 },
      { id: 'dv3', author: 'Brother Thomas', content: 'Daily Reflection: "The Lord is my light and my salvation; whom shall I fear?" (Psalm 27:1)', timestamp: Date.now() - 900000, likes: 12 }
    ],
    'general-fellowship': [
      { id: 'gf1', author: 'David K.', content: 'Grateful to join this digital table. God is moving in incredible ways across our global community.', timestamp: Date.now() - 7200000, likes: 11 },
      { id: 'gf2', author: 'Grace M.', content: 'Encouraging thought for today: Remember to give thanks for the small blessings and quiet moments of prayer.', timestamp: Date.now() - 3600000, likes: 9 }
    ]
  });
  const [newChannelPost, setNewChannelPost] = useState('');

  // Group Capacity Modal State for Bible Study
  const [selectedGroupModal, setSelectedGroupModal] = useState<{
    id: string;
    name: string;
    leader: string;
    members: string;
    book: string;
    isFull: boolean;
  } | null>(null);

  const [modalActionMessage, setModalActionMessage] = useState<string | null>(null);

  // Sync Dark Mode class with root document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Load Scripture
  useEffect(() => {
    let mounted = true;
    generateScriptureOfTheDay(user.struggles || [])
      .then(data => {
        if (mounted) setScripture(data);
      });
    return () => { mounted = false; };
  }, [user.struggles]);




  // -- Actions --
  const handleToggleDailyPrayer = () => {
    setDailyPrayer(prev => {
      const nextPrayed = !prev.hasPrayed;
      return {
        ...prev,
        hasPrayed: nextPrayed,
        prayedCount: nextPrayed ? prev.prayedCount + 1 : prev.prayedCount - 1
      };
    });
  };

  const handleUserPrayerSubmit = () => {
    if (!userPrayerText.trim()) return;
    setPrayerSubmittedNotice("Your prayer request has been submitted to the fellowship stream. May God bless you!");
    setUserPrayerText('');
    setShowSubmitPrayer(false);
    setTimeout(() => setPrayerSubmittedNotice(null), 5000);
  };

  const handlePostToChannel = () => {
    if (!newChannelPost.trim()) return;
    const post: CommunityPost = {
      id: Date.now().toString(),
      author: user.name || 'Anonymous Believer',
      content: newChannelPost.trim(),
      timestamp: Date.now(),
      likes: 0
    };
    setChannelPosts(prev => ({
      ...prev,
      [selectedChannel]: [post, ...(prev[selectedChannel] || [])]
    }));
    setNewChannelPost('');
  };

  const updateProfile = (key: keyof UserProfile, value: any) => {
    setUser(prev => ({ ...prev, [key]: value }));
  };

  // Derive channels list with automatic fallback to General Fellowship
  const userStrugglesList = user.struggles || [];
  const userInterestsList = user.biblicalInterests || [];

  const channels = [
    { id: 'daily-verse', name: '📌 Daily Scripture Reflections', category: 'Global' },
    { id: 'general-fellowship', name: 'General Fellowship', category: 'Global' },
    ...userStrugglesList.map(s => ({
      id: `struggle-${s.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      name: s === StruggleType.OTHER && user.specificStruggle ? `Specialized Lounge: ${user.specificStruggle.slice(0, 18)}...` : `Focus: ${s}`,
      category: 'My Focus Areas'
    })),
    ...userInterestsList.map(bi => ({
      id: `interest-${bi.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      name: `Interest: ${bi}`,
      category: 'Biblical Interests'
    }))
  ];

  // Helper menu card
  const MenuCard = ({ icon: Icon, title, subtitle, onClick, isDanger }: any) => (
    <button onClick={onClick} className="w-full bg-white dark:bg-slate-800 p-4 rounded-xl shadow-xs border border-gray-100 dark:border-slate-700/80 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition">
      <div className={`p-2 rounded-full ${isDanger ? 'bg-red-50 dark:bg-red-950/50 text-red-500' : 'bg-primary/5 dark:bg-emerald-950/60 text-primary dark:text-emerald-400'}`}>
        <Icon size={22} />
      </div>
      <div className="flex-1 text-left">
        <h3 className={`font-bold text-sm ${isDanger ? 'text-red-500' : 'text-gray-800 dark:text-slate-100'}`}>{title}</h3>
        {subtitle && <p className="text-xs text-gray-500 dark:text-slate-400">{subtitle}</p>}
      </div>
      <ChevronRight size={18} className="text-gray-300 dark:text-slate-500" />
    </button>
  );

  // -- Render Tab 1: Home --
  const renderHome = () => {
    const mainStruggle = (user.struggles && user.struggles.length > 0) ? user.struggles[0] : 'Faith & Fellowship';
    const userName = user.name || 'Believer';

    return (
      <div className="space-y-6 pb-24 animate-fade-in">
        {/* Header: Minimalist Staff Icon + User Greeting */}
        <div className="flex justify-between items-center pt-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-primary/10 dark:bg-emerald-950/60 rounded-xl flex items-center justify-center border border-primary/15 dark:border-emerald-800/50">
              <ShepherdStaffIcon className="w-6 h-6 text-primary dark:text-emerald-400" />
            </div>
            <div>
              <h1 className="font-serif text-lg font-bold text-primary dark:text-emerald-400 leading-tight">
                Welcome, {userName}
              </h1>
              <p className="text-[11px] text-gray-500 dark:text-slate-400">Peace be with you today</p>
            </div>
          </div>

          <div className="flex items-center bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-300 px-3 py-1.5 rounded-full text-xs font-bold border border-orange-200/50 dark:border-orange-900/50">
            <Flame size={14} className="mr-1 fill-orange-500" />
            {user.streak} days streak
          </div>
        </div>

        {/* Community Stat Banner */}
        <div className="bg-secondary/10 dark:bg-emerald-950/40 border border-secondary/20 dark:border-emerald-800/40 rounded-2xl p-4 text-xs text-secondary dark:text-emerald-300 leading-relaxed font-medium flex items-start gap-3 shadow-xs">
          <Users size={20} className="text-primary dark:text-emerald-400 shrink-0 mt-0.5" />
          <div>
            Did you know? <strong className="text-primary dark:text-emerald-300 font-bold">64% of believers</strong> in our fellowship are navigating <span className="underline font-semibold">{mainStruggle}</span> alongside you today. You are not alone!
          </div>
        </div>



        {/* Scripture of the Day */}
        <div className="bg-primary dark:bg-emerald-950 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden border border-primary/20 dark:border-emerald-800/50">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-28 h-28 bg-white opacity-10 rounded-full blur-xl"></div>
          <h3 className="text-xs uppercase tracking-widest text-white/70 dark:text-emerald-200/70 mb-2 font-semibold">Scripture of the Day</h3>
          {scripture ? (
            <>
              <p className="font-serif text-base md:text-lg leading-relaxed italic mb-4">"{scripture.verseText}"</p>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs font-bold text-accent dark:text-emerald-300">{scripture.reference}</span>
                <button
                  onClick={() => setActiveTab('discussions')}
                  className="bg-white/20 hover:bg-white/30 text-white text-xs font-bold py-2 px-3.5 rounded-full transition-all flex items-center gap-1.5"
                >
                  <MessageCircle size={14} />
                  Join Global Discussion
                </button>
              </div>
            </>
          ) : (
            <p className="animate-pulse text-sm">Opening scripture...</p>
          )}
        </div>

        {/* Submission Toast Notice if available */}
        {prayerSubmittedNotice && (
          <div className="bg-green-700 text-white p-3.5 rounded-xl text-xs font-medium flex justify-between items-center shadow-md animate-fade-in">
            <span>{prayerSubmittedNotice}</span>
            <button onClick={() => setPrayerSubmittedNotice(null)} className="hover:opacity-80">
              <X size={16} />
            </button>
          </div>
        )}

        {/* Redesigned "Prayer Request of the Day" Widget */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-xs border border-gray-100 dark:border-slate-700/80 space-y-4">
          <div className="flex justify-between items-center border-b border-gray-100 dark:border-slate-700 pb-3">
            <div className="flex items-center gap-2">
              <Heart className="text-primary dark:text-emerald-400" size={18} />
              <h3 className="font-serif font-bold text-gray-800 dark:text-slate-100 text-sm">Prayer Request of the Day</h3>
            </div>
            <span className="text-[10px] uppercase font-bold text-primary dark:text-emerald-300 bg-primary/10 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full">
              Featured Need
            </span>
          </div>

          {/* Card Body with Country Tag and Content (Strictly No Comment Thread) */}
          <div className="p-4 bg-cream/70 dark:bg-slate-900/70 rounded-xl text-xs border border-gray-200/60 dark:border-slate-700/60 space-y-3">
            <div className="flex items-center gap-2 text-secondary dark:text-emerald-400 font-bold text-xs">
              <span className="text-base">{dailyPrayer.flag}</span>
              <span>{dailyPrayer.author} from {dailyPrayer.country}</span>
            </div>

            <p className="text-gray-800 dark:text-slate-200 leading-relaxed font-serif text-sm italic">
              "{dailyPrayer.content}"
            </p>

            {/* Interactive "I Prayed For This" Button */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={handleToggleDailyPrayer}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 shadow-xs ${dailyPrayer.hasPrayed
                  ? 'bg-primary dark:bg-emerald-700 text-white ring-2 ring-primary/20'
                  : 'bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-200 hover:border-primary'
                  }`}
              >
                <Heart size={16} className={dailyPrayer.hasPrayed ? 'fill-white text-white' : 'text-primary dark:text-emerald-400'} />
                {dailyPrayer.hasPrayed
                  ? `Prayed (Thank you!) (${dailyPrayer.prayedCount})`
                  : `🙏 I Prayed For This (${dailyPrayer.prayedCount})`
                }
              </button>
            </div>
          </div>

          {/* Submit Request Form Trigger */}
          <div className="pt-1">
            {!showSubmitPrayer ? (
              <button
                onClick={() => setShowSubmitPrayer(true)}
                className="w-full py-2.5 px-4 bg-cream/40 dark:bg-slate-900/40 hover:bg-cream/80 dark:hover:bg-slate-900/80 border border-dashed border-gray-300 dark:border-slate-700 text-gray-600 dark:text-slate-300 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5"
              >
                <Plus size={16} className="text-primary dark:text-emerald-400" />
                Submit Your Own Prayer Request
              </button>
            ) : (
              <div className="bg-cream/40 dark:bg-slate-900/60 p-4 rounded-xl border border-gray-200 dark:border-slate-700 space-y-3 animate-fade-in">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-800 dark:text-slate-200">Submit a Prayer Request</span>
                  <button onClick={() => setShowSubmitPrayer(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-slate-300">
                    <X size={16} />
                  </button>
                </div>

                <textarea
                  rows={3}
                  value={userPrayerText}
                  onChange={(e) => setUserPrayerText(e.target.value)}
                  placeholder="Share what is on your heart so our global community can pray with you..."
                  className="w-full p-3 text-xs bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-800 dark:text-slate-100 rounded-lg outline-none focus:border-primary resize-none"
                />

                <div className="flex justify-between items-center pt-1">
                  {/* Anonymous Toggle Switch */}
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-600 dark:text-slate-300">
                    <input
                      type="checkbox"
                      checked={postAnonymously}
                      onChange={(e) => setPostAnonymously(e.target.checked)}
                      className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary accent-primary"
                    />
                    <span className="font-medium">Post Anonymously</span>
                  </label>

                  <button
                    disabled={!userPrayerText.trim()}
                    onClick={handleUserPrayerSubmit}
                    className="px-4 py-2 bg-primary dark:bg-emerald-800 text-white text-xs font-bold rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-all flex items-center gap-1.5"
                  >
                    <Send size={14} /> Submit
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // -- Render Tab 2: Discussions --
  const renderDiscussions = () => {
    const currentChannelObj = channels.find(c => c.id === selectedChannel) || channels[0];
    const currentPosts = channelPosts[selectedChannel] || channelPosts['general-fellowship'];

    return (
      <div className="space-y-4 pb-24 animate-fade-in">
        <div className="border-b dark:border-slate-700 pb-3 flex justify-between items-center">
          <div>
            <h2 className="font-serif text-2xl text-primary dark:text-emerald-400 font-bold">Discussion Hub</h2>
            <p className="text-xs text-gray-500 dark:text-slate-400">Moderated fellowship & discussion spaces</p>
          </div>
          <span className="bg-green-100 dark:bg-emerald-950 text-green-700 dark:text-emerald-300 text-[10px] uppercase font-bold px-2.5 py-1 rounded-md flex items-center gap-1 border border-green-200 dark:border-emerald-800">
            <ShieldCheck size={12} /> Protected
          </span>
        </div>

        {/* TOP OF SCREEN*/}


        <DiscussionsDropdown title="My Focus Areas" selectedCount={selectedTags.size}>
          <div className="flex flex-wrap gap-2">
            {focusAreas.map((label) => (
              <TagPillButton
                key={label}
                label={label}
                isSelected={selectedTags.has(label)}
                onClick={() =>
                  setSelectedTags((prev) => {
                    const next = new Set(prev)
                    next.has(label) ? next.delete(label) : next.add(label)
                    return next
                  })
                }
              />
            ))}
          </div>
        </DiscussionsDropdown>



        {/* Channel Header Banner */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-100 dark:border-slate-700/80 shadow-xs flex justify-between items-center">
          <div>
            <h3 className="font-bold text-sm text-gray-800 dark:text-slate-100 flex items-center gap-1.5">
              <Hash size={16} className="text-primary dark:text-emerald-400" />
              {currentChannelObj.name}
            </h3>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">Category: {currentChannelObj.category}</p>
          </div>
          <span className="text-[11px] text-primary dark:text-emerald-400 bg-primary/5 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full font-semibold">Active</span>
        </div>

        {/* Posts Stream */}
        <div className="space-y-3 min-h-[35vh]">
          {currentPosts.map((post) => (
            <div key={post.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-100 dark:border-slate-700/80 shadow-xs space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-primary dark:text-emerald-400">{post.author}</span>
                <span className="text-gray-400 dark:text-slate-500 text-[10px]">{new Date(post.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <p className="text-xs text-gray-700 dark:text-slate-200 leading-relaxed">{post.content}</p>
              <div className="flex justify-end pt-1">
                <button
                  onClick={() => {
                    setChannelPosts(prev => ({
                      ...prev,
                      [selectedChannel]: (prev[selectedChannel] || []).map(p =>
                        p.id === post.id ? { ...p, likes: p.likes + 1 } : p
                      )
                    }));
                  }}
                  className="text-[11px] text-gray-500 dark:text-slate-400 hover:text-primary dark:hover:text-emerald-300 flex items-center gap-1 bg-cream dark:bg-slate-900 px-2.5 py-1 rounded-lg border dark:border-slate-700"
                >
                  <ThumbsUp size={12} /> {post.likes} Amen
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* New Post Input */}
        <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm flex gap-2">
          <input
            type="text"
            value={newChannelPost}
            onChange={(e) => setNewChannelPost(e.target.value)}
            placeholder={`Message #${currentChannelObj.name}...`}
            className="flex-1 text-xs p-2.5 bg-gray-50 dark:bg-slate-900 text-gray-800 dark:text-slate-100 rounded-lg outline-none border border-transparent focus:border-primary dark:focus:border-emerald-500"
            onKeyDown={(e) => e.key === 'Enter' && handlePostToChannel()}
          />
          <button
            onClick={handlePostToChannel}
            className="bg-primary dark:bg-emerald-800 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-primary/90 transition-all flex items-center gap-1"
          >
            <Send size={14} /> Send
          </button>
        </div>



        {/* BOTTOM OF SCREEN */}



      </div>
    );
  };

  // -- Render Tab 3: Bible Study --
  const renderBibleStudy = () => {
    const studyBook = user.bibleBook || 'General Fellowship';

    const sampleGroups = [
      { id: 'g104', name: `Group #104: Study on ${studyBook}`, leader: 'Pastor Mark', members: '11/12 members', isFull: true },
      { id: 'g105', name: `Group #105: ${studyBook} Evening Walk`, leader: 'Rachel Stevens', members: '7/12 members', isFull: false },
      { id: 'g106', name: `Group #106: Deep Dive into ${studyBook}`, leader: 'David Chen', members: '12/12 members', isFull: true }
    ];

    return (
      <div className="space-y-5 pb-24 animate-fade-in">
        <div>
          <h2 className="font-serif text-2xl text-primary dark:text-emerald-400 font-bold">Bible Study Spaces</h2>
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">Currently matching book: <strong className="text-primary dark:text-emerald-300">{studyBook}</strong></p>
        </div>

        {/* Action Toast Message */}
        {modalActionMessage && (
          <div className="bg-primary dark:bg-emerald-800 text-white p-3 rounded-xl text-xs font-semibold flex justify-between items-center shadow-md animate-fade-in">
            <span>{modalActionMessage}</span>
            <button onClick={() => setModalActionMessage(null)} className="hover:opacity-80">
              <X size={16} />
            </button>
          </div>
        )}

        {/* Active Group List */}
        <div className="space-y-4">
          {sampleGroups.map((grp) => (
            <div key={grp.id} className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-gray-100 dark:border-slate-700/80 shadow-xs space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-gray-800 dark:text-slate-100 text-sm flex items-center gap-1.5">
                    <BookOpen size={16} className="text-primary dark:text-emerald-400" />
                    {grp.name}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">Led by {grp.leader} • {grp.members}</p>
                </div>
                {grp.isFull ? (
                  <span className="bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-300 text-[10px] px-2 py-0.5 rounded font-bold border border-red-200 dark:border-red-800">Capacity Hit</span>
                ) : (
                  <span className="bg-green-100 dark:bg-emerald-950 text-green-700 dark:text-emerald-300 text-[10px] px-2 py-0.5 rounded font-bold border border-green-200 dark:border-emerald-800">Open</span>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => {
                    if (grp.isFull) {
                      setSelectedGroupModal({
                        id: grp.id,
                        name: grp.name,
                        leader: grp.leader,
                        members: grp.members,
                        book: studyBook,
                        isFull: true
                      });
                    } else {
                      setModalActionMessage(`Successfully joined ${grp.name}!`);
                    }
                  }}
                  className="flex-1 py-2 bg-primary dark:bg-emerald-800 text-white text-xs font-bold rounded-lg hover:bg-primary/90 transition-all"
                >
                  {grp.isFull ? 'View Group Options' : 'Join Group'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal for Group Capacities */}
        {selectedGroupModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-sm w-full space-y-4 border border-gray-100 dark:border-slate-700 shadow-xl">
              <div className="flex justify-between items-center">
                <h3 className="font-serif font-bold text-gray-800 dark:text-slate-100 text-lg">Group Capacity Hit</h3>
                <button onClick={() => setSelectedGroupModal(null)} className="text-gray-400 dark:text-slate-500 hover:text-gray-600">
                  <X size={20} />
                </button>
              </div>

              <p className="text-xs text-gray-600 dark:text-slate-300 leading-relaxed">
                <strong className="text-gray-800 dark:text-slate-100">{selectedGroupModal.name}</strong> has reached its ideal small-group size of 12 members to ensure everyone gets time to share.
              </p>

              <div className="bg-cream/70 dark:bg-slate-900/80 p-3 rounded-xl border border-gray-100 dark:border-slate-700 text-xs text-gray-700 dark:text-slate-300 space-y-1">
                <div><strong>Book:</strong> {selectedGroupModal.book}</div>
                <div><strong>Leader:</strong> {selectedGroupModal.leader}</div>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={() => {
                    setSelectedGroupModal(null);
                    setModalActionMessage("Joined Group late! Welcome aboard.");
                  }}
                  className="w-full py-3 bg-primary dark:bg-emerald-800 text-white text-xs font-bold rounded-xl hover:bg-primary/90 transition-all"
                >
                  Join Late (Override capacity)
                </button>
                <button
                  onClick={() => {
                    setSelectedGroupModal(null);
                    setModalActionMessage("Queued for the next fresh group starting in 3 days.");
                  }}
                  className="w-full py-3 border border-primary dark:border-emerald-600 text-primary dark:text-emerald-400 text-xs font-bold rounded-xl hover:bg-cream/50 dark:hover:bg-slate-700 transition-all"
                >
                  Wait for Next Group
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // -- Render Tab 4: Profile --
  const renderProfileMenu = () => {
    return (
      <div className="space-y-6 pb-24 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col items-center pt-2 pb-4">
          <div className="relative mb-3">
            {user.profilePicture ? (
              <img src={user.profilePicture} alt="Profile" className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-slate-700 shadow-md" />
            ) : (
              <div className="w-24 h-24 rounded-full bg-primary dark:bg-emerald-900 flex items-center justify-center text-white text-3xl font-serif font-bold border-4 border-white dark:border-slate-700 shadow-md">
                {user.name ? user.name.substring(0, 2).toUpperCase() : 'ME'}
              </div>
            )}
            <button
              onClick={() => setProfileView('edit-profile')}
              className="absolute bottom-0 right-0 bg-white dark:bg-slate-700 p-2 rounded-full shadow-md border border-gray-100 dark:border-slate-600 text-primary dark:text-emerald-400 hover:text-secondary"
            >
              <Edit2 size={16} />
            </button>
          </div>
          <h2 className="font-serif text-xl font-bold text-primary dark:text-emerald-400">{user.name || 'Fellow Believer'}</h2>
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">{user.email}</p>
        </div>

        {/* Active Memberships Summary Box */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-100 dark:border-slate-700/80 shadow-xs space-y-2">
          <h3 className="font-serif font-bold text-xs uppercase tracking-wide text-primary dark:text-emerald-400">Active Memberships</h3>
          <div className="text-xs text-gray-700 dark:text-slate-300 space-y-1">
            <div><strong>Bible Study:</strong> {user.bibleBook || 'General Fellowship'} Group</div>
            <div><strong>Focus Areas:</strong> {(user.struggles && user.struggles.length > 0) ? user.struggles.join(', ') : 'General Fellowship'}</div>
            <div><strong>Interests:</strong> {(user.biblicalInterests && user.biblicalInterests.length > 0) ? user.biblicalInterests.join(', ') : 'General Bible Reflection'}</div>
          </div>
        </div>

        {/* Dark Mode Switch Toggle Row */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-100 dark:border-slate-700/80 shadow-xs flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-primary/5 dark:bg-emerald-950/60 text-primary dark:text-emerald-400">
              {isDarkMode ? <Moon size={22} /> : <Sun size={22} />}
            </div>
            <div>
              <h3 className="font-bold text-sm text-gray-800 dark:text-slate-100">Dark Mode</h3>
              <p className="text-xs text-gray-500 dark:text-slate-400">Switch to obsidian night palette</p>
            </div>
          </div>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${isDarkMode ? 'bg-primary dark:bg-emerald-600' : 'bg-gray-300'}`}
          >
            <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${isDarkMode ? 'translate-x-6' : ''}`} />
          </button>
        </div>

        {/* Menu Items */}
        <div className="space-y-2.5">
          <MenuCard icon={Edit2} title="Edit Profile" subtitle="Update name, bio, and photo" onClick={() => setProfileView('edit-profile')} />
          <MenuCard icon={MessageCircle} title="My Focus Areas" subtitle="Update struggles & prayer needs" onClick={() => setProfileView('struggles')} />
          <MenuCard icon={BookOpen} title="Biblical Interests" subtitle="Update topics & study preferences" onClick={() => setProfileView('interests')} />
          <MenuCard icon={Bell} title="Notifications" subtitle="Manage reminders & alerts" onClick={() => setProfileView('notifications')} />
          <MenuCard icon={Settings} title="Account Settings" subtitle="Email, security, privacy" onClick={() => setProfileView('account')} />
          <MenuCard icon={HelpCircle} title="Help & Support" subtitle="Community support & FAQs" onClick={() => setProfileView('help')} />
          <MenuCard icon={LogOut} title="Log Out" isDanger onClick={onLogout} />
        </div>
      </div>
    );
  };

  const renderEditProfile = () => {
    const [name, setName] = useState(user.name);
    const [bio, setBio] = useState(user.bio || '');

    const handleSave = () => {
      updateProfile('name', name);
      updateProfile('bio', bio);
      setProfileView('menu');
    };

    return (
      <div className="space-y-6 pb-24 animate-fade-in">
        <div className="flex items-center gap-2 mb-4">
          <button onClick={() => setProfileView('menu')} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700"><ArrowLeft size={20} className="text-gray-800 dark:text-slate-200" /></button>
          <h2 className="font-serif text-xl text-primary dark:text-emerald-400 font-bold">Edit Profile</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-1">Name</label>
            <input value={name} onChange={e => setName(e.target.value)} className="w-full p-3.5 text-xs rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-slate-100 outline-none focus:border-primary" />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-1">About Me</label>
            <textarea
              value={bio}
              onChange={e => setBio(e.target.value)}
              maxLength={200}
              placeholder="Share a little about your faith walk..."
              className="w-full p-3.5 text-xs rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-slate-100 outline-none focus:border-primary h-28 resize-none"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button variant="outline" onClick={() => setProfileView('menu')}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </div>
    );
  };

  const renderStrugglesEdit = () => {
    const [localStruggles, setLocalStruggles] = useState(user.struggles || []);

    const toggle = (s: StruggleType) => {
      if (localStruggles.includes(s)) setLocalStruggles(localStruggles.filter(i => i !== s));
      else setLocalStruggles([...localStruggles, s]);
    };

    return (
      <div className="space-y-6 pb-24 animate-fade-in">
        <div className="flex items-center gap-2 mb-4">
          <button onClick={() => setProfileView('menu')} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700"><ArrowLeft size={20} className="text-gray-800 dark:text-slate-200" /></button>
          <h2 className="font-serif text-xl text-primary dark:text-emerald-400 font-bold">Focus Areas & Struggles</h2>
        </div>

        <div className="space-y-2">
          {STRUGGLES.map((s) => {
            const isSelected = localStruggles.includes(s);
            return (
              <button
                key={s}
                onClick={() => toggle(s)}
                className={`w-full text-left p-3.5 rounded-xl transition-all border flex justify-between items-center text-xs ${isSelected
                  ? 'bg-primary dark:bg-emerald-800 text-white border-primary shadow-xs font-bold'
                  : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-200'
                  }`}
              >
                <span>{s}</span>
                {isSelected && <Check size={16} />}
              </button>
            );
          })}
        </div>
        <Button onClick={() => { updateProfile('struggles', localStruggles); setProfileView('menu'); }}>Save Focus Areas</Button>
      </div>
    );
  };

  const renderInterestsEdit = () => {
    const [localInterests, setLocalInterests] = useState(user.biblicalInterests || []);

    const toggle = (interest: string) => {
      if (localInterests.includes(interest)) setLocalInterests(localInterests.filter(i => i !== interest));
      else setLocalInterests([...localInterests, interest]);
    };

    const options = [
      'Apologetics', 'Marriage & Family', 'Faith & Mental Health',
      'Deep Theology', 'Daily Devotionals', 'Christian Leadership', 'Other'
    ];

    return (
      <div className="space-y-6 pb-24 animate-fade-in">
        <div className="flex items-center gap-2 mb-4">
          <button onClick={() => setProfileView('menu')} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700"><ArrowLeft size={20} className="text-gray-800 dark:text-slate-200" /></button>
          <h2 className="font-serif text-xl text-primary dark:text-emerald-400 font-bold">Biblical Interests</h2>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {options.map((opt) => {
            const isSelected = localInterests.includes(opt);
            return (
              <button
                key={opt}
                onClick={() => toggle(opt)}
                className={`p-3 rounded-xl border text-xs font-semibold text-left transition-all ${isSelected
                  ? 'bg-primary dark:bg-emerald-800 text-white border-primary shadow-xs'
                  : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-200'
                  }`}
              >
                {opt}
              </button>
            );
          })}
        </div>
        <Button onClick={() => { updateProfile('biblicalInterests', localInterests); setProfileView('menu'); }}>Save Interests</Button>
      </div>
    );
  };

  const renderNotificationsSettings = () => (
    <div className="space-y-6 pb-24 animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <button onClick={() => setProfileView('menu')} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700"><ArrowLeft size={20} className="text-gray-800 dark:text-slate-200" /></button>
        <h2 className="font-serif text-xl text-primary dark:text-emerald-400 font-bold">Notifications</h2>
      </div>

      <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-gray-100 dark:border-slate-700 space-y-4 text-xs">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-bold text-gray-800 dark:text-slate-100">Daily Reminders</h3>
            <p className="text-[11px] text-gray-500 dark:text-slate-400">Remind me to connect with fellowship</p>
          </div>
          <div
            onClick={() => updateProfile('notificationsEnabled', !user.notificationsEnabled)}
            className={`w-11 h-6 rounded-full p-1 cursor-pointer transition-colors ${user.notificationsEnabled ? 'bg-primary dark:bg-emerald-600' : 'bg-gray-300'}`}
          >
            <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${user.notificationsEnabled ? 'translate-x-5' : ''}`} />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-cream dark:bg-slate-900 max-w-md mx-auto relative flex flex-col transition-colors duration-300">
      <div className="flex-1 p-6 overflow-y-auto">
        {activeTab === 'home' && renderHome()}
        {activeTab === 'discussions' && renderDiscussions()}
        {activeTab === 'biblestudy' && renderBibleStudy()}
        {activeTab === 'profile' && (
          <>
            {profileView === 'menu' && renderProfileMenu()}
            {profileView === 'edit-profile' && renderEditProfile()}
            {profileView === 'struggles' && renderStrugglesEdit()}
            {profileView === 'interests' && renderInterestsEdit()}
            {profileView === 'notifications' && renderNotificationsSettings()}
            {profileView === 'account' && (
              <div className="space-y-4 pb-24">
                <button onClick={() => setProfileView('menu')} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700"><ArrowLeft size={20} className="text-gray-800 dark:text-slate-200" /></button>
                <h2 className="font-serif text-xl text-primary dark:text-emerald-400 font-bold">Account Privacy Settings</h2>
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-100 dark:border-slate-700 text-xs space-y-3">
                  <p className="text-gray-600 dark:text-slate-300">Your account data is private and encrypted. Group discussions are protected by moderation tools.</p>
                </div>
              </div>
            )}
            {profileView === 'help' && (
              <div className="space-y-4 pb-24">
                <button onClick={() => setProfileView('menu')} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700"><ArrowLeft size={20} className="text-gray-800 dark:text-slate-200" /></button>
                <h2 className="font-serif text-xl text-primary dark:text-emerald-400 font-bold">Help & Support</h2>
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-100 dark:border-slate-700 text-xs space-y-2">
                  <p className="font-bold text-primary dark:text-emerald-400">How do group capacities work?</p>
                  <p className="text-gray-600 dark:text-slate-300">Each small group is capped at 12 members. If full, you can choose 'Join Late' or 'Wait for Next Group'.</p>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Streamlined 4-Tab Bottom Navigation */}
      <div className="bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 px-4 py-2 flex justify-between items-center z-50 shadow-md">
        <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center flex-1 py-1 ${activeTab === 'home' ? 'text-primary dark:text-emerald-400 font-bold' : 'text-gray-400 dark:text-slate-500'}`}>
          <Home size={20} />
          <span className="text-[10px] mt-0.5">Home</span>
        </button>
        <button onClick={() => setActiveTab('discussions')} className={`flex flex-col items-center flex-1 py-1 ${activeTab === 'discussions' ? 'text-primary dark:text-emerald-400 font-bold' : 'text-gray-400 dark:text-slate-500'}`}>
          <MessageCircle size={20} />
          <span className="text-[10px] mt-0.5">Discussions</span>
        </button>
        <button onClick={() => setActiveTab('biblestudy')} className={`flex flex-col items-center flex-1 py-1 ${activeTab === 'biblestudy' ? 'text-primary dark:text-emerald-400 font-bold' : 'text-gray-400 dark:text-slate-500'}`}>
          <BookOpen size={20} />
          <span className="text-[10px] mt-0.5">Bible Study</span>
        </button>
        <button onClick={() => { setActiveTab('profile'); setProfileView('menu'); }} className={`flex flex-col items-center flex-1 py-1 ${activeTab === 'profile' ? 'text-primary dark:text-emerald-400 font-bold' : 'text-gray-400 dark:text-slate-500'}`}>
          <UserCircle size={20} />
          <span className="text-[10px] mt-0.5">Profile</span>
        </button>
      </div>
    </div>
  );
};
