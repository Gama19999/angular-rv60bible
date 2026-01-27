import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgClass } from '@angular/common';

import { BibleService } from '../../services/bible.service';
import { ReaderService } from '../../services/reader.service';
import { ErrorReport, VerseInfo } from '../../util/app.interfaces';
import { VerseReportType } from '../../util/app.types';
import { getVerseHashtag } from '../../util/app.util';

@Component({
  selector: 'app-context-menu',
  imports: [NgClass],
  templateUrl: './context-menu.html',
  styleUrl: './context-menu.css',
})
export class ContextMenu {
  copy: string = 'Copiar versículo';
  reportsHidden: boolean = true;
  @Input('view') view: string = 'verse-viewer';
  @Input('verse-data') verseData: VerseInfo | undefined;
  @Output('close') close: EventEmitter<void> = new EventEmitter();

  constructor(private bibleSrv: BibleService, private readerSrv: ReaderService) { }

  async copyVerse() {
    const bookName = (await this.bibleSrv.getBook(this.verseData!.bookId)).name
    const verse = `"${this.verseData?.text.trim()}" ${bookName} ${this.verseData?.chapterId}:${this.verseData?.verseOrdinal} (${this.bibleSrv.bibleId$.value.split('-')[1].toUpperCase()})`;
    navigator.clipboard.writeText(verse);
    this.closeMenu();
  }

  async toggleFavourite() {
    const modified = JSON.parse(JSON.stringify(this.verseData)) as VerseInfo;
    modified.isFavourite = modified.isFavourite === 1 ? 0 : 1;
    const bookName = (await this.bibleSrv.getBook(this.verseData!.bookId)).name
    const hastag = getVerseHashtag(bookName, this.verseData!.chapterId, this.verseData!.verseOrdinal);
    this.bibleSrv.setFavourite(modified).then(resp => {
      console.log(resp);
      this.readerSrv.reloadVerses$.next(hastag);
      this.closeMenu();
    });
  }

  async setColor(color: string) {
    const modified = JSON.parse(JSON.stringify(this.verseData)) as VerseInfo;
    modified.color = modified.color === color ? 'normal' : color;
    const bookName = (await this.bibleSrv.getBook(this.verseData!.bookId)).name
    const hastag = getVerseHashtag(bookName, this.verseData!.chapterId, this.verseData!.verseOrdinal);
    this.bibleSrv.setColor(modified).then(resp => {
      console.log(resp);
      this.readerSrv.reloadVerses$.next(hastag);
      this.closeMenu();
    });
  }

  async reportVerse(reportType: VerseReportType) {
    const bookName = (await this.bibleSrv.getBook(this.verseData!.bookId)).name
    const error: ErrorReport = {
      errorTypeId: reportType,
      verseId: this.verseData?.verseId,
      verseContent: `"${this.verseData?.text.trim()}" ${bookName} ${this.verseData?.chapterId}:${this.verseData?.verseOrdinal} (${this.bibleSrv.bibleId$.value.toUpperCase()})`
    };
    this.bibleSrv.reportError(error).then(resp => {
      console.log(resp);
      this.closeMenu();
    });
  }

  closeMenu() {
    this.reportsHidden = true;
    this.close.emit();
  }
}
