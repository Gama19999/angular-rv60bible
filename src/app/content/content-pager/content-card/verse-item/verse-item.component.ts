import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { strings_es } from '../../../../../assets/strings/strings-es';
import { FavouriteService } from '../../../../services/favourite.service';

@Component({
  selector: 'app-verse-item',
  standalone: false,
  templateUrl: './verse-item.component.html',
  styleUrl: './verse-item.component.css'
})
export class VerseItemComponent implements OnChanges {
  protected readonly s = strings_es;
  @Input('direction') direction!: string;
  @Input('verse-id') verseId!: string;
  @Input('book-id') bookId!: string;
  @Input('chapter-num') chapterNum!: string;
  @Input('verse-num') verseNum!: string;
  @Input('verse-txt') verseTxt!: string;
  @Input('margin-type') marginType!: string;
  isFavourite: boolean = false;

  constructor(private favouriteSrv: FavouriteService) {}

  ngOnChanges(changes: SimpleChanges) {
    let newVerseId = changes['verseId'].currentValue;
    this.checkFavourite(newVerseId);
  }

  private checkFavourite(verseId: string) {
    this.favouriteSrv.loadFavouriteState(verseId).then(state => this.isFavourite = state);
  }

  toggleFavourite() {
    this.isFavourite = !this.isFavourite;
    if (this.isFavourite) this.favouriteSrv.setAsFavourite({verseId: this.verseId,
                                                            bookId: this.bookId,
                                                            chapterNum: this.chapterNum,
                                                            verseNum: this.verseNum,
                                                            verseTxt: this.verseTxt});
    else this.favouriteSrv.unsetFromFavourite(this.verseId);
  }
}
