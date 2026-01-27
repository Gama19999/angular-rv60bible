import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { AsyncPipe, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';

import { environment } from '../../environments/environment';
import { BibleService } from '../shared/services/bible.service';
import { ReaderService } from '../shared/services/reader.service';
import { BtnConfig } from '../shared/svg/btn-config';
import { Logo } from '../shared/svg/logo';
import { Modal } from '../shared/components/modal/modal';
import { BibleInfo, BookInfo } from '../shared/util/app.interfaces';
import { BibleId } from '../shared/util/app.types';

@Component({
  selector: 'app-reader',
  imports: [BtnConfig, Logo, Modal, RouterOutlet, AsyncPipe, NgClass, FormsModule],
  templateUrl: './reader.html',
  styleUrl: './reader.css',
})
export class Reader implements OnInit, OnDestroy {
  private subs: Subscription[] = [];
  bibleInfo$!: Promise<BibleInfo>;
  bibleQuote$!: Subject<string>;
  isCordova = environment.appInfo.platform === 'cordova';
  navHidden: boolean = this.isCordova;
  bibleId!: BibleId;
  bibles$!: Promise<BibleInfo[]>;
  bookChapterHidden: boolean = true;
  bookId: any;
  prevBook$!: Promise<BookInfo>;
  nextBook$!: Promise<BookInfo>;
  chapterNum: any;
  chapterLimit: any;
  configHidden: boolean = true;

  constructor(private bibleSrv: BibleService, private readerSrv: ReaderService, private router: Router, private route: ActivatedRoute, private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.subs.push(this.route.params.subscribe(params => {
      this.bibleId = params['bibleId'] as BibleId;
      this.bibleSrv.setBibleId(this.bibleId);
      this.bibleInfo$ = this.bibleSrv.getBibleInfo();
    }));
    this.subs.push(this.readerSrv.inVerseViewer$.subscribe(val => {
      this.bookChapterHidden = val.hideNavigation;
      if (!this.bookChapterHidden) {
        this.bookId = val.bookId;
        this.prevBook$ = this.bibleSrv.getBooks().then(arr => arr.find(b => b.bookId === this.bookId - 1)!);
        this.nextBook$ = this.bibleSrv.getBooks().then(arr => arr.find(b => b.bookId === this.bookId + 1)!);
        this.chapterNum = val.chapterId;
        this.bibleSrv.getBook(this.bookId).then(bookData => this.chapterLimit = bookData.chapterCount);
      }
      this.cd.detectChanges();
    }));
    this.bibles$ = this.bibleSrv.getBibles();
    this.bibleQuote$ = this.readerSrv.bibleQuote$;
  }

  gotoLobby() {
    this.router.navigate(['/', 'lobby']);
  }

  setBibleVersion() {
    const currentUrl = this.router.url;
    const prevBibleId = this.bibleSrv.bibleId$.value;
    this.bibleSrv.setBibleId(this.bibleId);
    this.navHidden = this.isCordova ? true : this.navHidden;
    this.router.navigateByUrl(currentUrl.replace(prevBibleId, this.bibleId));
  }

  gotoFavourites() {
    this.navHidden = this.isCordova ? true : this.navHidden;
    this.router.navigate(['/', 'reader', this.bibleId, 'favourites']);
  }

  changeBookTo(evt: Event) {
    const gotoBookId = (evt.target as HTMLInputElement).dataset['bookId']!;
    const currentUrl = this.router.url;
    const replaceIdx = currentUrl.indexOf(this.bookId, currentUrl.indexOf('books'));
    const prefix = currentUrl.slice(0, replaceIdx);
    this.navHidden = this.isCordova ? true : this.navHidden;
    this.router.navigateByUrl(prefix + gotoBookId + '/chapters/1/verses');
  }

  gotoBooks() {
    this.navHidden = this.isCordova ? true : this.navHidden;
    this.router.navigate(['/', 'reader', this.bibleId, 'books']);
  }

  changeChapterTo(evt: Event) {
    const gotoChapterId = (evt.target as HTMLInputElement).dataset['chapterId']!;
    const currentUrl = this.router.url;
    const replaceIdx = currentUrl.indexOf(this.chapterNum, currentUrl.indexOf('chapters'));
    const prefix = currentUrl.slice(0, replaceIdx);
    this.navHidden = this.isCordova ? true : this.navHidden;
    this.router.navigateByUrl(prefix + gotoChapterId + '/verses');
  }

  async gotoChapters() {
    const bookName = (await this.bibleSrv.getBook(this.bookId)).name;
    this.readerSrv.bibleQuote$.next(bookName);
    this.navHidden = this.isCordova ? true : this.navHidden;
    this.router.navigate(['/', 'reader', this.bibleId, 'books', this.bookId, 'chapters']);
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }
}
