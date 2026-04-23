import { STORAGE_KEYS, QuizProgress, SRSCard } from '@/data/database';

export function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function saveJSON<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getQuizProgress(): QuizProgress {
  return loadJSON(STORAGE_KEYS.QUIZ, { attempts: 0, correct: 0, history: [] });
}

export function saveQuizProgress(progress: QuizProgress): void {
  saveJSON(STORAGE_KEYS.QUIZ, progress);
}

export function getBookmarks(): number[] {
  return loadJSON(STORAGE_KEYS.BOOKMARKS, []);
}

export function toggleBookmark(questionId: number): void {
  const bookmarks = getBookmarks();
  const index = bookmarks.indexOf(questionId);
  
  if (index > -1) {
    bookmarks.splice(index, 1);
  } else {
    bookmarks.push(questionId);
  }
  
  saveJSON(STORAGE_KEYS.BOOKMARKS, bookmarks);
}

export function isBookmarked(questionId: number): boolean {
  return getBookmarks().includes(questionId);
}

export function getSRSCards(): SRSCard[] {
  return loadJSON(STORAGE_KEYS.SRS, []);
}

export function saveSRSCards(cards: SRSCard[]): void {
  saveJSON(STORAGE_KEYS.SRS, cards);
}

export function exportProgress(): string {
  const data = {
    quiz: getQuizProgress(),
    bookmarks: getBookmarks(),
    srs: getSRSCards(),
    exportDate: new Date().toISOString(),
  };
  return JSON.stringify(data, null, 2);
}

export function importProgress(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString);
    if (data.quiz) saveJSON(STORAGE_KEYS.QUIZ, data.quiz);
    if (data.bookmarks) saveJSON(STORAGE_KEYS.BOOKMARKS, data.bookmarks);
    if (data.srs) saveJSON(STORAGE_KEYS.SRS, data.srs);
    return true;
  } catch {
    return false;
  }
}
