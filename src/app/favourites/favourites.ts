import { Component, OnDestroy, OnInit } from '@angular/core';
import { AsyncPipe, NgClass, NgStyle } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { BibleService } from '../shared/services/bible.service';
import { ReaderService } from '../shared/services/reader.service';
import { ContextMenu } from '../shared/components/context-menu/context-menu';
import { SinglePage } from '../shared/components/single-page/single-page';
import { FavouriteInfo } from '../shared/util/app.interfaces';

@Component({
  selector: 'app-favourites',
  imports: [ContextMenu, SinglePage, AsyncPipe, NgClass, NgStyle],
  templateUrl: './favourites.html',
  styleUrl: './favourites.css',
})
export class Favourites implements OnInit, OnDestroy {
  private subs: Subscription[] = [];
  favourites$!: Promise<FavouriteInfo[]>;
  menuHidden: boolean = true;
  menuData: any;
  menuX: number = 0;
  menuY: number = 0;

  constructor(private bibleSrv: BibleService, private readerSrv: ReaderService, private route: ActivatedRoute, private titleSrv: Title) {}

  ngOnInit(): void {
    this.subs.push(this.route.parent!.params.subscribe(params => {
      const bibleId = params['bibleId'].toUpperCase();
      this.titleSrv.setTitle(`${bibleId.split('-')[1]} | Favoritos`);
      this.favourites$ = this.bibleSrv.getFavourites();
      setTimeout(() => this.readerSrv.bibleQuote$.next('Favoritos'), 100);
    }));
    this.subs.push(this.readerSrv.reloadVerses$.subscribe(() => this.favourites$ = this.bibleSrv.getFavourites()));
  }

  openMenu(evt: PointerEvent, verse: FavouriteInfo) {
      evt.preventDefault();
      console.log(evt);
      const posY = (window.innerHeight - 235) > evt.pageY ? evt.pageY : window.innerHeight - 235;
      this.menuX = evt.pageX;
      this.menuY = posY;
      this.menuData = verse;
      this.menuHidden = false;
    }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }
}
