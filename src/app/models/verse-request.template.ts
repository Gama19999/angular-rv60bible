import { environment } from '../../environments/environment';

/**
 * Representation of verse request data
 */
export interface VerseRequest {
  bookId: string;
  chapterNum: string;
  verseNum: string;
  limit: number;
  forth: boolean;
}

/**
 * Generates verse request data for first verses of chapter
 * @param bookId Book ID to search
 * @param chapterNum Chapter of book to get the verses from
 */
export function firstOfCh(bookId: string, chapterNum: string): VerseRequest {
  return {bookId: bookId, chapterNum: chapterNum, verseNum: '', limit: environment.fetchLimit, forth: true};
}

/**
 * Generates verse request data for next verses of chapter given a starting point
 * @param bookId Book ID to search
 * @param chapterNum Chapter of book to get the verses from
 * @param verseNum Verse search starting point
 */
export function nextOfCh(bookId: string, chapterNum: string, verseNum: string): VerseRequest {
  return {bookId: bookId, chapterNum: chapterNum, verseNum: verseNum, limit: environment.fetchLimit, forth: true};
}

/**
 * Generates verse request data for previous verses of chapter given a starting point
 * @param bookId Book ID to search
 * @param chapterNum Chapter of book to get the verses from
 * @param verseNum Verse search starting point
 */
export function prevOfCh(bookId: string, chapterNum: string, verseNum: string): VerseRequest {
  return {bookId: bookId, chapterNum: chapterNum, verseNum: verseNum, limit: environment.fetchLimit, forth: false};
}
