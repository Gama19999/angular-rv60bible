const version = '3.0.0';
export const environment = {
    production: true,
    appInfo: {
        name: 'Biblia RV60',
        version: `${version}-ele`,
        year: '2026',
        platform: 'electron',
    },
    appContact: {
        developer: 'GAMARS',
        contact: 'https://github.com/Gama19999',
        company: 'Serial30',
        siteUrl: 'https://serial30here.web.app/projects/rv60bible',
        electronGit: 'https://github.com/Gama19999/electron-rv60bible.git',
        cordovaGit: 'https://github.com/Gama19999/cordova-rv60bible.git',
    },
    api: {
        root: '',
        getRoot: () => environment.api.root,
        versions: () => environment.api.getRoot() + '/versions',
        getVersion: (versionKey: string) => `${environment.api.getRoot()}/versions/${versionKey}`,
        books: (versionKey: string) =>`${environment.api.getRoot()}/versions/${versionKey}/books`,
        getBook: (versionKey: string, bookId: number) => `${environment.api.getRoot()}/versions/${versionKey}/books/${bookId}`,
        verses: (versionKey: string, bookId: number, chapterId: number) => `${environment.api.getRoot()}/versions/${versionKey}/books/${bookId}/chapters/${chapterId}/verses`,
        favourites: (versionKey: string) => `${environment.api.getRoot()}/versions/${versionKey}/favourites`,
        singleFavourite: (versionKey: string, favouriteId: any) => `${environment.api.favourites(versionKey)}/${favouriteId}`,
        lookup: (versionKey: string) => `${environment.api.getRoot()}/versions/${versionKey}/lookup`,
        reports: () => environment.api.getRoot() + '/app/reports',
        defragment: () => environment.api.getRoot() + '/app/defragment',
    },
};