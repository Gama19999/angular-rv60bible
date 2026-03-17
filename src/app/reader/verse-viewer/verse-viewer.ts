import { AfterViewInit, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ActivatedRoute, Params } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

import { environment } from '../../../environments/environment';
import { BackendService } from '../../shared/services/backend.service';
import { ConfigService } from '../../shared/services/config.service';
import { StateService } from '../../shared/services/state.service';
import { BtnChangeBook } from '../../shared/svg/btn-change-book';
import { BtnChangeChapter } from '../../shared/svg/btn-change-chapter';
import { ContextMenu } from '../../shared/components/context-menu/context-menu';
import { SinglePage } from '../../shared/components/single-page/single-page';
import { BookData, Language, MenuData, VerseData, VerseViewerChange } from '../../shared/util/app.interfaces';
import { getMenuData, getTargetHashtag, replace } from '../../shared/util/app.util';

@Component({
  selector: 'app-verse-viewer',
  imports: [BtnChangeBook, BtnChangeChapter, ContextMenu, SinglePage, AsyncPipe],
  templateUrl: './verse-viewer.html',
  styleUrl: './verse-viewer.css',
})
export class VerseViewer implements OnInit, AfterViewInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly titleSrv = inject(Title);
  private readonly backendSrv = inject(BackendService);
  private readonly configSrv = inject(ConfigService);
  private readonly stateSrv = inject(StateService);
  private subs: Subscription[] = [];
  private versionKey!: string;
  private bookId!: number;
  private chapterId!: number;
  private bookName!: string;
  verses$!: Promise<VerseData[]>;
  lang!: Language;
  verseFontSize!: number;
  verseViewerChange: VerseViewerChange = {};
  menuOpen: boolean = false;
  menuData!: MenuData;

  constructor() { }

  ngOnInit(): void {
    this.subs.push(this.route.parent!.params.subscribe(params => {
      this.versionKey = params['versionKey'];
      this.handleReload(this.route.snapshot.params, this.lang);
    }));
    this.subs.push(this.route.params.subscribe(params => this.handleReload(params, this.lang)));
    this.subs.push(this.stateSrv.reloadVerses$.subscribe(hashtag => {
      this.verses$ = this.backendSrv.getVerses(this.bookId, this.chapterId);
      this.handleInitScroll(hashtag);
    }));
    this.subs.push(this.configSrv.language$.subscribe(lang => this.handleReload(this.route.snapshot.params, lang)));
    this.subs.push(this.configSrv.verseFontSize$.subscribe(vfs => this.verseFontSize = vfs));
    this.subs.push(this.stateSrv.closeVerseMenu$.subscribe(_ => this.menuOpen = false));
    this.stateSrv.setCurrentView('verses');
  }

  private handleReload(params: Params, lang: Language) {
    this.bookId = params['bookId'];
    this.chapterId = params['chapterId'];
    this.lang = lang;
    this.backendSrv.getBook(this.bookId).then(book => {
      this.bookName = book.name;
      this.getChangeBook('prev').then(pb => { this.verseViewerChange.prevBook = { bookId: pb?.bookId, bookName: pb?.name }});
      this.getChangeBook('next').then(nb => { this.verseViewerChange.nextBook = { bookId: nb?.bookId, bookName: nb?.name }});
      this.verseViewerChange.prevChapterId = this.getChangeChapter('prev', book);
      this.verseViewerChange.nextChapterId = this.getChangeChapter('next', book);
      this.setTitle(book);
      this.verses$ = this.backendSrv.getVerses(this.bookId, this.chapterId);
      this.stateSrv.setCurrentView('verses');
    });
    this.handleInitScroll(this.route.snapshot.fragment ?? '');
  }

  private setTitle(book: BookData) {
    const titleStr = this.lang.str.verses.title;
    const title = replace(titleStr, this.versionKey.toUpperCase(), `${book.abr}.`, this.chapterId);
    this.titleSrv.setTitle(title);
    this.stateSrv.bibleQuote$.next(`${book.name} ${this.chapterId}`);
  }

  private handleInitScroll(hashtag: string) {
    setTimeout(() => {
      const target = document.getElementById(hashtag);
      target?.scrollIntoView();
      target?.focus();
      if (environment.appInfo.platform !== 'cordova') setTimeout(() => target?.blur(), 5000);
    }, 500);
  }

  private getChangeBook(direction: 'prev' | 'next'): Promise<BookData | undefined> {
    if (direction === 'prev' && +this.bookId > 1)
      return this.backendSrv.getBook(+this.bookId - 1);
    else if (direction === 'next' && +this.bookId < 66)
      return this.backendSrv.getBook(+this.bookId + 1);
    else return Promise.resolve(undefined);
  }

  private getChangeChapter(direction: 'prev' | 'next', book: BookData): number | undefined {
    if (direction === 'prev' && +this.chapterId - 1 > 0)
      return +this.chapterId - 1;
    else if (direction === 'next' && +this.chapterId + 1 <= book.chapterCount)
      return +this.chapterId + 1
    else return undefined;
  }

  ngAfterViewInit(): void {
    this.subs.push(this.route.fragment.subscribe(fragment => this.handleInitScroll(fragment ?? '')));
  }

  getHashtag = (verse: VerseData) => getTargetHashtag(this.bookName, verse.verseId);

  openMenu(evt: PointerEvent, verse: VerseData) {
    if (this.stateSrv.settingsOn$.value) return;
    this.menuData = getMenuData(evt, verse);
    this.menuOpen = true;
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }
}
