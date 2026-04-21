import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';

import { environment } from '../../environments/environment';
import { BackendService } from '../shared/services/backend.service';
import { ConfigService } from '../shared/services/config.service';
import { StateService } from '../shared/services/state.service';
import { Logo } from '../shared/svg/logo';
import { BibleData, Language, NavigationData, ViewTrack } from '../shared/util/app.interfaces';

@Component({
  selector: 'app-reader',
  imports: [Logo, RouterOutlet, AsyncPipe, FormsModule],
  templateUrl: './reader.html',
  styleUrl: './reader.css',
})
export class Reader implements OnInit, OnDestroy {
  private readonly cd = inject(ChangeDetectorRef);
  private readonly route = inject(ActivatedRoute);
  private readonly backendSrv = inject(BackendService);
  private readonly configSrv = inject(ConfigService);
  private readonly stateSrv = inject(StateService);
  private subs: Subscription[] = [];
  lang!: Language;
  versionKey!: string;
  version$!: Promise<BibleData>;
  bibles$!: Promise<BibleData[]>;
  bibleQuote$!: Subject<string>;
  viewTrack!: ViewTrack;
  hiddenBibles!: boolean;
  isAndroid = environment.appInfo.platform === 'android';
  
  constructor() { }

  ngOnInit(): void {
    this.subs.push(this.route.params.subscribe(params => {
      this.versionKey = params['versionKey'];
      this.backendSrv.setVersionKey(this.versionKey);
      this.version$ = this.backendSrv.getVersion();
    }));
    this.subs.push(this.configSrv.language$.subscribe(lang => this.lang = lang));
    this.subs.push(this.stateSrv.viewTrack$.subscribe(vt => { this.viewTrack = vt; this.cd.detectChanges(); }));
    this.subs.push(this.stateSrv.hiddenBibles$.subscribe(hb => this.hiddenBibles = hb));
    this.bibleQuote$ = this.stateSrv.bibleQuote$;
    this.bibles$ = this.backendSrv.versions();
  }

  toggleBibleList() {
    if (this.stateSrv.settingsOn$.value) return;
    this.hiddenBibles = !this.hiddenBibles;
    this.stateSrv.hiddenVersesNav$?.next(true);
    this.stateSrv.closeVerseMenu$.next();
  }

  setVersionKey(vk: string) {
    this.hiddenBibles = true;
    const bookId = this.route.firstChild?.snapshot.params['bookId'];
    const chapterId = this.route.firstChild?.snapshot.params['chapterId'];
    const hash = this.route.firstChild?.snapshot.fragment;
    const navData: NavigationData = { versionKey: vk, bookId: bookId, chapterId: chapterId, hash: hash ?? undefined };
    this.stateSrv.navigate(this.viewTrack.current, navData);
  }

  toggleVersesNav() {
    if (this.isAndroid && this.viewTrack.current === 'verses' && !this.stateSrv.settingsOn$.value) {
      this.stateSrv.hiddenBibles$.next(true);
      this.stateSrv.closeVerseMenu$.next();
      const state = this.stateSrv.hiddenVersesNav$?.value;
      this.stateSrv.hiddenVersesNav$?.next(!state);
    }
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }
}
