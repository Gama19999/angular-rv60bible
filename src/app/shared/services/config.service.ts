import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { es } from '../../../assets/languages/es.strings';
import { en } from '../../../assets/languages/en.strings';
import { environment } from '../../../environments/environment';
import { CacheService } from './cache.service';
import { Language } from '../util/app.interfaces';
import { LookupMode, Theme } from '../util/app.types';

@Injectable({ providedIn: 'root' })
export class ConfigService {
  private readonly cacheSrv = inject(CacheService);
  private theme: Theme;
  theme$: BehaviorSubject<Theme>;
  language$: BehaviorSubject<Language>;
  lookupMode$: BehaviorSubject<LookupMode>;
  verseFontSize$: BehaviorSubject<number>;
  tagsOn$: BehaviorSubject<boolean>;
  smoothScroll$: BehaviorSubject<boolean>;
  displayCanSleep$: BehaviorSubject<boolean> | undefined;

  constructor() {
    this.theme = this.cacheSrv.getTheme();
    const lang = this.cacheSrv.getLang();
    const lookupMode = this.cacheSrv.getLookupMode();
    const verseFontSize = this.cacheSrv.getVerseFontSize();
    const tagsOn = this.cacheSrv.getTags();
    const smoothScroll = this.cacheSrv.getSmoothScroll();
    this.cacheSrv.setTheme(this.theme);
    this.cacheSrv.setLang(lang);
    this.cacheSrv.setLookupMode(lookupMode);
    this.cacheSrv.setVerseFontSize(verseFontSize);
    this.cacheSrv.setTags(tagsOn);
    this.cacheSrv.setSmoothScroll(smoothScroll);
    this.theme$ = new BehaviorSubject(this.theme);
    this.language$ = new BehaviorSubject(({ language: lang, str: lang === 'es' ? es : en }) as Language);
    this.lookupMode$ = new BehaviorSubject(lookupMode);
    this.verseFontSize$ = new BehaviorSubject(verseFontSize);
    this.tagsOn$ = new BehaviorSubject(tagsOn);
    this.smoothScroll$ = new BehaviorSubject(smoothScroll);
    this.setupElectron();
  }

  private setupElectron() {
    if (environment.appInfo.platform === 'electron')
      window.electronAPI.requestDisplaySleep().then(like => this.displayCanSleep$ = new BehaviorSubject(like === 'asleep'));
  }

  toggleTheme() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    this.cacheSrv.setTheme(this.theme);
    this.theme$.next(this.theme);
  }

  setLang(lang: string) {
    this.cacheSrv.setLang(lang);
    this.language$.next({ language: lang, str: lang === 'es' ? es : en });
  }

  setLookupMode(mode: LookupMode) {
    this.cacheSrv.setLookupMode(mode);
    this.lookupMode$.next(mode);
  }

  setVerseFontSize(size: number) {
    this.cacheSrv.setVerseFontSize(size);
    this.verseFontSize$.next(size);
  }

  toggleTags() {
    this.cacheSrv.setTags(!this.tagsOn$.value);
    this.tagsOn$.next(!this.tagsOn$.value);
  }

  toggleSmoothScroll() {
    this.cacheSrv.setSmoothScroll(!this.smoothScroll$.value);
    this.smoothScroll$.next(!this.smoothScroll$.value);
  }

  toggleDisplaySleep() {
    if (environment.appInfo.platform === 'electron') {
      const like = this.displayCanSleep$?.value ? 'awake' : 'asleep';
      window.electronAPI.requestDisplaySleep(like).then(like => this.displayCanSleep$?.next(like === 'asleep'));
    }
  }
}
