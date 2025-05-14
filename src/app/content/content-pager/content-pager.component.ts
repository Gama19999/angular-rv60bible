import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { environment } from '../../../environments/environment';
import { VerseService } from '../../services/verse.service';

@Component({
  selector: 'app-content-pager',
  standalone: false,
  templateUrl: './content-pager.component.html',
  styleUrl: './content-pager.component.css'
})
export class ContentPagerComponent implements OnInit, OnDestroy {
  private cpcSubs: Subscription | undefined;
  inTransition: boolean = false;
  isMobile: boolean = environment.platform === 'mobile';

  constructor(private verseSrv: VerseService) {}

  ngOnInit() {
    this.cpcSubs = this.verseSrv.contentPageChange.subscribe(() => this.toggleTransition());
  }

  toggleTransition() {
    this.inTransition = true;
    setTimeout(() => this.inTransition = false, 200);
  }

  ngOnDestroy() {
    this.cpcSubs?.unsubscribe();
  }

}
