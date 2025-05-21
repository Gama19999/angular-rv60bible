import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

import { strings_es } from '../../../../assets/strings/strings-es';
import { BookService } from '../../../services/book.service';
import { FavouriteService } from '../../../services/favourite.service';

@Component({
  selector: 'app-fav-item',
  standalone: false,
  templateUrl: './fav-item.component.html',
  styleUrl: './fav-item.component.css'
})
export class FavItemComponent implements OnInit, OnChanges {
  protected readonly s = strings_es;
  @Input('verse-id') verseId!: string;
  @Input('book-id') bookId!: string;
  @Input('chapter-num') chapterNum!: string;
  @Input('verse-num') verseNum!: string;
  @Input('verse-txt') verseTxt!: string;
  @Input('date-added') dateAdded!: string;
  @Output('favourite-change') favouriteChange: EventEmitter<void> = new EventEmitter();
  bookName: string = '';
  isFavourite: boolean = false;

  constructor(private bookSrv: BookService, private favouriteSrv: FavouriteService) {}

  ngOnInit() {
    this.bookSrv.booksPromise?.then(books => {
      const book = books.find((bd) => { return bd.bookId === this.bookId; });
      this.bookName = book ? book.bookName : '';
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    let newVerseId = changes['verseId'].currentValue;
    this.favouriteSrv.loadFavouriteState(newVerseId).then(state => this.isFavourite = state);
  }

  toggleFavourite() {
    this.isFavourite = !this.isFavourite;
    this.favouriteSrv.unsetFromFavourite(this.verseId);
    this.favouriteChange.next();
  }
}
