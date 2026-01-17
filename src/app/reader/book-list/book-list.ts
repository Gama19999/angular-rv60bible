import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

import { BibleService } from '../../shared/services/bible.service';
import { ReaderService } from '../../shared/services/reader.service';
import { SinglePage } from '../../shared/components/single-page/single-page';
import { BookInfo } from '../../shared/util/app.interfaces';

@Component({
  selector: 'app-book-list',
  imports: [SinglePage, AsyncPipe],
  templateUrl: './book-list.html',
  styleUrl: './book-list.css',
})
export class BookList implements OnInit, AfterViewInit, OnDestroy {
  private subs: Subscription[] = [];
  private bibleId!: string;
  books$!: Promise<BookInfo[]>;

  @ViewChild('bookList') bookList!: ElementRef<HTMLElement>;

  constructor(private bibleSrv: BibleService, private readerSrv: ReaderService, private router: Router, private route: ActivatedRoute, private titleSrv: Title) { }

  ngOnInit(): void {
    this.subs.push(this.route.parent!.params.subscribe(params => {
      this.bibleId = params['bibleId'].toUpperCase();
      this.books$ = this.bibleSrv.getBooks();
      this.titleSrv.setTitle(`${this.bibleId.split('-')[1]} | Libros`);
      setTimeout(() => this.readerSrv.bibleQuote$.next('Libros'), 100);
    }));
  }

  ngAfterViewInit(): void {
    this.subs.push(this.readerSrv.bookListScroll$.subscribe(val => {
      setTimeout(() => this.bookList.nativeElement.scrollLeft = val, 100);
    }));
  }

  focusBookList() {
    this.bookList.nativeElement.focus();
  }

  bookScroll(evt: Event) {
    const scrollLeft = (evt.target as HTMLElement).scrollLeft;
    if (scrollLeft < 100) return;
    this.readerSrv.bookListScroll$.next(scrollLeft);
    this.focusBookList();
  }

  gotoChapters(bookId: number) {
    this.router.navigate([bookId, 'chapters'], { relativeTo: this.route });
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }
}
