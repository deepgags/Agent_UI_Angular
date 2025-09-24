import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IftaLabelModule } from 'primeng/iftalabel';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
// import { Subscription } from 'rxjs';
import { SiteConfig } from '../../models/SiteConfig';
import { NotificationService } from '../../services/notification.service';
import { PublicService } from '../../services/public.service';
import { SiteConfigService } from '../../services/site-config.service';

@Component({
	selector: 'app-hero-contact-form',
	imports: [
		CommonModule,
		ReactiveFormsModule,
		IftaLabelModule,
		InputMaskModule,
		InputTextModule,
	],
	templateUrl: './hero-contact-form.component.html',
	styleUrl: './hero-contact-form.component.scss'
})
export class HeroContactFormComponent {
	heroContactForm: FormGroup;
	siteConfig: SiteConfig | undefined;
	// private siteConfigSubscription: Subscription | undefined;

	constructor(
		private publicService: PublicService,
		private notificationService: NotificationService,
		private siteConfigService: SiteConfigService,
	) {
		this.heroContactForm = new FormGroup({
			name: new FormControl("", Validators.required),
			email: new FormControl("", [Validators.required, Validators.email]),
			phone: new FormControl("", [Validators.required]),
			message: new FormControl("", Validators.required),
		});
	}

	get contactName() {
		return this.heroContactForm.get("name");
	}
	get contactEmail() {
		return this.heroContactForm.get("email");
	}
	get contactPhone() {
		return this.heroContactForm.get("phone");
	}
	get contactMessage() {
		return this.heroContactForm.get("message");
	}

	ngOnInit() {
		this.siteConfigService.currentConfig$.subscribe((config) => {
			if (config) {
				this.siteConfig = config;
			}
		});
	}

	submitHeroContactForm() {
		if (this.heroContactForm.invalid) {
			this.heroContactForm.markAllAsTouched();
			this.notificationService.showError("Please fill all required fields correctly.");
			return;
		}

		const params = {
			...this.heroContactForm.value,
			leadSource: "heroForm",
			siteId: this.siteConfig?.id,
		};
		this.publicService.submitContactForm(params).subscribe({
			next: () => {
				this.notificationService.showSuccess("Your message has been sent successfully.");
				this.heroContactForm.reset();
			},
			error: () => {
				this.notificationService.showError("Failed to send message. Please try again later.");
			},
		});
	}
}
