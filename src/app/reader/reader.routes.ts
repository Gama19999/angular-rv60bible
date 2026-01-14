import { Routes } from '@angular/router';

import { BookList } from './book-list/book-list';
import { ChapterChooser } from './chapter-chooser/chapter-chooser';
import { VerseViewer } from './verse-viewer/verse-viewer';
import { Favourites } from '../favourites/favourites';

export const readerRoutes: Routes = [
    { path: '', redirectTo: 'books', pathMatch: 'full' },
    { path: 'books', component: BookList },
    { path: 'books/:bookId/chapters', component: ChapterChooser },
    { path: 'books/:bookId/chapters/:chapterId/verses', component: VerseViewer },
    { path: 'favourites', component: Favourites }
];