import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { strings_es } from '../../assets/strings/strings-es';
import { environment } from '../../environments/environment';
import { BookService } from '../services/book.service';
import { PopupService } from '../services/popup.service';
import { InfoComponent } from '../shared/info/info.component';
import { SettingsComponent } from '../shared/settings/settings.component';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './start.component.html',
  styleUrl: './start.component.css'
})
export class StartComponent implements OnInit, OnDestroy {
  private infoOpenSubs: Subscription | undefined;
  private settOpenSubs: Subscription | undefined;
  protected readonly s = strings_es;
  iasd_logo: string = environment.icons + 'iasd_black.webp';
  infoComp: any;
  infoOpen: boolean = false;
  settComp: any;
  settOpen: boolean = false;
  favoOpen: boolean = false;

  constructor(private bookSrv: BookService, private popupSrv: PopupService) {}

  ngOnInit() {
    this.bookSrv.loadAllBooks();
    this.infoOpenSubs = this.popupSrv.infoClosed.subscribe(() => this.toggleInfo());
    this.settOpenSubs = this.popupSrv.settingsClosed.subscribe(() => this.toggleSettings());
  }

  toggleInfo() {
    this.infoOpen = !this.infoOpen;
    this.infoComp = this.infoOpen ? InfoComponent : undefined;
  }

  toggleFavourites() {
    this.favoOpen = !this.favoOpen;
  }

  toggleSettings() {
    this.settOpen = !this.settOpen;
    this.settComp = this.settOpen ? SettingsComponent : undefined;
  }

  ngOnDestroy() {
    this.infoOpenSubs?.unsubscribe();
    this.settOpenSubs?.unsubscribe();
  }
}
