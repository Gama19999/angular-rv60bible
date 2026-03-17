import { Component, inject, input, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

import { BackendService } from '../services/backend.service';
import { ConfigService } from '../services/config.service';
import { StateService } from '../services/state.service';
import { TrimTagPipe } from '../pipes/trim-tag.pipe';
import { NavigationData, VerseViewerChange } from '../util/app.interfaces';

@Component({
  selector: 'app-btn-change-book',
  imports: [TrimTagPipe, AsyncPipe],
  templateUrl: './btn-change-book.html',
  styleUrl: './btn-all.css',
})
export class BtnChangeBook implements OnInit {
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

  changeBook() {
    this.stateSrv.closeVerseMenu$.next();
    const bookId = this.direction() === 'next' ? this.changeData().nextBook?.bookId : this.changeData().prevBook?.bookId;
    if (!bookId) return; 
    const navData: NavigationData = { versionKey: this.backendSrv.versionKey$.value, bookId: bookId, chapterId: 1 };
    this.stateSrv.navigate('verses', navData);
  }
}
