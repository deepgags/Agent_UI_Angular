
import { Component } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { RouterModule } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { SiteConfig } from "../../../models/SiteConfig";
import { PublicService } from "../../../services/public.service";
import { SiteConfigService } from "../../../services/site-config.service";

@Component({
	selector: "app-contact",
	imports: [NgbModule, FormsModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, RouterModule],
	templateUrl: "./contact.component.html",
	styleUrl: "./contact.component.scss",
	standalone: true,
})
export class ContactComponent {
	userForm!: FormGroup;
	siteConfig: SiteConfig | undefined;
	siteConfigSubscription: any;

	contactText =
		"Your way to better real estate software starts here. For 35 years, we’ve proudly delivered the gold standard in real estate software to businesses of all shapes, sizes, and structures, and we’d be honored to partner with your organization today.";

	constructor(private fb: FormBuilder, private siteConfigService: SiteConfigService, private publicService: PublicService) {}

	get name() {
		return this.userForm.get("name");
	}
	get email() {
		return this.userForm.get("email");
	}
	get phone() {
		return this.userForm.get("phone");
	}
	get message() {
		return this.userForm.get("message");
	}

	ngOnInit(): void {
		this.userForm = this.fb.group({
			name: new FormControl("", Validators.required),
			email: new FormControl("", [Validators.required, Validators.email]),
			phone: new FormControl("", [Validators.required, Validators.pattern("^(([0-9]{3}) |[0-9]{3}-)[0-9]{3}-[0-9]{4}$")]),
			message: new FormControl("", Validators.required),
			userType: new FormControl("seller", Validators.required),
		});

		this.siteConfigSubscription = this.siteConfigService.currentConfig$.subscribe((config) => {
			if (config) {
				this.siteConfig = config;
			}
		});
	}

	submitContactForm() {
		if (this.userForm.invalid) {
			this.userForm.markAllAsTouched();
			const errorMessage = "Please fill all required fields correctly.";
			return;
		}

		const params = {
			...this.userForm.value,
			leadSource: "contactForm",
		};
		this.publicService.submitContactForm(params).subscribe({
			next: () => {
				const success = "Your message has been sent successfully.";
				this.userForm.reset();
			},
			error: () => {
				const errorMessage = "Failed to send message. Please try again later.";
			},
		});
	}
}
