import { Routes } from '@angular/router';

import { Fade } from './fade/fade';
import { Reader } from './reader/reader';
import { Search } from './search/search';
import { Settings } from './settings/settings';

export const routes: Routes = [
    { path: 'fade', component: Fade },
    { path: 'search', component: Search },
    {
        path: 'reader/:versionKey',
        component: Reader,
        loadChildren: () => import('./reader/reader.routes').then(c => c.readerRoutes)
    },
    { path: 'settings', component: Settings },
    { path: '', redirectTo: 'fade', pathMatch: 'full' },
    { path: '**', redirectTo: 'fade' }
];