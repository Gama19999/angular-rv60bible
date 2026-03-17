import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

import { environment } from '../../../environments/environment';
import { CacheService } from './cache.service';
import { ConfigService } from './config.service';
import { BibleData, BookData, VerseData, FavouriteData, UpdateResp, InsertResp, LookupValue, LookupResp, ClientReport } from '../util/app.interfaces';

@Injectable({ providedIn: 'root' })
export class BackendService {
  private readonly http = inject(HttpClient);
  private readonly cacheSrv = inject(CacheService);
  private readonly configSrv = inject(ConfigService);
  private versionKey: string;
  versionKey$: BehaviorSubject<string>;

  constructor() {
    this.versionKey = this.cacheSrv.getVersionKey();
    this.cacheSrv.setVersionKey(this.versionKey);
    this.versionKey$ = new BehaviorSubject(this.versionKey);
  }

  setVersionKey(versionKey: string) {
    this.versionKey = versionKey;
    this.cacheSrv.setVersionKey(versionKey);
    this.versionKey$.next(this.versionKey);
  }

  async versions(): Promise<BibleData[]> {
    switch (environment.appInfo.platform) {
      case 'dev':
      case 'electron':
        return new Promise((resolve, reject) => {
          this.http.get<BibleData[]>(environment.api.versions()).subscribe({
            next: result => resolve(result ?? []),
            error: failure => reject(failure)
          });
        });
      case 'cordova': return await window.apacheCdv.versions();
      default: return Promise.reject();
    }
  }

  async getVersion(): Promise<BibleData> {
    switch (environment.appInfo.platform) {
      case 'dev':
      case 'electron':
        return new Promise((resolve, reject) => {
          this.http.get<BibleData>(environment.api.getVersion(this.versionKey)).subscribe({
            next: result => {
              this.configSrv.setLang(result.lang);
              resolve(result);
            },
            error: failure => reject(failure)
          });
        });
      case 'cordova': return (await window.apacheCdv.getVersion(this.versionKey))[0]; // TODO Refactor this response - wft ()[0] ?????
      default: return Promise.reject();
    }
  }

  async getBooks(): Promise<BookData[]> {
    switch (environment.appInfo.platform) {
      case 'dev':
      case 'electron':
        return new Promise((resolve, reject) => {
          this.http.get<BookData[]>(environment.api.books(this.versionKey)).subscribe({
            next: result => resolve(result ?? []),
            error: failure => reject(failure)
          });
        });
      case 'cordova': return await window.apacheCdv.books(this.versionKey);
      default: return Promise.reject();
    }
  }

  async getBook(bookId: number): Promise<BookData> {
    switch (environment.appInfo.platform) {
      case 'dev':
      case 'electron':
        return new Promise((resolve, reject) => {
          this.http.get<BookData>(environment.api.getBook(this.versionKey, +bookId)).subscribe({
            next: result => resolve(result),
            error: failure => reject(failure)
          });
        });
      case 'cordova': return (await window.apacheCdv.getBook(this.versionKey, +bookId))[0]; // TODO Refactor this response - wft ()[0] ?????
      default: return Promise.reject();
    }
  }

  async getVerses(bookId: number, chapterId: number): Promise<VerseData[]> {
    switch (environment.appInfo.platform) {
      case 'dev':
      case 'electron':
        return new Promise((resolve, reject) => {
          this.http.get<VerseData[]>(environment.api.verses(this.versionKey, +bookId, +chapterId)).subscribe({
            next: result => resolve(result ?? []),
            error: failure => reject(failure)
          });
        });
      case 'cordova': return await window.apacheCdv.verses(this.versionKey, +bookId, +chapterId);
      default: return Promise.reject();
    }
  }

  async favourites(): Promise<FavouriteData[]> {
    switch (environment.appInfo.platform) {
      case 'dev':
      case 'electron':
        return new Promise((resolve, reject) => {
          this.http.get<FavouriteData[]>(environment.api.favourites(this.versionKey)).subscribe({
            next: result => resolve(result ?? []),
            error: failure => reject(failure)
          });
        });
      case 'cordova': return await window.apacheCdv.favourites(this.versionKey);
      default: return Promise.reject();
    }
  }

  async addFavourite(verse: VerseData): Promise<InsertResp> {
    switch (environment.appInfo.platform) {
      case 'dev':
      case 'electron':
        return new Promise((resolve, reject) => {
          this.http.post<InsertResp>(environment.api.favourites(this.versionKey), verse).subscribe({
            next: result => resolve(result),
            error: failure => reject(failure)
          });
        });
      case 'cordova': return await window.apacheCdv.addFavourite(this.versionKey, verse);
      default: return Promise.reject();
    }
  }

  async removeFavourite(favouriteId: number): Promise<UpdateResp> {
    switch (environment.appInfo.platform) {
      case 'dev':
      case 'electron':
        return new Promise((resolve, reject) => {
          this.http.delete<UpdateResp>(environment.api.singleFavourite(this.versionKey, +favouriteId)).subscribe({
            next: result => resolve(result),
            error: failure => reject(failure)
          });
        });
      case 'cordova': return await window.apacheCdv.removeFavourite(this.versionKey, +favouriteId);
      default: return Promise.reject();
    }
  }

  async updateColor(verse: VerseData): Promise<UpdateResp> {
    switch (environment.appInfo.platform) {
      case 'dev':
      case 'electron':
        return new Promise((resolve, reject) => {
          this.http.put<UpdateResp>(environment.api.singleFavourite(this.versionKey, +verse.favouriteId), verse).subscribe({
            next: result => resolve(result),
            error: failure => reject(failure)
          });
        });
      case 'cordova': return await window.apacheCdv.updateColor(this.versionKey, +verse.favouriteId, verse);
      default: return Promise.reject();
    }
  }

  async lookup(value: LookupValue): Promise<LookupResp[]> {
    value.searchFor = value.searchFor.trim();
    switch (environment.appInfo.platform) {
      case 'dev':
      case 'electron':
        return new Promise((resolve, reject) => {
          this.http.post<LookupResp[]>(environment.api.lookup(this.versionKey), value).subscribe({
            next: result => resolve(result ?? []),
            error: failure => reject(failure)
          });
        });
      case 'cordova': return await window.apacheCdv.lookup(this.versionKey, value);
      default: return Promise.reject();
    }
  }

  async addReport(report: ClientReport): Promise<InsertResp> {
    switch (environment.appInfo.platform) {
      case 'dev':
      case 'electron':
        return new Promise((resolve, reject) => {
          this.http.post<InsertResp>(environment.api.reports(), report).subscribe({
            next: result => resolve(result),
            error: failure => reject(failure)
          });
        });
      case 'cordova': return await window.apacheCdv.addReport(report);
      default: return Promise.reject();
    }
  }

  async defragment(): Promise<UpdateResp> {
    switch (environment.appInfo.platform) {
      case 'dev':
      case 'electron':
        return new Promise((resolve, reject) => {
          this.http.get<UpdateResp>(environment.api.defragment()).subscribe({
            next: result => resolve(result),
            error: failure => reject(failure)
          });
        });
      case 'cordova': return await window.apacheCdv.defragment();
      default: return Promise.reject();
    }
  }
}