import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';
import { BookData } from '../models/book-data.interface';

@Injectable({ providedIn: 'root' })
export class BookService {
  booksPromise: Promise<BookData[]> | undefined;
  booksCount: number = 0;

  constructor() {}

  loadAllBooks() {
    switch (environment.platform) {
      case 'electron': // @ts-ignore
        this.booksPromise = window.electronAPI.fetchAllBooks(); break;
      case 'web': break;
      default: this.local_loadAllBooks();
    }
    this.booksPromise?.then(data => this.booksCount = data.length);
  }

  private local_loadAllBooks() {
    this.booksPromise = new Promise<BookData[]>((resolve) => {
      resolve([
        {bookId: '1', bookName: 'Book Name 1', bookShort: 'bs.1', bookTestament: '0', bookChCount: '8'},
        {bookId: '2', bookName: 'Book Name 2', bookShort: 'bs.2', bookTestament: '1', bookChCount: '5'},
        {bookId: '3', bookName: 'Book Name 3', bookShort: 'bs.3', bookTestament: '0', bookChCount: '3'},
        {bookId: '4', bookName: 'Book Name 4', bookShort: 'bs.4', bookTestament: '1', bookChCount: '60'}
      ]);
    });
  }
}
