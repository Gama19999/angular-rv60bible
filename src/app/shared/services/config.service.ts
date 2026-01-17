import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { CacheService } from './cache.service';
import { Theme } from '../util/app.types';

@Injectable({ providedIn: 'root' })
export class ConfigService {
  private _theme: Theme;
  private _verseFontSize: number;
  theme$: BehaviorSubject<Theme>;
  verseFontSize$: BehaviorSubject<number>;

  constructor(private cacheSrv: CacheService) {
    this._theme = cacheSrv.getTheme();
    this._verseFontSize = cacheSrv.getVerseFontSize();
    cacheSrv.setTheme(this._theme);
    cacheSrv.setVerseFontSize(this._verseFontSize);
    this.theme$ = new BehaviorSubject(this._theme);
    this.verseFontSize$ = new BehaviorSubject(this._verseFontSize);
  }

  toggleTheme() {
    this._theme = this._theme === 'light' ? 'dark' : 'light';
    this.cacheSrv.setTheme(this._theme);
    this.theme$.next(this._theme);
  }

  setVerseFontSize(size: number) {
    this._verseFontSize = size;
    this.cacheSrv.setVerseFontSize(size);
    this.verseFontSize$.next(this._verseFontSize);
  }
}
