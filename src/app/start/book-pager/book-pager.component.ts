import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { environment } from '../../../environments/environment';
import { BookService } from '../../services/book.service';
import { BookData } from '../../models/book-data.interface';
import { BookPageChange } from '../../models/book-page-change.interface';

@Component({
  selector: 'app-book-pager',
  standalone: false,
  templateUrl: './book-pager.component.html',
  styleUrl: './book-pager.component.css'
})
export class BookPagerComponent implements OnInit, OnDestroy {
  private booksSubs: Subscription | undefined;
  currentLeft: BookData;
  currentRight: BookData;
  isMobile: boolean = environment.platform === 'mobile';
  inTransition: boolean = false;

  constructor(private bookSrv: BookService) {
    this.currentLeft = {bookId: '', bookName: '', bookShort: '', bookTestament: '', bookChCount: ''};
    this.currentRight = {bookId: '', bookName: '', bookShort: '', bookTestament: '', bookChCount: ''};
  }

  ngOnInit() {
    this.booksSubs = this.bookSrv.loadAllBooks().subscribe({
      next: data => this.handleSuccess(data)
    });
  }

  private handleSuccess(data: BookData[]) {
    this.currentLeft = data[0];
    this.currentRight = data[1];
  }

  onPageChange(bpc: BookPageChange) {
    const idx: number = +bpc.bookNumber - 1;
    switch (bpc.direction) {
      case 'left': this.updateToLeft(idx, bpc.isMobile); break;
      case 'right': this.updateToRight(idx, bpc.isMobile); break;
    }
  }

  private updateToLeft(idx: number, isMobile: boolean) {
    if (this.isLimitLeft(idx, isMobile)) return;
    this.toggleTransition();
    if (!isMobile) this.currentRight = this.bookSrv.booksData[idx - 1];
    this.currentLeft = this.bookSrv.booksData[!isMobile ? idx - 2 : idx - 1];
  }
  private updateToRight(idx: number, isMobile: boolean) {
    if (this.isLimitRight(idx, isMobile)) return;
    this.toggleTransition();
    if (!isMobile) this.currentRight = this.bookSrv.booksData[idx + 2];
    this.currentLeft = this.bookSrv.booksData[idx + 1];
  }

  private isLimitLeft = (pos: number, isMobile: boolean): boolean => pos - (!isMobile ? 2 : 1) < 0;
  private isLimitRight = (pos: number, isMobile: boolean): boolean => pos + (!isMobile ? 2 : 1) >= this.bookSrv.booksData.length;

  private toggleTransition() {
    this.inTransition = true;
    setTimeout(() => this.inTransition = false, 200);
  }

  ngOnDestroy() {
    this.booksSubs?.unsubscribe();
  }
}
