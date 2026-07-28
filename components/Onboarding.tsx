import React, { useState, useEffect } from 'react';
import { UserProfile, StruggleType } from '../types';
import { STRUGGLES, POPULAR_BOOKS, OLD_TESTAMENT_BOOKS, NEW_TESTAMENT_BOOKS } from '../constants';
import { Button } from './Button';
import { Check, Mail, Lock, Info, Sparkles, BookOpen, Compass, ArrowRight } from 'lucide-react';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

const BIBLICAL_INTERESTS_OPTIONS = [
  'Apologetics',
  'Marriage & Family',
  'Faith & Mental Health',
  'Deep Theology',
  'Daily Devotionals',
  'Christian Leadership',
  'Other'
];

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [noBookOptOut, setNoBookOptOut] = useState(false);
  const [isSignInMode, setIsSignInMode] = useState(false);
  const [customInterestText, setCustomInterestText] = useState('');

  const [data, setData] = useState<UserProfile>({
    name: '',
    email: '',
    profilePicture: '',
    bio: '',
    struggles: [],
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
    biblicalInterests: []
  });
  const [password, setPassword] = useState('');

  // Smooth loading scale-and-fade animation trigger on mount
  useEffect(() => {
    setIsAnimating(true);
  }, []);

  const updateData = (key: keyof UserProfile, value: any) => {
    setData(prev => ({ ...prev, [key]: value }));
  };

  const toggleStruggle = (s: StruggleType) => {
    const current = data.struggles;
    if (current.includes(s)) {
      updateData('struggles', current.filter(item => item !== s));
    } else {
      updateData('struggles', [...current, s]);
    }
  };

  const toggleInterest = (interest: string) => {
    const current = data.biblicalInterests || [];
    if (current.includes(interest)) {
      updateData('biblicalInterests', current.filter(item => item !== interest));
    } else {
      updateData('biblicalInterests', [...current, interest]);
    }
  };

  const handleOptOutBookChange = (checked: boolean) => {
    setNoBookOptOut(checked);
    if (checked) {
      updateData('bibleBook', 'None / General Fellowship');
    } else {
      updateData('bibleBook', null);
    }
  };

  const handleAccountSubmit = () => {
    if (isSignInMode) {
      // In sign-in mode, default name if not set
      if (!data.name) {
        const fallbackName = data.email ? data.email.split('@')[0] : 'Believer';
        updateData('name', fallbackName.charAt(0).toUpperCase() + fallbackName.slice(1));
      }
    }
    setStep(2);
  };

  const handleCustomInterestChange = (val: string) => {
    setCustomInterestText(val);
    const current = data.biblicalInterests || [];
    // Filter out previous custom non-standard values if needed, keep standard ones plus new typed
    const standardInterests = current.filter(i => BIBLICAL_INTERESTS_OPTIONS.includes(i));
    if (val.trim()) {
      updateData('biblicalInterests', [...standardInterests, val.trim()]);
    } else {
      updateData('biblicalInterests', standardInterests);
    }
  };

  const renderWelcome = () => (
    <div className={`flex flex-col items-center justify-center h-full text-center space-y-8 transition-all duration-1000 transform ${isAnimating ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
      <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center text-white mb-2 shadow-xl animate-pulse">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 2h4a2 2 0 0 1 2 2v18" />
          <path d="M10 2a2 2 0 0 0-2 2" />
        </svg>
      </div>
      
      <div className="space-y-3">
        <h1 className="font-serif text-4xl text-primary font-bold tracking-tight">Selah</h1>
        <div className="space-y-1 bg-white/60 p-3.5 rounded-2xl border border-primary/10 shadow-xs max-w-sm mx-auto">
          <p className="font-serif italic text-secondary text-base md:text-lg leading-snug">
            "Spurring one another on in faith and community."
          </p>
          <p className="font-sans text-xs text-gray-500 font-bold uppercase tracking-wider">— Hebrews 10:24-25</p>
        </div>
      </div>

      <p className="font-sans text-gray-600 max-w-xs mx-auto leading-relaxed text-sm">
        Connect with a global community of believers walking the same path, reading the Word, and praying together.
      </p>

      <div className="w-full pt-4">
        <Button onClick={() => setStep(1)}>Get Started</Button>
      </div>
    </div>
  );

  const renderAccount = () => (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="font-serif text-2xl text-primary font-bold">
          {isSignInMode ? 'Welcome back to Selah' : 'Create your account'}
        </h2>
        <p className="text-xs text-gray-500 mt-1">
          {isSignInMode ? 'Enter your credentials to access your fellowship' : 'Join a global community of peer believers'}
        </p>
      </div>

      <div className="space-y-4">
        {!isSignInMode && (
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">First Name</label>
            <input
              type="text"
              value={data.name}
              onChange={(e) => updateData('name', e.target.value)}
              placeholder="David"
              className="w-full p-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-white text-sm"
            />
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Email</label>
          <div className="relative">
            <Mail className="absolute left-4 top-4 text-gray-400" size={20} />
            <input
              type="email"
              value={data.email}
              onChange={(e) => updateData('email', e.target.value)}
              placeholder="you@example.com"
              className="w-full p-4 pl-12 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-white text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Password</label>
          <div className="relative">
            <Lock className="absolute left-4 top-4 text-gray-400" size={20} />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-4 pl-12 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-white text-sm"
            />
          </div>
        </div>
      </div>

      <Button 
        disabled={isSignInMode ? (!data.email || !password) : (!data.name || !data.email || !password)} 
        onClick={handleAccountSubmit}
      >
        {isSignInMode ? 'Log In' : 'Continue'}
      </Button>

      <div className="text-center pt-2">
        <button
          type="button"
          onClick={() => setIsSignInMode(!isSignInMode)}
          className="text-xs text-primary font-bold hover:underline py-2"
        >
          {isSignInMode ? "Don't have an account? Sign Up" : 'Already have an account? Log In'}
        </button>
      </div>
    </div>
  );

  const renderStruggles = () => {
    const isOtherSelected = data.struggles.includes(StruggleType.OTHER);

    return (
      <div className="space-y-5 animate-fade-in">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="font-serif text-2xl text-primary font-bold">Community Focus Areas</h2>
            <p className="text-gray-600 text-xs mt-1">What areas are you looking for prayer or peer discussions on?</p>
          </div>
          <button
            onClick={() => setStep(3)}
            className="text-xs font-bold text-gray-500 hover:text-primary underline px-2 py-1"
          >
            Skip
          </button>
        </div>

        {/* Brief encouraging note */}
        <div className="bg-sky/20 border border-sky/40 rounded-xl p-3.5 text-xs text-gray-700 leading-relaxed">
          Skipping is completely fine, but sharing helps us tailor your home stats and community boards to what you need most!
        </div>

        <div className="space-y-2 max-h-[35vh] overflow-y-auto pr-1 border-b pb-3 border-gray-100 scrollbar-none">
          {STRUGGLES.map((s) => {
            const isSelected = data.struggles.includes(s);
            return (
              <button
                key={s}
                onClick={() => toggleStruggle(s)}
                className={`w-full text-left p-3.5 rounded-xl transition-all border flex justify-between items-center ${
                  isSelected ? 'bg-primary text-white border-primary shadow-md' : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="text-sm font-medium">{s}</span>
                {isSelected && <Check size={16} />}
              </button>
            );
          })}
        </div>

        {/* Smart "Other" Struggle Logic with Exact Custom Placeholder */}
        {isOtherSelected && (
          <div className="space-y-2 p-3.5 bg-white rounded-xl border border-accent/40 shadow-xs animate-fade-in">
            <label className="block text-xs font-bold text-primary uppercase tracking-wide">
              Describe what you are navigating:
            </label>
            <textarea
              rows={3}
              value={data.specificStruggle}
              onChange={(e) => updateData('specificStruggle', e.target.value)}
              placeholder="Feel free to share what you are navigating so we can best route you to the correct community space."
              className="w-full p-3 text-xs bg-cream/50 rounded-lg border border-gray-200 focus:border-primary outline-none resize-none text-gray-800"
            />
          </div>
        )}

        <div className="flex gap-2 pt-1">
          <Button onClick={() => setStep(3)}>
            Continue
          </Button>
        </div>
      </div>
    );
  };

  const renderBibleBook = () => {
    return (
      <div className="space-y-5 animate-fade-in">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="font-serif text-2xl text-primary font-bold">Bible Study Matching</h2>
            <p className="text-gray-600 text-xs mt-1">Select what you are currently reading or studying.</p>
          </div>
          <button
            onClick={() => {
              updateData('bibleBook', 'None / General Fellowship');
              setStep(4);
            }}
            className="text-xs font-bold text-gray-500 hover:text-primary underline px-2 py-1"
          >
            Skip
          </button>
        </div>

        {/* Info Banner */}
        <div className="bg-sky/20 border border-sky/40 rounded-xl p-4 text-xs text-gray-800 flex items-start gap-3">
          <Info size={18} className="text-primary shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-primary font-semibold">Why we ask this:</strong> We ask this so we can seamlessly pair you with an intimate, peer-led Bible study group covering that specific book!
          </p>
        </div>

        <div className="space-y-3">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">What book are you studying?</label>
          <select
            disabled={noBookOptOut}
            value={noBookOptOut ? 'None / General Fellowship' : (data.bibleBook || '')}
            onChange={(e) => updateData('bibleBook', e.target.value)}
            className={`w-full p-4 rounded-xl bg-white border border-gray-200 focus:border-primary outline-none appearance-none shadow-sm text-sm font-medium ${
              noBookOptOut ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'text-gray-800'
            }`}
          >
            <option value="" disabled>Select a Book</option>
            <option value="General Discussion">Just browsing / General Fellowship</option>
            <optgroup label="Suggestions">
              {POPULAR_BOOKS.map(b => <option key={`sug-${b}`} value={b}>{b}</option>)}
            </optgroup>
            <optgroup label="Old Testament">
              {OLD_TESTAMENT_BOOKS.map(b => <option key={b} value={b}>{b}</option>)}
            </optgroup>
            <optgroup label="New Testament">
              {NEW_TESTAMENT_BOOKS.map(b => <option key={b} value={b}>{b}</option>)}
            </optgroup>
          </select>

          {/* Opt-out Checkbox */}
          <label className="flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-100 cursor-pointer text-xs text-gray-700 hover:bg-cream/40 transition-colors">
            <input
              type="checkbox"
              checked={noBookOptOut}
              onChange={(e) => handleOptOutBookChange(e.target.checked)}
              className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary accent-primary"
            />
            <span className="font-medium">I am not reading any book at the moment</span>
          </label>
        </div>

        <Button
          disabled={!data.bibleBook && !noBookOptOut}
          onClick={() => setStep(4)}
        >
          Continue
        </Button>
      </div>
    );
  };

  const renderBiblicalInterests = () => {
    const selectedInterests = data.biblicalInterests || [];
    const isOtherSelected = selectedInterests.includes('Other');

    return (
      <div className="space-y-5 animate-fade-in">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="font-serif text-2xl text-primary font-bold">Biblical Interests</h2>
            <p className="text-gray-600 text-xs mt-1">What are your current biblical interests?</p>
          </div>
          <button
            onClick={() => onComplete(data)}
            className="text-xs font-bold text-gray-500 hover:text-primary underline px-2 py-1"
          >
            Skip
          </button>
        </div>

        {/* Tag Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          {BIBLICAL_INTERESTS_OPTIONS.map((interest) => {
            const isSelected = selectedInterests.includes(interest);
            return (
              <button
                key={interest}
                onClick={() => toggleInterest(interest)}
                className={`p-3.5 rounded-xl border text-xs font-semibold transition-all flex flex-col justify-between items-start gap-2 text-left h-22 ${
                  isSelected
                    ? 'bg-primary text-white border-primary shadow-md'
                    : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="w-full flex justify-between items-center">
                  <Compass size={16} className={isSelected ? 'text-accent' : 'text-gray-400'} />
                  {isSelected && <Check size={14} className="text-white" />}
                </div>
                <span>{interest}</span>
              </button>
            );
          })}
        </div>

        {/* Custom Interest Entry Field if Other is selected */}
        {isOtherSelected && (
          <div className="space-y-2 p-3 bg-white rounded-xl border border-gray-200 shadow-xs animate-fade-in">
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide">Specify custom interest:</label>
            <input
              type="text"
              value={customInterestText}
              onChange={(e) => handleCustomInterestChange(e.target.value)}
              placeholder="e.g. Worship Music, Church History, Prophecy"
              className="w-full p-3 text-xs bg-cream/40 rounded-lg border border-gray-200 focus:border-primary outline-none text-gray-800"
            />
          </div>
        )}

        <Button
          disabled={selectedInterests.length === 0}
          onClick={() => onComplete(data)}
        >
          Enter Fellowship
        </Button>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto p-6 bg-cream">
      <div className="flex-1 flex flex-col justify-center">
        {step === 0 && renderWelcome()}
        {step === 1 && renderAccount()}
        {step === 2 && renderStruggles()}
        {step === 3 && renderBibleBook()}
        {step === 4 && renderBiblicalInterests()}
      </div>
      {step > 0 && (
        <div className="py-6 flex justify-center space-x-2">
          {[1, 2, 3, 4].map(i => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i <= step ? 'w-6 bg-primary' : 'w-2 bg-gray-300'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
