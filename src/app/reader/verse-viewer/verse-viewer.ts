import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { AsyncPipe, NgClass, NgStyle } from '@angular/common';
import { ActivatedRoute, Params } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

import { BibleService } from '../../shared/services/bible.service';
import { ConfigService } from '../../shared/services/config.service';
import { ReaderService } from '../../shared/services/reader.service';
import { ContextMenu } from '../../shared/components/context-menu/context-menu';
import { SinglePage } from '../../shared/components/single-page/single-page';
import { BookInfo, VerseInfo } from '../../shared/util/app.interfaces';
import { getVerseHashtag } from '../../shared/util/app.util';

@Component({
  selector: 'app-verse-viewer',
  imports: [ContextMenu, SinglePage, AsyncPipe, NgClass, NgStyle],
  templateUrl: './verse-viewer.html',
  styleUrl: './verse-viewer.css',
})
export class VerseViewer implements OnInit, AfterViewInit, OnDestroy {
  private subs: Subscription[] = [];
  private bibleId!: string;
  private bookId!: number;
  private chapterId!: number;
  protected getVerseHashtag = getVerseHashtag;
  bookData!: BookInfo;
  verseArray$!: Promise<VerseInfo[]>;
  verseFontSize!: number;
  menuHidden: boolean = true;
  menuData: any;
  menuX: number = 0;
  menuY: number = 0;

  constructor(private bibleSrv: BibleService, private readerSrv: ReaderService, private configSrv: ConfigService, private route: ActivatedRoute, private titleSrv: Title) { }

  ngOnInit(): void {
    this.subs.push(this.route.parent!.params.subscribe(params => {
      this.bibleId = params['bibleId'].toUpperCase();
      this.handleReload(this.route.snapshot.params);
    }));
    this.subs.push(this.route.params.subscribe(params => this.handleReload(params)));
    this.subs.push(this.readerSrv.reloadVerses$.subscribe(hashtag => {
      this.verseArray$ = this.bibleSrv.getVerses(this.bookId, this.chapterId);
      this.handleInitScroll(this.route.snapshot.fragment ?? hashtag);
    }));
    this.subs.push(this.configSrv.verseFontSize$.subscribe(val => this.verseFontSize = val));
  }

  private handleReload(params: Params) {
    this.bookId = +params['bookId'];
    this.chapterId = +params['chapterId'];
    this.bibleSrv.getBook(this.bookId).then(bookInfo => {
      this.titleSrv.setTitle(`${this.bibleId.split('-')[1]} | ${bookInfo.abr}. ${this.chapterId}`);
      this.readerSrv.bibleQuote$.next(`${bookInfo.name} ${this.chapterId}`);
      this.bookData = bookInfo;
      this.verseArray$ = this.bibleSrv.getVerses(this.bookId, this.chapterId);
    });
    this.readerSrv.inVerseViewer$.next({ hideNavigation: false, bookId: this.bookId, chapterId: this.chapterId });
    this.handleInitScroll(this.route.snapshot.fragment ?? '');
  }

  ngAfterViewInit(): void {
    this.subs.push(this.route.fragment.subscribe(fragment => this.handleInitScroll(fragment ?? '')));
  }

  private handleInitScroll(hashtag: string) {
    setTimeout(() => {
      document.getElementById(hashtag)?.scrollIntoView({ behavior: 'smooth' });
    }, 500);
  }

  openMenu(evt: PointerEvent, verse: VerseInfo) {
    evt.preventDefault();
    console.log(evt);
    const posY = (window.innerHeight - 235) > evt.pageY ? evt.pageY : window.innerHeight - 235;
    this.menuX = evt.pageX;
    this.menuY = posY;
    this.menuData = verse;
    this.menuHidden = false;
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
    this.readerSrv.inVerseViewer$.next({ hideNavigation: true, bookId: 0, chapterId: 0 });
  }
}
