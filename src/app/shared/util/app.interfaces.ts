export interface VerseViewerState {
    hideNavigation: boolean;
    bookId: number;
    chapterId: number;
}

export interface BibleInfo {
    id: string;
    lang: string;
    name: string;
    year: number;
}

export interface BookInfo {
    bookId: number;
    name: string;
    abr: string;
    chapterCount: number;
    testament: string; 
    bookOrdinal: number;
    author: string;
    date: string;
}

export interface VerseInfo {
    verseId: number;
    bookId: number;
    chapterId: number;
    verseOrdinal: number;
    text: string;
    isFavourite: number;
    color: string;
}

export interface VerseUpdateResp {
    msg: string;
    changes: number;
}

export interface ErrorReport {
    errorTypeId: number;
    versionId?: string;
    verseId?: number;
    verseContent?: string;
    extraMsg?: string;
}

export interface ErrorReportResp extends VerseUpdateResp {}

export interface LookupValue {
    searchFor: string;
}

export interface LookupResp {
    bookId: number;
    bookName: string;
    chapterId?: number;
    verseOrdinal?: number;
    text?: string;
}

export interface FavouriteInfo extends VerseInfo {
    bookName: string;
}