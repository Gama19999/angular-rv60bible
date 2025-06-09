import { Component, Input, OnInit } from '@angular/core';

import { strings_es } from '../../../assets/strings/strings-es';
import { PopupService } from '../../services/popup.service';
import { VerseService } from '../../services/verse.service';

@Component({
  selector: 'app-settings',
  standalone: false,
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit {
  protected readonly s = strings_es;
  @Input('verse-limit-op') verseLimitOp: boolean = false;
  isFullScreen!: boolean;
  verseLimit: string = '';

  constructor(private popupSrv: PopupService, private verseSrv: VerseService) {}

  ngOnInit() {
    this.isFullScreen = this.popupSrv.isFullScreen;
    this.verseLimit = this.verseSrv.fetchLimit.toString();
  }

  closeSettings = () => this.popupSrv.settingsClosed.next();

  toggleScreenMode = () => this.isFullScreen = this.popupSrv.toggleScreenMode();

  fetchLimitUpd = () => this.verseSrv.fetchLimit = +this.verseLimit;

  exitApp = () => this.popupSrv.exitApp();
}
