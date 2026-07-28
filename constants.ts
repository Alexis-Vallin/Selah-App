
import { StruggleType, Lesson, FlockPost } from './types';

// Custom SVG Logo: Sheep with Halo and Shepherd's Crook on Green Background
export const SHEEP_LOGO_URL = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48ZGVmcz48ZmlsdGVyIGlkPSJzaGFkb3ciIHg9Ii0yMCUiIHk9Ii0yMCUiIHdpZHRoPSIxNDAlIiBoZWlnaHQ9IjE0MCUiPjxmZUdhdXNzaWFuQmx1ciBpbj0iU291cmNlQWxwaGEiIHN0ZERldmlhdGlvbj0iNSIvPjxmZU9mZnNldCBkeD0iMiIgZHk9IjQiIHJlc3VsdD0ib2Zmc2V0Ymx1ciIvPjxmZUNvbXBvbmVudFRyYW5zZmVyPjxmZUZ1bmM4IHR5cGU9ImxpbmVhciIgc2xvcGU9IjAuMyIvPjwvZmVDb21wb25lbnRUcmFuc2Zlcj48ZmVNZXJnZT4gPGZlTWVyZ2VOb2RlLz48ZmVNZXJnZU5vZGUgaW49IlNvdXJjZUdyYXBoaWMiLz4gPC9mZU1lcmdlPjwvZmlsdGVyPjwvZGVmcz48cmVjdCB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgcng9IjEwMCIgZmlsbD0iIzZCNzIzNiIvPjxnIGZpbHRlcj0idXJsKCNzaGFkb3cpIj48cGF0aCBkPSJNMjIwIDQwMCBMIDE5MCAyMDAgQyAxOTAgMTIwLCAzMDAgMTIwLCAzMDAgMjAwIiBzdHJva2U9IiM3REE5QzciIHN0cm9rZS13aWR0aD0iMzAiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0xOTAgMjQwIEMgMTYwIDIxMCwgMTIwIDI0MCwgMTIwIDI3MCBDIDEyMCAzMTAsIDE5MCAzNjAsIDE5MCAzNjAgQyAxOTAgMzYwLCAyNjAgMzEwLCAyNjAgMjcwIEMgMjYwIDI0MCwgMjIwIDIxMCwgMTkwIDI0MCIgZmlsbD0iIzdEQTlDNyIvPjwvZz48ZyBmaWx0ZXI9InVybCgjc2hhZG93KSI+PHBhdGggZD0iTTE4MCAzNTAgTCAxNjAgNDMwIiBzdHJva2U9IiNGNEVCQzMiIHN0cm9rZS13aWR0aD0iNDAiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjxwYXRoIGQ9Ik0yNjAgMzUwIEwgMjUwIDQyMCBMIDI4MCA0MzAiIHN0cm9rZT0iI0Y0RUJDMyIgc3Ryb2tlLXdpZHRoPSI0MCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTM0MCAzNTAgTCAzNDAgNDMwIiBzdHJva2U9IiNGNEVCQzMiIHN0cm9rZS13aWR0aD0iNDAiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjxwYXRoIGQ9Ik00MDAgMzMwIEwgNDMwIDM4MCBMIDQxMCA0MTAiIHN0cm9rZT0iI0Y0RUJDMyIgc3Ryb2tlLXdpZHRoPSI0MCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBmaWxsPSJub25lIi8+PGVsbGlwc2UgY3g9IjI4MCIgY3k9IjMwMCIgcng9IjE0MCIgcnk9IjEwMCIgZmlsbD0iI0Y0RUJDMyIvPjxjaXJjbGUgY3g9IjE0MCIgY3k9IjMwMCIgcj0iMzAiIGZpbGw9IiNGNEVCQzMiLz4gPGcgdHJhbnNmb3JtPSJyb3RhdGUoNSA0MDAgMjIwKSI+PGVsbGlwc2UgY3g9IjQwMCIgY3k9IjIyMCIgcng9Ijc1IiByeT0iNjAiIGZpbGw9IiNGNEVCQzMiLz48ZWxsaXBzZSBjeD0iMzMwIiBjeT0iMjEwIiByeD0iMzUiIHJ5PSIxNSIgZmlsbD0iI0Y0RUJDMyIgdHJhbnNmb3JtPSJyb3RhdGUoLTE1IDMzMCAyMTApIi8+IDxwYXRoIGQ9Ik00MDAgMjEwIFEgNDIwIDIwMCA0NDAgMjEwIiBzdHJva2U9IiM2NTVBM0YiIHN0cm9rZS13aWR0aD0iNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBmaWxsPSJub25lIi8+IDxwYXRoIGQ9Ik00NTUgMjMwIFEgNDUwIDI0MCA0NDAgMjMwIiBzdHJva2U9IiM2NTVBM0YiIHN0cm9rZS13aWR0aD0iNCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBmaWxsPSJub25lIi8+IDwvZz48L2c+PGVsbGlwc2UgY3g9IjM4MCIgY3k9IjEzMCIgcng9IjcwIiByeT0iMjAiIHN0cm9rZT0iI0Y5Qzg0NiIgc3Ryb2tlLXdpZHRoPSIxMiIgZmlsbD0ibm9uZSIgZmlsdGVyPSJ1cmwoI3NoYWRvdykiLz48ZWxsaXBzZSBjeD0iMzgwIiBjeT0iMTMwIiByeD0iNzAiIHJ5PSIyMCIgc3Ryb2tlPSIjRkZGNUQ2IiBzdHJva2Utd2lkdGg9IjQiIGZpbGw9Im5vbmUiIG9wYWNpdHk9IjAuOCIvPjwvc3ZnPg==";

export const STRUGGLES = Object.values(StruggleType);

export const TIME_SLOTS = [
  'Morning (6-9am)',
  'Mid-Morning (9-12pm)',
  'Afternoon (12-3pm)',
  'Evening (3-6pm)',
  'Night (6-9pm)',
  'Late Night (9pm+)'
];

export const POPULAR_BOOKS = ['Psalms', 'Proverbs', 'John', 'Romans', 'James'];

export const OLD_TESTAMENT_BOOKS = [
  'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy', 'Joshua', 'Judges', 'Ruth', 
  '1 Samuel', '2 Samuel', '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles', 'Ezra', 
  'Nehemiah', 'Esther', 'Job', 'Psalms', 'Proverbs', 'Ecclesiastes', 'Song of Solomon', 
  'Isaiah', 'Jeremiah', 'Lamentations', 'Ezekiel', 'Daniel', 'Hosea', 'Joel', 'Amos', 
  'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk', 'Zephaniah', 'Haggai', 'Zechariah', 'Malachi'
];

export const NEW_TESTAMENT_BOOKS = [
  'Matthew', 'Mark', 'Luke', 'John', 'Acts', 'Romans', '1 Corinthians', '2 Corinthians', 
  'Galatians', 'Ephesians', 'Philippians', 'Colossians', '1 Thessalonians', '2 Thessalonians', 
  '1 Timothy', '2 Timothy', 'Titus', 'Philemon', 'Hebrews', 'James', '1 Peter', '2 Peter', 
  '1 John', '2 John', '3 John', 'Jude', 'Revelation'
];

export const BIBLE_BOOKS = [...OLD_TESTAMENT_BOOKS, ...NEW_TESTAMENT_BOOKS];

export const MOCK_BUDDY = {
  name: "David",
  avatarUrl: "https://picsum.photos/100/100",
  sharedStruggle: "Prayer Life",
  prayerRequest: "My grandmother is going through surgery this week. Please pray for peace and healing."
};

export const MOCK_COMMUNITY_POSTS = [
  {
    id: '1',
    author: 'Sarah J.',
    content: 'Verse 12 really spoke to me today about endurance. How do you all interpret "rejoicing in hope"?',
    timestamp: Date.now() - 1000000,
    likes: 5
  },
  {
    id: '2',
    author: 'Mike T.',
    content: 'Struggling to keep up with the reading plan this week. Prayers appreciated!',
    timestamp: Date.now() - 5000000,
    likes: 12
  }
];

export const MOCK_LESSONS: Lesson[] = [
  { id: '1', title: 'The Heart of Prayer', description: 'Understanding why we pray and how God listens.', duration: '5 min', completed: true },
  { id: '2', title: 'Walking in the Spirit', description: 'What does it mean to be led by the Spirit daily?', duration: '8 min', completed: false },
  { id: '3', title: 'Dealing with Doubt', description: 'It is okay to ask questions. Lets look at Thomas.', duration: '6 min', completed: false },
  { id: '4', title: 'Identity in Christ', description: 'You are who He says you are.', duration: '10 min', completed: false },
];

export const MOCK_FLOCK_POSTS: FlockPost[] = [
  { 
    id: 'dev1', 
    author: 'Pastor Michael',
    avatarUrl: 'https://i.pravatar.cc/150?u=dev1',
    type: 'DEVOTIONAL',
    title: 'Finding Silence in the Noise',
    content: 'In our busy world, silence is rare. Yet, Elijah found God not in the wind or earthquake, but in the gentle whisper. Today, take 5 minutes to just listen.',
    tags: ['SILENCE', 'GROWTH', 'PEACE'],
    likes: 125,
    reactions: 125,
    timestamp: Date.now() - 3600000 * 2, // 2 hours ago
    isUser: false 
  },
  { 
    id: 'req1', 
    author: 'Grace L.', 
    avatarUrl: 'https://i.pravatar.cc/150?u=req1',
    type: 'PRAYER_REQUEST',
    content: 'Job interview tomorrow morning. Anxiety is high. Please pray for peace and clarity of mind.',
    tags: ['ANXIETY', 'WORK', 'TRUST'],
    likes: 89,
    reactions: 89,
    timestamp: Date.now() - 3600000 * 5, // 5 hours ago
    isUser: false 
  },
  { 
    id: 'enc1', 
    author: 'Marcus T.', 
    avatarUrl: 'https://i.pravatar.cc/150?u=enc1',
    type: 'ENCOURAGEMENT',
    title: 'God Provided!',
    content: 'I shared last week about my financial struggle. Today, an unexpected check arrived covering exactly what I needed. Jehovah Jireh!',
    tags: ['TESTIMONY', 'PROVISION', 'JOY'],
    likes: 240,
    reactions: 240,
    timestamp: Date.now() - 86400000, // 1 day ago
    isUser: false 
  },
  { 
    id: 'req2', 
    author: 'Anonymous', 
    avatarUrl: '',
    type: 'PRAYER_REQUEST',
    content: 'My marriage is hanging by a thread. We stopped talking days ago. Need a miracle.',
    tags: ['MARRIAGE', 'FAMILY', 'HEALING'],
    likes: 42,
    reactions: 42,
    timestamp: Date.now() - 3600000 * 12, // 12 hours ago
    isUser: false 
  },
  {
    id: 'dev2',
    author: 'Selah Team',
    avatarUrl: SHEEP_LOGO_URL,
    type: 'DEVOTIONAL',
    title: 'Spurring One Another On',
    content: 'Hebrews 10:24-25 reminds us to consider how we may spur one another on toward love and good deeds, not giving up meeting together.',
    tags: ['HEBREWS', 'COMMUNITY', 'FAITH'],
    likes: 312,
    reactions: 312,
    timestamp: Date.now() - 86400000 * 2,
    isUser: false
  }
];
