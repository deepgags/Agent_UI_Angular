import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { GoogleMapsModule } from "@angular/google-maps";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { IftaLabelModule } from "primeng/iftalabel";
import { InputMaskModule } from "primeng/inputmask";
import { InputTextModule } from "primeng/inputtext";
import { environment } from "../../../environments/environment.development";
import { SiteConfig } from "../../../models/SiteConfig";
import { NotificationService } from "../../../services/notification.service";
import { PublicService } from "../../../services/public.service";
import { SharedDataService } from "../../../services/shared-data.service";

@Component({
	selector: "app-home-detail",
	imports: [
		CommonModule,
		RouterModule,
		ReactiveFormsModule,
		InputMaskModule,
		InputTextModule,
		IftaLabelModule,
		GoogleMapsModule,
	],
	templateUrl: "./home-detail.component.html",
	styleUrl: "./home-detail.component.scss",
})
export class HomeDetailComponent implements OnInit {
	homeDetailForm: FormGroup;
	siteConfig: SiteConfig = {} as SiteConfig;
	selectedAddress: string = "";
	latitude!: number;
	longitude!: number;
	localImageUrl = environment.localImageUrl;
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
		this.homeDetailForm = this.fb.group({
			homeType: new FormControl("", Validators.required),
			radius: new FormControl("", Validators.required),
			bed: new FormControl("", Validators.required),
			bath: new FormControl("", Validators.required),
			name: new FormControl("", Validators.required),
			email: new FormControl("", [Validators.required, Validators.email]),
			phone: new FormControl("", Validators.required),
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
	get name() {
		return this.homeDetailForm.get("name");
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

		const { homeType, radius, bed, bath, name, email, phone } = this.homeDetailForm.value;
		const params = {
			name,
			email,
			phone,
			leadSource: "findDreamHome",
			siteId: this.siteConfig?.id,
			leadMetaData: {
				address: this.selectedAddress,
				latitude: this.latitude,
				longitude: this.longitude,
				homeType,
				radius,
				bed,
				bath,
			},
			message: "I would like to know about any property available in this location.",
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
