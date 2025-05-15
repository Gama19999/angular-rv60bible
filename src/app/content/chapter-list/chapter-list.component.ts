import { Component, Input, OnInit } from '@angular/core';

import { PopupService } from '../../services/popup.service';

@Component({
  selector: 'app-chapter-list',
  standalone: false,
  templateUrl: './chapter-list.component.html',
  styleUrl: './chapter-list.component.css'
})
export class ChapterListComponent implements OnInit {
  @Input('book-id') bookId: string = '1';
  @Input('ch-count') chapterCount: string = '1';
  chapters: string[] = [];

  constructor(private popupSrv: PopupService) {}

  ngOnInit() {
    for (let i = 1; i <= +this.chapterCount; i++) this.chapters.push(i < 10 ? `0${i}` : `${i}`);
  }

  chClick(ch: number) {
    this.popupSrv.chListClosed.next({bookId: this.bookId, chapterNum: `${ch}`});
  }
}
