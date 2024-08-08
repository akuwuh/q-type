import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';

import { provideStore } from '@ngrx/store';
import { provideAnimations } from '@angular/platform-browser/animations';
import { gameReducer } from './ngrx/game/game.reducers';


export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideStore({game: gameReducer}), provideAnimations()]
};
