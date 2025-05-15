import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, of, tap } from 'rxjs';

import { environment } from '../../environments/environment';
import { BookData } from '../models/book-data.interface';
import { apiGetAllBooks } from '../models/api-request.interface';

@Injectable({ providedIn: 'root' })
export class BookService {
  booksData: BookData[] = [];

  constructor(private http: HttpClient) {}

  loadAllBooks() {
    return this.http.post<BookData[]>(environment.api, apiGetAllBooks()).pipe(
      tap(data => this.booksData = data),
      catchError(failure => { console.error(failure); return of([]); })
    );
  }
}
