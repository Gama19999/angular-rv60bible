import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-verse-item',
  standalone: false,
  templateUrl: './verse-item.component.html',
  styleUrl: './verse-item.component.css'
})
export class VerseItemComponent {
  @Input('verse-id') verseId!: string;
  @Input('book-id') bookId!: string;
  @Input('chapter-num') chapterNum!: string;
  @Input('verse-num') verseNum!: string;
  @Input('verse-txt') verseTxt!: string;
  @Input('with-mb') withMB!: boolean;
}
