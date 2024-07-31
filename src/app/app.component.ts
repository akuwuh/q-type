import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GameComponent } from './game/game.component';
import { DurationComponent } from './duration/duration.component';
import { trigger, state, style, animate, transition, query, group } from '@angular/animations';
   

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, GameComponent, DurationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
	title = 'q-type';
	
}
