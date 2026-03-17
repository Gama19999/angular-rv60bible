import { Injectable } from '@angular/core';

import { LookupMode, Theme } from '../util/app.types';

@Injectable({ providedIn: 'root' })
export class CacheService {
  private readonly FADE = 'FADE';
  private readonly THEME = 'THEME';
  private readonly LANG = 'LANG';
  private readonly VERSION_KEY = 'VERSION_KEY';
  private readonly LOOKUP_MODE = 'LOOKUP_MODE';
  private readonly VERSE_FONT_SIZE = 'VERSE_FS';
  private readonly TAGS = 'TAGS';
  private readonly SMOOTH = 'SMOOTH';
  
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

  setLang(lang: string) {
    localStorage.setItem(this.LANG, lang);
  }

  getLang(): string {
    return localStorage.getItem(this.LANG) ?? 'es';
  }

  setVersionKey(versionKey: string) {
    localStorage.setItem(this.VERSION_KEY, versionKey);
  }

  getVersionKey(): string {
    return localStorage.getItem(this.VERSION_KEY) ?? 'init';
  }

  setLookupMode(mode: LookupMode) {
    localStorage.setItem(this.LOOKUP_MODE, mode);
  }

  getLookupMode(): LookupMode {
    return (localStorage.getItem(this.LOOKUP_MODE) ?? 'byQuote') as LookupMode;
  }

  setVerseFontSize(size: number) {
    localStorage.setItem(this.VERSE_FONT_SIZE, size.toString());
  }

  getVerseFontSize(): number {
    return +(localStorage.getItem(this.VERSE_FONT_SIZE) ?? 2);
  }

  setTags(flag: boolean) {
    localStorage.setItem(this.TAGS, flag ? '1' : '0');
  }

  getTags(): boolean {
    return !!+(localStorage.getItem(this.TAGS) ?? '1');
  }

  setSmoothScroll(flag: boolean) {
    localStorage.setItem(this.SMOOTH, flag ? '1' : '0');
  }

  getSmoothScroll(): boolean {
    return !!+(localStorage.getItem(this.SMOOTH) ?? '1');
  }
}
