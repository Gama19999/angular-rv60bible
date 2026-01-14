import { Routes } from '@angular/router';

import { Fade } from './fade/fade';
import { Lobby } from './lobby/lobby';
import { Reader } from './reader/reader';

export const routes: Routes = [
    { path: 'fade', component: Fade, title: 'Biblia | Cargando...' },
    { path: 'lobby', component: Lobby, title: 'Biblia | Inicio' },
    {
        path: 'reader/:bibleId',
        component: Reader,
        loadChildren: () => import('./reader/reader.routes').then(c => c.readerRoutes)
    },
    { path: '', redirectTo: 'fade', pathMatch: 'full' },
    { path: '**', redirectTo: 'fade' }
];