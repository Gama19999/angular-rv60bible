import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

import { BibleService } from '../../shared/services/bible.service';
import { ReaderService } from '../../shared/services/reader.service';
import { SinglePage } from '../../shared/components/single-page/single-page';
import { BookInfo } from '../../shared/util/app.interfaces';

@Component({
  selector: 'app-chapter-chooser',
  imports: [SinglePage],
  templateUrl: './chapter-chooser.html',
  styleUrl: './chapter-chooser.css',
})
export class ChapterChooser implements OnInit, OnDestroy {
  private subs: Subscription[] = [];
  private bibleId!: string;
  private bookId!: number;
  book$!: Promise<BookInfo>;
  chapters!: number[];

  constructor(private bibleSrv: BibleService, private readerSrv: ReaderService, private route: ActivatedRoute, private titleSrv: Title, private router: Router) { }

  ngOnInit(): void {
    this.subs.push(this.route.parent!.params.subscribe(params => {
      this.bibleId = params['bibleId'].toUpperCase();
      this.handleReload(this.route.snapshot.params);
    }));
    this.subs.push(this.route.params.subscribe(params => this.handleReload(params)));
  }

  private handleReload(params: Params) {
    this.bookId = +params['bookId'];
    this.book$ = this.bibleSrv.getBook(this.bookId).then(bookInfo => {
      this.titleSrv.setTitle(`${this.bibleId} | ${bookInfo.abr}.`);
      this.readerSrv.bibleQuote$.next(bookInfo.name);
      this.chapters = Array.from({ length: bookInfo.chapterCount }).map((_, idx) => idx + 1);
      return bookInfo;
    });
  }

  openVerses(chapterNum: number) {
    this.router.navigate([chapterNum, 'verses'], { relativeTo: this.route });
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
    this.readerSrv.bibleQuote$.next('');
  }
}
