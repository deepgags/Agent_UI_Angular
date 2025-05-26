import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Pages } from '../../../enums/pages';
import { CustomerService } from '../../../services/customer.service';
import { LoadingService } from '../../../services/loading.service';
import { NotificationService } from '../../../services/notification.service';

@Component({
	selector: 'app-verify-email',
	imports: [ReactiveFormsModule],
	templateUrl: './verify-email.component.html',
	styleUrl: './verify-email.component.scss'
})
export class VerifyEmailComponent  implements OnInit {
	email: string = '';

	verifyEmailForm: FormGroup
	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private loadingService: LoadingService,
		private titleService: Title,
		private customerService: CustomerService,
		private notificationService: NotificationService,
	) {
		this.titleService.setTitle("Verify your account")
		this.verifyEmailForm = new FormGroup({
			email: new FormControl('', [Validators.required, Validators.email]),
			authCode: new FormControl('', [Validators.required]),
		});
	}

	ngOnInit(): void {
		this.activatedRoute.queryParams.subscribe(params => {
			this.email = params['email'] || '';
			this.verifyEmailForm.patchValue({
				email: this.email
			});
		});
	}

	submitVerificationCode() {
		if (this.verifyEmailForm.valid) {
			// Handle the form submission
			const { email, authCode } = this.verifyEmailForm.value;
			const params = {
				emailAddress: email,
				authCode: authCode
			}

			this.loadingService.loadingOn();
			this.customerService.verifyEmail(params).subscribe({
				next: (res: any) => {
					this.loadingService.loadingOff();
					this.router.navigate([Pages.LOGIN]);
					this.notificationService.showNotification(res.message);
				},
				error: (error: any) => {
					this.loadingService.loadingOff();
					this.notificationService.showNotification(error.error.message);
				}
			});
		}
	}
}
