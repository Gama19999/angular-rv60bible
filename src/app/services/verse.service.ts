import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { environment } from '../../environments/environment';
import { VerseData } from '../models/verse-data.interface';
import { VerseRequest } from '../models/verse-request.template';

@Injectable({ providedIn: 'root' })
export class VerseService {
  versesPromise: Promise<VerseData[]> | undefined;
  contentPageChange: Subject<void> = new Subject();

  constructor() {}

  loadVersesOn(vr: VerseRequest) {
    if (environment.platform === 'electron') { // @ts-ignore
      this.versesPromise = window.electronAPI.fetchVersesOn(vr);
    } else this.local_loadVersesOn();
  }

  private local_loadVersesOn() {
    this.versesPromise = new Promise<VerseData[]>((resolve) => {
      resolve([
        {verseId: '34', bookId: '1', chapterNum: '1', verseNum: '8', verseTxt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'},
        {verseId: '35', bookId: '1', chapterNum: '1', verseNum: '9', verseTxt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'},
        {verseId: '36', bookId: '1', chapterNum: '1', verseNum: '10', verseTxt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'},
        {verseId: '37', bookId: '1', chapterNum: '1', verseNum: '11', verseTxt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'},
        {verseId: '38', bookId: '1', chapterNum: '1', verseNum: '12', verseTxt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'},
        {verseId: '39', bookId: '1', chapterNum: '1', verseNum: '13', verseTxt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'},
        {verseId: '40', bookId: '1', chapterNum: '1', verseNum: '14', verseTxt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'},
        {verseId: '41', bookId: '1', chapterNum: '1', verseNum: '15', verseTxt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'},
        {verseId: '42', bookId: '1', chapterNum: '1', verseNum: '16', verseTxt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'},
        {verseId: '43', bookId: '1', chapterNum: '1', verseNum: '17', verseTxt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'},
        {verseId: '44', bookId: '1', chapterNum: '1', verseNum: '18', verseTxt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'},
        {verseId: '45', bookId: '1', chapterNum: '1', verseNum: '19', verseTxt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'},
        {verseId: '46', bookId: '1', chapterNum: '1', verseNum: '20', verseTxt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'},
        {verseId: '47', bookId: '1', chapterNum: '1', verseNum: '21', verseTxt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'},
        {verseId: '48', bookId: '1', chapterNum: '1', verseNum: '22', verseTxt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'},
        {verseId: '49', bookId: '1', chapterNum: '1', verseNum: '23', verseTxt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'},
        {verseId: '50', bookId: '1', chapterNum: '1', verseNum: '24', verseTxt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'},
        {verseId: '51', bookId: '1', chapterNum: '1', verseNum: '25', verseTxt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'},
        {verseId: '52', bookId: '1', chapterNum: '1', verseNum: '26', verseTxt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'},
        {verseId: '53', bookId: '1', chapterNum: '1', verseNum: '27', verseTxt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'}
      ]);
    });
  }

}
