import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription} from 'rxjs';

import { strings_es } from '../../assets/strings/strings-es';
import { environment } from '../../environments/environment';
import { BookService } from '../services/book.service';
import { PopupService } from '../services/popup.service';
import { InfoComponent } from './info/info.component';
import { SettingsComponent } from '../shared/settings/settings.component';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './start.component.html',
  styleUrl: './start.component.css'
})
export class StartComponent implements OnInit, OnDestroy {
  private infoStateSubs: Subscription | undefined;
  private settingsStateSubs: Subscription | undefined;
  private infoState: boolean = false;
  private settingsState: boolean = false;
  protected readonly s = strings_es;
  iasd_logo: string = environment.icons + 'iasd_black.webp';
  infoComp: any;
  settingsComp: any;

  constructor(private bookSrv: BookService, private popupSrv: PopupService) {}

  ngOnInit() {
    this.bookSrv.loadAllBooks();
    this.infoStateSubs = this.popupSrv.infoClosed.subscribe(() => this.toggleInfo());
    this.settingsStateSubs = this.popupSrv.settingsClosed.subscribe(() => this.toggleSettings());
  }

  toggleInfo() {
    this.infoState = !this.infoState;
    this.infoComp = this.infoState ? InfoComponent : undefined;
  }

  toggleSettings() {
    this.settingsState = !this.settingsState;
    this.settingsComp = this.settingsState ? SettingsComponent : undefined;
  }

  ngOnDestroy() {
    this.infoStateSubs?.unsubscribe();
    this.settingsStateSubs?.unsubscribe();
  }
}
