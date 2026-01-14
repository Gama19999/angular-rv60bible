import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

import { environment } from '../../../environments/environment';
import { CacheService } from './cache.service';
import { BibleInfo, BookInfo, VerseUpdateResp, VerseInfo, ErrorReportResp, ErrorReport, LookupValue, LookupResp, FavouriteInfo } from '../util/app.interfaces';
import { BibleId } from '../util/app.types';
import { replace } from '../util/app.util';

@Injectable({ providedIn: 'root' })
export class BibleService {
  private _bibleId: BibleId;
  private _apiAddress: string = '';
  bibleId$: BehaviorSubject<BibleId>;

  constructor(private http: HttpClient, private cacheSrv: CacheService) {
    this._bibleId = cacheSrv.getBibleId();
    cacheSrv.setBibleId(this._bibleId);
    this.bibleId$ = new BehaviorSubject(this._bibleId);
  }

  set apiAddress(value: string) { this._apiAddress = value; }

  async getBibles(): Promise<BibleInfo[]> {
    if (environment.appInfo.platform === 'dev') {
      return new Promise((resolve, reject) => {
        this.http.get<BibleInfo[]>(environment.api.versions).subscribe({
          next: result => resolve(result),
          error: failure => reject(failure)
        });
      });
    } else if (environment.appInfo.platform === 'electron') {
      return new Promise((resolve, reject) => {
        this.http.get<BibleInfo[]>(replace(environment.api.versions, this._apiAddress)).subscribe({
          next: result => resolve(result),
          error: failure => reject(failure)
        });
      });
    } else return Promise.reject('Not implemented');
  }

  setBibleId(bibleId: BibleId) {
    this._bibleId = bibleId;
    this.cacheSrv.setBibleId(bibleId);
    this.bibleId$.next(this._bibleId);
  }

  async getBibleInfo(): Promise<BibleInfo> {
    if (environment.appInfo.platform === 'dev') {
      return new Promise((resolve, reject) => {
        this.http.get<BibleInfo>(replace(environment.api.getVersion, this._bibleId)).subscribe({
          next: result => resolve(result),
          error: failure => reject(failure)
        });
      });
    } else if (environment.appInfo.platform === 'electron') {
      return new Promise((resolve, reject) => {
        this.http.get<BibleInfo>(replace(environment.api.getVersion, this._apiAddress, this._bibleId)).subscribe({
          next: result => resolve(result),
          error: failure => reject(failure)
        });
      });
    } else return Promise.reject('Not implemented');
  }

  async getBooks(): Promise<BookInfo[]> {
    if (environment.appInfo.platform === 'dev') {
      return new Promise((resolve, reject) => {
        this.http.get<BookInfo[]>(replace(environment.api.books, this._bibleId)).subscribe({
          next: result => resolve(result),
          error: failure => reject(failure)
        });
      });
    } else if (environment.appInfo.platform === 'electron') {
      return new Promise((resolve, reject) => {
        this.http.get<BookInfo[]>(replace(environment.api.books, this._apiAddress, this._bibleId)).subscribe({
          next: result => resolve(result),
          error: failure => reject(failure)
        });
      });
    } else return Promise.reject('Not implemented');
  }

  async getBook(bookId: number): Promise<BookInfo> {
    if (environment.appInfo.platform === 'dev') {
      return new Promise((resolve, reject) => {
        this.http.get<BookInfo>(replace(environment.api.getBook, this._bibleId, bookId)).subscribe({
          next: result => resolve(result),
          error: failure => reject(failure)
        });
      });
    } else if (environment.appInfo.platform === 'electron') {
      return new Promise((resolve, reject) => {
        this.http.get<BookInfo>(replace(environment.api.getBook, this._apiAddress, this._bibleId, bookId)).subscribe({
          next: result => resolve(result),
          error: failure => reject(failure)
        });
      });
    } else return Promise.reject('Not implemented');
  }

  async getVerses(bookId: number, chapterId: number): Promise<VerseInfo[]> {
    if (environment.appInfo.platform === 'dev') {
      return new Promise((resolve, reject) => {
        this.http.get<VerseInfo[]>(replace(environment.api.verses, this._bibleId, bookId, chapterId)).subscribe({
          next: result => resolve(result),
          error: failure => reject(failure)
        });
      });
    } else if (environment.appInfo.platform === 'electron') {
      return new Promise((resolve, reject) => {
        this.http.get<VerseInfo[]>(replace(environment.api.verses, this._apiAddress, this._bibleId, bookId, chapterId)).subscribe({
          next: result => resolve(result),
          error: failure => reject(failure)
        });
      });
    } else return Promise.reject('Not implemented');
  }

  async getFavourites(): Promise<FavouriteInfo[]> {
    if (environment.appInfo.platform === 'dev') {
      return new Promise((resolve, reject) => {
        this.http.get<FavouriteInfo[]>(replace(environment.api.getFavourites, this._bibleId)).subscribe({
          next: result => resolve(result),
          error: failure => reject(failure)
        });
      });
    } else if (environment.appInfo.platform === 'electron') {
      return new Promise((resolve, reject) => {
        this.http.get<FavouriteInfo[]>(replace(environment.api.getFavourites, this._apiAddress, this._bibleId)).subscribe({
          next: result => resolve(result),
          error: failure => reject(failure)
        });
      });
    } else return Promise.reject('Not implemented');
  }

  async setFavourite(verse: VerseInfo): Promise<VerseUpdateResp> {
    if (environment.appInfo.platform === 'dev') {
      return new Promise((resolve, reject) => {
        this.http.put<VerseUpdateResp>(replace(environment.api.setFavourite, this._bibleId), verse).subscribe({
          next: result => resolve(result),
          error: failure => reject(failure)
        });
      });
    } else if (environment.appInfo.platform === 'electron') {
      return new Promise((resolve, reject) => {
        this.http.put<VerseUpdateResp>(replace(environment.api.setFavourite, this._apiAddress, this._bibleId), verse).subscribe({
          next: result => resolve(result),
          error: failure => reject(failure)
        });
      });
    } else return Promise.reject('Not implemented');
  }

  async setColor(verse: VerseInfo): Promise<VerseUpdateResp> {
    if (environment.appInfo.platform === 'dev') {
      return new Promise((resolve, reject) => {
        this.http.put<VerseUpdateResp>(replace(environment.api.setColors, this._bibleId), verse).subscribe({
          next: result => resolve(result),
          error: failure => reject(failure)
        });
      });
    } else if (environment.appInfo.platform === 'electron') {
      return new Promise((resolve, reject) => {
        this.http.put<VerseUpdateResp>(replace(environment.api.setColors, this._apiAddress, this._bibleId), verse).subscribe({
          next: result => resolve(result),
          error: failure => reject(failure)
        });
      });
    } else return Promise.reject('Not implemented');
  }

  async lookup(value: LookupValue): Promise<LookupResp[]> {
    value.searchFor = value.searchFor.trim();
    if (environment.appInfo.platform === 'dev') {
      return new Promise((resolve, reject) => {
        this.http.post<LookupResp[]>(replace(environment.api.lookup, this._bibleId), value).subscribe({
          next: result => resolve(result),
          error: failure => reject(failure)
        });
      });
    } else if (environment.appInfo.platform === 'electron') {
      return new Promise((resolve, reject) => {
        this.http.post<LookupResp[]>(replace(environment.api.lookup, this._apiAddress, this._bibleId), value).subscribe({
          next: result => resolve(result),
          error: failure => reject(failure)
        });
      });
    } else return Promise.reject('Not implemented');
  }

  async reportError(error: ErrorReport): Promise<ErrorReportResp> {
    if (error.errorTypeId <= 3) error.versionId = this._bibleId;
    if (environment.appInfo.platform === 'dev') {
      return new Promise((resolve, reject) => {
        this.http.post<ErrorReportResp>(environment.api.setError, error).subscribe({
          next: result => resolve(result),
          error: failure => reject(failure)
        });
      });
    } else if (environment.appInfo.platform === 'electron') {
      return new Promise((resolve, reject) => {
        this.http.post<ErrorReportResp>(replace(environment.api.setError, this._apiAddress), error).subscribe({
          next: result => resolve(result),
          error: failure => reject(failure)
        });
      });
    } else return Promise.reject('Not implemented');
  }
}
