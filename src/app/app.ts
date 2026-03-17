import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Meta } from '@angular/platform-browser';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';

import { environment } from '../environments/environment';
import { BackendService } from './shared/services/backend.service';
import { ConfigService } from './shared/services/config.service';
import { StateService } from './shared/services/state.service';
import { BtnBooks } from './shared/svg/btn-books';
import { BtnChapters } from './shared/svg/btn-chapters';
import { BtnVerses } from './shared/svg/btn-verses';
import { BtnConfig } from './shared/svg/btn-config';
import { BtnFavourites } from './shared/svg/btn-favourites';
import { BtnSearch } from './shared/svg/btn-search';
import { Settings } from './settings/settings';
import { AppView, Theme } from './shared/util/app.types';
import { Language, NavigationData, ViewTrack } from './shared/util/app.interfaces';

@Component({
  selector: 'app-root',
  imports: [BtnBooks, BtnChapters, BtnVerses, BtnConfig, BtnFavourites, BtnSearch, Settings, RouterOutlet, AsyncPipe],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, OnDestroy {
  private readonly metaSrv = inject(Meta);
  private readonly route = inject(ActivatedRoute);
  private readonly backendSrv = inject(BackendService);
  private readonly configSrv = inject(ConfigService);
  private readonly stateSrv = inject(StateService);
  private subs: Subscription[] = [];
  lang!: Language;
  theme$!: BehaviorSubject<Theme>;
  viewTrack$!: BehaviorSubject<ViewTrack>;
  settingsOn$!: BehaviorSubject<boolean>;

  constructor() { }

  ngOnInit(): void {
    switch (environment.appInfo.platform) {
      case 'dev': break;
      case 'electron': this.setupElectron(); break;
      case 'cordova': this.setupCordova(); break;
    }
    this.subs.push(this.configSrv.language$.subscribe(lang => this.lang = lang));
    this.theme$ = this.configSrv.theme$;
    this.viewTrack$ = this.stateSrv.viewTrack$;
    this.settingsOn$ = this.stateSrv.settingsOn$;
  }

  private setupElectron() {
    this.metaSrv.addTag({
      httpEquiv: 'Content-Security-Policy',
      content: "default-src 'self'; connect-src 'self' http://127.0.0.1:*; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; media-src *; img-src 'self';"
    });
    window.electronAPI.getServerAddress().then(address => environment.api.root = address);
  }

  private setupCordova() {
    this.metaSrv.addTag({
      httpEquiv: 'Content-Security-Policy',
      content: "default-src 'self' https://ssl.gstatic.com; connect-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; media-src *; img-src 'self';"
    });
    this.metaSrv.updateTag({
      name: 'viewport',
      content: 'user-scalable=yes, initial-scale=1, maximum-scale=3, minimum-scale=1, width=device-width, height=device-height'
    });
  }

  goto(view: AppView) {
    this.stateSrv.closeVerseMenu$.next();
    const versionKey = this.backendSrv.versionKey$.value;
    const bookId = this.route.firstChild?.firstChild?.snapshot.params['bookId'];
    const navData: NavigationData = { versionKey: versionKey, bookId: bookId };
    switch (view) {
      case 'books':
      case 'search':
      case 'favourites':
        this.stateSrv.navigate(view, navData);
        break;
      case 'settings':
        this.stateSrv.settingsOn$.next(!this.stateSrv.settingsOn$.value);
        break;
      case 'chapters':
        if (navData.bookId) this.stateSrv.navigate(view, navData);
        else console.warn(`Cannot navigate to: ${view}`); // forgotten IDs required
        break;
      case 'verses':
        if (view === this.viewTrack$.value.previous) {
          navData.url = this.viewTrack$.value.previousUrl;
          this.stateSrv.navigate('', navData);
        } else console.warn(`Cannot navigate to: ${view}`); // forgotten IDs required
    }
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }
}
