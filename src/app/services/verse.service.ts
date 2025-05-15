import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { environment } from '../../environments/environment';
import { VerseData } from '../models/verse-data.interface';
import { VerseRequest } from '../models/verse-request.template';
import { apiGetVersesOn } from '../models/api-request.interface';

@Injectable({ providedIn: 'root' })
export class VerseService {
  verseData: Subject<VerseData[]> = new Subject();
  contentPageChange: Subject<void> = new Subject();

  constructor(private http: HttpClient) {}

  loadVersesOn(vr: VerseRequest) {
    this.http.post<VerseData[]>(environment.api, apiGetVersesOn(vr)).subscribe({
      next: data => this.verseData.next(data),
      error: failure => console.error(failure)
    });
  }

  clear() {
    this.verseData.next([{verseId:'',verseNum:'',verseTxt:'',chapterNum:'',bookId:''}]);
  }

}
