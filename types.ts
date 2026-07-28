
export enum UserStatus {
  ONBOARDING = 'ONBOARDING',
  MATCHING = 'MATCHING',
  DASHBOARD = 'DASHBOARD'
}

export enum StruggleType {
  ANXIETY = 'Anxiety & Worry',
  RELATIONSHIP = 'Relationship Issues',
  DOUBT = 'Faith Doubts',
  LONELINESS = 'Loneliness',
  ACADEMIC = 'Academic Pressure',
  ADDICTION = 'Addiction',
  IDENTITY = 'Identity in Christ',
  PRAYER = 'Prayer Life',
  BIBLE = 'Bible Understanding',
  OTHER = 'Other'
}

export enum ConnectionPreference {
  BUDDY = 'One-on-One Buddy',
  COMMUNITY = 'Bible Study Community'
}

export interface MoodEntry {
  date: string; // ISO date YYYY-MM-DD
  rating: number; // 1-10
  note?: string;
}

export interface GratitudeEntry {
  id: string;
  date: string;
  content: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: string; // e.g. "5 min"
  completed: boolean;
}

export interface UserProfile {
  name: string;
  email?: string; // Mock auth
  profilePicture?: string;
  bio?: string;
  struggles: StruggleType[];
  specificStruggle: string;
  connectionPreference: 'buddy' | 'community' | 'both';
  availability: string[];
  prayerRequest: string;
  bibleBook: string | null;
  bibleStudyGroupId: string | null;
  streak: number;
  lastCheckIn: string | null;
  
  // Notifications
  notificationsEnabled: boolean;
  notificationTime?: string; // Morning, Evening, etc.
  notifyOnBuddyMessage: boolean;
  notifyOnCommunityPost: boolean;

  // Privacy
  shareGrowthStats: boolean;
  defaultAnonymousPrayer: boolean;

  moodHistory: MoodEntry[];
  gratitudeHistory: GratitudeEntry[];
  completedLessons: string[]; // IDs of completed lessons
  biblicalInterests?: string[];
}

export interface Message {
  id: string;
  sender: 'user' | 'buddy';
  text: string;
  timestamp: number;
}

export interface CommunityPost {
  id: string;
  author: string;
  content: string;
  timestamp: number;
  likes: number;
}

export type PostType = 'DEVOTIONAL' | 'PRAYER_REQUEST' | 'ENCOURAGEMENT' | 'QUESTION';

export interface FlockPost {
  id: string;
  author: string;
  avatarUrl?: string;
  type: PostType;
  title?: string;
  content: string;
  tags: string[];
  timestamp: number;
  likes: number; // Amens or Praying count
  isUser: boolean;
  reactions: number;
}

export interface Buddy {
  name: string;
  avatarUrl: string;
  sharedStruggle: string;
  prayerRequest: string;
}