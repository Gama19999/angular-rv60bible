import { Component, inject, input, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

import { BackendService } from '../services/backend.service';
import { ConfigService } from '../services/config.service';
import { StateService } from '../services/state.service';
import { NavigationData, VerseViewerChange } from '../util/app.interfaces';

@Component({
  selector: 'app-btn-change-chapter',
  imports: [AsyncPipe],
  templateUrl: './btn-change-chapter.html',
  styleUrl: './btn-all.css',
})
export class BtnChangeChapter implements OnInit {
  private readonly backendSrv = inject(BackendService);
  private readonly configSrv = inject(ConfigService);
  private readonly stateSrv = inject(StateService);
  direction = input<'prev' | 'next'>('next');
  tag = input('tag');
  changeData = input.required<VerseViewerChange>({ alias: 'change-data' });
  tagsOn$!: BehaviorSubject<boolean>;

  constructor() { }

  ngOnInit(): void {
    this.tagsOn$ = this.configSrv.tagsOn$;
  }

  changeChapter() {
    this.stateSrv.closeVerseMenu$.next();
    const nextBookId = this.changeData().nextBook?.bookId;
    const bookId = nextBookId ? +nextBookId - 1 : 66;
    const chapterId = this.direction() === 'next' ? this.changeData().nextChapterId : this.changeData().prevChapterId;
    if (!chapterId) return;
    const navData: NavigationData = { versionKey: this.backendSrv.versionKey$.value, bookId: bookId, chapterId: chapterId };
    this.stateSrv.navigate('verses', navData);
  }
}
