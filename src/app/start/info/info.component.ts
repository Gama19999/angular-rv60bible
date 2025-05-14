import { Component } from '@angular/core';

import { strings_es } from '../../../assets/strings/strings-es';
import { environment } from '../../../environments/environment';
import { PopupService } from '../../services/popup.service';

@Component({
  selector: 'app-info',
  standalone: false,
  templateUrl: './info.component.html',
  styleUrl: './info.component.css'
})
export class InfoComponent {
  protected readonly s = strings_es;
  isMobile: boolean = environment.platform === 'mobile';
  appName: string = environment.appName;
  iasd_logo: string = environment.icons + 'iasd_black.webp';
  version: string = 'v. ' + environment.version;

  constructor(private popupService: PopupService) {}

  closeInfo = () => this.popupService.infoClosed.next();
}
