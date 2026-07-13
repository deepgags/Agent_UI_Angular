import { CommonModule } from "@angular/common";
import { Component, OnInit, ViewChild, signal } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { InputMaskModule } from "primeng/inputmask";
import { InputTextModule } from "primeng/inputtext";
import { CaptchaComponent } from "../../../components/captcha/captcha.component";
import { SiteConfig } from "../../../models/SiteConfig";
import { PhoneNumberFormatPipe } from "../../../pipes/phone-format";
import { NotificationService } from "../../../services/notification.service";
import { PublicService } from "../../../services/public.service";
import { SharedDataService } from "../../../services/shared-data.service";

@Component({
	selector: "app-join-us",
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule, InputMaskModule, InputTextModule, PhoneNumberFormatPipe, CaptchaComponent],
	templateUrl: "./join-us.component.html",
	styleUrl: "./join-us.component.scss",
})
export class JoinUsComponent implements OnInit {
	siteConfig: SiteConfig = {} as SiteConfig;
	isSubmitting = signal(false);

	@ViewChild(CaptchaComponent) captchaComponent!: CaptchaComponent;

	features = [
		{
			icon: "bi-people-fill",
			title: "Dedicated Broker Support",
			desc: "Experienced brokers and staff who are always here to guide, support, and help you succeed.",
		},
		{
			icon: "bi-display",
			title: "Powerful Technology",
			desc: "Modern tools that simplify your workload, save time, and help you deliver an exceptional client experience.",
		},
		{
			icon: "bi-mortarboard-fill",
			title: "Training & Education",
			desc: "Ongoing learning opportunities to sharpen your skills and keep you ahead in a competitive market.",
		},
		{
			icon: "bi-handshake",
			title: "Collaborative Culture",
			desc: "A positive, supportive community where agents collaborate, share knowledge, and celebrate each other's wins.",
		},
		{
			icon: "bi-graph-up-arrow",
			title: "Grow Your Business",
			desc: "Whether you're a new agent or a seasoned professional, you'll find the resources to reach your next level.",
		},
		{
			icon: "bi-heart-fill",
			title: "Community Focused",
			desc: "We believe in making a difference. Our agents are encouraged to give back and be active in the communities we serve.",
		},
	];

	userTypes = [
		{ title: "Seller",   value: "seller" },
		{ title: "Buyer",    value: "buyer" },
		{ title: "Tenant",   value: "tenant" },
		{ title: "Landlord", value: "landlord" },
		{ title: "Realtor",  value: "realtor" },
	];

	contactForm = new FormGroup({
		name:          new FormControl("", Validators.required),
		email:         new FormControl("", [Validators.required, Validators.email]),
		phone:         new FormControl("", Validators.required),
		message:       new FormControl("", Validators.required),
		userType:      new FormControl("seller", Validators.required),
		termsAccepted: new FormControl(false, Validators.requiredTrue),
	});

	constructor(
		private sharedDataService: SharedDataService,
		private publicService: PublicService,
		private notificationService: NotificationService,
	) {}

	ngOnInit() {
		this.siteConfig = this.sharedDataService.siteData();
	}

	get name()    { return this.contactForm.get("name"); }
	get email()   { return this.contactForm.get("email"); }
	get phone()   { return this.contactForm.get("phone"); }
	get message() { return this.contactForm.get("message"); }

	submit() {
		if (this.isSubmitting()) return;

		if (this.contactForm.invalid) {
			this.contactForm.markAllAsTouched();
			this.captchaComponent.reset();
			this.notificationService.showError("Please fill all required fields correctly.");
			return;
		}

		if (!this.captchaComponent.isCaptchaValid()) {
			this.notificationService.showError("Please solve the math problem correctly.");
			return;
		}

		const params = {
			...this.contactForm.value,
			leadSource: "contactForm",
			siteId: (this.siteConfig as any)?._id,
		};

		this.isSubmitting.set(true);
		this.publicService.submitContactForm(params).subscribe({
			next: () => {
				this.isSubmitting.set(false);
				this.notificationService.showSuccess("Your request has been submitted successfully.");
				this.contactForm.reset();
				this.contactForm.patchValue({ userType: "seller", termsAccepted: false });
				this.captchaComponent.reset();
			},
			error: () => {
				this.isSubmitting.set(false);
				this.notificationService.showError("Failed to submit request. Please try again later.");
			},
		});
	}
}
