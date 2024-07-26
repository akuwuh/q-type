import { Component, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-timer',
  standalone: true,
  imports: [],
  template: `
    <p>
      {{timeLeft}}
    </p>
  `,
  styleUrl: './timer.component.css'
})

export class TimerComponent {
	@Input() timeLeft: number;
	intervalId: any;

	@Output() timerFinished = new EventEmitter<void>();

	startTimer() {
		this.intervalId = setInterval(() => {
		  this.timeLeft--;
		  if (this.timeLeft === 0) {
			this.clearTimer();
			this.timerFinished.emit();  // Emit event when timer ends
		  }
		}, 1000);
	  }
	clearTimer() {
		clearInterval(this.intervalId);
	}


}	
