import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { BehaviorSubject, Subscription } from 'rxjs';

import { ConfigService } from '../../services/config.service';
import { PageType, Theme } from '../../util/app.types';

@Component({
  selector: 'app-single-page',
  imports: [AsyncPipe],
  templateUrl: './single-page.html',
  styleUrl: './single-page.css',
})
export class SinglePage implements OnInit, OnDestroy {
  private readonly configSrv = inject(ConfigService);
  private subs: Subscription[] = [];
  @Input('type') type!: PageType;
  theme!: Theme;
  smoothScroll$!: BehaviorSubject<boolean>;

  constructor() { }

  ngOnInit(): void {
    this.subs.push(this.configSrv.theme$.subscribe(val => this.theme = val));
    this.smoothScroll$ = this.configSrv.smoothScroll$;
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }
}
