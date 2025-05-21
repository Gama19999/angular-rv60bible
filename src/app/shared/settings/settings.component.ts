import { Component, OnInit } from '@angular/core';

import { strings_es } from '../../../assets/strings/strings-es';
import { PopupService } from '../../services/popup.service';

@Component({
  selector: 'app-settings',
  standalone: false,
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit {
  protected readonly s = strings_es;
  isFullScreen!: boolean;

  constructor(private popupSrv: PopupService) {}

  ngOnInit() {
    this.isFullScreen = this.popupSrv.isFullScreen;
  }

  closeSettings = () => this.popupSrv.settingsClosed.next();

  toggleScreenMode = () => this.isFullScreen = this.popupSrv.toggleScreenMode();

  exitApp = () => this.popupSrv.exitApp();
}
