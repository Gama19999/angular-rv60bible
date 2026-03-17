import { BibleData, BookData, VerseData, FavouriteData, UpdateResp, InsertResp, LookupValue, LookupResp, HistoryData, ClientReport } from '../util/app.interfaces';

export { };

declare global {
    interface Window {
        /** API to comunicate with Electron (PC app) */
        electronAPI: {
            /** @returns Promises the electron server address as `'http://127.0.0.1:*'` */
            getServerAddress: () => Promise<string>,
            /** @param like As `asleep` or `awake` — If `undefined` requests current display config @returns Promises current display config */
            requestDisplaySleep: (like?: string) => Promise<string>,
        };
        /** API to comunicate with Apache Cordova (Android app) */
        apacheCdv: { // TODO refactor method return type
            versions: () => Promise<BibleData[]>,
            getVersion: (versionId: string) => Promise<BibleData[]>,
            books: (versionId: string) => Promise<BookData[]>,
            getBook: (versionId: string, bookId: number) => Promise<BookData[]>,
            verses: (versionId: string, bookId: number, chapterId: number) => Promise<VerseData[]>,
            favourites: (versionId: string) => Promise<FavouriteData[]>,
            addFavourite: (versionId: string, verse: VerseData) => Promise<InsertResp>, // TODO update method signature
            removeFavourite: (versionId: string, favouriteId: number) => Promise<UpdateResp>, // TODO add this method to cordova
            updateColor: (versionId: string, favouriteId: number, verse: VerseData) => Promise<UpdateResp>, // TODO update method signature
            lookup: (versionId: string, lookupValue: LookupValue) => Promise<LookupResp[]>, // TODO update method signature
            addReport: (clientReport: ClientReport) => Promise<InsertResp>,
            defragment: () => Promise<UpdateResp>, // TODO update method signature
        };
    }
}