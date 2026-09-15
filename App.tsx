import { Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import { Dashboard } from './components/Dashboard';
import { Onboarding } from './components/Onboarding';
import { StruggleType, UserProfile, UserStatus } from './types';

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
    localStorage.setItem('selah_user_name', profile.name);
    localStorage.setItem('selah_user_location', profile.location || '');
    setStatus(UserStatus.MATCHING);
    setPhraseIndex(0);
  };

  const handleLogout = () => {
    setUser(null);
    setStatus(UserStatus.ONBOARDING);
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

  // Hydrate user from localStorage on mount so saved profile edits persist across reloads
  useEffect(() => {
    const savedName = localStorage.getItem('selah_user_name');
    if (!savedName) return;

    const savedLocation = localStorage.getItem('selah_user_location') || '';

    let savedStruggles: StruggleType[] = [];
    try {
      const raw = localStorage.getItem('selah_user_struggles');
      if (raw) savedStruggles = JSON.parse(raw);
    } catch {
      savedStruggles = [];
    }

    let savedInterests: string[] = [];
    try {
      const raw = localStorage.getItem('selah_user_interests');
      if (raw) savedInterests = JSON.parse(raw);
    } catch {
      savedInterests = [];
    }

    setUser({
      name: savedName,
      email: '',
      profilePicture: '',
      bio: '',
      struggles: savedStruggles,
      specificStruggle: '',
      connectionPreference: 'both',
      availability: [],
      prayerRequest: '',
      bibleBook: null,
      bibleStudyGroupId: null,
      streak: 1,
      lastCheckIn: null,
      notificationsEnabled: false,
      notificationTime: 'Morning',
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
    setStatus(UserStatus.DASHBOARD);
  }, []);

  return (
    <>
      {status === UserStatus.MATCHING ? (

        <div className="min-h-screen bg-cream flex flex-col items-center justify-center text-center p-6">
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
    </>
  );
}
