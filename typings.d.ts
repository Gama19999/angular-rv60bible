import { BibleInfo, BookInfo, ErrorReport, ErrorReportResp, FavouriteInfo, LookupResp, LookupValue, VerseInfo, VerseUpdateResp } from "./src/app/shared/util/app.interfaces";

export { };

declare global {
    interface Window {
        electron: {
            /** Retrieves the current server address and port */
            getServerAddress: () => Promise<string>,
        };
        apacheCdv: {
            versions: () => Promise<BibleInfo[]>,
            getVersion: (versionId: string) => Promise<BibleInfo[]>,
            books: (versionId: string) => Promise<BookInfo[]>,
            getBook: (versionId: string, bookId: number) => Promise<BookInfo[]>,
            verses: (versionId: string, bookId: number, chapterId: number) => Promise<VerseInfo[]>,
            getFavourites: (versionId: string) => Promise<FavouriteInfo[]>,
            setFavourite: (versionId: string, verseBody: VerseInfo) => Promise<VerseUpdateResp>,
            setColors: (versionId: string, verseBody: VerseInfo) => Promise<VerseUpdateResp>,
            fastSearch: (versionId: string, lookupValue: LookupValue) => Promise<LookupResp[]>,
            setError: (clientReport: ErrorReport) => Promise<ErrorReportResp>,
        };
    }
}