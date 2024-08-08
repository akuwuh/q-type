import { Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-caret',
  standalone: true,
  imports: [],
  template: `
    <div #caret id="caret" class="full-width default" [class.pace]="isActive" tabindex="-1"></div>
  `,
  styleUrl: './caret.component.scss'
})
export class CaretComponent {

	

	@Input() isActive: boolean = true;

	@ViewChild('caret') caret!: ElementRef;
	
	updatePosition(left: number, top: number): void {
		this.caret.nativeElement.style.left = `${left}px`;
		this.caret.nativeElement.style.top = `${top}px`;
	}
}
