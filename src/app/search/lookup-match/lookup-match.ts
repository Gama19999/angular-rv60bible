import { Component, ElementRef, inject, Input, ViewChild } from '@angular/core';

import { BackendService } from '../../shared/services/backend.service';
import { StateService } from '../../shared/services/state.service';
import { LookupResp } from '../../shared/util/app.interfaces';
import { openTargetWith } from '../../shared/util/app.util';

@Component({
  selector: 'app-lookup-match',
  imports: [],
  templateUrl: './lookup-match.html',
  styleUrl: './lookup-match.css',
})
export class LookupMatch {
  private readonly backendSrv = inject(BackendService);
  private readonly stateSrv = inject(StateService);
  @Input('data') data!: LookupResp;  
  @ViewChild('match') match!: ElementRef<HTMLDivElement>;

  constructor() { }

  openMatch() {
    openTargetWith(this.match.nativeElement, this.backendSrv.versionKey$.value, this.stateSrv);
  }
}
