import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Title } from '@angular/platform-browser';

import { strings_es } from '../../assets/strings/strings-es';
import { environment } from '../../environments/environment';
import { BookService } from '../services/book.service';
import { PopupService } from '../services/popup.service';
import { VerseService } from '../services/verse.service';
import { BookData } from '../models/book-data.interface';
import { ChapterChange } from '../models/chapter-change.interface';
import { BookListComponent } from './book-list/book-list.component';
import { ChapterListComponent } from './chapter-list/chapter-list.component';
import { SettingsComponent } from '../shared/settings/settings.component';
import { firstOfCh } from '../models/verse-request.template';

@Component({
  selector: 'app-content',
  standalone: false,
  templateUrl: './content.component.html',
  styleUrl: './content.component.css'
})
export class ContentComponent implements OnInit, OnDestroy {
  private chListSubs: Subscription | undefined;
  private bkListSubs: Subscription | undefined;
  private settOpenSubs: Subscription | undefined;
  protected readonly s = strings_es;
  iasd_logo: string = environment.icons + 'iasd_black.webp';
  bookInfo!: BookData;
  currentCh: string = '1';
  chListComp: any;
  chListOpen: boolean = false;
  bkListComp: any;
  bkListOpen: boolean = false;
  settComp: any;
  settOpen: boolean = false;

  constructor(private route: ActivatedRoute, private titleSrv: Title, private router: Router,
              private bookSrv: BookService, private popupSrv: PopupService, private verseSrv: VerseService) {
    this.route.url.subscribe(url => {
      this.bookInfo = {bookId: url[1].path, bookName: '', bookShort: url[2].path, bookTestament: '', bookChCount: ''};
    });
  }

  ngOnInit() {
    if (!this.bookSrv.booksPromise) this.router.navigate(['/'], {replaceUrl: true});
    this.completeBookData();
    this.verseSrv.loadVersesOn(firstOfCh(this.bookInfo.bookId, this.currentCh, this.verseSrv.fetchLimit));
    this.chListSubs = this.popupSrv.chListClosed.subscribe(cc => this.handleChListChange(cc));
    this.bkListSubs = this.popupSrv.bkListClosed.subscribe(bd => this.handleBkListChange(bd));
    this.settOpenSubs = this.popupSrv.settingsClosed.subscribe(() => this.toggleSettings());
  }

  private completeBookData() {
    this.bookSrv.booksPromise?.then(data => {
      const idx = +this.bookInfo.bookId - 1;
      this.bookInfo.bookName = data[idx].bookName;
      this.bookInfo.bookTestament = data[idx].bookTestament;
      this.bookInfo.bookChCount = data[idx].bookChCount;
      this.updateTitle();
    });
  }

  private updateTitle = () => this.titleSrv.setTitle(`RV60 | ${this.bookInfo.bookName} ${this.currentCh}`);

  private handleChListChange(cc: ChapterChange) {
    this.toggleBookList(true);
    this.currentCh = cc.chapterNum;
    this.updateTitle();
    this.toggleChapterList(cc.component_less);
  }

  private handleBkListChange(bd: BookData) {
    this.toggleChapterList(true);
    this.bookInfo = bd;
    this.currentCh = '1';
    this.completeBookData();
    this.toggleBookList();
  }

  toggleBookList(asClose: boolean = false) {
    this.bkListOpen = asClose ? false : !this.bkListOpen;
    this.bkListComp = this.bkListOpen ? BookListComponent : undefined;
  }

  btnChapterClicked(direction: string) {
    if (direction === 'prev' && +this.currentCh - 1 > 0) {
      this.currentCh = `${+this.currentCh - 1}`;
    } else if (direction === 'next' && +this.currentCh + 1 <= +this.bookInfo.bookChCount) {
      this.currentCh = `${+this.currentCh + 1}`;
    } else return;
    this.popupSrv.chListClosed.next({bookId: this.bookInfo.bookId, chapterNum: this.currentCh, component_less: true});
  }

  toBooks = () => this.router.navigate(['/', 'start']);

  toggleChapterList(asClose: boolean = false) {
    this.chListOpen = asClose ? false : !this.chListOpen;
    this.chListComp = this.chListOpen ? ChapterListComponent : undefined;
  }

  toggleSettings() {
    this.settOpen = !this.settOpen;
    this.settComp = this.settOpen ? SettingsComponent : undefined;
  }

  ngOnDestroy() {
    this.chListSubs?.unsubscribe();
    this.bkListSubs?.unsubscribe();
    this.settOpenSubs?.unsubscribe();
  }
}
