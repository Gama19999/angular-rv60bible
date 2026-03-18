import { AfterViewInit, Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

import { environment } from '../../../environments/environment';
import { BackendService } from '../../shared/services/backend.service';
import { ConfigService } from '../../shared/services/config.service';
import { StateService } from '../../shared/services/state.service';
import { SinglePage } from '../../shared/components/single-page/single-page';
import { BookData, Language, NavigationData } from '../../shared/util/app.interfaces';
import { getTargetHashtag, parseCharacterMod, replace } from '../../shared/util/app.util';

@Component({
  selector: 'app-book-list',
  imports: [SinglePage, AsyncPipe],
  templateUrl: './book-list.html',
  styleUrl: './book-list.css',
})
export class BookList implements OnInit, AfterViewInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly titleSrv = inject(Title);
  private readonly backendSrv = inject(BackendService);
  private readonly configSrv = inject(ConfigService);
  private readonly stateSrv = inject(StateService);
  private subs: Subscription[] = [];
  private versionKey!: string;
  books$!: Promise<BookData[]>;
  lang!: Language;
  isCordova = environment.appInfo.platform === 'cordova';

  @ViewChild('bookList') bookList!: ElementRef<HTMLElement>;

  constructor() { }

  ngOnInit(): void {
    this.subs.push(this.route.parent!.params.subscribe(params => {
      this.versionKey = params['versionKey'];
      this.books$ = this.backendSrv.getBooks();
    }));
    this.subs.push(this.configSrv.language$.subscribe(lang => this.setTitle(lang)));
    this.stateSrv.setCurrentView('books');
  }

  private setTitle(lang: Language) {
    this.lang = lang;
    const titleStr = this.lang.str.books.title;
    const title = replace(titleStr, this.versionKey.toUpperCase());
    this.titleSrv.setTitle(title);
    setTimeout(() => this.stateSrv.bibleQuote$.next(this.lang.str.books.quote), 100);
  }

  ngAfterViewInit(): void {
    this.subs.push(this.stateSrv.booksScroll$.subscribe(bs => setTimeout(() => {
      if (this.isCordova) this.bookList.nativeElement.scrollTop = bs;
      else this.bookList.nativeElement.scrollLeft = bs;
    }, 100)));
  }

  onEndScroll(evt: Event) {
    const el = (evt.target as HTMLElement);
    const scrolled = this.isCordova ? el.scrollTop : el.scrollLeft;
    if (scrolled > 100) this.stateSrv.setBooksScroll(scrolled);
  }

  getHashtag = (book: BookData) => getTargetHashtag(book.name, book.bookId);

  gotoChapters(bookId: number) {
    const navData: NavigationData = { versionKey: this.versionKey, bookId: bookId };
    this.stateSrv.navigate('chapters', navData);
  }

  parse = (value: string) => parseCharacterMod(value, this.lang);

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }
}
