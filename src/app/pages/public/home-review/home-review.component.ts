import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { GoogleMapsModule } from "@angular/google-maps";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { IftaLabelModule } from "primeng/iftalabel";
import { InputMaskModule } from "primeng/inputmask";
import { InputTextModule } from "primeng/inputtext";
import { SiteConfig } from "../../../models/SiteConfig";
import { NotificationService } from "../../../services/notification.service";
import { PublicService } from "../../../services/public.service";
import { SharedDataService } from "../../../services/shared-data.service";

@Component({
	selector: "app-home-review",
	imports: [
		CommonModule,
		RouterModule,
		ReactiveFormsModule,
		InputMaskModule,
		InputTextModule,
		IftaLabelModule,
		GoogleMapsModule,
	],
	templateUrl: "./home-review.component.html",
	styleUrl: "./home-review.component.scss",
})
export class HomeReviewComponent implements OnInit {
	homeReviewForm: FormGroup;
	siteConfig: SiteConfig = {} as SiteConfig;
	selectedAddress: string = "";
	latitude!: number;
	longitude!: number;
	mapOptions: google.maps.MapOptions = {
		center: { lat: this.latitude, lng: this.longitude },
		zoom: 15,
	};
	markerOptions: google.maps.MarkerOptions = { position: { lat: this.latitude, lng: this.longitude } };

	constructor(
		private fb: FormBuilder,
		private publicService: PublicService,
		private notificationService: NotificationService,
		private sharedDataService: SharedDataService,
		private route: ActivatedRoute
	) {
		this.homeReviewForm = this.fb.group({
			name: new FormControl("", Validators.required),
			email: new FormControl("", [Validators.required, Validators.email]),
			phone: new FormControl("", Validators.required),
			sellingIn: new FormControl("", Validators.required),
		});
	}

	ngOnInit() {
		this.siteConfig = this.sharedDataService.siteData();

		this.route.queryParams.subscribe((params) => {
			if (params["address"]) {
				this.selectedAddress = params["address"];
				this.latitude = +params["lat"];
				this.longitude = +params["lng"];

				this.mapOptions = {
					center: { lat: this.latitude, lng: this.longitude },
					zoom: 15,
				};

				this.markerOptions = {
					position: { lat: this.latitude, lng: this.longitude },
				};
			}
		});
	}

	get name() {
		return this.homeReviewForm.get("name");
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
			leadSource: "homeWorth",
			siteId: this.siteConfig?.id,
			leadMetaData: {
				address: this.selectedAddress,
				latitude: this.latitude,
				longitude: this.longitude,
			},
			message: "I would like to know my home worth.",
		};

		this.publicService.submitContactForm(params).subscribe({
			next: () => {
				this.notificationService.showSuccess("Your request has been sent successfully.");
				this.homeReviewForm.reset();
			},
			error: () => {
				this.notificationService.showError("Failed to send your request. Please try again later.");
			},
		});
	}
}
