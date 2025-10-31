import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { IftaLabelModule } from "primeng/iftalabel";
import { InputMaskModule } from "primeng/inputmask";
import { InputTextModule } from "primeng/inputtext";
import { SiteConfig } from "../../../models/SiteConfig";
import { NotificationService } from "../../../services/notification.service";
import { PublicService } from "../../../services/public.service";
import { SharedDataService } from "../../../services/shareddata.service";

@Component({
	selector: "app-home-review",
	imports: [CommonModule, RouterModule, ReactiveFormsModule, InputMaskModule, InputTextModule, IftaLabelModule],
	templateUrl: "./home-review.component.html",
	styleUrl: "./home-review.component.scss",
})
export class HomeReviewComponent implements OnInit {
	homeReviewForm: FormGroup;
	siteConfig: SiteConfig = {} as SiteConfig;

	constructor(
		private fb: FormBuilder,
		private publicService: PublicService,
		private notificationService: NotificationService,
		private sharedDataService: SharedDataService
	) {
		this.homeReviewForm = this.fb.group({
			firstName: new FormControl("", Validators.required),
			lastName: new FormControl("", Validators.required),
			email: new FormControl("", [Validators.required, Validators.email]),
			phone: new FormControl("", Validators.required),
			sellingIn: new FormControl("", Validators.required),
		});
	}

	ngOnInit() {
		this.siteConfig = this.sharedDataService.siteData();
	}

	get firstName() {
		return this.homeReviewForm.get("firstName");
	}
	get lastName() {
		return this.homeReviewForm.get("lastName");
	}
	get email() {
		return this.homeReviewForm.get("email");
	}
	get phone() {
		return this.homeReviewForm.get("phone");
	}
	get sellingIn() {
		return this.homeReviewForm.get("sellingIn");
	}

	submitHomeReviewForm() {
		if (this.homeReviewForm.invalid) {
			this.homeReviewForm.markAllAsTouched();
			this.notificationService.showError("Please fill all required fields correctly.");
			return;
		}

		const params = {
			...this.homeReviewForm.value,
			leadSource: "homeReviewForm",
			siteId: this.siteConfig?.id,
		};

		this.publicService.submitContactForm(params).subscribe({
			next: () => {
				this.notificationService.showSuccess("Your message has been sent successfully.");
				this.homeReviewForm.reset();
			},
			error: () => {
				this.notificationService.showError("Failed to send message. Please try again later.");
			},
		});
	}
}
