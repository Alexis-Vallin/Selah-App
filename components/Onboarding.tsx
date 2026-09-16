import React, { useState, useEffect } from 'react';
import { UserProfile, StruggleType } from '../types';
import { STRUGGLES, POPULAR_BOOKS, OLD_TESTAMENT_BOOKS, NEW_TESTAMENT_BOOKS } from '../constants';
import { Button } from './Button';
import { Check, Mail, Lock, Info, Sparkles, BookOpen, Compass, ArrowRight, ArrowLeft, Eye, EyeOff } from 'lucide-react';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

const BIBLICAL_INTERESTS_OPTIONS = [
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

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isSignInMode, setIsSignInMode] = useState(false);
  const [customInterestText, setCustomInterestText] = useState('');

  const [data, setData] = useState<UserProfile>({
    name: '',
    email: '',
    profilePicture: '',
    bio: '',
    location: '',
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
    biblicalInterests: [],
    wantsGroupMatch: true
  });
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [signupError, setSignupError] = useState('');
  const [loginError, setLoginError] = useState('');

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const validateEmail = (email: string): boolean => {
    return EMAIL_REGEX.test(email);
  };

  const getUserKey = (email: string) => `user_${email.toLowerCase()}`;
  const accountExists = (email: string) => {
    try {
      return localStorage.getItem(getUserKey(email)) !== null;
    } catch {
      return false;
    }
  };
  const loadUserData = (email: string): { profile: UserProfile } | null => {
    try {
      const raw = localStorage.getItem(getUserKey(email));
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  };

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

  const renderBackButton = () => (
    <button
      type="button"
      onClick={() => setStep(prev => prev - 1)}
      aria-label="Go back"
      className="absolute top-6 left-6 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-stone-800 text-gray-800 dark:text-stone-100"
    >
      <ArrowLeft size={20} />
    </button>
  );

  const renderWelcome = () => (
    <div className={`flex flex-col items-center justify-center h-full text-center space-y-8 transition-all duration-1000 transform ${isAnimating ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
      <img src="/logo.png" alt="Selah" className="w-64 h-auto mb-2 rounded-2xl" />
      
      <div className="space-y-3">
        <div className="space-y-1 bg-white/60 dark:bg-stone-900/60 p-3.5 rounded-2xl border border-primary/10 dark:border-stone-700/50 shadow-xs max-w-sm mx-auto">
          <p className="font-serif italic text-secondary text-base md:text-lg leading-snug">
            "Spurring one another on in faith and community."
          </p>
          <p className="font-sans text-xs text-gray-500 dark:text-stone-400 font-bold uppercase tracking-wider">— Hebrews 10:24-25</p>
        </div>
      </div>

      <p className="font-sans text-gray-600 dark:text-stone-300 max-w-xs mx-auto leading-relaxed text-sm">
        Connect with a global community of believers walking the same path, reading the Word, and praying together.
      </p>

      <div className="w-full pt-4">
        <Button onClick={() => setStep(1)}>Get Started</Button>
      </div>
    </div>
  );

  const renderAccount = () => (
    <div className="space-y-6 animate-fade-in">
      {renderBackButton()}
      <div>
        <h2 className="font-serif text-2xl text-primary dark:text-warm-amber font-bold">
          {isSignInMode ? 'Welcome back to Selah' : 'Create your account'}
        </h2>
        <p className="text-xs text-gray-500 dark:text-stone-400 mt-1">
          {isSignInMode ? 'Enter your credentials to access your fellowship' : 'Join a global community of peer believers'}
        </p>
      </div>

      <div className="space-y-4">
        {!isSignInMode && (
          <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-stone-400 uppercase tracking-wide mb-1">First Name</label>
            <input
              type="text"
              value={data.name}
              onChange={(e) => updateData('name', e.target.value)}
              placeholder="David"
              className="w-full p-4 rounded-xl border border-gray-200 dark:border-stone-700 focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-white dark:bg-stone-900 text-sm text-gray-800 dark:text-stone-100"
            />
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-gray-500 dark:text-stone-400 uppercase tracking-wide mb-1">Email</label>
          <div className="relative">
            <Mail className="absolute left-4 top-4 text-gray-400" size={20} />
            <input
              type="email"
              value={data.email}
              onChange={(e) => {
                updateData('email', e.target.value);
                setSignupError('');
                setLoginError('');
                if (e.target.value && !validateEmail(e.target.value)) {
                  setEmailError('Please enter a valid email address');
                } else {
                  setEmailError('');
                }
              }}
              placeholder="you@example.com"
              className="w-full p-4 pl-12 rounded-xl border border-gray-200 dark:border-stone-700 focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-white dark:bg-stone-900 text-sm text-gray-800 dark:text-stone-100"
            />
          </div>
          {emailError && (
            <p className="text-xs text-red-500 mt-1 ml-1">{emailError}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 dark:text-stone-400 uppercase tracking-wide mb-1">Password</label>
          <div className="relative">
            <Lock className="absolute left-4 top-4 text-gray-400" size={20} />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-4 pl-12 pr-12 rounded-xl border border-gray-200 dark:border-stone-700 focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-white dark:bg-stone-900 text-sm text-gray-800 dark:text-stone-100"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {!isSignInMode && (
          <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-stone-400 uppercase tracking-wide mb-1">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-4 text-gray-400" size={20} />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (e.target.value !== password) {
                    setPasswordError('Passwords do not match');
                  } else {
                    setPasswordError('');
                  }
                }}
                placeholder="••••••••"
                className="w-full p-4 pl-12 pr-12 rounded-xl border border-gray-200 dark:border-stone-700 focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-white dark:bg-stone-900 text-sm text-gray-800 dark:text-stone-100"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {passwordError && (
              <p className="text-xs text-red-500 mt-1 ml-1">{passwordError}</p>
            )}
          </div>
        )}
      </div>

      <Button 
        disabled={
          isSignInMode
            ? (!data.email || !password || !validateEmail(data.email))
            : (!data.name || !data.email || !password || !confirmPassword || !validateEmail(data.email) || password !== confirmPassword)
        } 
        onClick={() => {
          if (!data.email) return;
          if (isSignInMode) {
            // Login mode: check if account exists
            const userData = loadUserData(data.email);
            if (!userData) {
              setLoginError('No account found with this email. Please sign up instead.');
              return;
            }
            // Account exists — load their saved profile and complete onboarding
            onComplete({ ...userData.profile, email: data.email });
          } else {
            // Sign-up mode: check if account already exists
            if (accountExists(data.email)) {
              setSignupError('An account with this email already exists. Please log in instead.');
              return;
            }
            // New account — proceed with onboarding
            setStep(prev => prev + 1);
          }
        }}
      >
        {isSignInMode ? 'Log In' : 'Continue'}
      </Button>

      {signupError && (
        <p className="text-xs text-red-500 mt-2 text-center">{signupError}</p>
      )}
      {loginError && (
        <p className="text-xs text-red-500 mt-2 text-center">{loginError}</p>
      )}

      <div className="text-center pt-2">
        <button
          type="button"
          onClick={() => {
            setIsSignInMode(!isSignInMode);
            setConfirmPassword('');
            setEmailError('');
            setPasswordError('');
            setSignupError('');
            setLoginError('');
          }}
          className="text-xs text-primary font-bold hover:underline py-2"
        >
          {isSignInMode ? "Don't have an account? Sign Up" : 'Already have an account? Log In'}
        </button>
      </div>
    </div>
  );

  const renderLocation = () => (
    <div className="space-y-6 animate-fade-in">
      {renderBackButton()}
      <div>
        <h2 className="font-serif text-2xl text-primary font-bold">Where are you joining us from?</h2>
        <p className="text-xs text-gray-500 mt-1">This helps us connect you with local prayer groups and events.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">City / Country</label>
          <input
            type="text"
            value={data.location || ''}
            onChange={(e) => updateData('location', e.target.value)}
            placeholder="e.g., London, UK"
            className="w-full p-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-white text-sm"
          />
        </div>
      </div>

      <div className="pt-2">
        <Button
          onClick={() => setStep(3)}
        >
          Continue
        </Button>
      </div>
    </div>
  );

  const renderStruggles = () => {
    const isOtherSelected = data.struggles.includes(StruggleType.OTHER);

    return (
      <div className="space-y-5 animate-fade-in">
        {renderBackButton()}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="font-serif text-2xl text-primary font-bold">Discussion Focus Areas</h2>
            <p className="text-gray-600 text-xs mt-1">What areas are you looking for prayer or peer discussions on?</p>
          </div>
          <button
            onClick={() => onComplete(data)}
            className="text-xs font-bold text-gray-500 hover:text-primary underline px-2 py-1"
          >
            Skip
          </button>
        </div>

        {/* Group Matching Opt-in Toggle */}
        <label className="flex items-start gap-3 p-3.5 rounded-xl bg-white border border-gray-100 cursor-pointer text-xs text-gray-700 hover:bg-cream/40 transition-colors">
          <input
            type="checkbox"
            checked={data.wantsGroupMatch}
            onChange={(e) => updateData('wantsGroupMatch', e.target.checked)}
            className="w-4 h-4 mt-0.5 text-primary rounded border-gray-300 focus:ring-primary accent-primary"
          />
          <div>
            <span className="font-semibold block text-gray-800">Yes, find me a group based on my focus areas</span>
            <span className="text-[11px] text-gray-500 leading-relaxed block mt-0.5">If unchecked, you can still select focus areas, but we won't automatically match you into a discussion group.</span>
          </div>
        </label>

        {/* Brief encouraging note */}
        <div className="bg-taupe/20 border border-taupe/40 rounded-xl p-3.5 text-xs text-gray-700 leading-relaxed">
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
          <Button onClick={() => onComplete(data)}>
            Continue
          </Button>
        </div>
      </div>
    );
  };

  const renderBibleBook = () => {
    return (
      <div className="space-y-5 animate-fade-in">
        {renderBackButton()}
        <div className="flex flex-col items-start">
          <h2 className="font-serif text-2xl text-primary font-bold">Bible Study Matching</h2>
          <p className="text-gray-600 text-xs mt-1">Select what you are currently reading or studying.</p>
        </div>

        {/* Info Banner */}
        <div className="bg-taupe/20 border border-taupe/40 rounded-xl p-4 text-xs text-gray-800 flex items-start gap-3">
          <Info size={18} className="text-primary shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-primary font-semibold">Why we ask this:</strong> We ask this so we can seamlessly pair you with an intimate, peer-led Bible study group covering that specific book!
          </p>
        </div>

        <div className="space-y-3">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">What book are you studying?</label>
          <select
            value={data.bibleBook || ''}
            onChange={(e) => updateData('bibleBook', e.target.value)}
            className="w-full p-4 rounded-xl bg-white border border-gray-200 focus:border-primary outline-none appearance-none shadow-sm text-sm font-medium text-gray-800"
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
        </div>

        <Button
        disabled={!data.bibleBook}
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
        {renderBackButton()}
        <div className="flex flex-col items-start">
          <h2 className="font-serif text-2xl text-primary font-bold">Biblical Interests</h2>
          <p className="text-gray-600 text-xs mt-1">What are your current biblical interests?</p>
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
        onClick={() => setStep(5)}
      >
          Enter Fellowship
        </Button>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto p-6 bg-cream dark:bg-stone-950 relative">
      <div className="flex-1 flex flex-col justify-center">
        {step === 0 && renderWelcome()}
        {step === 1 && renderAccount()}
        {step === 2 && renderLocation()}
        {step === 3 && renderBibleBook()}
        {step === 4 && renderBiblicalInterests()}
        {step === 5 && renderStruggles()}
      </div>
      {step > 0 && (
        <div className="py-6 flex justify-center space-x-2">
          {[1, 2, 3, 4, 5].map(i => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i <= step ? 'w-6 bg-primary' : 'w-2 bg-gray-300 dark:bg-stone-700'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
