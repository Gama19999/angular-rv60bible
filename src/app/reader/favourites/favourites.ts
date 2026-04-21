import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AsyncPipe, DatePipe } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { environment } from '../../../environments/environment';
import { BackendService } from '../../shared/services/backend.service';
import { ConfigService } from '../../shared/services/config.service';
import { StateService } from '../../shared/services/state.service';
import { ContextMenu } from '../../shared/components/context-menu/context-menu';
import { SinglePage } from '../../shared/components/single-page/single-page';
import { FavouriteData, Language, MenuData } from '../../shared/util/app.interfaces';
import { getMenuData, openReaderOn, replace } from '../../shared/util/app.util';

@Component({
  selector: 'app-favourites',
  imports: [ContextMenu, SinglePage, AsyncPipe, DatePipe],
  templateUrl: './favourites.html',
  styleUrl: './favourites.css',
})
export class Favourites implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly titleSrv = inject(Title);
  private readonly backendSrv = inject(BackendService);
  private readonly configSrv = inject(ConfigService);
  private readonly stateSrv = inject(StateService);
  private subs: Subscription[] = [];
  private versionKey!: string;
  private emptyFavToastShown = false;
  favourites$!: Promise<FavouriteData[]>;
  lang!: Language;
  verseFontSize!: number;
  menuOpen = false;
  menuData!: MenuData;

  constructor() { }

  ngOnInit(): void {
    this.subs.push(this.route.parent!.params.subscribe(params => {
      this.versionKey = params['versionKey'];
      this.favourites$ = this.backendSrv.favourites();
    }));
    this.subs.push(this.stateSrv.reloadVerses$.subscribe(() => this.favourites$ = this.backendSrv.favourites()));
    this.subs.push(this.configSrv.language$.subscribe(lang => this.setTitle(lang)));
    this.subs.push(this.configSrv.verseFontSize$.subscribe(vfs => this.verseFontSize = vfs));
    this.subs.push(this.stateSrv.closeVerseMenu$.subscribe(_ => this.menuOpen = false));
    this.stateSrv.setCurrentView('favourites');
  }

  private setTitle(lang: Language) {
    this.lang = lang;
    const titleStr = this.lang.str.favourites.title;
    const title = replace(titleStr, this.versionKey.toUpperCase());
    this.titleSrv.setTitle(title);
    if (environment.appInfo.platform === 'android') {
      this.favourites$.then(data => { 
        if (data.length == 0 && !this.emptyFavToastShown) {
          this.emptyFavToastShown = true;
          window.androidAPI.showToast(lang.str.favourites.empty);
        }
      });
    }
    setTimeout(() => this.stateSrv.bibleQuote$.next(this.lang.str.favourites.quote), 100);
  }

  openMenu(evt: PointerEvent, verse: FavouriteData) {
    if (this.stateSrv.settingsOn$.value) return;
    this.stateSrv.hiddenBibles$.next(true);
    this.menuData = getMenuData(evt, verse);
    this.menuOpen = true;
  }

  openVerse(favourite: FavouriteData) {
    openReaderOn(favourite, this.versionKey, this.stateSrv);
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }
}
