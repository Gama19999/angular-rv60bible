import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { ChapterChange } from '../models/chapter-change.interface';

@Injectable({ providedIn: 'root' })
export class PopupService {
  private _isFullScreen: boolean = false;
  infoClosed: Subject<void> = new Subject();
  chListClosed: Subject<ChapterChange> = new Subject();
  settingsClosed: Subject<void> = new Subject();

  get isFullScreen(): boolean { return this._isFullScreen; }

  constructor() {}

  toggleScreenMode(): boolean {
    this._isFullScreen = !this._isFullScreen;
    // @ts-ignore
    window.electronAPI.setScreenMode(this._isFullScreen);
    return this._isFullScreen;
  }

  // @ts-ignore
  exitApp = () => window.electronAPI.goodBye();
}
