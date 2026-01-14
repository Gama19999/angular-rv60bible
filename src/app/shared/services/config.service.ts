import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { CacheService } from './cache.service';
import { Theme } from '../util/app.types';

@Injectable({ providedIn: 'root' })
export class ConfigService {
  private _theme: Theme;
  theme$: BehaviorSubject<Theme>;

  constructor(private cacheSrv: CacheService) {
    this._theme = cacheSrv.getTheme();
    cacheSrv.setTheme(this._theme);
    this.theme$ = new BehaviorSubject(this._theme);
  }

  toggleTheme() {
    this._theme = this._theme === 'light' ? 'dark' : 'light';
    this.cacheSrv.setTheme(this._theme);
    this.theme$.next(this._theme);
  }
}
