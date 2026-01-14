import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { NgStyle } from '@angular/common';
import { Subscription } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { ConfigService } from '../../services/config.service';
import { Theme } from '../../util/app.types';

@Component({
  selector: 'app-modal',
  imports: [NgStyle],
  templateUrl: './modal.html',
  styleUrl: './modal.css',
})
export class Modal implements OnInit, OnDestroy {
  private subs: Subscription[] = [];
  @Input('width') width: string = '50%';
  @Input('height') height: string = '30%';
  @Output('close') close: EventEmitter<void> = new EventEmitter();
  theme!: Theme;
  appContact = environment.appContact;
  appInfo = environment.appInfo;

  constructor(private configSrv: ConfigService) {}

  ngOnInit(): void {
    this.subs.push(this.configSrv.theme$.subscribe(val => this.theme = val));
  }

  closeModal() { this.close.emit(); }

  toggleTheme() {
    this.configSrv.toggleTheme();
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }
}
