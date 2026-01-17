const version = '2.0.1';
const api = 'http://127.0.0.1:8001';
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
        company: 'Serial30',
        siteUrl: 'http://127.0.0.1:8001/',
        githubUrl: 'https://github.com/Gama19999/electron-rv60bible.git',
    },
    api: {
        /** GET /versions */
        versions: api + '/versions',
        /** GET /versions/{} */
        getVersion: api + '/versions/{}',
        /** GET /versions/{}/books */
        books: api + '/versions/{}/books',
        /** GET /versions/{}/books/{} */
        getBook: api + '/versions/{}/books/{}',
        /** GET /versions/{}/books/{}/chapters/{}/verses */
        verses: api + '/versions/{}/books/{}/chapters/{}/verses',
        /** GET /versions/{}/favourites */
        getFavourites: api + '/versions/{}/favourites',
        /** PUT /versions/{}/favourites */
        setFavourite: api + '/versions/{}/favourites',
        /** PUT /versions/{}/colors */
        setColors: api + '/versions/{}/colors',
        /** POST /versions/{}/lookup */
        lookup: api + '/versions/{}/lookup',
        /** POST /errors */
        setError: api + '/errors'
    },
};