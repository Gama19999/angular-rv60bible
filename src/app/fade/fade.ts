import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

import { environment } from '../../environments/environment';
import { CacheService } from '../shared/services/cache.service';
import { ConfigService } from '../shared/services/config.service';
import { StateService } from '../shared/services/state.service';
import { Logo } from '../shared/svg/logo';

@Component({
  selector: 'app-fade',
  imports: [Logo],
  templateUrl: './fade.html',
  styleUrl: './fade.css',
})
export class Fade implements OnInit, OnDestroy {
  private readonly titleSrv = inject(Title);
  private readonly router = inject(Router);
  private readonly cacheSrv = inject(CacheService);
  private readonly configSrv = inject(ConfigService);
  private readonly stateSrv = inject(StateService);
  private subs: Subscription[] = [];
  appInfo = environment.appInfo;

  constructor() { }

  ngOnInit(): void {
    this.subs.push(this.configSrv.language$.subscribe(lang => this.titleSrv.setTitle(lang.str.fade.title)));
    if (this.cacheSrv.isFadeDone()) {
      this.stateSrv.navigate('search', { replaceUrl: true });
    } else {
      setTimeout(() => {
        this.cacheSrv.setFadeDone();
        this.stateSrv.navigate('search', { replaceUrl: true });
      }, 1500);
    }
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }
}
