import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';

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
  hiddenBibles = true;
  
  constructor() { }

  ngOnInit(): void {
    this.subs.push(this.route.params.subscribe(params => {
      this.versionKey = params['versionKey'];
      this.backendSrv.setVersionKey(this.versionKey);
      this.version$ = this.backendSrv.getVersion();
    }));
    this.subs.push(this.configSrv.language$.subscribe(lang => this.lang = lang));
    this.subs.push(this.stateSrv.viewTrack$.subscribe(vt => { this.viewTrack = vt; this.cd.detectChanges(); }));
    this.bibleQuote$ = this.stateSrv.bibleQuote$;
    this.bibles$ = this.backendSrv.versions();
  }

  gotoSearch() { this.stateSrv.navigate('search'); }

  toggleBibleList() {
    this.hiddenBibles = !this.hiddenBibles;
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

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }
}
