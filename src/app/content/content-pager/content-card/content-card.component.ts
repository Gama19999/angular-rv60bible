import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';

import { PopupService } from '../../../services/popup.service';
import { VerseService } from '../../../services/verse.service';
import { BookData } from '../../../models/book-data.interface';
import { ChapterChange } from '../../../models/chapter-change.interface';
import { VerseData } from '../../../models/verse-data.interface';
import { firstOfCh, nextOfCh, prevOfCh } from '../../../models/verse-request.template';

@Component({
  selector: 'app-content-card',
  standalone: false,
  templateUrl: './content-card.component.html',
  styleUrl: './content-card.component.css'
})
export class ContentCardComponent implements OnInit, AfterViewInit, OnDestroy {
  private cpcSubs: Subscription | undefined;
  private chListSubs: Subscription | undefined;
  private bkListSubs: Subscription | undefined;
  private verses: VerseData[] = [];
  private xDown: number | undefined;
  private yDown: number | undefined;
  protected rightHidden: boolean = false;
  @ViewChild('contentCard') private contentCardEl!: ElementRef;
  @Input('page-direction') pageDirection!: string;
  @Input('is-mobile') isMobile: boolean = false;
  @Input('has-content') hasContent: boolean = false;
  viewArr: {verse: VerseData, marginType: string}[] = [];
  vl: number = 0;

  constructor(private verseSrv: VerseService, private popupSrv: PopupService) {}

  ngOnInit() {
    if (this.isMobile && this.pageDirection === 'right') this.rightHidden = true;
    if (!this.hasContent) return;
    this.reloadVerses();
    this.cpcSubs = this.verseSrv.contentPageChange.subscribe(() => this.reloadVerses());
    this.chListSubs = this.popupSrv.chListClosed.subscribe(cc => this.handleChListChange(cc));
    this.bkListSubs = this.popupSrv.bkListClosed.subscribe(bd => this.handleBkListChange(bd));
  }

  private reloadVerses() {
    this.vl = this.verseSrv.fetchLimit;
    this.verseSrv.versesPromise?.then(data => {
      if (this.isMobile) { this.verses = data; return; }
      switch (this.pageDirection) {
        case 'left': this.verses = data.slice(0, this.verseSrv.fetchLimit / 2); break;
        case 'right': this.verses = data.slice(this.verseSrv.fetchLimit / 2); break;
      }
      this.fillViewArr();
    });
  }

  private fillViewArr() {
    this.viewArr = [];
    for (let vi = 0; vi < this.verses.length; vi++)
      this.viewArr.push({verse: this.verses[vi], marginType: this.marginType(vi)});
  }

  private marginType(vi: number): string {
    let type = 'none';
    if (vi < this.verses.length - 1) {
      if (this.verseSrv.fetchLimit === 10)
        type = this.verses[vi].verseTxt.length > 293 ? 'max' :
               this.verses[vi].verseTxt.length > 240 ? 'quad' :
               this.verses[vi].verseTxt.length > 190 ? 'triple+' :
               this.verses[vi].verseTxt.length > 187 && this.verses[vi+1].verseTxt.length < 151 ? 'double+' :
               this.verses[vi].verseTxt.length > 187 ? 'triple+' :
               this.verses[vi].verseTxt.length > 138 && this.verses[vi+1].verseTxt.length > 138 ? 'double+' :
               this.verses[vi].verseTxt.length > 138 ? 'double' : type;
      else if (this.verseSrv.fetchLimit === 16)
        type = this.verses[vi].verseTxt.length > 305 ? 'triple' :
               this.verses[vi].verseTxt.length > 240 ? 'double' :
               this.verses[vi].verseTxt.length > 130 && this.verses[vi+1].verseTxt.length > 115 ? 'single' : type;
      else
        type = this.verses[vi].verseTxt.length > 160 && this.verses[vi+1].verseTxt.length > 145 ? 'single' : type;
    }
    return type;
  }

  private handleChListChange(cc: ChapterChange) {
    this.verseSrv.loadVersesOn(firstOfCh(cc.bookId, cc.chapterNum, this.verseSrv.fetchLimit));
    this.reloadVerses();
  }

  private handleBkListChange(bd: BookData) {
    this.verseSrv.loadVersesOn(firstOfCh(bd.bookId, '1', this.verseSrv.fetchLimit));
    this.reloadVerses();
  }

  ngAfterViewInit() {
    this.contentCardEl.nativeElement.addEventListener('touchstart', this.touchStart, false);
    this.contentCardEl.nativeElement.addEventListener('touchmove', this.touchMove, false);
  }

  contentCardClick(evt: Event) {
    if (!this.isMobile && (<HTMLElement> evt.target).tagName !== 'I') this.emitPageChange();
  }

  private emitPageChange(dir: string = this.pageDirection) {
    if (dir === 'left') {
      const first = this.verses[0];
      this.verseSrv.loadVersesOn(prevOfCh(first.bookId, first.chapterNum, first.verseNum, this.verseSrv.fetchLimit));
    } else {
      const last = this.verses[this.verses.length - 1];
      this.verseSrv.loadVersesOn(nextOfCh(last.bookId, last.chapterNum, last.verseNum, this.verseSrv.fetchLimit));
    }
    this.verseSrv.versesPromise?.then(data => { if (data.length) this.verseSrv.contentPageChange.next(); });
  }

  private touchStart = (evt: TouchEvent) => {
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
    this.contentCardEl.nativeElement.removeEventListener('touchstart', this.touchStart, false);
    this.contentCardEl.nativeElement.removeEventListener('touchmove', this.touchMove, false);
    this.cpcSubs?.unsubscribe();
    this.chListSubs?.unsubscribe();
    this.bkListSubs?.unsubscribe();
  }
}
