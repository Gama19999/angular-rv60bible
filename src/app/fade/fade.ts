import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';
import { CacheService } from '../shared/services/cache.service';
import { Logo } from '../shared/svg/logo';

@Component({
  selector: 'app-fade',
  imports: [Logo],
  templateUrl: './fade.html',
  styleUrl: './fade.css',
})
export class Fade implements OnInit {
  appInfo = environment.appInfo;

  constructor(private cacheSrv: CacheService, private router: Router) {}

  ngOnInit(): void {
    if (this.cacheSrv.isFadeDone()) {
      this.router.navigate(['/', 'lobby'], { replaceUrl: true });
      return;
    }
    setTimeout(() => {
      this.cacheSrv.setFadeDone();
      this.router.navigate(['/', 'lobby'], { replaceUrl: true });
    }, 3000);
  }
}
