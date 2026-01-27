import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

import { environment } from './environments/environment';

if (environment.appInfo.platform === 'cordova') {
  const cordovaJS = document.createElement('script');
  const mainJS = document.createElement('script');
  cordovaJS.src = 'cordova.js';
  mainJS.src = 'main.js';
  document.body.append(cordovaJS, mainJS);
}

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
