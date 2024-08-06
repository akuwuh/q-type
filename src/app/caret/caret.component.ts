import { Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-caret',
  standalone: true,
  imports: [],
  template: `
    <div #caret id="caret" class="full-width default" [class.pace]="isActive"></div>
  `,
  styleUrl: './caret.component.css'
})
export class CaretComponent {

	

	@Input() isActive: boolean = true;

	@ViewChild('caret') caret!: ElementRef;
	
	updatePosition(left: number, top: number): void {
		this.caret.nativeElement.style.left = `${left}px`;
		this.caret.nativeElement.style.top = `${top}px`;
	}
}
