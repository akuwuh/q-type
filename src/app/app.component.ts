import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GameComponent } from './game/game.component';
import { DurationComponent } from './duration/duration.component';
import { trigger, state, style, animate, transition, query, group } from '@angular/animations';
import { Store } from '@ngrx/store';
import { AppState } from './ngrx/app.state';
import { selectGame, selectGameStatus, selectRestart } from './ngrx/game/game.selectors';
import { CommonModule } from '@angular/common';
import { generateShuffled } from './utils/wordList';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, GameComponent, DurationComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})

export class AppComponent implements OnInit  {
	title = 'q-type';
  showGame = true;
  gameState$ = this.store.select(selectRestart);
  wordList: string[] = [];
  ngOnInit(): void {
    this.wordList = generateShuffled();
    this.gameState$.subscribe({
      next: (state) => {
          if (state) {
            this.rerender();
          }
      }
    });
  }

  constructor(private store: Store<AppState>, private changeDetector: ChangeDetectorRef) {
  
  }


  rerender(): void {
    this.showGame = false;
    this.wordList = generateShuffled(); 
    this.changeDetector.detectChanges();
    this.showGame = true;
  } 
}
