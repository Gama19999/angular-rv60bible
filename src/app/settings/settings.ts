import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AsyncPipe, KeyValuePipe } from '@angular/common';
import { BehaviorSubject, Subscription } from 'rxjs';

import { environment } from '../../environments/environment';
import { BackendService } from '../shared/services/backend.service';
import { ConfigService } from '../shared/services/config.service';
import { StateService } from '../shared/services/state.service';
import { Language, ViewTrack } from '../shared/util/app.interfaces';
import { Theme } from '../shared/util/app.types';

@Component({
  selector: 'app-settings',
  imports: [AsyncPipe, KeyValuePipe],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class Settings implements OnInit, OnDestroy {
  private readonly backendSrv = inject(BackendService);
  private readonly configSrv = inject(ConfigService);
  private readonly stateSrv = inject(StateService);
  private subs: Subscription[] = [];
  lang!: Language;
  theme$!: BehaviorSubject<Theme>;
  verseFontSize$!: BehaviorSubject<number>;
  tagsOn$!: BehaviorSubject<boolean>;
  smoothScroll$!: BehaviorSubject<boolean>;
  displayCanSleep$: BehaviorSubject<boolean> | undefined;
  viewTrack$!: BehaviorSubject<ViewTrack>;
  appInfo = environment.appInfo;
  appContact = environment.appContact;
  resourcesOn = false;

  constructor() { }

  ngOnInit(): void {
    this.subs.push(this.configSrv.language$.subscribe(lang => this.lang = lang));
    this.theme$ = this.configSrv.theme$;
    this.verseFontSize$ = this.configSrv.verseFontSize$;
    this.tagsOn$ = this.configSrv.tagsOn$;
    this.smoothScroll$ = this.configSrv.smoothScroll$;
    this.displayCanSleep$ = this.configSrv.displayCanSleep$;
    this.viewTrack$ = this.stateSrv.viewTrack$;
  }

  closeSettings = () => this.stateSrv.settingsOn$.next(false);

  toggleTheme = () => this.configSrv.toggleTheme();

  biggerFS() {
    const fs = this.verseFontSize$.value + 0.1;
    this.configSrv.setVerseFontSize(fs > 4.0 ? +(4.0).toFixed(1) : +fs.toFixed(1)); 
  }

  smallerFS() {
    const fs = this.verseFontSize$.value - 0.1;
    this.configSrv.setVerseFontSize(fs < 1.0 ? +(1.0).toFixed(1) : +(fs).toFixed(1)); 
  }

  toggleTags = () => this.configSrv.toggleTags();

  toggleSmoothScroll = () => this.configSrv.toggleSmoothScroll();

  toggleDisplaySleep = () => this.configSrv.toggleDisplaySleep();

  defragment = () => this.backendSrv.defragment().then(res => console.log(res));

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }
}
