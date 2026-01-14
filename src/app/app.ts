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
  styleUrl: './app.css',
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
    }
    this.subs.push(this.configSrv.theme$.subscribe(val => this.theme = val));
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }
}
