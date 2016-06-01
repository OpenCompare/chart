import { bootstrap } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { ChartAppComponent, environment } from './app/';
import { HTTP_PROVIDERS } from '@angular/http';
import 'rxjs/Rx'; // For using methods on observables



if (environment.production) {
  enableProdMode();
}

bootstrap(ChartAppComponent, [HTTP_PROVIDERS]);

