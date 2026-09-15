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
  MapPin,
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
import { CommunityPost, PrayerEntry, StruggleType, UserProfile } from '../types';
import { BibleStudy } from './BibleStudy';
import { Button } from './Button';


interface DashboardProps {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  onLogout: () => void;
}

type Tab = 'home' | 'discussions' | 'biblestudy' | 'profile';
type ProfileView = 'menu' | 'edit-profile' | 'location' | 'struggles' | 'interests' | 'prayers' | 'notifications' | 'account' | 'help' | 'logout';

export const Dashboard: React.FC<DashboardProps> = ({ user, setUser, onLogout }) => {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [profileView, setProfileView] = useState<ProfileView>('menu');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('selah_theme') === 'dark';
    } catch {
      return false;
    }
  });

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

  // User's personal prayer journal — persisted to localStorage
  const [userPrayers, setUserPrayers] = useState<PrayerEntry[]>(() => {
    try {
      const stored = localStorage.getItem('selah_user_prayers');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Discussions state with rotating scripture & fellowship fallback streams
  const [selectedChannel, setSelectedChannel] = useState<string>('daily-verse');
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

  // Sync Dark Mode class with root document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    try {
      localStorage.setItem('selah_theme', isDarkMode ? 'dark' : 'light');
    } catch { /* ignore */ }
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
    const newPrayer: PrayerEntry = {
      id: Date.now().toString(),
      content: userPrayerText.trim(),
      timestamp: Date.now(),
      anonymous: postAnonymously,
      answered: false,
      archived: false
    };
    const updated = [newPrayer, ...userPrayers];
    setUserPrayers(updated);
    localStorage.setItem('selah_user_prayers', JSON.stringify(updated));
    setPrayerSubmittedNotice("Your prayer request has been saved to your prayer journal. May God bless you!");
    setUserPrayerText('');
    setShowSubmitPrayer(false);
    setTimeout(() => setPrayerSubmittedNotice(null), 5000);
  };

  const togglePrayerAnswered = (id: string) => {
    const updated = userPrayers.map(p =>
      p.id === id ? { ...p, answered: !p.answered } : p
    );
    setUserPrayers(updated);
    localStorage.setItem('selah_user_prayers', JSON.stringify(updated));
  };

  const archivePrayer = (id: string) => {
    const updated = userPrayers.map(p =>
      p.id === id ? { ...p, archived: true } : p
    );
    setUserPrayers(updated);
    localStorage.setItem('selah_user_prayers', JSON.stringify(updated));
  };

  const deletePrayer = (id: string) => {
    const updated = userPrayers.filter(p => p.id !== id);
    setUserPrayers(updated);
    localStorage.setItem('selah_user_prayers', JSON.stringify(updated));
  };

  const restorePrayer = (id: string) => {
    const updated = userPrayers.map(p =>
      p.id === id ? { ...p, archived: false } : p
    );
    setUserPrayers(updated);
    localStorage.setItem('selah_user_prayers', JSON.stringify(updated));
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

  // Persist editable profile fields to localStorage so they survive reloads
  // and can be hydrated by App.tsx on next mount.
  const persistUserEdits = (updates: Partial<UserProfile>) => {
    if (updates.name !== undefined) {
      localStorage.setItem('selah_user_name', updates.name);
    }
    if (updates.location !== undefined) {
      localStorage.setItem('selah_user_location', updates.location || '');
    }
    if (updates.struggles !== undefined) {
      localStorage.setItem('selah_user_struggles', JSON.stringify(updates.struggles));
    }
    if (updates.biblicalInterests !== undefined) {
      localStorage.setItem('selah_user_interests', JSON.stringify(updates.biblicalInterests));
    }
  };

  // Derive channels list with automatic fallback to General Fellowship
  const userStrugglesList = user.struggles || [];
  const userInterestsList = user.biblicalInterests || [];

  const channels = [
    { id: 'daily-verse', name: '📌 Daily Scripture Reflections', category: 'Global' },
    { id: 'general-fellowship', name: 'General Fellowship', category: 'Global' },
    ...(user.wantsGroupMatch ? userStrugglesList.map(s => ({
      id: `struggle-${s.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      name: s === StruggleType.OTHER && user.specificStruggle ? `Specialized Lounge: ${user.specificStruggle.slice(0, 18)}...` : `Focus: ${s}`,
      category: 'Discussion Focus Areas'
    })) : []),
    ...userInterestsList.map(bi => ({
      id: `interest-${bi.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      name: `Interest: ${bi}`,
      category: 'Biblical Interests'
    }))
  ];

  // Helper menu card
  const MenuCard = ({ icon: Icon, title, subtitle, onClick, isDanger }: any) => (
    <button onClick={onClick} className="w-full bg-white dark:bg-stone-900 p-4 rounded-xl shadow-xs border border-gray-100 dark:border-stone-700/80 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-stone-800/50 transition">
      <div className={`p-2 rounded-full ${isDanger ? 'bg-red-50 dark:bg-red-950/50 text-red-500' : 'bg-primary/5 dark:bg-warm-amber/10 text-primary dark:text-warm-amber'}`}>
        <Icon size={22} />
      </div>
      <div className="flex-1 text-left">
        <h3 className={`font-bold text-sm ${isDanger ? 'text-red-500' : 'text-gray-800 dark:text-stone-100'}`}>{title}</h3>
        {subtitle && <p className="text-xs text-gray-500 dark:text-stone-400">{subtitle}</p>}
      </div>
      <ChevronRight size={18} className="text-gray-300 dark:text-stone-500" />
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
            <div className="p-1.5 bg-primary/10 dark:bg-stone-800/60 rounded-xl flex items-center justify-center border border-primary/15 dark:border-stone-700/50">
              <img src="/logo.png" alt="Selah" className="w-8 h-8 rounded-lg object-cover" />
            </div>
            <div>
              <h1 className="font-serif text-lg font-bold text-primary dark:text-warm-amber leading-tight">
                Welcome, {userName}
              </h1>
              <p className="text-[11px] text-gray-500 dark:text-stone-400">Peace be with you today</p>
            </div>
          </div>

          <div className="flex items-center bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-300 px-3 py-1.5 rounded-full text-xs font-bold border border-orange-200/50 dark:border-orange-900/50">
            <Flame size={14} className="mr-1 fill-orange-500" />
            {user.streak} days streak
          </div>
        </div>

        {/* Community Stat Banner */}
        <div className="bg-secondary/10 dark:bg-stone-800/40 border border-secondary/20 dark:border-stone-700/40 rounded-2xl p-4 text-xs text-secondary dark:text-stone-300 leading-relaxed font-medium flex items-start gap-3 shadow-xs">
          <Users size={20} className="text-primary dark:text-warm-amber shrink-0 mt-0.5" />
          <div>
            Did you know? <strong className="text-primary dark:text-warm-amber font-bold">64% of believers</strong> in our fellowship are navigating <span className="underline font-semibold">{mainStruggle}</span> alongside you today. You are not alone!
          </div>
        </div>



        {/* Scripture of the Day */}
        <div className="bg-primary dark:bg-stone-800 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden border border-primary/20 dark:border-stone-700/50">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-28 h-28 bg-white opacity-10 rounded-full blur-xl"></div>
          <h3 className="text-xs uppercase tracking-widest text-white/70 dark:text-warm-amber/70 mb-2 font-semibold">Scripture of the Day</h3>
          {scripture ? (
            <>
              <p className="font-serif text-base md:text-lg leading-relaxed italic mb-4">"{scripture.verseText}"</p>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs font-bold text-accent dark:text-amber-300">{scripture.reference}</span>
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
        <div className="bg-white dark:bg-stone-900 rounded-2xl p-5 shadow-xs border border-gray-100 dark:border-stone-700/80 space-y-4">
          <div className="flex justify-between items-center border-b border-gray-100 dark:border-stone-700 pb-3">
            <div className="flex items-center gap-2">
              <Heart className="text-primary dark:text-warm-amber" size={18} />
              <h3 className="font-serif font-bold text-gray-800 dark:text-stone-100 text-sm">Prayer Request of the Day</h3>
            </div>
          </div>

          {/* Card Body with Country Tag and Content (Strictly No Comment Thread) */}
          <div className="p-4 bg-cream/70 dark:bg-stone-900/70 rounded-xl text-xs border border-gray-200/60 dark:border-stone-700/60 space-y-3">
            <div className="flex items-center gap-2 text-secondary dark:text-warm-amber font-bold text-xs">
              <span className="text-base">{dailyPrayer.flag}</span>
              <span>{dailyPrayer.author} from {dailyPrayer.country}</span>
            </div>

            <p className="text-gray-800 dark:text-stone-200 leading-relaxed font-serif text-sm italic">
              "{dailyPrayer.content}"
            </p>

            {/* Interactive "I Prayed For This" Button */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={handleToggleDailyPrayer}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 shadow-xs ${dailyPrayer.hasPrayed
                  ? 'bg-primary dark:bg-stone-700 text-white ring-2 ring-primary/20'
                  : 'bg-white dark:bg-stone-900 border border-gray-300 dark:border-stone-600 text-gray-700 dark:text-stone-200 hover:border-primary'
                  }`}
              >
                <Heart size={16} className={dailyPrayer.hasPrayed ? 'fill-white text-white' : 'text-primary dark:text-warm-amber'} />
                {dailyPrayer.hasPrayed
                  ? `Prayed (Thank you!)`
                  : `🙏 I Prayed For This`
                }
              </button>
            </div>
          </div>

          {/* Submit Request Form Trigger */}
          <div className="pt-1">
            {!showSubmitPrayer ? (
              <button
                onClick={() => setShowSubmitPrayer(true)}
                className="w-full py-2.5 px-4 bg-cream/40 dark:bg-stone-900/40 hover:bg-cream/80 dark:hover:bg-stone-900/80 border border-dashed border-gray-300 dark:border-stone-700 text-gray-600 dark:text-stone-300 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5"
              >
                <Plus size={16} className="text-primary dark:text-warm-amber" />
                Submit Your Own Prayer Request
              </button>
            ) : (
              <div className="bg-cream/40 dark:bg-stone-900/60 p-4 rounded-xl border border-gray-200 dark:border-stone-700 space-y-3 animate-fade-in">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-800 dark:text-stone-200">Submit a Prayer Request</span>
                  <button onClick={() => setShowSubmitPrayer(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-stone-300">
                    <X size={16} />
                  </button>
                </div>

                <textarea
                  rows={3}
                  value={userPrayerText}
                  onChange={(e) => setUserPrayerText(e.target.value)}
                  placeholder="Share what is on your heart so our global community can pray with you..."
                  className="w-full p-3 text-xs bg-white dark:bg-stone-900 border border-gray-200 dark:border-stone-700 text-gray-800 dark:text-stone-100 rounded-lg outline-none focus:border-primary resize-none"
                />

                <div className="flex justify-between items-center pt-1">
                  {/* Anonymous Toggle Switch */}
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-600 dark:text-stone-300">
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
                    className="px-4 py-2 bg-primary dark:bg-stone-800 text-white text-xs font-bold rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-all flex items-center gap-1.5"
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
        <div className="border-b dark:border-stone-700 pb-3 flex justify-between items-center">
          <div>
            <h2 className="font-serif text-2xl text-primary dark:text-warm-amber font-bold">Discussion Hub</h2>
            <p className="text-xs text-gray-500 dark:text-stone-400">Moderated fellowship & discussion spaces</p>
          </div>
          <span className="bg-green-100 dark:bg-stone-900 text-green-700 dark:text-amber-300 text-[10px] uppercase font-bold px-2.5 py-1 rounded-md flex items-center gap-1 border border-green-200 dark:border-stone-800">
            <ShieldCheck size={12} /> Protected
          </span>
        </div>

        {/* Channel Selector Bar */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {channels.map((ch) => {
            const isSelected = selectedChannel === ch.id;
            return (
              <button
                key={ch.id}
                onClick={() => setSelectedChannel(ch.id)}
                className={`whitespace-nowrap text-xs px-3.5 py-2 rounded-xl font-bold transition-all shrink-0 flex items-center gap-1.5 ${isSelected
                  ? 'bg-primary dark:bg-stone-800 text-white shadow-xs'
                  : 'bg-white dark:bg-stone-900 text-gray-600 dark:text-stone-300 border border-gray-200 dark:border-stone-700 hover:border-gray-300'
                  }`}
              >
                <Hash size={12} className={isSelected ? 'text-accent dark:text-amber-300' : 'text-gray-400 dark:text-stone-500'} />
                {ch.name}
              </button>
            );
          })}
        </div>

        {/* Channel Header Banner */}
        <div className="bg-white dark:bg-stone-900 p-4 rounded-xl border border-gray-100 dark:border-stone-700/80 shadow-xs flex justify-between items-center">
          <div>
            <h3 className="font-bold text-sm text-gray-800 dark:text-stone-100 flex items-center gap-1.5">
              <Hash size={16} className="text-primary dark:text-warm-amber" />
              {currentChannelObj.name}
            </h3>
            <p className="text-xs text-gray-500 dark:text-stone-400 mt-0.5">Category: {currentChannelObj.category}</p>
          </div>
          <span className="text-[11px] text-primary dark:text-warm-amber bg-primary/5 dark:bg-stone-950/60 px-2.5 py-1 rounded-full font-semibold">Active</span>
        </div>

        {/* Posts Stream */}
        <div className="space-y-3 min-h-[35vh]">
          {currentPosts.map((post) => (
            <div key={post.id} className="bg-white dark:bg-stone-900 p-4 rounded-xl border border-gray-100 dark:border-stone-700/80 shadow-xs space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-primary dark:text-warm-amber">{post.author}</span>
                <span className="text-gray-400 dark:text-stone-500 text-[10px]">{new Date(post.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <p className="text-xs text-gray-700 dark:text-stone-200 leading-relaxed">{post.content}</p>
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
                  className="text-[11px] text-gray-500 dark:text-stone-400 hover:text-primary dark:hover:text-amber-300 flex items-center gap-1 bg-cream dark:bg-stone-900 px-2.5 py-1 rounded-lg border dark:border-stone-700"
                >
                  <ThumbsUp size={12} /> {post.likes} Amen
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* New Post Input */}
        <div className="bg-white dark:bg-stone-900 p-3 rounded-xl border border-gray-200 dark:border-stone-700 shadow-sm flex gap-2">
          <input
            type="text"
            value={newChannelPost}
            onChange={(e) => setNewChannelPost(e.target.value)}
            placeholder={`Message #${currentChannelObj.name}...`}
            className="flex-1 text-xs p-2.5 bg-gray-50 dark:bg-stone-900 text-gray-800 dark:text-stone-100 rounded-lg outline-none border border-transparent focus:border-primary dark:focus:border-warm-amber"
            onKeyDown={(e) => e.key === 'Enter' && handlePostToChannel()}
          />
          <button
            onClick={handlePostToChannel}
            className="bg-primary dark:bg-stone-800 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-primary/90 transition-all flex items-center gap-1"
          >
            <Send size={14} /> Send
          </button>
        </div>
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
              <img src={user.profilePicture} alt="Profile" className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-stone-700 shadow-md" />
            ) : (
              <div className="w-24 h-24 rounded-full bg-primary dark:bg-stone-800 flex items-center justify-center text-white text-3xl font-serif font-bold border-4 border-white dark:border-stone-700 shadow-md">
                {user.name ? user.name.substring(0, 2).toUpperCase() : 'ME'}
              </div>
            )}
            <button
              onClick={() => setProfileView('edit-profile')}
              className="absolute bottom-0 right-0 bg-white dark:bg-stone-700 p-2 rounded-full shadow-md border border-gray-100 dark:border-stone-600 text-primary dark:text-warm-amber hover:text-secondary"
            >
              <Edit2 size={16} />
            </button>
          </div>
          <h2 className="font-serif text-xl font-bold text-primary dark:text-warm-amber">{user.name || 'Fellow Believer'}</h2>
          <p className="text-xs text-gray-500 dark:text-stone-400 mt-0.5">{user.email}</p>
        </div>

        {/* Active Memberships Summary Box */}
        <div className="bg-white dark:bg-stone-900 p-4 rounded-xl border border-gray-100 dark:border-stone-700/80 shadow-xs space-y-2">
          <h3 className="font-serif font-bold text-xs uppercase tracking-wide text-primary dark:text-warm-amber">Active Memberships</h3>
          <div className="text-xs text-gray-700 dark:text-stone-300 space-y-1">
            <div><strong>Bible Study:</strong> {user.bibleBook || 'General Fellowship'} Group</div>
            <div><strong>Discussion Focus Areas:</strong> {(user.struggles && user.struggles.length > 0) ? user.struggles.join(', ') : 'General Fellowship'}</div>
            <div><strong>Interests:</strong> {(user.biblicalInterests && user.biblicalInterests.length > 0) ? user.biblicalInterests.join(', ') : 'General Bible Reflection'}</div>
          </div>
        </div>

        {/* Dark Mode Switch Toggle Row */}
        <div className="bg-white dark:bg-stone-900 p-4 rounded-xl border border-gray-100 dark:border-stone-700/80 shadow-xs flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-primary/5 dark:bg-stone-950/60 text-primary dark:text-warm-amber">
              {isDarkMode ? <Moon size={22} /> : <Sun size={22} />}
            </div>
            <div>
              <h3 className="font-bold text-sm text-gray-800 dark:text-stone-100">Dark Mode</h3>
              <p className="text-xs text-gray-500 dark:text-stone-400">Switch to obsidian night palette</p>
            </div>
          </div>
          <div className="flex items-center rounded-full bg-gray-100 dark:bg-stone-800 p-1">
            <button
              onClick={() => setIsDarkMode(false)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                !isDarkMode
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-gray-400 dark:text-stone-500'
              }`}
            >
              <Sun size={14} /> Light
            </button>
            <button
              onClick={() => setIsDarkMode(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                isDarkMode
                  ? 'bg-stone-900 dark:bg-warm-amber text-white shadow-sm'
                  : 'text-gray-400 dark:text-stone-500'
              }`}
            >
              <Moon size={14} /> Dark
            </button>
          </div>
        </div>

        {/* Menu Items */}
        <div className="space-y-2.5">
          <MenuCard icon={Edit2} title="Edit Profile" subtitle="Update name, bio, and photo" onClick={() => setProfileView('edit-profile')} />
          <MenuCard icon={MapPin} title="Location" subtitle="Update where you're joining us from" onClick={() => setProfileView('location')} />
          <MenuCard icon={MessageCircle} title="Discussion Focus Areas" subtitle="Update discussion topics & prayer needs" onClick={() => setProfileView('struggles')} />
          <MenuCard icon={Heart} title="My Prayers" subtitle="Your prayer journal & answered prayers" onClick={() => setProfileView('prayers')} />
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
      persistUserEdits({ name });
      setProfileView('menu');
    };

    return (
      <div className="space-y-6 pb-24 animate-fade-in">
        <div className="flex items-center gap-2 mb-4">
          <button onClick={() => setProfileView('menu')} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-stone-800"><ArrowLeft size={20} className="text-gray-800 dark:text-stone-200" /></button>
          <h2 className="font-serif text-xl text-primary dark:text-warm-amber font-bold">Edit Profile</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-stone-400 uppercase tracking-wide mb-1">Name</label>
            <input value={name} onChange={e => setName(e.target.value)} className="w-full p-3.5 text-xs rounded-xl border border-gray-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-gray-800 dark:text-stone-100 outline-none focus:border-primary" />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-stone-400 uppercase tracking-wide mb-1">About Me</label>
            <textarea
              value={bio}
              onChange={e => setBio(e.target.value)}
              maxLength={200}
              placeholder="Share a little about your faith walk..."
              className="w-full p-3.5 text-xs rounded-xl border border-gray-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-gray-800 dark:text-stone-100 outline-none focus:border-primary h-28 resize-none"
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

  const renderLocationEdit = () => {
    const [localLocation, setLocalLocation] = useState(user.location || '');

    const handleSave = () => {
      updateProfile('location', localLocation);
      persistUserEdits({ location: localLocation });
      setProfileView('menu');
    };

    return (
      <div className="space-y-6 pb-24 animate-fade-in">
        <div className="flex items-center gap-2 mb-4">
          <button onClick={() => setProfileView('menu')} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-stone-800"><ArrowLeft size={20} className="text-gray-800 dark:text-stone-200" /></button>
          <h2 className="font-serif text-xl text-primary dark:text-warm-amber font-bold">Location</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-stone-400 uppercase tracking-wide mb-1">City / Country</label>
            <input
              value={localLocation}
              onChange={e => setLocalLocation(e.target.value)}
              placeholder="e.g., London, UK"
              className="w-full p-3.5 text-xs rounded-xl border border-gray-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-gray-800 dark:text-stone-100 outline-none focus:border-primary"
            />
          </div>
          <p className="text-[11px] text-gray-500 dark:text-stone-400 leading-relaxed">This helps us connect you with local prayer groups and events.</p>
        </div>

        <div className="flex gap-3 pt-2">
          <Button variant="outline" onClick={() => setProfileView('menu')}>Cancel</Button>
          <Button onClick={handleSave}>Save Location</Button>
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
          <button onClick={() => setProfileView('menu')} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-stone-800"><ArrowLeft size={20} className="text-gray-800 dark:text-stone-200" /></button>
          <h2 className="font-serif text-xl text-primary dark:text-warm-amber font-bold">Discussion Focus Areas</h2>
        </div>

        <div className="space-y-2">
          {STRUGGLES.map((s) => {
            const isSelected = localStruggles.includes(s);
            return (
              <button
                key={s}
                onClick={() => toggle(s)}
                className={`w-full text-left p-3.5 rounded-xl transition-all border flex justify-between items-center text-xs ${isSelected
                  ? 'bg-primary dark:bg-stone-800 text-white border-primary shadow-xs font-bold'
                  : 'bg-white dark:bg-stone-900 border-gray-200 dark:border-stone-700 text-gray-700 dark:text-stone-200'
                  }`}
              >
                <span>{s}</span>
                {isSelected && <Check size={16} />}
              </button>
            );
          })}
        </div>
        <Button onClick={() => { updateProfile('struggles', localStruggles); persistUserEdits({ struggles: localStruggles }); setProfileView('menu'); }}>Save Focus Areas</Button>
      </div>
    );
  };

  const renderInterestsEdit = () => {
    const [localInterests, setLocalInterests] = useState(user.biblicalInterests || []);
    const [customInterest, setCustomInterest] = useState('');

    const toggle = (interest: string) => {
      if (localInterests.includes(interest)) setLocalInterests(localInterests.filter(i => i !== interest));
      else setLocalInterests([...localInterests, interest]);
    };

    const addCustomInterest = () => {
      const trimmed = customInterest.trim();
      if (trimmed && !localInterests.includes(trimmed)) {
        setLocalInterests([...localInterests, trimmed]);
        setCustomInterest('');
      }
    };

    const removeInterest = (interest: string) => {
      setLocalInterests(localInterests.filter(i => i !== interest));
    };

    const options = [
      'Apologetics',
      'Prayer Life',
      'Marriage & Family',
      'Identity in Christ',
      'Faith & Mental Health',
      'Biblical Interpretation',
      'Deep Theology',
      'Daily Devotionals',
      'Christian Leadership',
      'Other'
    ];

    const customInterestsList = localInterests.filter(i => !options.includes(i));

    return (
      <div className="space-y-6 pb-24 animate-fade-in">
        <div className="flex items-center gap-2 mb-4">
          <button onClick={() => setProfileView('menu')} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-stone-800"><ArrowLeft size={20} className="text-gray-800 dark:text-stone-200" /></button>
          <h2 className="font-serif text-xl text-primary dark:text-warm-amber font-bold">Biblical Interests</h2>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {options.map((opt) => {
            const isSelected = localInterests.includes(opt);
            return (
              <button
                key={opt}
                onClick={() => toggle(opt)}
                className={`p-3 rounded-xl border text-xs font-semibold text-left transition-all ${isSelected
                  ? 'bg-primary dark:bg-stone-800 text-white border-primary shadow-xs'
                  : 'bg-white dark:bg-stone-900 border-gray-200 dark:border-stone-700 text-gray-700 dark:text-stone-200'
                  }`}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {/* Custom Interest Input */}
        <div className="space-y-2 pt-2">
          <label className="block text-xs font-bold text-gray-500 dark:text-stone-400 uppercase tracking-wide mb-1">Add Custom Interest</label>
          <div className="flex gap-2">
            <input
              value={customInterest}
              onChange={e => setCustomInterest(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') addCustomInterest(); }}
              placeholder="e.g., Worship Music, Church History"
              className="flex-1 p-3 text-xs rounded-xl border border-gray-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-gray-800 dark:text-stone-100 outline-none focus:border-primary"
            />
            <Button onClick={addCustomInterest}>Add</Button>
          </div>
        </div>

        {/* Custom Interests as Removable Chips */}
        {customInterestsList.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {customInterestsList.map(interest => (
              <span key={interest} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 dark:bg-stone-950/60 text-primary dark:text-amber-300 rounded-full text-xs font-medium">
                {interest}
                <button onClick={() => removeInterest(interest)} className="hover:text-red-500 dark:hover:text-red-400 transition-colors">
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        )}

        <Button onClick={() => { updateProfile('biblicalInterests', localInterests); persistUserEdits({ biblicalInterests: localInterests }); setProfileView('menu'); }}>Save Interests</Button>
      </div>
    );
  };

  const renderPrayers = () => {
    const activePrayers = userPrayers.filter(p => !p.archived);
    const archivedPrayers = userPrayers.filter(p => p.archived);

    const formatDate = (timestamp: number) => {
      const date = new Date(timestamp);
      const now = new Date();
      const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays === 0) return 'Today';
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays} days ago`;
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const PrayerCard = ({ prayer }: { prayer: PrayerEntry }) => (
      <div className={`bg-white dark:bg-stone-900 p-4 rounded-xl border shadow-xs space-y-3 ${
        prayer.answered
          ? 'border-primary/40 dark:border-stone-700/60 bg-primary/5 dark:bg-stone-950/30'
          : 'border-gray-100 dark:border-stone-700/80'
      }`}>
        <p className="font-serif text-sm italic text-gray-800 dark:text-stone-200 leading-relaxed">
          "{prayer.content}"
        </p>
        <div className="flex justify-between items-center text-[11px] text-gray-500 dark:text-stone-400">
          <div className="flex items-center gap-2">
            <span>{formatDate(prayer.timestamp)}</span>
            {prayer.anonymous && (
              <span className="px-2 py-0.5 bg-gray-100 dark:bg-stone-700 rounded-full text-[10px] font-medium">
                Anonymous
              </span>
            )}
            {prayer.answered && (
              <span className="px-2 py-0.5 bg-primary/15 dark:bg-stone-900/60 text-primary dark:text-amber-300 rounded-full text-[10px] font-bold flex items-center gap-1">
                <Check size={10} /> Answered
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => togglePrayerAnswered(prayer.id)}
              className={`p-1.5 rounded-lg transition-colors ${
                prayer.answered
                  ? 'bg-primary/10 dark:bg-stone-900/60 text-primary dark:text-amber-300'
                  : 'text-gray-400 dark:text-stone-500 hover:bg-gray-100 dark:hover:bg-stone-800 hover:text-primary'
              }`}
              title={prayer.answered ? 'Mark as not answered' : 'Mark as answered'}
            >
              <Check size={14} />
            </button>
            {prayer.archived ? (
              <button
                onClick={() => restorePrayer(prayer.id)}
                className="p-1.5 rounded-lg text-gray-400 dark:text-stone-500 hover:bg-gray-100 dark:hover:bg-stone-800 hover:text-primary"
                title="Restore prayer"
              >
                <Plus size={14} />
              </button>
            ) : (
              <button
                onClick={() => archivePrayer(prayer.id)}
                className="p-1.5 rounded-lg text-gray-400 dark:text-stone-500 hover:bg-gray-100 dark:hover:bg-stone-800 hover:text-secondary"
                title="Archive prayer"
              >
                <Hash size={14} />
              </button>
            )}
            <button
              onClick={() => deletePrayer(prayer.id)}
              className="p-1.5 rounded-lg text-gray-400 dark:text-stone-500 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-500"
              title="Delete prayer"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      </div>
    );

    return (
      <div className="space-y-6 pb-24 animate-fade-in">
        <div className="flex items-center gap-2 mb-4">
          <button onClick={() => setProfileView('menu')} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-stone-800"><ArrowLeft size={20} className="text-gray-800 dark:text-stone-200" /></button>
          <h2 className="font-serif text-xl text-primary dark:text-warm-amber font-bold">My Prayers</h2>
        </div>

        {activePrayers.length === 0 && archivedPrayers.length === 0 ? (
          <div className="bg-white dark:bg-stone-900 p-8 rounded-xl border border-gray-100 dark:border-stone-700/80 text-center space-y-3">
            <Heart size={32} className="text-gray-300 dark:text-stone-600 mx-auto" />
            <p className="text-sm text-gray-600 dark:text-stone-400 leading-relaxed">
              You haven't submitted any prayers yet. Share what's on your heart from the Home tab.
            </p>
          </div>
        ) : (
          <>
            {activePrayers.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-stone-400">
                  Active Prayers ({activePrayers.length})
                </h3>
                {activePrayers.map(prayer => (
                  <PrayerCard key={prayer.id} prayer={prayer} />
                ))}
              </div>
            )}

            {archivedPrayers.length > 0 && (
              <div className="space-y-3 pt-4">
                <h3 className="text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-stone-400">
                  Archived ({archivedPrayers.length})
                </h3>
                {archivedPrayers.map(prayer => (
                  <PrayerCard key={prayer.id} prayer={prayer} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  const renderNotificationsSettings = () => (
    <div className="space-y-6 pb-24 animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <button onClick={() => setProfileView('menu')} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-stone-800"><ArrowLeft size={20} className="text-gray-800 dark:text-stone-200" /></button>
        <h2 className="font-serif text-xl text-primary dark:text-warm-amber font-bold">Notifications</h2>
      </div>

      <div className="bg-white dark:bg-stone-900 p-5 rounded-xl border border-gray-100 dark:border-stone-700 space-y-4 text-xs">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-bold text-gray-800 dark:text-stone-100">Daily Reminders</h3>
            <p className="text-[11px] text-gray-500 dark:text-stone-400">Remind me to connect with fellowship</p>
          </div>
          <div className="flex items-center rounded-full bg-gray-100 dark:bg-stone-800 p-1">
            <button
              onClick={() => updateProfile('notificationsEnabled', false)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                !user.notificationsEnabled
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-gray-400 dark:text-stone-500'
              }`}
            >
              Off
            </button>
            <button
              onClick={() => updateProfile('notificationsEnabled', true)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                user.notificationsEnabled
                  ? 'bg-stone-900 dark:bg-warm-amber text-white shadow-sm'
                  : 'text-gray-400 dark:text-stone-500'
              }`}
            >
              On
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-cream dark:bg-stone-950 max-w-md mx-auto relative flex flex-col transition-colors duration-300">
      <div className="flex-1 p-6 overflow-y-auto">
        {activeTab === 'home' && renderHome()}
        {activeTab === 'discussions' && renderDiscussions()}
        {activeTab === 'biblestudy' && <BibleStudy user={user} />}
        {activeTab === 'profile' && (
          <>
            {profileView === 'menu' && renderProfileMenu()}
            {profileView === 'edit-profile' && renderEditProfile()}
            {profileView === 'location' && renderLocationEdit()}
            {profileView === 'struggles' && renderStrugglesEdit()}
            {profileView === 'interests' && renderInterestsEdit()}
            {profileView === 'prayers' && renderPrayers()}
            {profileView === 'notifications' && renderNotificationsSettings()}
            {profileView === 'account' && (
              <div className="space-y-4 pb-24">
                <button onClick={() => setProfileView('menu')} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-stone-800"><ArrowLeft size={20} className="text-gray-800 dark:text-stone-200" /></button>
                <h2 className="font-serif text-xl text-primary dark:text-warm-amber font-bold">Account Privacy Settings</h2>
                <div className="bg-white dark:bg-stone-900 p-4 rounded-xl border border-gray-100 dark:border-stone-700 text-xs space-y-3">
                  <p className="text-gray-600 dark:text-stone-300">Your account data is private and encrypted. Group discussions are protected by moderation tools.</p>
                </div>
              </div>
            )}
            {profileView === 'help' && (
              <div className="space-y-4 pb-24">
                <button onClick={() => setProfileView('menu')} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-stone-800"><ArrowLeft size={20} className="text-gray-800 dark:text-stone-200" /></button>
                <h2 className="font-serif text-xl text-primary dark:text-warm-amber font-bold">Help & Support</h2>
                <div className="bg-white dark:bg-stone-900 p-4 rounded-xl border border-gray-100 dark:border-stone-700 text-xs space-y-2">
                  <p className="font-bold text-primary dark:text-warm-amber">How do group capacities work?</p>
                  <p className="text-gray-600 dark:text-stone-300">Each small group is capped at 12 members. If full, you can choose 'Join Late' or 'Wait for Next Group'.</p>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Streamlined 4-Tab Bottom Navigation */}
      <div className="bg-white dark:bg-stone-900 border-t border-gray-200 dark:border-stone-700 px-4 py-2 flex justify-between items-center z-50 shadow-md">
        <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center flex-1 py-1 ${activeTab === 'home' ? 'text-primary dark:text-warm-amber font-bold' : 'text-gray-400 dark:text-stone-500'}`}>
          <Home size={20} />
          <span className="text-[10px] mt-0.5">Home</span>
        </button>
        <button onClick={() => setActiveTab('discussions')} className={`flex flex-col items-center flex-1 py-1 ${activeTab === 'discussions' ? 'text-primary dark:text-warm-amber font-bold' : 'text-gray-400 dark:text-stone-500'}`}>
          <MessageCircle size={20} />
          <span className="text-[10px] mt-0.5">Discussions</span>
        </button>
        <button onClick={() => setActiveTab('biblestudy')} className={`flex flex-col items-center flex-1 py-1 ${activeTab === 'biblestudy' ? 'text-primary dark:text-warm-amber font-bold' : 'text-gray-400 dark:text-stone-500'}`}>
          <BookOpen size={20} />
          <span className="text-[10px] mt-0.5">Bible Study</span>
        </button>
        <button onClick={() => { setActiveTab('profile'); setProfileView('menu'); }} className={`flex flex-col items-center flex-1 py-1 ${activeTab === 'profile' ? 'text-primary dark:text-warm-amber font-bold' : 'text-gray-400 dark:text-stone-500'}`}>
          <UserCircle size={20} />
          <span className="text-[10px] mt-0.5">Profile</span>
        </button>
      </div>
    </div>
  );
};
