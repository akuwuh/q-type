import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-caret',
  standalone: true,
  imports: [],
  template: `
    <div id="caret" class="text-2xl top-1.5 full-width default"></div>
  `,
  styleUrl: './caret.component.css'
})
export class CaretComponent {

	@Input() currentWord: number = 0;
	@Input() currentChar: number = 0;

	startAnimation(): void {

	}
	updatePosition(): void {
		
	}

	stopAnimation(): void {

	}
}
