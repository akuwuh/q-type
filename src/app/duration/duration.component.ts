import { Component, OnInit, Inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../ngrx/app.state';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DOCUMENT } from '@angular/common';

import { durationChange } from '../ngrx/game/game.actions';


@Component({
  selector: 'app-duration',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './duration.component.html',
  styleUrl: './duration.component.scss'
})

export class DurationComponent implements OnInit {
	constructor (private fb: FormBuilder, private store: Store<AppState>) {
		
	}

	duration: number;
	ngOnInit(): void {
		this.duration = 15;
		this.durationForm = this.fb.group({
			duration: [15, [Validators.required]]
		})

		this.store.dispatch(durationChange({duration: this.duration}));

	}
    durationOptions = [
		{
		  label: '15',
		  value: 15,
		},
		{
		  label: '30',
		  value: 30,
		},
		{
		  label: '60',
		  value: 60,
		},
		{
		  label: '120',
		  value: 120,
		}
	];
	public durationForm!: FormGroup;

	onChange(): void {
		this.duration = this.durationForm.value.duration;
		console.log(this.duration);
		console.log(this.duration);
		this.store.dispatch(durationChange({duration: this.duration}));
	}
}
