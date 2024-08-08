import { Component, Input, OnInit} from '@angular/core';
// import { trigger, state, style, animate, transition, query, group } from '@angular/animations';


@Component({
  selector: 'app-result',
  standalone: true,
  imports: [],
  template: `
	<div id="results" class="container grid sm:grid-cols-3 m-0 p-0 min-w-min grid-cols-1 auto-rows-min gap-y-5 sm:gap-0">
		@for (result of results; track $index) {
			<div class="inline-block" >
				<span class="flex m-0 p-0 justify-center border-hidden sm:border-solid" [class.borderLol]="result.name === 'acc'">
					<h1 class="relative m-0 p-0 text-8xl font-medium">
						{{result.value}}
					</h1>
				</span>
				<span class="relative flex m-0 p-0 justify-center">
					<h3 class="relative m-0 p-0 text-lg font-extralight">
						{{result.name}}
					</h3>
				</span>
				@if (result.name=== 'wpm') {
					<span class="relative flex m-0 p-0 justify-center ">
						<h3 class="relative m-0 p-0.5 text-sm font-thin opacity-45 tracking-wider">
							{{this.raw}} raw
						</h3>
					</span>
				}
			</div>
			
		}

	</div>
  `,
  styleUrl: './result.component.scss',
})
export class ResultComponent implements OnInit {
	@Input() correctWords: number;
	@Input() rawWords: number; 
	@Input() time: number;
	@Input() correctChars: number;
	@Input() totalChars: number;

	results: any[] = [];

	wpm: number = 0;
	raw: number = 0;
	accuracy: number = 0;
	
	ngOnInit (): void { // calculate here
		this.wpm = this.calculateWPM();
		this.raw = this.calculateRaw(); 
		this.accuracy = this.calculateAccuracy();
		this.results = [
			{	
				id: 1,
				name: 'wpm',
				value: this.wpm
			},
			{
				id: 2,
				name: 'acc',
				value: this.accuracy + "%"
			},
			{
				id: 3,
				name: 'secs',
				value: this.time
			}
		]
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
		if (this.totalChars === 0) {
			return 0;
		}
		return Math.ceil((this.correctChars / this.totalChars) * 100);
	}
	
}
