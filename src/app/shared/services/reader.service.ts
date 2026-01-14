import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

import { VerseViewerState } from '../util/app.interfaces';

@Injectable({ providedIn: 'root' })
export class ReaderService {
  bookListScroll$: BehaviorSubject<number>;
  bibleQuote$: BehaviorSubject<string>;
  reloadVerses$: Subject<string>;
  inVerseViewer$: Subject<VerseViewerState>;

  constructor() {
    this.bookListScroll$ = new BehaviorSubject(0);
    this.bibleQuote$ = new BehaviorSubject('Libros');
    this.reloadVerses$ = new Subject();
    this.inVerseViewer$ = new Subject();
  }
}
