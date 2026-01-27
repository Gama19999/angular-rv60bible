import { Component, OnDestroy, OnInit } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';

import { environment } from '../environments/environment';
import { BibleService } from './shared/services/bible.service';
import { ConfigService } from './shared/services/config.service';
import { Theme } from './shared/util/app.types';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
})
export class App implements OnInit, OnDestroy {
  private subs: Subscription[] = [];
  theme!: Theme;
  
  constructor(private metaSrv: Meta, private configSrv: ConfigService, private bibleSrv: BibleService) {}

  ngOnInit(): void {
    if (environment.appInfo.platform === 'electron') {
      this.metaSrv.addTag({
        httpEquiv: 'Content-Security-Policy',
        content: "default-src 'self'; connect-src 'self' http://127.0.0.1:*; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; media-src *; img-src 'self';"
      });
      window.electron.getServerAddress().then(val => this.bibleSrv.apiAddress = val);
    } else if (environment.appInfo.platform === 'cordova') {
      this.metaSrv.addTag({
        httpEquiv: 'Content-Security-Policy',
        content: "default-src 'self' https://ssl.gstatic.com; connect-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; media-src *; img-src 'self';"
      });
      this.metaSrv.updateTag({
        name: 'viewport',
        content: 'user-scalable=yes, initial-scale=1, maximum-scale=3, minimum-scale=1, width=device-width, height=device-height'
      });
    }
    this.subs.push(this.configSrv.theme$.subscribe(val => this.theme = val));
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }
}
