import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';
import { FavouriteData, VerseData } from '../models/verse-data.interface';

@Injectable({ providedIn: 'root' })
export class FavouriteService {

  constructor() {}

  loadFavouriteState(verseId: string): Promise<boolean> {
    if (environment.platform === 'electron') { // @ts-ignore
      return window.electronAPI.inFavourites(verseId);
    } else return new Promise<boolean>((resolve) => resolve(false))
  }

  setAsFavourite(verse: VerseData) {
    if (environment.platform === 'electron') { // @ts-ignore
      window.electronAPI.setFavourite(verse);
    }
  }

  unsetFromFavourite(verseId: string) {
    if (environment.platform === 'electron') { // @ts-ignore
      window.electronAPI.unsetFavourite(verseId);
    }
  }

  loadAllFavourites(): Promise<FavouriteData[]> {
    if (environment.platform === 'electron') { // @ts-ignore
      return window.electronAPI.fetchAllFavourites();
    } else return new Promise<FavouriteData[]>((resolve) => {
      resolve([
        {verseId: '1', bookId: '1', chapterNum: '1', verseNum: '1', verseTxt: 'deiwbiwevfiywvefiyewfvwi', added: '2025-05-20'},
        {verseId: '2', bookId: '2', chapterNum: '2', verseNum: '2', verseTxt: 'deiwbiwevfiywvefiyewfvwi', added: '2025-05-22'},
        {verseId: '3', bookId: '3', chapterNum: '3', verseNum: '3', verseTxt: 'deiwbiwevfiywvefiyewfvwi', added: '2025-05-23'},
        {verseId: '4', bookId: '4', chapterNum: '4', verseNum: '4', verseTxt: 'deiwbiwevfiywvefiyewfvwi', added: '2025-05-24'}
      ]);
    })
  }
}
