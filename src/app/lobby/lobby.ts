import { Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { AsyncPipe, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { environment } from '../../environments/environment';
import { BibleService } from '../shared/services/bible.service';
import { ConfigService } from '../shared/services/config.service';
import { BtnConfig } from '../shared/svg/btn-config';
import { BtnReader } from '../shared/svg/btn-reader';
import { Logo } from '../shared/svg/logo';
import { LookupMatch } from './lookup-match/lookup-match';
import { Modal } from '../shared/components/modal/modal';
import { BibleInfo } from '../shared/util/app.interfaces';
import { BibleId, Theme } from '../shared/util/app.types';
import { getVerseHashtag } from '../shared/util/app.util';

@Component({
  selector: 'app-lobby',
  imports: [BtnConfig, BtnReader, Logo, Modal, FormsModule, AsyncPipe, NgClass],
  templateUrl: './lobby.html',
  styleUrl: './lobby.css',
})
export class Lobby implements OnInit, OnDestroy {
  private subs: Subscription[] = [];
  appInfo = environment.appInfo;
  appContact = environment.appContact;
  bibleId!: BibleId;
  bibles$!: Promise<BibleInfo[]>;
  configHidden: boolean = true;
  theme!: Theme;

  @ViewChild('search') search!: ElementRef<HTMLInputElement>;
  @ViewChild('matches') matches!: ElementRef<HTMLElement>;
  @ViewChild('matchList', { read: ViewContainerRef }) matchList!: ViewContainerRef;

  constructor(private configSrv: ConfigService, private bibleSrv: BibleService, private router: Router) { }

  ngOnInit(): void {
    this.bibles$ = this.bibleSrv.getBibles();
    this.subs.push(this.configSrv.theme$.subscribe(val => this.theme = val));
    this.subs.push(this.bibleSrv.bibleId$.subscribe(val => this.bibleId = val));
  }

  setBibleVersion() {
    this.bibleSrv.setBibleId(this.bibleId);
  }

  async lookupValue(evt: Event) {
    const value = (evt.target as HTMLInputElement).value;
    const results = await this.bibleSrv.lookup({ searchFor: value });
    this.matchList.clear();
    let itemRef, itemEl;
    for (const item of results) {
      itemRef = this.matchList.createComponent(LookupMatch);
      itemRef.instance.matchData = item;
      itemEl = itemRef.location.nativeElement as HTMLElement;
      itemEl.tabIndex = -1;
    }
  }

  searchKeyListener(evt: KeyboardEvent) {
    if (evt.key === 'ArrowDown') {
      evt.preventDefault();
      (this.matches.nativeElement.firstElementChild as HTMLElement)?.focus();
    }
  }

  matchesKeyListener(evt: KeyboardEvent) {
    evt.preventDefault();
    const items = Array.from(this.matches.nativeElement.children) as HTMLElement[];
    const activeEl = document.activeElement as HTMLElement;
    const currentIndex = items.indexOf(activeEl);
    let nextIndex = currentIndex;
    switch (evt.code) {
      case 'ArrowDown': nextIndex = (currentIndex + 1) % items.length; break;
      case 'ArrowUp': nextIndex = (currentIndex - 1 + items.length) % items.length; break;
      case 'Escape': this.search.nativeElement.focus(); return;
      case 'Enter': this.openAt((activeEl.firstElementChild as HTMLElement)); return;
    }
    items[nextIndex].focus();
  }

  private openAt(el: HTMLElement) {
    const { bookId, bookName, chapterId, verseOrdinal } = el.dataset;
    if (verseOrdinal) {
      const hash = getVerseHashtag(bookName!, +chapterId!, +verseOrdinal);
      this.router.navigate(['/', 'reader', this.bibleSrv.bibleId$.value, 'books', bookId, 'chapters', chapterId, 'verses'], { fragment: hash });
    } else this.router.navigate(['/', 'reader', this.bibleSrv.bibleId$.value, 'books', bookId, 'chapters'])
  }

  gotoReader() {
    this.router.navigate(['/', 'reader', this.bibleId]);
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }
}
