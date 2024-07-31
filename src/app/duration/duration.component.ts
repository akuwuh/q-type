import { Component } from '@angular/core';

@Component({
  selector: 'app-duration',
  standalone: true,
  imports: [],
  templateUrl: './duration.component.html',
  styleUrl: './duration.component.css'
})
export class DurationComponent {
    durationOptions = [
		{
		  label: '15s',
		  value: '15',
		  name: 'test-duration',
		  checked: 'checked',
		  id: 'one',
		},
		{
		  label: '30s',
		  value: '30',
		  name: 'test-duration',
		  checked: '',
		  id: 'two',
		},
		{
		  label: '60s',
		  value: '60',
		  name: 'test-duration',
		  checked: '',
		  id: 'three',
		},
		{
		  label: '120',
		  value: '120s',
		  name: 'test-duration',
		  checked: '',
		  id: 'four',
		}
	  ];
}
