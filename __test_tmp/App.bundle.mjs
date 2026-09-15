// __test_tmp/appStubs.mjs
import React from "react";
var Loader2 = (props) => React.createElement("svg", { "data-icon": "Loader2", ...props });
var Dashboard = (props) => {
  if (typeof window !== "undefined") window.__HYDRATED_USER__ = props.user;
  return React.createElement("div", { id: "dashboard-stub" }, "Dashboard stub, user=" + (props.user?.name || "none"));
};
var Onboarding = () => React.createElement("div", { id: "onboarding-stub" }, "Onboarding stub");

// App.tsx
import { useEffect, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var LOADING_PHRASES = [
  "Gathering your flock...",
  "Finding the perfect community spaces for you...",
  "Preparing your digital table..."
];
function App() {
  const [status, setStatus] = useState("ONBOARDING" /* ONBOARDING */);
  const [user, setUser] = useState(null);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [fadeState, setFadeState] = useState(true);
  const handleOnboardingComplete = (profile) => {
    setUser(profile);
    localStorage.setItem("selah_user_name", profile.name);
    localStorage.setItem("selah_user_location", profile.location || "");
    setStatus("MATCHING" /* MATCHING */);
    setPhraseIndex(0);
  };
  const handleLogout = () => {
    setUser(null);
    setStatus("ONBOARDING" /* ONBOARDING */);
  };
  useEffect(() => {
    if (status === "MATCHING" /* MATCHING */) {
      const interval = setInterval(() => {
        setFadeState(false);
        setTimeout(() => {
          setPhraseIndex((prev) => {
            if (prev < LOADING_PHRASES.length - 1) {
              return prev + 1;
            }
            return prev;
          });
          setFadeState(true);
        }, 300);
      }, 1e3);
      const completionTimer = setTimeout(() => {
        setStatus("DASHBOARD" /* DASHBOARD */);
      }, 3400);
      return () => {
        clearInterval(interval);
        clearTimeout(completionTimer);
      };
    }
  }, [status]);
  useEffect(() => {
    const savedName = localStorage.getItem("selah_user_name");
    if (!savedName) return;
    const savedLocation = localStorage.getItem("selah_user_location") || "";
    let savedStruggles = [];
    try {
      const raw = localStorage.getItem("selah_user_struggles");
      if (raw) savedStruggles = JSON.parse(raw);
    } catch {
      savedStruggles = [];
    }
    let savedInterests = [];
    try {
      const raw = localStorage.getItem("selah_user_interests");
      if (raw) savedInterests = JSON.parse(raw);
    } catch {
      savedInterests = [];
    }
    setUser({
      name: savedName,
      email: "",
      profilePicture: "",
      bio: "",
      struggles: savedStruggles,
      specificStruggle: "",
      connectionPreference: "both",
      availability: [],
      prayerRequest: "",
      bibleBook: null,
      bibleStudyGroupId: null,
      streak: 1,
      lastCheckIn: null,
      notificationsEnabled: false,
      notificationTime: "Morning",
      notifyOnBuddyMessage: true,
      notifyOnCommunityPost: true,
      shareGrowthStats: false,
      defaultAnonymousPrayer: false,
      moodHistory: [],
      gratitudeHistory: [],
      completedLessons: [],
      biblicalInterests: savedInterests,
      location: savedLocation,
      wantsGroupMatch: true
    });
    setStatus("DASHBOARD" /* DASHBOARD */);
  }, []);
  return /* @__PURE__ */ jsx(Fragment, { children: status === "MATCHING" /* MATCHING */ ? /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-cream flex flex-col items-center justify-center text-center p-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" }),
      /* @__PURE__ */ jsx(Loader2, { size: 64, className: "text-primary animate-spin relative z-10" })
    ] }),
    /* @__PURE__ */ jsx("h2", { className: `mt-8 font-serif text-2xl text-primary font-bold transition-opacity duration-300 ${fadeState ? "opacity-100" : "opacity-0"}`, children: LOADING_PHRASES[phraseIndex] }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 text-gray-600 font-sans max-w-xs text-sm", children: "Setting up your peer fellowship environment" })
  ] }) : status === "DASHBOARD" /* DASHBOARD */ && user ? /* @__PURE__ */ jsx(Dashboard, { user, setUser, onLogout: handleLogout }) : /* @__PURE__ */ jsx(Onboarding, { onComplete: handleOnboardingComplete }) });
}
export {
  App as default
};
