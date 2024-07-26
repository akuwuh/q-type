import { Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-result',
  standalone: true,
  imports: [],
  template: `
    <p>
	  WPM: {{wpm}}
	  Raw WPM: {{raw}}
	  Accuracy: {{accuracy}}%
    </p>
  `,
  styleUrl: './result.component.css'
})
export class ResultComponent implements OnInit {
	@Input() correctWords: number;
	@Input() rawWords: number; 
	@Input() time: number;
	@Input() correctChars: number;
	@Input() totalChars: number;

	wpm: number = 0;
	raw: number = 0;
	accuracy: number = 0;
	
	ngOnInit (): void { // calculate here
		this.wpm = this.calculateWPM();
		this.raw = this.calculateRaw(); 
		this.accuracy = this.calculateAccuracy();
	}

	calculateWPM(): number {
		const numberOfWords = this.correctWords / 5;
		
		return Math.ceil((numberOfWords / (this.time)) * 60);
	}

	calculateRaw(): number {
		const numberOfWords = this.rawWords / 5;
		return Math.ceil((numberOfWords / (this.time)) * 60);
	}

	calculateAccuracy(): number {
		return Math.ceil((this.correctChars / this.totalChars) * 100);
	}
	
}
