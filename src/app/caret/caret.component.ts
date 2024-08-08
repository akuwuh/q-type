import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-caret',
  standalone: true,
  imports: [],
  template: `
    <div #caret id="caret" class="default" [class.pace]="isActive" tabindex="-1"></div>
  `,
  styleUrl: './caret.component.scss'
})
export class CaretComponent implements OnInit {

	ngOnInit(): void {
      this.updatePosition(6,6);
  }

	@Input() isActive: boolean = true;

	@ViewChild('caret') caret!: ElementRef;
	
	updatePosition(left: number, top: number): void {
		this.caret.nativeElement.style.left = `${left}px`;
		this.caret.nativeElement.style.top = `${top}px`;
	}
}
