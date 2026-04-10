import { CommonModule } from "@angular/common";
import { Component, ViewChild } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { IftaLabelModule } from "primeng/iftalabel";
import { InputMaskModule } from "primeng/inputmask";
import { InputTextModule } from "primeng/inputtext";
import { SiteConfig } from "../../models/SiteConfig";
import { NotificationService } from "../../services/notification.service";
import { PublicService } from "../../services/public.service";
import { SharedDataService } from "../../services/shared-data.service";
import { CaptchaComponent } from "../captcha/captcha.component";

@Component({
	selector: "app-hero-contact-form",
	imports: [CommonModule, ReactiveFormsModule, IftaLabelModule, InputMaskModule, InputTextModule, CaptchaComponent],
	templateUrl: "./hero-contact-form.component.html",
	styleUrl: "./hero-contact-form.component.scss",
})
export class HeroContactFormComponent {
	heroContactForm: FormGroup;
	siteConfig: SiteConfig = {} as SiteConfig;

	@ViewChild(CaptchaComponent) captchaComponent!: CaptchaComponent;

	constructor(
		private publicService: PublicService,
		private notificationService: NotificationService,
		private sharedDataService: SharedDataService,
	) {
		this.heroContactForm = new FormGroup({
			name: new FormControl("", Validators.required),
			email: new FormControl("", [Validators.required, Validators.email]),
			phone: new FormControl("", [Validators.required]),
			message: new FormControl("", Validators.required),
			termsAccepted: new FormControl(false, Validators.requiredTrue),
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
		this.siteConfig = this.sharedDataService.siteData();
	}

	submitHeroContactForm() {
		if (this.heroContactForm.invalid) {
			this.heroContactForm.markAllAsTouched();
			this.captchaComponent.reset();
			this.notificationService.showError("Please fill all required fields correctly.");
			return;
		}

		if (!this.captchaComponent.isCaptchaValid()) {
			this.notificationService.showError("Please solve the math problem correctly.");
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
				this.heroContactForm.patchValue({ termsAccepted: false });
				this.captchaComponent.reset();
			},
			error: () => {
				this.notificationService.showError("Failed to send message. Please try again later.");
			},
		});
	}
}
