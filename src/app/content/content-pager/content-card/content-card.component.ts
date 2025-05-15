import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { PopupService } from '../../../services/popup.service';
import { VerseService } from '../../../services/verse.service';
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
  private verses: VerseData[] = [];
  private xDown: number | undefined;
  private yDown: number | undefined;
  protected rightHidden: boolean = false;
  @ViewChild('contentCard') private contentCardEl!: ElementRef;
  @Input('page-direction') pageDirection!: string;
  @Input('is-mobile') isMobile: boolean = false;
  @Input('has-content') hasContent: boolean = false;
  viewArr: {verse: VerseData, withMarginB: boolean}[] = [];

  constructor(private verseSrv: VerseService, private popupSrv: PopupService) {}

  ngOnInit() {
    if (this.isMobile && this.pageDirection === 'right') this.rightHidden = true;
    if (!this.hasContent) return;
    this.reloadVerses();
    this.cpcSubs = this.verseSrv.contentPageChange.subscribe(() => this.reloadVerses());
    this.chListSubs = this.popupSrv.chListClosed.subscribe(cc => this.handleChListChange(cc));
  }

  private reloadVerses() {
    this.verseSrv.versesPromise?.then(data => {
      if (this.isMobile) { this.verses = data; return; }
      switch (this.pageDirection) {
        case 'left': this.verses = data.slice(0, environment.fetchLimit / 2); break;
        case 'right': this.verses = data.slice(environment.fetchLimit / 2); break;
      }
      this.fillViewArr();
    });
  }

  private fillViewArr() {
    this.viewArr = [];
    let needMarginB;
    for (let vi = 0; vi < this.verses.length; vi++) {
      needMarginB = vi < this.verses.length - 1 ?
               environment.fetchLimit === 16 ? this.verses[vi].verseTxt.length > 130 && this.verses[vi+1].verseTxt.length > 115 :
               this.verses[vi].verseTxt.length > 160 && this.verses[vi+1].verseTxt.length > 160 : false;
      this.viewArr.push({verse: this.verses[vi], withMarginB: needMarginB});
    }
  }

  private handleChListChange(cc: ChapterChange) {
    this.verseSrv.loadVersesOn(firstOfCh(cc.bookId, cc.chapterNum));
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
      this.verseSrv.loadVersesOn(prevOfCh(first.bookId, first.chapterNum, first.verseNum));
    } else {
      const last = this.verses[this.verses.length - 1];
      this.verseSrv.loadVersesOn(nextOfCh(last.bookId, last.chapterNum, last.verseNum));
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
  }
}
