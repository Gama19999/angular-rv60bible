const version = '2.0.2';
const api = '';
export const environment = {
    production: true,
    appInfo: {
        name: 'Biblia RV60',
        version: `${version}-cor`,
        year: '2026',
        platform: 'cordova',
    },
    appContact: {
        developer: 'GAMARS',
        company: 'Serial30',
        siteUrl: 'https://bit.ly/rv60bible',
        githubUrl: 'https://github.com/Gama19999/cordova-rv60bible.git',
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