import { Component, inject, input, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';

import { ConfigService } from '../services/config.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-btn-books',
  imports: [AsyncPipe],
  templateUrl: './btn-books.html',
  styleUrl: './btn-all.css',
})
export class BtnBooks implements OnInit {
  private readonly configSrv = inject(ConfigService);
  tag = input('tag');
  tagsOn$!: BehaviorSubject<boolean>;

  constructor() { }

  ngOnInit(): void {
    this.tagsOn$ = this.configSrv.tagsOn$;
  }
}
