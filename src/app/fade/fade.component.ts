import { AfterViewInit, Component } from '@angular/core';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';

@Component({
  selector: 'app-fade',
  standalone: false,
  templateUrl: './fade.component.html',
  styleUrl: './fade.component.css'
})
export class FadeComponent implements AfterViewInit {
  appName: string = environment.appName;
  icon: string = environment.icons + 'ic_color.webp';

  constructor(private router: Router) {}

  ngAfterViewInit() {
    setTimeout(() => this.router.navigate(['/', 'start'], {replaceUrl: true}), 3000);
  }
}
