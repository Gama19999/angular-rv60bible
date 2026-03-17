import { Component, inject, input, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

import { ConfigService } from '../services/config.service';

@Component({
  selector: 'app-btn-config',
  imports: [AsyncPipe],
  templateUrl: './btn-config.html',
  styleUrl: './btn-all.css',
})
export class BtnConfig implements OnInit {
  private readonly configSrv = inject(ConfigService);
  tag = input('tag');
  tagsOn$!: BehaviorSubject<boolean>;

  constructor() { }

  ngOnInit(): void {
    this.tagsOn$ = this.configSrv.tagsOn$;
  }
}
