/**
 * Representation of a verse data
 */
export interface VerseData {
  verseId: string;
  bookId: string;
  chapterNum: string;
  verseNum: string;
  verseTxt: string;
}

/**
 * Representation of a verse marked as favourite
 */
export interface FavouriteData {
  verseId: string;
  bookId: string;
  chapterNum: string;
  verseNum: string;
  verseTxt: string;
  added: string;
}
