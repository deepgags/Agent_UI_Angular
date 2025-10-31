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
	selector: "app-home-detail",
	imports: [CommonModule, RouterModule, ReactiveFormsModule, InputMaskModule, InputTextModule, IftaLabelModule],
	templateUrl: "./home-detail.component.html",
	styleUrl: "./home-detail.component.scss",
})
export class HomeDetailComponent implements OnInit {
	homeDetailForm: FormGroup;
	siteConfig: SiteConfig = {} as SiteConfig;

	constructor(
		private fb: FormBuilder,
		private publicService: PublicService,
		private notificationService: NotificationService,
		private sharedDataService: SharedDataService
	) {
		this.homeDetailForm = this.fb.group({
			homeType: new FormControl("", Validators.required),
			radius: new FormControl("", Validators.required),
			bed: new FormControl("", Validators.required),
			bath: new FormControl("", Validators.required),
			firstName: new FormControl("", Validators.required),
			lastName: new FormControl("", Validators.required),
			email: new FormControl("", [Validators.required, Validators.email]),
			phone: new FormControl("", Validators.required),
		});
	}

	ngOnInit() {
		this.siteConfig = this.sharedDataService.siteData();
	}

	get homeType() {
		return this.homeDetailForm.get("homeType");
	}
	get radius() {
		return this.homeDetailForm.get("radius");
	}
	get bed() {
		return this.homeDetailForm.get("bed");
	}
	get bath() {
		return this.homeDetailForm.get("bath");
	}
	get firstName() {
		return this.homeDetailForm.get("firstName");
	}
	get lastName() {
		return this.homeDetailForm.get("lastName");
	}
	get email() {
		return this.homeDetailForm.get("email");
	}
	get phone() {
		return this.homeDetailForm.get("phone");
	}

	submitHomeDetailForm() {
		if (this.homeDetailForm.invalid) {
			this.homeDetailForm.markAllAsTouched();
			this.notificationService.showError("Please fill all required fields correctly.");
			return;
		}

		const params = {
			...this.homeDetailForm.value,
			leadSource: "homeDetailForm",
			siteId: this.siteConfig?.id,
		};

		this.publicService.submitContactForm(params).subscribe({
			next: () => {
				this.notificationService.showSuccess("Your message has been sent successfully.");
				this.homeDetailForm.reset();
			},
			error: () => {
				this.notificationService.showError("Failed to send message. Please try again later.");
			},
		});
	}
}
