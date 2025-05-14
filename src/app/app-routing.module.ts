import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FadeComponent } from './fade/fade.component';
import { StartComponent } from './start/start.component';
import { ContentComponent } from './content/content.component';

const routes: Routes = [
  { path: 'fade', component: FadeComponent, title: 'RV60 | Cargando...' },
  { path: 'start', component: StartComponent, title: 'RV60 | Inicio' },
  { path: 'content/:booknum/:bookabr', component: ContentComponent },
  { path: '', redirectTo: 'fade', pathMatch: 'full' },
  { path: '**', redirectTo: 'fade' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
