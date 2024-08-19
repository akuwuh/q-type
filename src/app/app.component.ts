import { ApplicationRef, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild, afterNextRender, inject} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GameComponent } from './game/game.component';
import { DurationComponent } from './duration/duration.component';
import { Store } from '@ngrx/store';
import { AppState } from './ngrx/app.state';
import { selectRestart } from './ngrx/game/game.selectors';
import { CommonModule } from '@angular/common';
import { wordList } from './utils/wordList';
// import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

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

  appref = inject(ApplicationRef)
  
  constructor(private store: Store<AppState>, private changeDetector: ChangeDetectorRef) {

    afterNextRender(() => {
      setTimeout(() => {
        this.app.nativeElement.style.visibility = 'visible';
      }, 50);
  
    })
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

