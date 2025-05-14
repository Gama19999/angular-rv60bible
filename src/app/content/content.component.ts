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
import { ChapterListComponent } from './chapter-list/chapter-list.component';
import { firstOfCh } from '../models/verse-request.template';

@Component({
  selector: 'app-content',
  standalone: false,
  templateUrl: './content.component.html',
  styleUrl: './content.component.css'
})
export class ContentComponent implements OnInit, OnDestroy {
  private chListSubs: Subscription | undefined;
  protected readonly s = strings_es;
  iasd_logo: string = environment.icons + 'iasd_black.webp';
  isMobile: boolean = environment.platform === 'mobile';
  bookInfo!: BookData;
  currentCh: string = '1';
  chListComp: any;
  chListOpen: boolean = false;

  constructor(private route: ActivatedRoute, private titleSrv: Title, private router: Router,
              private bookSrv: BookService, private popupSrv: PopupService, private verseSrv: VerseService) {
    this.route.url.subscribe(url => {
      this.bookInfo = {bookId: url[1].path, bookName: '', bookShort: url[2].path, bookTestament: '', bookChCount: ''};
      this.titleSrv.setTitle('RV60 | ' + url[2].path);
    });
  }

  ngOnInit() {
    if (!this.bookSrv.booksPromise) this.router.navigate(['/'], {replaceUrl: true});
    this.completeBookData();
    this.verseSrv.loadVersesOn(firstOfCh(this.bookInfo.bookId, this.currentCh));
    this.chListSubs = this.popupSrv.chListClosed.subscribe(cc => this.handleChListChange(cc));
  }

  private completeBookData() {
    this.bookSrv.booksPromise?.then(data => {
      const idx = +this.bookInfo.bookId - 1;
      this.bookInfo.bookName = data[idx].bookName;
      this.bookInfo.bookTestament = data[idx].bookTestament;
      this.bookInfo.bookChCount = data[idx].bookChCount;
    });
  }

  private handleChListChange(cc: ChapterChange) {
    this.currentCh = cc.chapterNum;
    this.toggleChapterList();
  }

  toBooks() {
    this.router.navigate(['/', 'start']);
  }

  toggleChapterList() {
    this.chListOpen = !this.chListOpen;
    this.chListComp = this.chListOpen ? ChapterListComponent : undefined;
  }

  ngOnDestroy() {
    this.chListSubs?.unsubscribe();
  }
}
