import { CommonModule } from "@angular/common";
import { Component, signal } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { InputMaskModule } from "primeng/inputmask";
import { InputTextModule } from "primeng/inputtext";
import { NotificationService } from "../../../services/notification.service";
import { PublicService } from "../../../services/public.service";

@Component({
	selector: "app-deal-centre",
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule, InputTextModule, InputMaskModule],
	templateUrl: "./deal-centre.component.html",
	styleUrl: "./deal-centre.component.scss",
})
export class DealCentreComponent {
	isSubmitting = signal(false);
	submitted = signal(false);
	currentYear = new Date().getFullYear();
	openFaq: number | null = null;

	faqItems = [
		{ q: "How long does it take to build my website?", a: "Most websites are set up and live within 24–48 hours after we receive your information and branding assets." },
		{ q: "Can I use my own domain name?", a: "Yes! You can connect any existing domain name to your Deal Centre website, or we can help you register one." },
		{ q: "Can I edit my website myself?", a: "Absolutely. Our easy-to-use admin dashboard lets you update content, listings, images, and pages anytime without any technical knowledge." },
		{ q: "Do you provide hosting?", a: "Yes, hosting is fully included in all plans. We handle the infrastructure so you can focus on your business." },
		{ q: "Is support included?", a: "Yes. Every plan includes email and chat support. Professional and Brokerage plans receive priority response times." },
		{ q: "Can I upgrade or change my plan later?", a: "Of course. You can upgrade, downgrade, or switch plans at any time from your account settings." },
	];

	toggleFaq(index: number): void {
		this.openFaq = this.openFaq === index ? null : index;
	}

	form = new FormGroup({
		agentName:     new FormControl("", Validators.required),
		brokerageName: new FormControl("", Validators.required),
		phone:         new FormControl("", Validators.required),
		email:         new FormControl("", [Validators.required, Validators.email]),
		address:       new FormControl(""),
		designation:   new FormControl("", Validators.required),
	});

	constructor(
		private publicService: PublicService,
		private notificationService: NotificationService,
	) {}

	get agentName()     { return this.form.get("agentName"); }
	get brokerageName() { return this.form.get("brokerageName"); }
	get phone()         { return this.form.get("phone"); }
	get email()         { return this.form.get("email"); }
	get designation()   { return this.form.get("designation"); }

	submit() {
		if (this.form.invalid) {
			this.form.markAllAsTouched();
			return;
		}

		this.isSubmitting.set(true);
		const payload = {
			...this.form.value,
			leadSource: "dealCentre",
		};

		this.publicService.submitContactForm(payload).subscribe({
			next: () => {
				this.isSubmitting.set(false);
				this.submitted.set(true);
				this.form.reset();
			},
			error: () => {
				this.isSubmitting.set(false);
				this.notificationService.showError("Something went wrong. Please try again.");
			},
		});
	}
}
