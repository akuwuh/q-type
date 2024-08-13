import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GameComponent } from './game/game.component';
import { DurationComponent } from './duration/duration.component';
import { trigger, state, style, animate, transition, query, group } from '@angular/animations';
import { Store } from '@ngrx/store';
import { AppState } from './ngrx/app.state';
import { selectRestart } from './ngrx/game/game.selectors';
import { CommonModule } from '@angular/common';
import { wordList } from './utils/wordList';

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
  wordListGame: string[] = [];
  ngOnInit(): void {
    this.wordListGame = wordList;
    this.shuffle();
    this.gameState$.subscribe({
      next: (state) => {
          if (state) {
            this.rerender();
          }
      }
    });
  }
  @ViewChild('app') app!: ElementRef;
  constructor(private store: Store<AppState>, private changeDetector: ChangeDetectorRef) {
  }
  ngAfterViewInit(): void { 
    this.app.nativeElement.style.visibility = 'visible';
  }

  rerender(): void {
    this.showGame = false;
    this.shuffle();
    this.changeDetector.detectChanges();
    this.showGame = true;
  } 
  
  shuffle(): void {
    this.wordListGame = wordList
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)
  }
}

