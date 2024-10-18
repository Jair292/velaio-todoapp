import { isDevMode, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InmemoryService } from './services/inmemory.service';
import { HeaderComponent } from './components/header/header.component';
import { provideStore } from '@ngrx/store';
import { todosReducer } from './store/store.reducers';
import { provideEffects } from '@ngrx/effects';
import * as todoEffects from  './store/store.effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    HeaderComponent,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    HttpClientInMemoryWebApiModule.forRoot(InmemoryService, { delay: 500 }),
  ],
  providers: [
    provideStore({ appState: todosReducer }),
    provideEffects(todoEffects),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
    }),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
