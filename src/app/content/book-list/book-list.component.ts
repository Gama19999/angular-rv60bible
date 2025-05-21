import { Component, OnInit } from '@angular/core';

import { BookService } from '../../services/book.service';
import { PopupService } from '../../services/popup.service';
import { BookData } from '../../models/book-data.interface';

@Component({
  selector: 'app-book-list',
  standalone: false,
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.css'
})
export class BookListComponent implements OnInit {
  books: BookData[] = [];

  constructor(private bookSrv: BookService, private popupSrv: PopupService) {}

  ngOnInit() {
    this.bookSrv.booksPromise?.then(data => this.books = data);
  }

  bookClick(book: number) {
    this.popupSrv.bkListClosed.next(this.books[book]);
  }
}
