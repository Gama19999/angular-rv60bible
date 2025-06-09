import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FadeComponent } from './fade/fade.component';
import { StartComponent } from './start/start.component';
import { BookCardComponent } from './start/book-pager/book-card/book-card.component';
import { BookPagerComponent } from './start/book-pager/book-pager.component';
import { ContentComponent } from './content/content.component';
import { ContentPagerComponent } from './content/content-pager/content-pager.component';
import { ContentCardComponent } from './content/content-pager/content-card/content-card.component';
import { VerseItemComponent } from './content/content-pager/content-card/verse-item/verse-item.component';
import { ChapterListComponent } from './content/chapter-list/chapter-list.component';
import { BookListComponent } from './content/book-list/book-list.component';
import { FavouritesComponent } from './shared/favourites/favourites.component';
import { FavItemComponent } from './shared/favourites/fav-item/fav-item.component';
import { InfoComponent } from './shared/info/info.component';
import { SettingsComponent } from './shared/settings/settings.component';
import { ChapterPipe } from './shared/pipes/chapter.pipe';
import { TestamentPipe } from './shared/pipes/testament.pipe';

@NgModule({
  declarations: [
    AppComponent,
    FadeComponent,
    StartComponent,
    BookCardComponent,
    BookPagerComponent,
    ContentComponent,
    ContentPagerComponent,
    ContentCardComponent,
    VerseItemComponent,
    ChapterListComponent,
    BookListComponent,
    FavouritesComponent,
    FavItemComponent,
    InfoComponent,
    SettingsComponent,
    TestamentPipe,
    ChapterPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
