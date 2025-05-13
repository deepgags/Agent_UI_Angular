import { Location } from '@angular/common';
import { Component } from '@angular/core';

@Component({
	selector: 'app-forgot',
	imports: [],
	templateUrl: './forgot.component.html',
	styleUrl: './forgot.component.scss'
})
export class ForgotComponent {


	constructor(private location: Location) {
	}

	back() {
		this.location.back();
	}
}
