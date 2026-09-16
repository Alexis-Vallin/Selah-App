import { Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import { Dashboard } from './components/Dashboard';
import { Onboarding } from './components/Onboarding';
import { StruggleType, UserProfile, UserStatus, PrayerEntry } from './types';

interface UserBlob {
  profile: UserProfile;
  prayers?: PrayerEntry[];
  joinedStudyGroups?: string[];
  joinedDiscussionGroups?: string[];
  theme?: 'dark' | 'light';
}

const getUserKey = (email: string) => `user_${email.toLowerCase()}`;

const saveUserBlob = (email: string, data: Partial<UserBlob>) => {
  try {
    const key = getUserKey(email);
    const existing = localStorage.getItem(key);
    const blob = existing ? JSON.parse(existing) : {};
    localStorage.setItem(key, JSON.stringify({ ...blob, ...data }));
  } catch { /* ignore */ }
};

const loadUserBlob = (email: string): UserBlob | null => {
  try {
    const raw = localStorage.getItem(getUserKey(email));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const setActiveUser = (email: string) => {
  try { localStorage.setItem('selah_active_user', email); } catch { /* ignore */ }
};

const clearActiveUser = () => {
  try { localStorage.removeItem('selah_active_user'); } catch { /* ignore */ }
};

const getActiveUser = (): string | null => {
  try { return localStorage.getItem('selah_active_user'); } catch { return null; }
};

const LEGACY_KEYS = [
  'selah_user_name', 'selah_user_location', 'selah_user_struggles',
  'selah_user_interests', 'selah_user_bio', 'selah_user_notifications_enabled',
  'selah_theme', 'selah_joined_groups', 'selah_joined_discussion_groups',
  'selah_user_prayers'
];

const LOADING_PHRASES = [
  "Gathering your flock...",
  "Finding the perfect community spaces for you...",
  "Preparing your digital table..."
];

export default function App() {
  const [status, setStatus] = useState<UserStatus>(UserStatus.ONBOARDING);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [fadeState, setFadeState] = useState(true);

  const handleOnboardingComplete = (profile: UserProfile) => {
    setUser(profile);
    if (profile.email) {
      setActiveUser(profile.email);
      saveUserBlob(profile.email, { profile });
    }
    setStatus(UserStatus.MATCHING);
    setPhraseIndex(0);
  };

  const handleLogout = () => {
    clearActiveUser();
    setUser(null);
    setStatus(UserStatus.ONBOARDING);
    // Reset theme to light mode
    document.documentElement.classList.remove('dark');
    try { localStorage.setItem('selah_theme', 'light'); } catch { /* ignore */ }
  };

  // Automated rotating text sequence for community matching
  useEffect(() => {
    if (status === UserStatus.MATCHING) {
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
      }, 1000);

      const completionTimer = setTimeout(() => {
        setStatus(UserStatus.DASHBOARD);
      }, 3400);

      return () => {
        clearInterval(interval);
        clearTimeout(completionTimer);
      };
    }
  }, [status]);

  // Hydrate active user from localStorage on mount
  useEffect(() => {
    const activeEmail = getActiveUser();
    if (!activeEmail) {
      // No active user — clear any legacy keys for a clean start
      const savedName = localStorage.getItem('selah_user_name');
      if (savedName) {
        LEGACY_KEYS.forEach(key => {
          try { localStorage.removeItem(key); } catch { /* ignore */ }
        });
      }
      return;
    }

    const blob = loadUserBlob(activeEmail);
    if (!blob || !blob.profile) return;

    setUser(blob.profile);
    setStatus(UserStatus.DASHBOARD);
  }, []);

  return (
    <div className="min-h-screen w-full bg-gray-100 dark:bg-black flex justify-center">
      <div className="w-full max-w-md min-h-screen bg-cream dark:bg-stone-950 border-x border-gray-200 dark:border-stone-800 shadow-2xl relative overflow-x-hidden">
        {status === UserStatus.MATCHING ? (

          <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
              <Loader2 size={64} className="text-primary animate-spin relative z-10" />
            </div>
            <h2 className={`mt-8 font-serif text-2xl text-primary font-bold transition-opacity duration-300 ${fadeState ? 'opacity-100' : 'opacity-0'}`}>
              {LOADING_PHRASES[phraseIndex]}
            </h2>
            <p className="mt-2 text-gray-600 font-sans max-w-xs text-sm">
              Setting up your peer fellowship environment
            </p>
          </div>
        ) : status === UserStatus.DASHBOARD && user ? (
          <Dashboard user={user} setUser={setUser as React.Dispatch<React.SetStateAction<UserProfile>>} onLogout={handleLogout} />

        ) : (
          <Onboarding onComplete={handleOnboardingComplete} />
        )}
      </div>
    </div>
  );
}
