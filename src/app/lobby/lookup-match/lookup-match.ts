import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { BibleService } from '../../shared/services/bible.service';
import { LookupResp } from '../../shared/util/app.interfaces';
import { getVerseHashtag } from '../../shared/util/app.util';

@Component({
  selector: 'app-lookup-match',
  imports: [],
  templateUrl: './lookup-match.html',
  styleUrl: './lookup-match.css',
})
export class LookupMatch {
  @Input('match-data') matchData!: LookupResp;

  constructor(private bibleSrv: BibleService, private router: Router) { }

  openAt() {
    if (this.matchData.verseOrdinal) {
      const hash = getVerseHashtag(this.matchData.bookName, this.matchData.chapterId!, this.matchData.verseOrdinal);
      this.router.navigate(['/', 'reader', this.bibleSrv.bibleId$.value, 'books', this.matchData.bookId, 'chapters', this.matchData.chapterId, 'verses'], { fragment: hash });
    } else this.router.navigate(['/', 'reader', this.bibleSrv.bibleId$.value, 'books', this.matchData.bookId, 'chapters'])
  }
}
