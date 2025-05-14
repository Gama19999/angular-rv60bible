import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { BookData } from '../../../models/book-data.interface';
import { BookPageChange } from '../../../models/book-page-change.interface';

@Component({
  selector: 'app-book-card',
  standalone: false,
  templateUrl: './book-card.component.html',
  styleUrl: './book-card.component.css'
})
export class BookCardComponent implements OnInit, AfterViewInit, OnDestroy {
  private xDown: number | undefined;
  private yDown: number | undefined;
  protected rightHidden: boolean = false;
  @ViewChild('bookCard') private bookCardEl!: ElementRef;
  @Input('book-info') bookInfo: BookData = {bookId: '', bookName: '', bookShort: '', bookTestament: '', bookChCount: ''};
  @Input('page-direction') pageDirection!: string;
  @Input('is-mobile') isMobile: boolean = false;
  @Output('page-clicked') private pageClicked: EventEmitter<BookPageChange> = new EventEmitter();

  constructor(private router: Router) {}

  ngOnInit() {
    if (this.isMobile && this.pageDirection === 'right') this.rightHidden = true;
  }

  ngAfterViewInit() {
    this.bookCardEl.nativeElement.addEventListener('touchstart', this.touchStart, false);
    this.bookCardEl.nativeElement.addEventListener('touchmove', this.touchMove, false);
  }

  bookCardClick(evt: Event) {
    if (!this.isMobile && (<HTMLElement> evt.target).tagName !== 'DIV') this.emitPageChange();
    else this.openBook();
  }

  openBook() {
    this.router.navigate(['/', 'content', this.bookInfo.bookId, this.bookInfo.bookShort]);
  }

  private emitPageChange(dir: string = this.pageDirection) {
    this.pageClicked.emit({bookNumber: this.bookInfo.bookId, direction: dir, isMobile: this.isMobile});
  }

  private touchStart = (evt: TouchEvent)=> {
    const firstTouch = evt.touches[0];
    this.xDown = firstTouch.clientX;
    this.yDown = firstTouch.clientY;
  }

  private touchMove = (evt: TouchEvent) => {
    if (!this.xDown || !this.yDown) return;
    const xDiff = this.xDown - evt.touches[0].clientX;
    const yDiff = this.yDown - evt.touches[0].clientY;
    if (Math.abs(xDiff) > Math.abs(yDiff)) { // Vertical or Horizontal direction
      if (xDiff > 0) this.emitPageChange('right'); // Swipe from left to right
      else this.emitPageChange('left'); // Swipe from right to left
    }
    this.xDown = undefined;
    this.yDown = undefined;
  }

  ngOnDestroy() {
    this.bookCardEl.nativeElement.removeEventListener('touchstart', this.touchStart, false);
    this.bookCardEl.nativeElement.removeEventListener('touchmove', this.touchMove, false);
  }
}
