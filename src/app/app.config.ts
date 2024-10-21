import {
  ApplicationConfig,
  importProvidersFrom,
  isDevMode,
  provideZoneChangeDetection,
} from "@angular/core";
import { provideRouter } from "@angular/router";
import { provideHttpClient } from "@angular/common/http";
import { routes } from "./app.routes";
import { HttpClientInMemoryWebApiModule } from "angular-in-memory-web-api";
import { InmemoryService } from "./services/inmemory.service";
import { provideStore } from "@ngrx/store";
import { todosReducer } from "./store/store.reducers";
import { provideEffects } from "@ngrx/effects";
import { provideStoreDevtools } from "@ngrx/store-devtools";
import * as todoEffects from "./store/store.effects";

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(), // add prop withInterceptorsFromDi() if interceptores are required
    importProvidersFrom( // provide InMemoryWebApiModule after HttpClient
      HttpClientInMemoryWebApiModule.forRoot(InmemoryService, {
        passThruUnknownUrl: true,
      })
    ),
    provideStore({ appState: todosReducer }),
    provideEffects(todoEffects),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
      connectInZone: true,
    }),
  ],
};
