import { Component, ElementRef, inject, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

import { environment } from '../../environments/environment';
import { BackendService } from '../shared/services/backend.service';
import { ConfigService } from '../shared/services/config.service';
import { StateService } from '../shared/services/state.service';
import { Logo } from '../shared/svg/logo';
import { ContextMenu } from '../shared/components/context-menu/context-menu';
import { LookupMatch } from './lookup-match/lookup-match';
import { BibleData, Language, MenuData } from '../shared/util/app.interfaces';
import { LookupMode } from '../shared/util/app.types';
import { normalize, openTargetWith } from '../shared/util/app.util';

@Component({
  selector: 'app-search',
  imports: [ContextMenu, Logo, FormsModule, AsyncPipe],
  templateUrl: './search.html',
  styleUrl: './search.css',
})
export class Search implements OnInit, OnDestroy {
  private readonly titleSrv = inject(Title);
  private readonly backendSrv = inject(BackendService);
  private readonly configSrv = inject(ConfigService);
  private readonly stateSrv = inject(StateService);
  private subs: Subscription[] = [];
  appName = environment.appInfo.name;
  versionKey!: string;
  versions$!: Promise<BibleData[]>;
  lang!: Language;
  lookupMode: LookupMode = 'byQuote';
  menuOpen = false;
  menuData!: MenuData;

  @ViewChild('lookupEl') lookupEl!: ElementRef<HTMLInputElement>;
  @ViewChild('matchesEl') matchesEl!: ElementRef<HTMLElement>;
  @ViewChild('matchList', { read: ViewContainerRef }) matchList!: ViewContainerRef;

  constructor() { }

  ngOnInit(): void {
    this.versions$ = this.backendSrv.versions();
    this.subs.push(this.backendSrv.versionKey$.subscribe(vk => this.versionKey = vk));
    this.subs.push(this.configSrv.language$.subscribe(lang => this.setTitle(lang)));
    this.subs.push(this.configSrv.lookupMode$.subscribe(lm => this.lookupMode = lm));
    this.stateSrv.setCurrentView('search');
  }

  private setTitle(lang: Language) {
    this.lang = lang;
    this.titleSrv.setTitle(this.lang.str.search.title);
  }

  setVersionKey(evt: Event) {
    const select = (evt.target as HTMLSelectElement);
    const lang = select.options[select.selectedIndex].dataset['lang'];
    this.backendSrv.setVersionKey(this.versionKey);
    this.configSrv.setLang(lang ?? 'es');
    if (this.lookupEl.nativeElement.value) this.getLookup(this.lookupEl.nativeElement);
  }

  toggleLookupMode() {
    this.lookupMode = this.lookupMode === 'byQuote' ? 'byText' : 'byQuote';
    this.configSrv.setLookupMode(this.lookupMode);
    if (this.lookupEl.nativeElement.value) this.getLookup(this.lookupEl.nativeElement);
  }

  async getLookup(el: HTMLInputElement) {
    const value = normalize(el.value);
    const results = await this.backendSrv.lookup({ searchFor: value, lookupMode: this.lookupMode });
    this.matchList.clear();
    let itemRef, itemEl;
    for (const match of results) {
      itemRef = this.matchList.createComponent(LookupMatch);
      itemRef.instance.data = match;
      itemEl = itemRef.location.nativeElement as HTMLElement;
      itemEl.tabIndex = -1;
    }
  }

  handleLookupKey(evt: KeyboardEvent) {
    if (evt.key === 'ArrowDown') {
      evt.preventDefault();
      (this.matchesEl.nativeElement.firstElementChild as HTMLElement)?.focus();
    }
  }

  handleMatchesKey(evt: KeyboardEvent) {
    evt.preventDefault();
    const items = Array.from(this.matchesEl.nativeElement.children) as HTMLElement[];
    const activeEl = document.activeElement as HTMLElement;
    const currentIndex = items.indexOf(activeEl);
    let nextIndex = currentIndex;
    switch (evt.code) {
      case 'ArrowDown': nextIndex = (currentIndex + 1) % items.length; break;
      case 'ArrowUp': nextIndex = (currentIndex - 1 + items.length) % items.length; break;
      case 'Escape': this.lookupEl.nativeElement.focus(); return;
      case 'Enter': return openTargetWith((activeEl.firstElementChild as HTMLElement), this.backendSrv.versionKey$.value, this.stateSrv);
    }
    items[nextIndex].focus();
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }
}
