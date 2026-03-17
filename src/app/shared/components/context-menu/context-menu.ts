import { Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { BackendService } from '../../services/backend.service';
import { ConfigService } from '../../services/config.service';
import { StateService } from '../../services/state.service';
import { ClientReport, Language, MenuData, VerseData } from '../../util/app.interfaces';
import { getTargetHashtag } from '../../util/app.util';

@Component({
  selector: 'app-context-menu',
  imports: [],
  templateUrl: './context-menu.html',
  styleUrl: './context-menu.css',
})
export class ContextMenu implements OnInit, OnDestroy {
  private readonly backendSrv = inject(BackendService);
  private readonly configSrv = inject(ConfigService);
  private readonly stateSrv = inject(StateService);
  private subs: Subscription[] = [];
  lang!: Language;
  hiddenColors = true;
  @Input('data') data!: MenuData;
  @Output('close') close = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void {
    this.subs.push(this.configSrv.language$.subscribe(lang => this.lang = lang));
  }

  closeMenu() {
    this.hiddenColors = true;
    this.close.emit();
  }

  async copy() {
    if (!this.data.verse) return;
    const bookName = (await this.backendSrv.getBook(this.data.verse.bookId)).name
    const verse = `${this.data.verse.text} ${bookName} ${this.data.verse.chapterId}:${this.data.verse.verseOrdinal} (${this.backendSrv.versionKey$.value.toUpperCase()})`;
    navigator.clipboard.writeText(verse);
    this.closeMenu();
  }

  async toggleFavourite() {
    if (!this.data.verse) return;
    if (this.data.verse.color === 'favourite' || this.data.verse.color === 'normal') {
      const modified = JSON.parse(JSON.stringify(this.data.verse)) as VerseData;
      modified.isFavourite = +modified.isFavourite ? 0 : 1;
      const bookName = (await this.backendSrv.getBook(this.data.verse.bookId)).name
      const hastag = getTargetHashtag(bookName, this.data.verse.verseId);
      if (modified.isFavourite)
        this.backendSrv.addFavourite(modified).then(resp => {
          console.log(resp);
          this.stateSrv.reloadVerses$.next(hastag);
          this.closeMenu();
        });
      else
        this.backendSrv.removeFavourite(+modified.favouriteId).then(resp => {
          console.log(resp);
          this.stateSrv.reloadVerses$.next(hastag);
          this.closeMenu();
        });
    }
  }

  async setColor(color: string) {
    if (!this.data.verse) return;
    if (+this.data.verse.isFavourite) return; // verse is favourite => CANNOT change color
    const modified = JSON.parse(JSON.stringify(this.data.verse)) as VerseData;
    modified.color = modified.color === color ? 'normal' : color;
    const bookName = (await this.backendSrv.getBook(this.data.verse.bookId)).name
    const hastag = getTargetHashtag(bookName, this.data.verse.verseId);
    this.backendSrv.updateColor(modified).then(resp => {
      console.log(resp);
      this.stateSrv.reloadVerses$.next(hastag);
      this.closeMenu();
    });
  }

  reportVerse(reportType: number, comment?: string) {
    const report: ClientReport = {
      appVersion: environment.appInfo.version,
      versionKey: this.backendSrv.versionKey$.value,
      typeId: reportType,
      verseId: this.data.verse?.verseId,
      feedback: this.data.verse?.text ?? comment
    };
    this.backendSrv.addReport(report).then(resp => {
      console.log(resp);
      this.closeMenu();
    });
  }

  openModal(as: string) {
    this.closeMenu();
    throw new Error('Not implemented', { cause: 'Missing component with modal for error or feedback' });
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }
}
