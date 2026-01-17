import { Injectable } from '@angular/core';

import { BibleId, Theme } from '../util/app.types';

@Injectable({ providedIn: 'root' })
export class CacheService {
  private readonly FADE = 'FADE';
  private readonly THEME = 'THEME';
  private readonly BIBLE_ID = 'BIBLE_ID';
  private readonly VERSE_FONT_SIZE = 'VERSE_FS';
  
  constructor() {}

  setFadeDone() {
    sessionStorage.setItem(this.FADE, 'done');
  }

  isFadeDone(): boolean {
    return !!sessionStorage.getItem(this.FADE);
  }

  setTheme(theme: Theme) {
    localStorage.setItem(this.THEME, theme);
  }

  getTheme(): Theme {
    return (localStorage.getItem(this.THEME) ?? 'light') as Theme;
  }

  setBibleId(bibleId: BibleId) {
    localStorage.setItem(this.BIBLE_ID, bibleId);
  }

  getBibleId(): BibleId {
    return (localStorage.getItem(this.BIBLE_ID) ?? 'init') as BibleId;
  }

  setVerseFontSize(size: number) {
    localStorage.setItem(this.VERSE_FONT_SIZE, size.toString());
  }

  getVerseFontSize(): number {
    return +(localStorage.getItem(this.VERSE_FONT_SIZE) ?? 2);
  }
}
