import { VerseData } from './verse-data.interface';

/**
 * Representation of a content (verses) page change
 */
export interface ContentPageChange {
  currentVerses: VerseData[];
  direction: string;
  isMobile: boolean;
}
