import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

import { environment } from '../../../environments/environment';
import { BackendService } from '../../shared/services/backend.service';
import { ConfigService } from '../../shared/services/config.service';
import { StateService } from '../../shared/services/state.service';
import { SinglePage } from '../../shared/components/single-page/single-page';
import { BookData, Language, NavigationData } from '../../shared/util/app.interfaces';
import { replace } from '../../shared/util/app.util';

@Component({
  selector: 'app-chapter-chooser',
  imports: [SinglePage],
  templateUrl: './chapter-chooser.html',
  styleUrl: './chapter-chooser.css',
})
export class ChapterChooser implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly titleSrv = inject(Title);
  private readonly backendSrv = inject(BackendService);
  private readonly configSrv = inject(ConfigService);
  private readonly stateSrv = inject(StateService);
  private subs: Subscription[] = [];
  private versionKey!: string;
  private bookId!: number;
  lang!: Language;
  chapters!: number[];
  isAndroid = environment.appInfo.platform === 'android';

  constructor() { }

  ngOnInit(): void {
    this.subs.push(this.route.parent!.params.subscribe(params => {
      this.versionKey = params['versionKey'];
      this.handleReload(this.route.snapshot.params, this.lang);
    }));
    this.subs.push(this.route.params.subscribe(params => this.handleReload(params, this.lang)));
    this.subs.push(this.configSrv.language$.subscribe(lang => this.handleReload(this.route.snapshot.params, lang)));
    this.stateSrv.setCurrentView('chapters');
  }

  private handleReload(params: Params, lang: Language) {
    this.bookId = params['bookId'];
    this.lang = lang;
    this.backendSrv.getBook(this.bookId).then(book => {
      this.setTitle(book);
      this.chapters = Array.from({ length: book.chapterCount }).map((_, idx) => idx + 1);
    });
  }

  private setTitle(book: BookData) {
    const titleStr = this.lang.str.chapters.title;
    const title = replace(titleStr, this.versionKey.toUpperCase(), book.name);
    this.titleSrv.setTitle(title);
    this.stateSrv.bibleQuote$.next(book.name);
  }

  openVerses(chapterId: number) {
    const navData: NavigationData = { versionKey: this.versionKey, bookId: this.bookId, chapterId: chapterId };
    this.stateSrv.navigate('verses', navData);
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }
}
