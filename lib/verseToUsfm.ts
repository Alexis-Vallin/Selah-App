/**
 * Maps human-readable Bible book names to their 3-letter USFM codes.
 * Used to convert discussion verse references (e.g. "Proverbs 3:5-6")
 * into the USFM format (e.g. "PRO.3.5-6") required by the YouVersion
 * BibleCard component.
 */

const BOOK_TO_USFM: Record<string, string> = {
  // Old Testament
  genesis: 'GEN',
  exodus: 'EXO',
  leviticus: 'LEV',
  numbers: 'NUM',
  deuteronomy: 'DEU',
  joshua: 'JOS',
  judges: 'JDG',
  ruth: 'RUT',
  '1 samuel': '1SA',
  '2 samuel': '2SA',
  '1 kings': '1KI',
  '2 kings': '2KI',
  '1 chronicles': '1CH',
  '2 chronicles': '2CH',
  ezra: 'EZR',
  nehemiah: 'NEH',
  esther: 'EST',
  job: 'JOB',
  psalms: 'PSA',
  psalm: 'PSA',
  proverbs: 'PRO',
  ecclesiastes: 'ECC',
  'song of solomon': 'SNG',
  'song of songs': 'SNG',
  isaiah: 'ISA',
  jeremiah: 'JER',
  lamentations: 'LAM',
  ezekiel: 'EZK',
  daniel: 'DAN',
  hosea: 'HOS',
  joel: 'JOL',
  amos: 'AMO',
  obadiah: 'OBA',
  jonah: 'JON',
  micah: 'MIC',
  nahum: 'NAM',
  habakkuk: 'HAB',
  zephaniah: 'ZEP',
  haggai: 'HAG',
  zechariah: 'ZEC',
  malachi: 'MAL',

  // New Testament
  matthew: 'MAT',
  mark: 'MRK',
  luke: 'LUK',
  john: 'JHN',
  acts: 'ACT',
  romans: 'ROM',
  '1 corinthians': '1CO',
  '2 corinthians': '2CO',
  galatians: 'GAL',
  ephesians: 'EPH',
  philippians: 'PHP',
  colossians: 'COL',
  '1 thessalonians': '1TH',
  '2 thessalonians': '2TH',
  '1 timothy': '1TI',
  '2 timothy': '2TI',
  titus: 'TIT',
  philemon: 'PHM',
  hebrews: 'HEB',
  james: 'JAS',
  '1 peter': '1PE',
  '2 peter': '2PE',
  '1 john': '1JN',
  '2 john': '2JN',
  '3 john': '3JN',
  jude: 'JUD',
  revelation: 'REV',
};

/**
 * Convert a human-readable verse reference to USFM format.
 *
 * Examples:
 *   "Proverbs 3:5-6"       → "PRO.3.5-6"
 *   "John 3:16"             → "JHN.3.16"
 *   "1 Corinthians 10:13"   → "1CO.10.13"
 *   "Ephesians 4:2-3"       → "EPH.4.2-3"
 *   "Mark 9:24"             → "MRK.9.24"
 *   "Psalm 23"              → "PSA.23"
 *
 * Returns `null` if the book name isn't recognized.
 */
export function verseToUsfm(verseRef: string): string | null {
  // Match: optional number prefix + book name, then chapter:verse(s)
  // e.g. "1 Corinthians 10:13" → ["1 Corinthians", "10", "13"]
  //      "Proverbs 3:5-6"     → ["Proverbs", "3", "5-6"]
  //      "Psalm 23"           → ["Psalm", "23", undefined]
  const match = verseRef
    .trim()
    .match(/^(\d?\s*[A-Za-z\s]+?)\s+(\d+)(?::(.+))?$/);

  if (!match) return null;

  const bookName = match[1].trim().toLowerCase();
  const chapter = match[2];
  const versesPart = match[3]; // may be undefined for whole-chapter refs

  const usfmBook = BOOK_TO_USFM[bookName];
  if (!usfmBook) return null;

  if (versesPart) {
    return `${usfmBook}.${chapter}.${versesPart}`;
  }
  return `${usfmBook}.${chapter}`;
}
