import { AppView, LookupMode } from './app.types';

// *********** LOGIC related interfaces *********** 
export interface Language {
    language: string;
    str: any;
}

export interface ViewTrack {
    previous: AppView;
    previousUrl?: string;
    current: AppView;
    currentUrl?: string;
}

export interface NavigationData {
    versionKey?: string;
    bookId?: number;
    chapterId?: number;
    hash?: string;
    url?: string;
    replaceUrl?: boolean;
}

export interface VerseViewerChange {
    prevBook?: { bookId?: number; bookName?: string; };
    nextBook?: { bookId?: number; bookName?: string; };
    prevChapterId?: number;
    nextChapterId?: number;
}

export interface MenuData {
    top: number;
    left: number;
    verse?: VerseData;
}

// *********** API retated interfaces *********** 
export interface BibleData {
    versionKey: string;
    lang: string;
    name: string;
    year: number;
}

export interface BookData {
    bookId: number;
    name: string;
    abr: string;
    chapterCount: number;
    /** `1` or `0` */ bookOfNT: number;
    bookOrdinal: number;
    author: string;
    /** Parse prefix symbols */ date: string;
}

export interface VerseData {
    verseId: number;
    bookId: number;
    chapterId: number;
    verseOrdinal: number;
    text: string;
    favouriteId: number;
    /** `1` or `0` */ isFavourite: number;
    color: string;
}

export interface FavouriteData extends VerseData {
    bookName: string;
    bookAbr: string;
    /** Stored **date** as ISO-8601 `YYYY-MM-DD` */ date: string;
}

export interface UpdateResp {
    msg: string;
    changes: number;
}

export interface InsertResp {
    msg: string;
    newId: number;
}

export interface LookupValue {
    searchFor: string;
    lookupMode: LookupMode;
}

export interface LookupResp {
    bookId: number;
    bookName: string;
    verseId?: number;
    chapterId?: number;
    verseOrdinal?: number;
    text?: string;
}

export interface ClientReport {
    /** From `environment.appInfo.version` */ appVersion: string;
    /** From `BibleService` */ versionKey: string;
    /** `1,2,3,4,5` */ typeId: number;
    /** Required if `typeId < 4` */ verseId?: number;
    /** If `typeId > 3` store a text comment — If `typeId < 4` store `verse.text` value */ feedback?: string;
}