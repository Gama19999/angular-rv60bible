import { Component, Input } from '@angular/core';

import { strings_es } from '../../../../../assets/strings/strings-es';

@Component({
  selector: 'app-verse-item',
  standalone: false,
  templateUrl: './verse-item.component.html',
  styleUrl: './verse-item.component.css'
})
export class VerseItemComponent {
  @Input('direction') direction!: string;
  @Input('verse-id') verseId!: string;
  @Input('book-id') bookId!: string;
  @Input('chapter-num') chapterNum!: string;
  @Input('verse-num') verseNum!: string;
  @Input('verse-txt') verseTxt!: string;
  @Input('with-margin-b') withMarginB!: boolean;
  protected readonly s = strings_es;
  isFavourite: boolean = false;

  setFavourite() {
    this.isFavourite = !this.isFavourite;
  }
}
