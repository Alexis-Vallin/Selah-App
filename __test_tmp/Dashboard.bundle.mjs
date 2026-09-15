// __test_tmp/stubs.mjs
import React from "react";
var makeIcon = (name) => (props) => React.createElement("svg", { "data-icon": name, ...props });
var icons = ["ArrowLeft", "Bell", "BookOpen", "Check", "ChevronRight", "Edit2", "Flame", "Hash", "Heart", "HelpCircle", "Home", "LogOut", "MapPin", "MessageCircle", "Moon", "Plus", "Send", "Settings", "ShieldCheck", "Sun", "ThumbsUp", "UserCircle", "Users", "X"];
var lucide = {};
for (const i of icons) lucide[i] = makeIcon(i);
var { ArrowLeft, Bell, BookOpen, Check, ChevronRight, Edit2, Flame, Hash, Heart, HelpCircle, Home, LogOut, MapPin, MessageCircle, Moon, Plus, Send, Settings, ShieldCheck, Sun, ThumbsUp, UserCircle, Users, X } = lucide;
var generateScriptureOfTheDay = async () => ({ verseText: "stub verse", reference: "Stub 1:1" });
var BibleStudy = (props) => React.createElement("div", { "data-stub": "BibleStudy" });
var Button = (props) => React.createElement("button", { onClick: props.onClick, className: props.className, "data-stub": "Button" }, props.children);

// components/Dashboard.tsx
import { useEffect, useState } from "react";

// types.ts
var StruggleType = /* @__PURE__ */ ((StruggleType2) => {
  StruggleType2["ANXIETY"] = "Anxiety & Worry";
  StruggleType2["RELATIONSHIP"] = "Relationship Issues";
  StruggleType2["DOUBT"] = "Faith Doubts";
  StruggleType2["LONELINESS"] = "Loneliness";
  StruggleType2["ACADEMIC"] = "Academic Pressure";
  StruggleType2["ADDICTION"] = "Addiction";
  StruggleType2["OTHER"] = "Other";
  return StruggleType2;
})(StruggleType || {});

// constants.ts
var SHEEP_LOGO_URL = "/logo.png";
var STRUGGLES = Object.values(StruggleType);
var OLD_TESTAMENT_BOOKS = [
  "Genesis",
  "Exodus",
  "Leviticus",
  "Numbers",
  "Deuteronomy",
  "Joshua",
  "Judges",
  "Ruth",
  "1 Samuel",
  "2 Samuel",
  "1 Kings",
  "2 Kings",
  "1 Chronicles",
  "2 Chronicles",
  "Ezra",
  "Nehemiah",
  "Esther",
  "Job",
  "Psalms",
  "Proverbs",
  "Ecclesiastes",
  "Song of Solomon",
  "Isaiah",
  "Jeremiah",
  "Lamentations",
  "Ezekiel",
  "Daniel",
  "Hosea",
  "Joel",
  "Amos",
  "Obadiah",
  "Jonah",
  "Micah",
  "Nahum",
  "Habakkuk",
  "Zephaniah",
  "Haggai",
  "Zechariah",
  "Malachi"
];
var NEW_TESTAMENT_BOOKS = [
  "Matthew",
  "Mark",
  "Luke",
  "John",
  "Acts",
  "Romans",
  "1 Corinthians",
  "2 Corinthians",
  "Galatians",
  "Ephesians",
  "Philippians",
  "Colossians",
  "1 Thessalonians",
  "2 Thessalonians",
  "1 Timothy",
  "2 Timothy",
  "Titus",
  "Philemon",
  "Hebrews",
  "James",
  "1 Peter",
  "2 Peter",
  "1 John",
  "2 John",
  "3 John",
  "Jude",
  "Revelation"
];
var BIBLE_BOOKS = [...OLD_TESTAMENT_BOOKS, ...NEW_TESTAMENT_BOOKS];
var MOCK_COMMUNITY_POSTS = [
  {
    id: "1",
    author: "Sarah J.",
    content: 'Verse 12 really spoke to me today about endurance. How do you all interpret "rejoicing in hope"?',
    timestamp: Date.now() - 1e6,
    likes: 5
  },
  {
    id: "2",
    author: "Mike T.",
    content: "Struggling to keep up with the reading plan this week. Prayers appreciated!",
    timestamp: Date.now() - 5e6,
    likes: 12
  }
];
var MOCK_FLOCK_POSTS = [
  {
    id: "dev1",
    author: "Pastor Michael",
    avatarUrl: "https://i.pravatar.cc/150?u=dev1",
    type: "DEVOTIONAL",
    title: "Finding Silence in the Noise",
    content: "In our busy world, silence is rare. Yet, Elijah found God not in the wind or earthquake, but in the gentle whisper. Today, take 5 minutes to just listen.",
    tags: ["SILENCE", "GROWTH", "PEACE"],
    likes: 125,
    reactions: 125,
    timestamp: Date.now() - 36e5 * 2,
    // 2 hours ago
    isUser: false
  },
  {
    id: "req1",
    author: "Grace L.",
    avatarUrl: "https://i.pravatar.cc/150?u=req1",
    type: "PRAYER_REQUEST",
    content: "Job interview tomorrow morning. Anxiety is high. Please pray for peace and clarity of mind.",
    tags: ["ANXIETY", "WORK", "TRUST"],
    likes: 89,
    reactions: 89,
    timestamp: Date.now() - 36e5 * 5,
    // 5 hours ago
    isUser: false
  },
  {
    id: "enc1",
    author: "Marcus T.",
    avatarUrl: "https://i.pravatar.cc/150?u=enc1",
    type: "ENCOURAGEMENT",
    title: "God Provided!",
    content: "I shared last week about my financial struggle. Today, an unexpected check arrived covering exactly what I needed. Jehovah Jireh!",
    tags: ["TESTIMONY", "PROVISION", "JOY"],
    likes: 240,
    reactions: 240,
    timestamp: Date.now() - 864e5,
    // 1 day ago
    isUser: false
  },
  {
    id: "req2",
    author: "Anonymous",
    avatarUrl: "",
    type: "PRAYER_REQUEST",
    content: "My marriage is hanging by a thread. We stopped talking days ago. Need a miracle.",
    tags: ["MARRIAGE", "FAMILY", "HEALING"],
    likes: 42,
    reactions: 42,
    timestamp: Date.now() - 36e5 * 12,
    // 12 hours ago
    isUser: false
  },
  {
    id: "dev2",
    author: "Selah Team",
    avatarUrl: SHEEP_LOGO_URL,
    type: "DEVOTIONAL",
    title: "Spurring One Another On",
    content: "Hebrews 10:24-25 reminds us to consider how we may spur one another on toward love and good deeds, not giving up meeting together.",
    tags: ["HEBREWS", "COMMUNITY", "FAITH"],
    likes: 312,
    reactions: 312,
    timestamp: Date.now() - 864e5 * 2,
    isUser: false
  }
];

// components/Dashboard.tsx
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var Dashboard = ({ user, setUser, onLogout }) => {
  const [activeTab, setActiveTab] = useState("home");
  const [profileView, setProfileView] = useState("menu");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [scripture, setScripture] = useState(null);
  const [dailyPrayer, setDailyPrayer] = useState({
    id: "daily-prayer-1",
    country: "South Africa",
    flag: "\u{1F1FF}\u{1F1E6}",
    author: "Anonymous",
    content: "Please pray for wisdom as I navigate a difficult career change and seek God's direction for my family during this uncertain transition.",
    prayedCount: 84,
    hasPrayed: false
  });
  const [showSubmitPrayer, setShowSubmitPrayer] = useState(false);
  const [userPrayerText, setUserPrayerText] = useState("");
  const [postAnonymously, setPostAnonymously] = useState(true);
  const [prayerSubmittedNotice, setPrayerSubmittedNotice] = useState(null);
  const [userPrayers, setUserPrayers] = useState(() => {
    try {
      const stored = localStorage.getItem("selah_user_prayers");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [selectedChannel, setSelectedChannel] = useState("daily-verse");
  const [channelPosts, setChannelPosts] = useState({
    "daily-verse": [
      { id: "dv1", author: "Pastor Mark", content: "Welcome everyone! Today's passage calls us to trust completely in Him. What verse stood out to you in your morning reading?", timestamp: Date.now() - 36e5, likes: 14 },
      { id: "dv2", author: "Sarah J.", content: "Rejoicing in hope really grounded my morning. Praying for everyone here today!", timestamp: Date.now() - 18e5, likes: 8 },
      { id: "dv3", author: "Brother Thomas", content: 'Daily Reflection: "The Lord is my light and my salvation; whom shall I fear?" (Psalm 27:1)', timestamp: Date.now() - 9e5, likes: 12 }
    ],
    "general-fellowship": [
      { id: "gf1", author: "David K.", content: "Grateful to join this digital table. God is moving in incredible ways across our global community.", timestamp: Date.now() - 72e5, likes: 11 },
      { id: "gf2", author: "Grace M.", content: "Encouraging thought for today: Remember to give thanks for the small blessings and quiet moments of prayer.", timestamp: Date.now() - 36e5, likes: 9 }
    ]
  });
  const [newChannelPost, setNewChannelPost] = useState("");
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);
  useEffect(() => {
    let mounted = true;
    generateScriptureOfTheDay(user.struggles || []).then((data) => {
      if (mounted) setScripture(data);
    });
    return () => {
      mounted = false;
    };
  }, [user.struggles]);
  const handleToggleDailyPrayer = () => {
    setDailyPrayer((prev) => {
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
    const newPrayer = {
      id: Date.now().toString(),
      content: userPrayerText.trim(),
      timestamp: Date.now(),
      anonymous: postAnonymously,
      answered: false,
      archived: false
    };
    const updated = [newPrayer, ...userPrayers];
    setUserPrayers(updated);
    localStorage.setItem("selah_user_prayers", JSON.stringify(updated));
    setPrayerSubmittedNotice("Your prayer request has been saved to your prayer journal. May God bless you!");
    setUserPrayerText("");
    setShowSubmitPrayer(false);
    setTimeout(() => setPrayerSubmittedNotice(null), 5e3);
  };
  const togglePrayerAnswered = (id) => {
    const updated = userPrayers.map(
      (p) => p.id === id ? { ...p, answered: !p.answered } : p
    );
    setUserPrayers(updated);
    localStorage.setItem("selah_user_prayers", JSON.stringify(updated));
  };
  const archivePrayer = (id) => {
    const updated = userPrayers.map(
      (p) => p.id === id ? { ...p, archived: true } : p
    );
    setUserPrayers(updated);
    localStorage.setItem("selah_user_prayers", JSON.stringify(updated));
  };
  const deletePrayer = (id) => {
    const updated = userPrayers.filter((p) => p.id !== id);
    setUserPrayers(updated);
    localStorage.setItem("selah_user_prayers", JSON.stringify(updated));
  };
  const restorePrayer = (id) => {
    const updated = userPrayers.map(
      (p) => p.id === id ? { ...p, archived: false } : p
    );
    setUserPrayers(updated);
    localStorage.setItem("selah_user_prayers", JSON.stringify(updated));
  };
  const handlePostToChannel = () => {
    if (!newChannelPost.trim()) return;
    const post = {
      id: Date.now().toString(),
      author: user.name || "Anonymous Believer",
      content: newChannelPost.trim(),
      timestamp: Date.now(),
      likes: 0
    };
    setChannelPosts((prev) => ({
      ...prev,
      [selectedChannel]: [post, ...prev[selectedChannel] || []]
    }));
    setNewChannelPost("");
  };
  const updateProfile = (key, value) => {
    setUser((prev) => ({ ...prev, [key]: value }));
  };
  const persistUserEdits = (updates) => {
    if (updates.name !== void 0) {
      localStorage.setItem("selah_user_name", updates.name);
    }
    if (updates.location !== void 0) {
      localStorage.setItem("selah_user_location", updates.location || "");
    }
    if (updates.struggles !== void 0) {
      localStorage.setItem("selah_user_struggles", JSON.stringify(updates.struggles));
    }
    if (updates.biblicalInterests !== void 0) {
      localStorage.setItem("selah_user_interests", JSON.stringify(updates.biblicalInterests));
    }
  };
  const userStrugglesList = user.struggles || [];
  const userInterestsList = user.biblicalInterests || [];
  const channels = [
    { id: "daily-verse", name: "\u{1F4CC} Daily Scripture Reflections", category: "Global" },
    { id: "general-fellowship", name: "General Fellowship", category: "Global" },
    ...user.wantsGroupMatch ? userStrugglesList.map((s) => ({
      id: `struggle-${s.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
      name: s === "Other" /* OTHER */ && user.specificStruggle ? `Specialized Lounge: ${user.specificStruggle.slice(0, 18)}...` : `Focus: ${s}`,
      category: "Discussion Focus Areas"
    })) : [],
    ...userInterestsList.map((bi) => ({
      id: `interest-${bi.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
      name: `Interest: ${bi}`,
      category: "Biblical Interests"
    }))
  ];
  const MenuCard = ({ icon: Icon, title, subtitle, onClick, isDanger }) => /* @__PURE__ */ jsxs("button", { onClick, className: "w-full bg-white dark:bg-slate-800 p-4 rounded-xl shadow-xs border border-gray-100 dark:border-slate-700/80 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition", children: [
    /* @__PURE__ */ jsx("div", { className: `p-2 rounded-full ${isDanger ? "bg-red-50 dark:bg-red-950/50 text-red-500" : "bg-primary/5 dark:bg-emerald-950/60 text-primary dark:text-emerald-400"}`, children: /* @__PURE__ */ jsx(Icon, { size: 22 }) }),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 text-left", children: [
      /* @__PURE__ */ jsx("h3", { className: `font-bold text-sm ${isDanger ? "text-red-500" : "text-gray-800 dark:text-slate-100"}`, children: title }),
      subtitle && /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 dark:text-slate-400", children: subtitle })
    ] }),
    /* @__PURE__ */ jsx(ChevronRight, { size: 18, className: "text-gray-300 dark:text-slate-500" })
  ] });
  const renderHome = () => {
    const mainStruggle = user.struggles && user.struggles.length > 0 ? user.struggles[0] : "Faith & Fellowship";
    const userName = user.name || "Believer";
    return /* @__PURE__ */ jsxs("div", { className: "space-y-6 pb-24 animate-fade-in", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center pt-1", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5", children: [
          /* @__PURE__ */ jsx("div", { className: "p-1.5 bg-primary/10 dark:bg-emerald-950/60 rounded-xl flex items-center justify-center border border-primary/15 dark:border-emerald-800/50", children: /* @__PURE__ */ jsx("img", { src: "/logo.png", alt: "Selah", className: "w-8 h-8 rounded-lg object-cover" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("h1", { className: "font-serif text-lg font-bold text-primary dark:text-emerald-400 leading-tight", children: [
              "Welcome, ",
              userName
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-[11px] text-gray-500 dark:text-slate-400", children: "Peace be with you today" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-300 px-3 py-1.5 rounded-full text-xs font-bold border border-orange-200/50 dark:border-orange-900/50", children: [
          /* @__PURE__ */ jsx(Flame, { size: 14, className: "mr-1 fill-orange-500" }),
          user.streak,
          " days streak"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-secondary/10 dark:bg-emerald-950/40 border border-secondary/20 dark:border-emerald-800/40 rounded-2xl p-4 text-xs text-secondary dark:text-emerald-300 leading-relaxed font-medium flex items-start gap-3 shadow-xs", children: [
        /* @__PURE__ */ jsx(Users, { size: 20, className: "text-primary dark:text-emerald-400 shrink-0 mt-0.5" }),
        /* @__PURE__ */ jsxs("div", { children: [
          "Did you know? ",
          /* @__PURE__ */ jsx("strong", { className: "text-primary dark:text-emerald-300 font-bold", children: "64% of believers" }),
          " in our fellowship are navigating ",
          /* @__PURE__ */ jsx("span", { className: "underline font-semibold", children: mainStruggle }),
          " alongside you today. You are not alone!"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-primary dark:bg-emerald-950 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden border border-primary/20 dark:border-emerald-800/50", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 -mt-4 -mr-4 w-28 h-28 bg-white opacity-10 rounded-full blur-xl" }),
        /* @__PURE__ */ jsx("h3", { className: "text-xs uppercase tracking-widest text-white/70 dark:text-emerald-200/70 mb-2 font-semibold", children: "Scripture of the Day" }),
        scripture ? /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsxs("p", { className: "font-serif text-base md:text-lg leading-relaxed italic mb-4", children: [
            '"',
            scripture.verseText,
            '"'
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between flex-wrap gap-2", children: [
            /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-accent dark:text-emerald-300", children: scripture.reference }),
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => setActiveTab("discussions"),
                className: "bg-white/20 hover:bg-white/30 text-white text-xs font-bold py-2 px-3.5 rounded-full transition-all flex items-center gap-1.5",
                children: [
                  /* @__PURE__ */ jsx(MessageCircle, { size: 14 }),
                  "Join Global Discussion"
                ]
              }
            )
          ] })
        ] }) : /* @__PURE__ */ jsx("p", { className: "animate-pulse text-sm", children: "Opening scripture..." })
      ] }),
      prayerSubmittedNotice && /* @__PURE__ */ jsxs("div", { className: "bg-green-700 text-white p-3.5 rounded-xl text-xs font-medium flex justify-between items-center shadow-md animate-fade-in", children: [
        /* @__PURE__ */ jsx("span", { children: prayerSubmittedNotice }),
        /* @__PURE__ */ jsx("button", { onClick: () => setPrayerSubmittedNotice(null), className: "hover:opacity-80", children: /* @__PURE__ */ jsx(X, { size: 16 }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-xs border border-gray-100 dark:border-slate-700/80 space-y-4", children: [
        /* @__PURE__ */ jsx("div", { className: "flex justify-between items-center border-b border-gray-100 dark:border-slate-700 pb-3", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Heart, { className: "text-primary dark:text-emerald-400", size: 18 }),
          /* @__PURE__ */ jsx("h3", { className: "font-serif font-bold text-gray-800 dark:text-slate-100 text-sm", children: "Prayer Request of the Day" })
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "p-4 bg-cream/70 dark:bg-slate-900/70 rounded-xl text-xs border border-gray-200/60 dark:border-slate-700/60 space-y-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-secondary dark:text-emerald-400 font-bold text-xs", children: [
            /* @__PURE__ */ jsx("span", { className: "text-base", children: dailyPrayer.flag }),
            /* @__PURE__ */ jsxs("span", { children: [
              dailyPrayer.author,
              " from ",
              dailyPrayer.country
            ] })
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "text-gray-800 dark:text-slate-200 leading-relaxed font-serif text-sm italic", children: [
            '"',
            dailyPrayer.content,
            '"'
          ] }),
          /* @__PURE__ */ jsx("div", { className: "pt-2 flex justify-end", children: /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: handleToggleDailyPrayer,
              className: `px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 shadow-xs ${dailyPrayer.hasPrayed ? "bg-primary dark:bg-emerald-700 text-white ring-2 ring-primary/20" : "bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-200 hover:border-primary"}`,
              children: [
                /* @__PURE__ */ jsx(Heart, { size: 16, className: dailyPrayer.hasPrayed ? "fill-white text-white" : "text-primary dark:text-emerald-400" }),
                dailyPrayer.hasPrayed ? `Prayed (Thank you!)` : `\u{1F64F} I Prayed For This`
              ]
            }
          ) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "pt-1", children: !showSubmitPrayer ? /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setShowSubmitPrayer(true),
            className: "w-full py-2.5 px-4 bg-cream/40 dark:bg-slate-900/40 hover:bg-cream/80 dark:hover:bg-slate-900/80 border border-dashed border-gray-300 dark:border-slate-700 text-gray-600 dark:text-slate-300 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5",
            children: [
              /* @__PURE__ */ jsx(Plus, { size: 16, className: "text-primary dark:text-emerald-400" }),
              "Submit Your Own Prayer Request"
            ]
          }
        ) : /* @__PURE__ */ jsxs("div", { className: "bg-cream/40 dark:bg-slate-900/60 p-4 rounded-xl border border-gray-200 dark:border-slate-700 space-y-3 animate-fade-in", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
            /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-gray-800 dark:text-slate-200", children: "Submit a Prayer Request" }),
            /* @__PURE__ */ jsx("button", { onClick: () => setShowSubmitPrayer(false), className: "text-gray-400 hover:text-gray-600 dark:hover:text-slate-300", children: /* @__PURE__ */ jsx(X, { size: 16 }) })
          ] }),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              rows: 3,
              value: userPrayerText,
              onChange: (e) => setUserPrayerText(e.target.value),
              placeholder: "Share what is on your heart so our global community can pray with you...",
              className: "w-full p-3 text-xs bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-800 dark:text-slate-100 rounded-lg outline-none focus:border-primary resize-none"
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center pt-1", children: [
            /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2 cursor-pointer text-xs text-gray-600 dark:text-slate-300", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "checkbox",
                  checked: postAnonymously,
                  onChange: (e) => setPostAnonymously(e.target.checked),
                  className: "w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary accent-primary"
                }
              ),
              /* @__PURE__ */ jsx("span", { className: "font-medium", children: "Post Anonymously" })
            ] }),
            /* @__PURE__ */ jsxs(
              "button",
              {
                disabled: !userPrayerText.trim(),
                onClick: handleUserPrayerSubmit,
                className: "px-4 py-2 bg-primary dark:bg-emerald-800 text-white text-xs font-bold rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-all flex items-center gap-1.5",
                children: [
                  /* @__PURE__ */ jsx(Send, { size: 14 }),
                  " Submit"
                ]
              }
            )
          ] })
        ] }) })
      ] })
    ] });
  };
  const renderDiscussions = () => {
    const currentChannelObj = channels.find((c) => c.id === selectedChannel) || channels[0];
    const currentPosts = channelPosts[selectedChannel] || channelPosts["general-fellowship"];
    return /* @__PURE__ */ jsxs("div", { className: "space-y-4 pb-24 animate-fade-in", children: [
      /* @__PURE__ */ jsxs("div", { className: "border-b dark:border-slate-700 pb-3 flex justify-between items-center", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h2", { className: "font-serif text-2xl text-primary dark:text-emerald-400 font-bold", children: "Discussion Hub" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 dark:text-slate-400", children: "Moderated fellowship & discussion spaces" })
        ] }),
        /* @__PURE__ */ jsxs("span", { className: "bg-green-100 dark:bg-emerald-950 text-green-700 dark:text-emerald-300 text-[10px] uppercase font-bold px-2.5 py-1 rounded-md flex items-center gap-1 border border-green-200 dark:border-emerald-800", children: [
          /* @__PURE__ */ jsx(ShieldCheck, { size: 12 }),
          " Protected"
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex gap-2 overflow-x-auto pb-2 scrollbar-none", children: channels.map((ch) => {
        const isSelected = selectedChannel === ch.id;
        return /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setSelectedChannel(ch.id),
            className: `whitespace-nowrap text-xs px-3.5 py-2 rounded-xl font-bold transition-all shrink-0 flex items-center gap-1.5 ${isSelected ? "bg-primary dark:bg-emerald-800 text-white shadow-xs" : "bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-300 border border-gray-200 dark:border-slate-700 hover:border-gray-300"}`,
            children: [
              /* @__PURE__ */ jsx(Hash, { size: 12, className: isSelected ? "text-accent dark:text-emerald-300" : "text-gray-400 dark:text-slate-500" }),
              ch.name
            ]
          },
          ch.id
        );
      }) }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-100 dark:border-slate-700/80 shadow-xs flex justify-between items-center", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("h3", { className: "font-bold text-sm text-gray-800 dark:text-slate-100 flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsx(Hash, { size: 16, className: "text-primary dark:text-emerald-400" }),
            currentChannelObj.name
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "text-xs text-gray-500 dark:text-slate-400 mt-0.5", children: [
            "Category: ",
            currentChannelObj.category
          ] })
        ] }),
        /* @__PURE__ */ jsx("span", { className: "text-[11px] text-primary dark:text-emerald-400 bg-primary/5 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full font-semibold", children: "Active" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "space-y-3 min-h-[35vh]", children: currentPosts.map((post) => /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-100 dark:border-slate-700/80 shadow-xs space-y-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center text-xs", children: [
          /* @__PURE__ */ jsx("span", { className: "font-bold text-primary dark:text-emerald-400", children: post.author }),
          /* @__PURE__ */ jsx("span", { className: "text-gray-400 dark:text-slate-500 text-[10px]", children: new Date(post.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-700 dark:text-slate-200 leading-relaxed", children: post.content }),
        /* @__PURE__ */ jsx("div", { className: "flex justify-end pt-1", children: /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => {
              setChannelPosts((prev) => ({
                ...prev,
                [selectedChannel]: (prev[selectedChannel] || []).map(
                  (p) => p.id === post.id ? { ...p, likes: p.likes + 1 } : p
                )
              }));
            },
            className: "text-[11px] text-gray-500 dark:text-slate-400 hover:text-primary dark:hover:text-emerald-300 flex items-center gap-1 bg-cream dark:bg-slate-900 px-2.5 py-1 rounded-lg border dark:border-slate-700",
            children: [
              /* @__PURE__ */ jsx(ThumbsUp, { size: 12 }),
              " ",
              post.likes,
              " Amen"
            ]
          }
        ) })
      ] }, post.id)) }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-slate-800 p-3 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm flex gap-2", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            value: newChannelPost,
            onChange: (e) => setNewChannelPost(e.target.value),
            placeholder: `Message #${currentChannelObj.name}...`,
            className: "flex-1 text-xs p-2.5 bg-gray-50 dark:bg-slate-900 text-gray-800 dark:text-slate-100 rounded-lg outline-none border border-transparent focus:border-primary dark:focus:border-emerald-500",
            onKeyDown: (e) => e.key === "Enter" && handlePostToChannel()
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: handlePostToChannel,
            className: "bg-primary dark:bg-emerald-800 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-primary/90 transition-all flex items-center gap-1",
            children: [
              /* @__PURE__ */ jsx(Send, { size: 14 }),
              " Send"
            ]
          }
        )
      ] })
    ] });
  };
  const renderProfileMenu = () => {
    return /* @__PURE__ */ jsxs("div", { className: "space-y-6 pb-24 animate-fade-in", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center pt-2 pb-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "relative mb-3", children: [
          user.profilePicture ? /* @__PURE__ */ jsx("img", { src: user.profilePicture, alt: "Profile", className: "w-24 h-24 rounded-full object-cover border-4 border-white dark:border-slate-700 shadow-md" }) : /* @__PURE__ */ jsx("div", { className: "w-24 h-24 rounded-full bg-primary dark:bg-emerald-900 flex items-center justify-center text-white text-3xl font-serif font-bold border-4 border-white dark:border-slate-700 shadow-md", children: user.name ? user.name.substring(0, 2).toUpperCase() : "ME" }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setProfileView("edit-profile"),
              className: "absolute bottom-0 right-0 bg-white dark:bg-slate-700 p-2 rounded-full shadow-md border border-gray-100 dark:border-slate-600 text-primary dark:text-emerald-400 hover:text-secondary",
              children: /* @__PURE__ */ jsx(Edit2, { size: 16 })
            }
          )
        ] }),
        /* @__PURE__ */ jsx("h2", { className: "font-serif text-xl font-bold text-primary dark:text-emerald-400", children: user.name || "Fellow Believer" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 dark:text-slate-400 mt-0.5", children: user.email })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-100 dark:border-slate-700/80 shadow-xs space-y-2", children: [
        /* @__PURE__ */ jsx("h3", { className: "font-serif font-bold text-xs uppercase tracking-wide text-primary dark:text-emerald-400", children: "Active Memberships" }),
        /* @__PURE__ */ jsxs("div", { className: "text-xs text-gray-700 dark:text-slate-300 space-y-1", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("strong", { children: "Bible Study:" }),
            " ",
            user.bibleBook || "General Fellowship",
            " Group"
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("strong", { children: "Discussion Focus Areas:" }),
            " ",
            user.struggles && user.struggles.length > 0 ? user.struggles.join(", ") : "General Fellowship"
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("strong", { children: "Interests:" }),
            " ",
            user.biblicalInterests && user.biblicalInterests.length > 0 ? user.biblicalInterests.join(", ") : "General Bible Reflection"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-100 dark:border-slate-700/80 shadow-xs flex justify-between items-center", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "p-2 rounded-full bg-primary/5 dark:bg-emerald-950/60 text-primary dark:text-emerald-400", children: isDarkMode ? /* @__PURE__ */ jsx(Moon, { size: 22 }) : /* @__PURE__ */ jsx(Sun, { size: 22 }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "font-bold text-sm text-gray-800 dark:text-slate-100", children: "Dark Mode" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 dark:text-slate-400", children: "Switch to obsidian night palette" })
          ] })
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setIsDarkMode(!isDarkMode),
            className: `w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${isDarkMode ? "bg-primary dark:bg-emerald-600" : "bg-gray-300"}`,
            children: /* @__PURE__ */ jsx("div", { className: `w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${isDarkMode ? "translate-x-6" : ""}` })
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2.5", children: [
        /* @__PURE__ */ jsx(MenuCard, { icon: Edit2, title: "Edit Profile", subtitle: "Update name, bio, and photo", onClick: () => setProfileView("edit-profile") }),
        /* @__PURE__ */ jsx(MenuCard, { icon: MapPin, title: "Location", subtitle: "Update where you're joining us from", onClick: () => setProfileView("location") }),
        /* @__PURE__ */ jsx(MenuCard, { icon: MessageCircle, title: "Discussion Focus Areas", subtitle: "Update discussion topics & prayer needs", onClick: () => setProfileView("struggles") }),
        /* @__PURE__ */ jsx(MenuCard, { icon: Heart, title: "My Prayers", subtitle: "Your prayer journal & answered prayers", onClick: () => setProfileView("prayers") }),
        /* @__PURE__ */ jsx(MenuCard, { icon: BookOpen, title: "Biblical Interests", subtitle: "Update topics & study preferences", onClick: () => setProfileView("interests") }),
        /* @__PURE__ */ jsx(MenuCard, { icon: Bell, title: "Notifications", subtitle: "Manage reminders & alerts", onClick: () => setProfileView("notifications") }),
        /* @__PURE__ */ jsx(MenuCard, { icon: Settings, title: "Account Settings", subtitle: "Email, security, privacy", onClick: () => setProfileView("account") }),
        /* @__PURE__ */ jsx(MenuCard, { icon: HelpCircle, title: "Help & Support", subtitle: "Community support & FAQs", onClick: () => setProfileView("help") }),
        /* @__PURE__ */ jsx(MenuCard, { icon: LogOut, title: "Log Out", isDanger: true, onClick: onLogout })
      ] })
    ] });
  };
  const renderEditProfile = () => {
    const [name, setName] = useState(user.name);
    const [bio, setBio] = useState(user.bio || "");
    const handleSave = () => {
      updateProfile("name", name);
      updateProfile("bio", bio);
      persistUserEdits({ name });
      setProfileView("menu");
    };
    return /* @__PURE__ */ jsxs("div", { className: "space-y-6 pb-24 animate-fade-in", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
        /* @__PURE__ */ jsx("button", { onClick: () => setProfileView("menu"), className: "p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700", children: /* @__PURE__ */ jsx(ArrowLeft, { size: 20, className: "text-gray-800 dark:text-slate-200" }) }),
        /* @__PURE__ */ jsx("h2", { className: "font-serif text-xl text-primary dark:text-emerald-400 font-bold", children: "Edit Profile" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-1", children: "Name" }),
          /* @__PURE__ */ jsx("input", { value: name, onChange: (e) => setName(e.target.value), className: "w-full p-3.5 text-xs rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-slate-100 outline-none focus:border-primary" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-1", children: "About Me" }),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              value: bio,
              onChange: (e) => setBio(e.target.value),
              maxLength: 200,
              placeholder: "Share a little about your faith walk...",
              className: "w-full p-3.5 text-xs rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-slate-100 outline-none focus:border-primary h-28 resize-none"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-3 pt-2", children: [
        /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => setProfileView("menu"), children: "Cancel" }),
        /* @__PURE__ */ jsx(Button, { onClick: handleSave, children: "Save Changes" })
      ] })
    ] });
  };
  const renderLocationEdit = () => {
    const [localLocation, setLocalLocation] = useState(user.location || "");
    const handleSave = () => {
      updateProfile("location", localLocation);
      persistUserEdits({ location: localLocation });
      setProfileView("menu");
    };
    return /* @__PURE__ */ jsxs("div", { className: "space-y-6 pb-24 animate-fade-in", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
        /* @__PURE__ */ jsx("button", { onClick: () => setProfileView("menu"), className: "p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700", children: /* @__PURE__ */ jsx(ArrowLeft, { size: 20, className: "text-gray-800 dark:text-slate-200" }) }),
        /* @__PURE__ */ jsx("h2", { className: "font-serif text-xl text-primary dark:text-emerald-400 font-bold", children: "Location" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-1", children: "City / Country" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              value: localLocation,
              onChange: (e) => setLocalLocation(e.target.value),
              placeholder: "e.g., London, UK",
              className: "w-full p-3.5 text-xs rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-slate-100 outline-none focus:border-primary"
            }
          )
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-[11px] text-gray-500 dark:text-slate-400 leading-relaxed", children: "This helps us connect you with local prayer groups and events." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-3 pt-2", children: [
        /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => setProfileView("menu"), children: "Cancel" }),
        /* @__PURE__ */ jsx(Button, { onClick: handleSave, children: "Save Location" })
      ] })
    ] });
  };
  const renderStrugglesEdit = () => {
    const [localStruggles, setLocalStruggles] = useState(user.struggles || []);
    const toggle = (s) => {
      if (localStruggles.includes(s)) setLocalStruggles(localStruggles.filter((i) => i !== s));
      else setLocalStruggles([...localStruggles, s]);
    };
    return /* @__PURE__ */ jsxs("div", { className: "space-y-6 pb-24 animate-fade-in", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
        /* @__PURE__ */ jsx("button", { onClick: () => setProfileView("menu"), className: "p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700", children: /* @__PURE__ */ jsx(ArrowLeft, { size: 20, className: "text-gray-800 dark:text-slate-200" }) }),
        /* @__PURE__ */ jsx("h2", { className: "font-serif text-xl text-primary dark:text-emerald-400 font-bold", children: "Discussion Focus Areas" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "space-y-2", children: STRUGGLES.map((s) => {
        const isSelected = localStruggles.includes(s);
        return /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => toggle(s),
            className: `w-full text-left p-3.5 rounded-xl transition-all border flex justify-between items-center text-xs ${isSelected ? "bg-primary dark:bg-emerald-800 text-white border-primary shadow-xs font-bold" : "bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-200"}`,
            children: [
              /* @__PURE__ */ jsx("span", { children: s }),
              isSelected && /* @__PURE__ */ jsx(Check, { size: 16 })
            ]
          },
          s
        );
      }) }),
      /* @__PURE__ */ jsx(Button, { onClick: () => {
        updateProfile("struggles", localStruggles);
        persistUserEdits({ struggles: localStruggles });
        setProfileView("menu");
      }, children: "Save Focus Areas" })
    ] });
  };
  const renderInterestsEdit = () => {
    const [localInterests, setLocalInterests] = useState(user.biblicalInterests || []);
    const [customInterest, setCustomInterest] = useState("");
    const toggle = (interest) => {
      if (localInterests.includes(interest)) setLocalInterests(localInterests.filter((i) => i !== interest));
      else setLocalInterests([...localInterests, interest]);
    };
    const addCustomInterest = () => {
      const trimmed = customInterest.trim();
      if (trimmed && !localInterests.includes(trimmed)) {
        setLocalInterests([...localInterests, trimmed]);
        setCustomInterest("");
      }
    };
    const removeInterest = (interest) => {
      setLocalInterests(localInterests.filter((i) => i !== interest));
    };
    const options = [
      "Apologetics",
      "Prayer Life",
      "Marriage & Family",
      "Identity in Christ",
      "Faith & Mental Health",
      "Biblical Interpretation",
      "Deep Theology",
      "Daily Devotionals",
      "Christian Leadership",
      "Other"
    ];
    const customInterestsList = localInterests.filter((i) => !options.includes(i));
    return /* @__PURE__ */ jsxs("div", { className: "space-y-6 pb-24 animate-fade-in", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
        /* @__PURE__ */ jsx("button", { onClick: () => setProfileView("menu"), className: "p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700", children: /* @__PURE__ */ jsx(ArrowLeft, { size: 20, className: "text-gray-800 dark:text-slate-200" }) }),
        /* @__PURE__ */ jsx("h2", { className: "font-serif text-xl text-primary dark:text-emerald-400 font-bold", children: "Biblical Interests" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-2.5", children: options.map((opt) => {
        const isSelected = localInterests.includes(opt);
        return /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => toggle(opt),
            className: `p-3 rounded-xl border text-xs font-semibold text-left transition-all ${isSelected ? "bg-primary dark:bg-emerald-800 text-white border-primary shadow-xs" : "bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-200"}`,
            children: opt
          },
          opt
        );
      }) }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2 pt-2", children: [
        /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-1", children: "Add Custom Interest" }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              value: customInterest,
              onChange: (e) => setCustomInterest(e.target.value),
              onKeyDown: (e) => {
                if (e.key === "Enter") addCustomInterest();
              },
              placeholder: "e.g., Worship Music, Church History",
              className: "flex-1 p-3 text-xs rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-slate-100 outline-none focus:border-primary"
            }
          ),
          /* @__PURE__ */ jsx(Button, { onClick: addCustomInterest, children: "Add" })
        ] })
      ] }),
      customInterestsList.length > 0 && /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2 pt-2", children: customInterestsList.map((interest) => /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 dark:bg-emerald-950/60 text-primary dark:text-emerald-300 rounded-full text-xs font-medium", children: [
        interest,
        /* @__PURE__ */ jsx("button", { onClick: () => removeInterest(interest), className: "hover:text-red-500 dark:hover:text-red-400 transition-colors", children: /* @__PURE__ */ jsx(X, { size: 12 }) })
      ] }, interest)) }),
      /* @__PURE__ */ jsx(Button, { onClick: () => {
        updateProfile("biblicalInterests", localInterests);
        persistUserEdits({ biblicalInterests: localInterests });
        setProfileView("menu");
      }, children: "Save Interests" })
    ] });
  };
  const renderPrayers = () => {
    const activePrayers = userPrayers.filter((p) => !p.archived);
    const archivedPrayers = userPrayers.filter((p) => p.archived);
    const formatDate = (timestamp) => {
      const date = new Date(timestamp);
      const now = /* @__PURE__ */ new Date();
      const diffDays = Math.floor((now.getTime() - date.getTime()) / (1e3 * 60 * 60 * 24));
      if (diffDays === 0) return "Today";
      if (diffDays === 1) return "Yesterday";
      if (diffDays < 7) return `${diffDays} days ago`;
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    };
    const PrayerCard = ({ prayer }) => /* @__PURE__ */ jsxs("div", { className: `bg-white dark:bg-slate-800 p-4 rounded-xl border shadow-xs space-y-3 ${prayer.answered ? "border-primary/40 dark:border-emerald-700/60 bg-primary/5 dark:bg-emerald-950/30" : "border-gray-100 dark:border-slate-700/80"}`, children: [
      /* @__PURE__ */ jsxs("p", { className: "font-serif text-sm italic text-gray-800 dark:text-slate-200 leading-relaxed", children: [
        '"',
        prayer.content,
        '"'
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center text-[11px] text-gray-500 dark:text-slate-400", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("span", { children: formatDate(prayer.timestamp) }),
          prayer.anonymous && /* @__PURE__ */ jsx("span", { className: "px-2 py-0.5 bg-gray-100 dark:bg-slate-700 rounded-full text-[10px] font-medium", children: "Anonymous" }),
          prayer.answered && /* @__PURE__ */ jsxs("span", { className: "px-2 py-0.5 bg-primary/15 dark:bg-emerald-900/60 text-primary dark:text-emerald-300 rounded-full text-[10px] font-bold flex items-center gap-1", children: [
            /* @__PURE__ */ jsx(Check, { size: 10 }),
            " Answered"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => togglePrayerAnswered(prayer.id),
              className: `p-1.5 rounded-lg transition-colors ${prayer.answered ? "bg-primary/10 dark:bg-emerald-900/60 text-primary dark:text-emerald-300" : "text-gray-400 dark:text-slate-500 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-primary"}`,
              title: prayer.answered ? "Mark as not answered" : "Mark as answered",
              children: /* @__PURE__ */ jsx(Check, { size: 14 })
            }
          ),
          prayer.archived ? /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => restorePrayer(prayer.id),
              className: "p-1.5 rounded-lg text-gray-400 dark:text-slate-500 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-primary",
              title: "Restore prayer",
              children: /* @__PURE__ */ jsx(Plus, { size: 14 })
            }
          ) : /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => archivePrayer(prayer.id),
              className: "p-1.5 rounded-lg text-gray-400 dark:text-slate-500 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-secondary",
              title: "Archive prayer",
              children: /* @__PURE__ */ jsx(Hash, { size: 14 })
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => deletePrayer(prayer.id),
              className: "p-1.5 rounded-lg text-gray-400 dark:text-slate-500 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-500",
              title: "Delete prayer",
              children: /* @__PURE__ */ jsx(X, { size: 14 })
            }
          )
        ] })
      ] })
    ] });
    return /* @__PURE__ */ jsxs("div", { className: "space-y-6 pb-24 animate-fade-in", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
        /* @__PURE__ */ jsx("button", { onClick: () => setProfileView("menu"), className: "p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700", children: /* @__PURE__ */ jsx(ArrowLeft, { size: 20, className: "text-gray-800 dark:text-slate-200" }) }),
        /* @__PURE__ */ jsx("h2", { className: "font-serif text-xl text-primary dark:text-emerald-400 font-bold", children: "My Prayers" })
      ] }),
      activePrayers.length === 0 && archivedPrayers.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-slate-800 p-8 rounded-xl border border-gray-100 dark:border-slate-700/80 text-center space-y-3", children: [
        /* @__PURE__ */ jsx(Heart, { size: 32, className: "text-gray-300 dark:text-slate-600 mx-auto" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600 dark:text-slate-400 leading-relaxed", children: "You haven't submitted any prayers yet. Share what's on your heart from the Home tab." })
      ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        activePrayers.length > 0 && /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxs("h3", { className: "text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-slate-400", children: [
            "Active Prayers (",
            activePrayers.length,
            ")"
          ] }),
          activePrayers.map((prayer) => /* @__PURE__ */ jsx(PrayerCard, { prayer }, prayer.id))
        ] }),
        archivedPrayers.length > 0 && /* @__PURE__ */ jsxs("div", { className: "space-y-3 pt-4", children: [
          /* @__PURE__ */ jsxs("h3", { className: "text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-slate-400", children: [
            "Archived (",
            archivedPrayers.length,
            ")"
          ] }),
          archivedPrayers.map((prayer) => /* @__PURE__ */ jsx(PrayerCard, { prayer }, prayer.id))
        ] })
      ] })
    ] });
  };
  const renderNotificationsSettings = () => /* @__PURE__ */ jsxs("div", { className: "space-y-6 pb-24 animate-fade-in", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
      /* @__PURE__ */ jsx("button", { onClick: () => setProfileView("menu"), className: "p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700", children: /* @__PURE__ */ jsx(ArrowLeft, { size: 20, className: "text-gray-800 dark:text-slate-200" }) }),
      /* @__PURE__ */ jsx("h2", { className: "font-serif text-xl text-primary dark:text-emerald-400 font-bold", children: "Notifications" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "bg-white dark:bg-slate-800 p-5 rounded-xl border border-gray-100 dark:border-slate-700 space-y-4 text-xs", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h3", { className: "font-bold text-gray-800 dark:text-slate-100", children: "Daily Reminders" }),
        /* @__PURE__ */ jsx("p", { className: "text-[11px] text-gray-500 dark:text-slate-400", children: "Remind me to connect with fellowship" })
      ] }),
      /* @__PURE__ */ jsx(
        "div",
        {
          onClick: () => updateProfile("notificationsEnabled", !user.notificationsEnabled),
          className: `w-11 h-6 rounded-full p-1 cursor-pointer transition-colors ${user.notificationsEnabled ? "bg-primary dark:bg-emerald-600" : "bg-gray-300"}`,
          children: /* @__PURE__ */ jsx("div", { className: `w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${user.notificationsEnabled ? "translate-x-5" : ""}` })
        }
      )
    ] }) })
  ] });
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-cream dark:bg-slate-900 max-w-md mx-auto relative flex flex-col transition-colors duration-300", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex-1 p-6 overflow-y-auto", children: [
      activeTab === "home" && renderHome(),
      activeTab === "discussions" && renderDiscussions(),
      activeTab === "biblestudy" && /* @__PURE__ */ jsx(BibleStudy, { user }),
      activeTab === "profile" && /* @__PURE__ */ jsxs(Fragment, { children: [
        profileView === "menu" && renderProfileMenu(),
        profileView === "edit-profile" && renderEditProfile(),
        profileView === "location" && renderLocationEdit(),
        profileView === "struggles" && renderStrugglesEdit(),
        profileView === "interests" && renderInterestsEdit(),
        profileView === "prayers" && renderPrayers(),
        profileView === "notifications" && renderNotificationsSettings(),
        profileView === "account" && /* @__PURE__ */ jsxs("div", { className: "space-y-4 pb-24", children: [
          /* @__PURE__ */ jsx("button", { onClick: () => setProfileView("menu"), className: "p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700", children: /* @__PURE__ */ jsx(ArrowLeft, { size: 20, className: "text-gray-800 dark:text-slate-200" }) }),
          /* @__PURE__ */ jsx("h2", { className: "font-serif text-xl text-primary dark:text-emerald-400 font-bold", children: "Account Privacy Settings" }),
          /* @__PURE__ */ jsx("div", { className: "bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-100 dark:border-slate-700 text-xs space-y-3", children: /* @__PURE__ */ jsx("p", { className: "text-gray-600 dark:text-slate-300", children: "Your account data is private and encrypted. Group discussions are protected by moderation tools." }) })
        ] }),
        profileView === "help" && /* @__PURE__ */ jsxs("div", { className: "space-y-4 pb-24", children: [
          /* @__PURE__ */ jsx("button", { onClick: () => setProfileView("menu"), className: "p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700", children: /* @__PURE__ */ jsx(ArrowLeft, { size: 20, className: "text-gray-800 dark:text-slate-200" }) }),
          /* @__PURE__ */ jsx("h2", { className: "font-serif text-xl text-primary dark:text-emerald-400 font-bold", children: "Help & Support" }),
          /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-100 dark:border-slate-700 text-xs space-y-2", children: [
            /* @__PURE__ */ jsx("p", { className: "font-bold text-primary dark:text-emerald-400", children: "How do group capacities work?" }),
            /* @__PURE__ */ jsx("p", { className: "text-gray-600 dark:text-slate-300", children: "Each small group is capped at 12 members. If full, you can choose 'Join Late' or 'Wait for Next Group'." })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 px-4 py-2 flex justify-between items-center z-50 shadow-md", children: [
      /* @__PURE__ */ jsxs("button", { onClick: () => setActiveTab("home"), className: `flex flex-col items-center flex-1 py-1 ${activeTab === "home" ? "text-primary dark:text-emerald-400 font-bold" : "text-gray-400 dark:text-slate-500"}`, children: [
        /* @__PURE__ */ jsx(Home, { size: 20 }),
        /* @__PURE__ */ jsx("span", { className: "text-[10px] mt-0.5", children: "Home" })
      ] }),
      /* @__PURE__ */ jsxs("button", { onClick: () => setActiveTab("discussions"), className: `flex flex-col items-center flex-1 py-1 ${activeTab === "discussions" ? "text-primary dark:text-emerald-400 font-bold" : "text-gray-400 dark:text-slate-500"}`, children: [
        /* @__PURE__ */ jsx(MessageCircle, { size: 20 }),
        /* @__PURE__ */ jsx("span", { className: "text-[10px] mt-0.5", children: "Discussions" })
      ] }),
      /* @__PURE__ */ jsxs("button", { onClick: () => setActiveTab("biblestudy"), className: `flex flex-col items-center flex-1 py-1 ${activeTab === "biblestudy" ? "text-primary dark:text-emerald-400 font-bold" : "text-gray-400 dark:text-slate-500"}`, children: [
        /* @__PURE__ */ jsx(BookOpen, { size: 20 }),
        /* @__PURE__ */ jsx("span", { className: "text-[10px] mt-0.5", children: "Bible Study" })
      ] }),
      /* @__PURE__ */ jsxs("button", { onClick: () => {
        setActiveTab("profile");
        setProfileView("menu");
      }, className: `flex flex-col items-center flex-1 py-1 ${activeTab === "profile" ? "text-primary dark:text-emerald-400 font-bold" : "text-gray-400 dark:text-slate-500"}`, children: [
        /* @__PURE__ */ jsx(UserCircle, { size: 20 }),
        /* @__PURE__ */ jsx("span", { className: "text-[10px] mt-0.5", children: "Profile" })
      ] })
    ] })
  ] });
};
export {
  Dashboard
};
