import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {AppModule} from './app/app.module';
import {environment} from './environments/environment';

if (environment.production) {
    enableProdMode();
}

/*
bootsrap process for the browser. there are many other as for eg. mobile applications
 */
platformBrowserDynamic().bootstrapModule(AppModule)
    .catch(err => console.error(err));
