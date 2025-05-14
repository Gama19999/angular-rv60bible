import { Component, Input, OnInit } from '@angular/core';

import { strings_es } from '../../../assets/strings/strings-es';
import { environment } from '../../../environments/environment';
import { PopupService } from '../../services/popup.service';

@Component({
  selector: 'app-settings',
  standalone: false,
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit {
  protected readonly s = strings_es;
  @Input('view-name') viewName!: string;
  isMobile: boolean = environment.platform === 'mobile';
  isElectron: boolean = environment.platform === 'electron';
  isFullScreen!: boolean;

  constructor(private popupSrv: PopupService) {}

  ngOnInit() {
    this.isFullScreen = this.popupSrv.isFullScreen;
  }

  closeSettings = () => this.popupSrv.settingsClosed.next();

  toggleScreenMode = () => this.isFullScreen = this.popupSrv.toggleScreenMode();

  exitApp = () => this.popupSrv.exitApp();
}
