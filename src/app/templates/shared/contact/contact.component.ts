import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { IftaLabelModule } from "primeng/iftalabel";
import { InputMaskModule } from "primeng/inputmask";
import { InputTextModule } from "primeng/inputtext";
import { MultiSelectModule } from "primeng/multiselect";
import { SelectModule } from "primeng/select";
import { SiteConfig } from "../../../models/SiteConfig";
import { PhoneNumberPipe } from "../../../pipes/phoneSearch";
import { NotificationService } from "../../../services/notification.service";
import { PublicService } from "../../../services/public.service";
import { SharedDataService } from "../../../services/shareddata.service";

@Component({
	selector: "app-contact",
	imports: [
		CommonModule,
		NgbModule,
		FormsModule,
		ReactiveFormsModule,
		RouterModule,
		PhoneNumberPipe,
		IftaLabelModule,
		InputMaskModule,
		InputTextModule,
		SelectModule,
		MultiSelectModule,
	],
	templateUrl: "./contact.component.html",
	styleUrl: "./contact.component.scss",
	standalone: true,
})
export class ContactComponent {
	contactForm!: FormGroup;
	siteConfig: SiteConfig = {} as SiteConfig;

	contactText =
		"Your way to better real estate software starts here. For 35 years, we’ve proudly delivered the gold standard in real estate software to businesses of all shapes, sizes, and structures, and we’d be honored to partner with your organization today.";

	userTypes = [
		{
			title: "Seller",
			value: "seller",
		},
		{
			title: "Buyer",
			value: "buyer",
		},
		{
			title: "Renter",
			value: "renter",
		},
		{
			title: "Buyer And Seller",
			value: "buyerAndSeller",
		},
	];

	constructor(
		private sharedDataService: SharedDataService,
		private notificationService: NotificationService,
		private publicService: PublicService
	) {
		this.contactForm = new FormGroup({
			name: new FormControl("", Validators.required),
			email: new FormControl("", [Validators.required, Validators.email]),
			phone: new FormControl("", [Validators.required]),
			message: new FormControl("", Validators.required),
			userType: new FormControl("seller", Validators.required),
		});
	}

	get name() {
		return this.contactForm.get("name");
	}
	get email() {
		return this.contactForm.get("email");
	}
	get phone() {
		return this.contactForm.get("phone");
	}
	get message() {
		return this.contactForm.get("message");
	}

	get requestLeadType() {
		return this.contactForm.get("leadType");
	}

	ngOnInit(): void {
		this.siteConfig = this.sharedDataService.siteData();
	}

	submitContactForm() {
		if (this.contactForm.invalid) {
			this.contactForm.markAllAsTouched();
			this.notificationService.showError("Please fill all required fields correctly.");
			return;
		}

		const params = {
			...this.contactForm.value,
			leadSource: "contactForm",
			siteId: this.siteConfig?.id,
		};
		this.publicService.submitContactForm(params).subscribe({
			next: () => {
				this.notificationService.showSuccess("Your request has been submitted successfully.");
				this.contactForm.reset();
			},
			error: () => {
				this.notificationService.showError("Failed to submit request. Please try again later.");
			},
		});
	}
}
