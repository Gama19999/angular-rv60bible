import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';

import { environment } from '../../../environments/environment';
import { CacheService } from './cache.service';
import { NavigationData, ViewTrack } from '../util/app.interfaces';
import { AppView } from '../util/app.types';

@Injectable({ providedIn: 'root' })
export class StateService {
  private readonly router = inject(Router);
  private readonly cacheSrv = inject(CacheService);
  private readonly isCordova = environment.appInfo.platform === 'cordova';
  viewTrack$: BehaviorSubject<ViewTrack>;
  bibleQuote$: BehaviorSubject<string>;
  booksScroll$: BehaviorSubject<number>;
  reloadVerses$: Subject<string>;
  closeVerseMenu$: Subject<void>;
  settingsOn$: BehaviorSubject<boolean>;
  hiddenBibles$: BehaviorSubject<boolean>;
  hiddenVersesNav$: BehaviorSubject<boolean> | undefined;

  constructor() {
    this.viewTrack$ = new BehaviorSubject({ previous: 'fade', current: this.cacheSrv.isFadeDone() ? 'search' : 'fade' } as ViewTrack);
    this.bibleQuote$ = new BehaviorSubject('');
    this.booksScroll$ = new BehaviorSubject(0);
    this.reloadVerses$ = new Subject();
    this.closeVerseMenu$ = new Subject();
    this.settingsOn$ = new BehaviorSubject(false);
    this.hiddenBibles$ = new BehaviorSubject(true);
    this.setupCordova();
  }

  private setupCordova() {
    if (this.isCordova) this.hiddenVersesNav$ = new BehaviorSubject(true);
  }

  navigate(appView: AppView, params?: NavigationData): void {
    switch (appView) {
      case 'books':
        this.router.navigate(['/reader', params?.versionKey]);
        break;
      case 'chapters':
        this.router.navigate(['/reader', params?.versionKey, 'books', params?.bookId, 'chapters']);
        break;
      case 'verses':
        this.router.navigate(['/reader', params?.versionKey, 'books', params?.bookId, 'chapters', params?.chapterId, 'verses'], { fragment: params?.hash });
        break;
      case 'search':
        this.router.navigate(['/search'], { replaceUrl: params?.replaceUrl });
        break;
      case 'favourites':
        this.router.navigate(['/reader', params?.versionKey, 'favourites' ]);
        break;
      case 'settings':
        break;
      default: 
        if (params?.url) this.router.navigateByUrl(params.url);
    }
  }

  setCurrentView(view: AppView) {
    const prev = this.viewTrack$.value.current;
    const prevUrl = this.viewTrack$.value.currentUrl;
    this.viewTrack$.next({ previous: prev, previousUrl: prevUrl, current: view, currentUrl: this.router.url });
  }

  setBooksScroll(scrolled: number) {
    this.booksScroll$.next(scrolled);
  }
}
