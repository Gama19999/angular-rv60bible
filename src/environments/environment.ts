const version = '3.0.0';
export const environment = {
    production: false,
    appInfo: {
        name: 'Biblia RV60',
        version: `${version}-dev`,
        year: '2026',
        platform: 'dev',
    },
    appContact: {
        developer: 'GAMARS',
        contact: 'https://github.com/Gama19999',
        company: 'Serial30',
        siteUrl: 'http://127.0.0.1:8001/',
        electronGit: 'https://github.com/Gama19999/electron-rv60bible.git',
        androidGit: 'https://github.com/Gama19999/android-rv60bible.git',
    },
    api: {
        root: 'http://127.0.0.1:8001',
        getRoot: () => environment.api.root,
        versions: () => environment.api.getRoot() + '/versions',
        getVersion: (versionKey: string) => `${environment.api.getRoot()}/versions/${versionKey}`,
        books: (versionKey: string) =>`${environment.api.getRoot()}/versions/${versionKey}/books`,
        getBook: (versionKey: string, bookId: any) => `${environment.api.getRoot()}/versions/${versionKey}/books/${bookId}`,
        verses: (versionKey: string, bookId: any, chapterId: any) => `${environment.api.getRoot()}/versions/${versionKey}/books/${bookId}/chapters/${chapterId}/verses`,
        favourites: (versionKey: string) => `${environment.api.getRoot()}/versions/${versionKey}/favourites`,
        singleFavourite: (versionKey: string, favouriteId: any) => `${environment.api.favourites(versionKey)}/${favouriteId}`,
        lookup: (versionKey: string) => `${environment.api.getRoot()}/versions/${versionKey}/lookup`,
        reports: () => environment.api.getRoot() + '/app/reports',
        defragment: () => environment.api.getRoot() + '/app/defragment',
    },
};