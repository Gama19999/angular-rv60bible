import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { NgClass } from '@angular/common';
import { Subscription } from 'rxjs';

import { ConfigService } from '../../services/config.service';
import { PageType, Theme } from '../../util/app.types';
import { BookInfo } from '../../util/app.interfaces';
import { parseCharacterMod } from '../../util/app.util';

@Component({
  selector: 'app-single-page',
  imports: [NgClass],
  templateUrl: './single-page.html',
  styleUrl: './single-page.css',
})
export class SinglePage implements OnInit, OnDestroy {
  private subs: Subscription[] = [];
  protected readonly parseCharacterMod = parseCharacterMod;
  @Input('type') type!: PageType;
  @Input('book-data') bookData: BookInfo | undefined;
  @Input('chapter-num') chapterNum: number | undefined;
  @Output('page-click') pageClick: EventEmitter<number> = new EventEmitter();
  theme!: Theme;

  constructor(private configSrv: ConfigService) {}

  ngOnInit(): void {
    this.subs.push(this.configSrv.theme$.subscribe(val => this.theme = val));
  }

  onPageClicked() {
    this.pageClick.emit(this.type === 'book' ? this.bookData?.bookId : this.chapterNum);
  }
  
  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }
}
