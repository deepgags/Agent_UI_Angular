import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { GoogleMapsModule } from "@angular/google-maps";
import { RouterModule } from "@angular/router";
import { IftaLabelModule } from "primeng/iftalabel";
import { InputMaskModule } from "primeng/inputmask";
import { InputTextModule } from "primeng/inputtext";
import { GooglePlaceComponent } from "../../../components/google-place/google-place.component";
import { environment } from "../../../environments/environment.development";
import { SiteConfig } from "../../../models/SiteConfig";
import { NotificationService } from "../../../services/notification.service";
import { PublicService } from "../../../services/public.service";
import { SharedDataService } from "../../../services/shared-data.service";

@Component({
	selector: "app-neighbors-detail",
	imports: [
		CommonModule,
		RouterModule,
		ReactiveFormsModule,
		InputMaskModule,
		InputTextModule,
		IftaLabelModule,
		GoogleMapsModule,
		GooglePlaceComponent,
	],
	templateUrl: "./neighbor-detail.component.html",
	styleUrl: "./neighbor-detail.component.scss",
})
export class NeighborDetailComponent implements OnInit {
	neighborDetailForm: FormGroup;
	siteConfig: SiteConfig = {} as SiteConfig;
	selectedPlace: any = null;
	selectedAddress: string = "";
	latitude: number = 43.6532; // Toronto
	longitude: number = -79.3832;
	localImageUrl = environment.localImageUrl;
	mapOptions: google.maps.MapOptions = {
		center: { lat: this.latitude, lng: this.longitude },
		zoom: 15,
	};
	markerOptions: google.maps.MarkerOptions = { position: { lat: this.latitude, lng: this.longitude } };
	circleOptions: google.maps.CircleOptions = {
		center: { lat: this.latitude, lng: this.longitude },
		radius: 500,
		strokeColor: "#FF0000",
		strokeOpacity: 0.8,
		strokeWeight: 2,
		fillColor: "#FF0000",
		fillOpacity: 0.1,
	};

	radiusDropdown = [
		{
			key: "200 Meters",
			value: 200,
		},
		{
			key: "500 Meters",
			value: 500,
		},
		{
			key: "800 Meters",
			value: 800,
		},
		{
			key: "1 KM",
			value: 1000,
		},
	];

	constructor(
		private fb: FormBuilder,
		private publicService: PublicService,
		private notificationService: NotificationService,
		private sharedDataService: SharedDataService,
	) {
		this.neighborDetailForm = this.fb.group({
			radius: new FormControl(500, Validators.required),
			homeType: new FormControl("", Validators.required),
			beds: new FormControl("", Validators.required),
			baths: new FormControl("", Validators.required),
			name: new FormControl("", Validators.required),
			email: new FormControl("", [Validators.required, Validators.email]),
			phone: new FormControl("", Validators.required),
		});
	}

	ngOnInit() {
		this.siteConfig = this.sharedDataService.siteData();
	}

	onPlaceSelect = (place: any) => {
		this.selectedPlace = place;
		this.selectedAddress = place.formatted_address;
		this.latitude = place.geometry.location.lat();
		this.longitude = place.geometry.location.lng();

		this.mapOptions = {
			center: { lat: this.latitude, lng: this.longitude },
			zoom: 15,
		};

		this.markerOptions = {
			position: { lat: this.latitude, lng: this.longitude },
		};

		this.updateCircle();
	};

	updateCircle = () => {
		let radius = 500; // default
		const radiusValue: number = this.neighborDetailForm.get("radius")?.value;
		if (radiusValue) {
			radius = Number(radiusValue);
		}

		// Reassign the entire object to trigger change detection
		this.circleOptions = {
			...this.circleOptions,
			center: { lat: this.latitude, lng: this.longitude },
			radius: radius,
		};
	};

	get radius() {
		return this.neighborDetailForm.get("radius");
	}
	get homeType() {
		return this.neighborDetailForm.get("homeType");
	}
	get name() {
		return this.neighborDetailForm.get("name");
	}
	get email() {
		return this.neighborDetailForm.get("email");
	}
	get phone() {
		return this.neighborDetailForm.get("phone");
	}

	get beds() {
		return this.neighborDetailForm.get("beds");
	}

	get baths() {
		return this.neighborDetailForm.get("baths");
	}

	submitNeighborDetailForm() {
		if (this.neighborDetailForm.invalid) {
			this.neighborDetailForm.markAllAsTouched();
			this.notificationService.showError("Please fill all required fields correctly.");
			return;
		}

		const { homeType, radius, beds, baths, name, email, phone } = this.neighborDetailForm.value;

		const params = {
			name,
			email,
			phone,
			leadSource: "sellingInNeighborHood",
			siteId: this.siteConfig?.id,
			leadMetaData: {
				address: this.selectedAddress,
				latitude: this.latitude,
				longitude: this.longitude,
				homeType,
				radius,
				beds,
				baths,
			},
			message: "I would like to know about any property selling in this neighbor hood.",
		};

		this.publicService.submitContactForm(params).subscribe({
			next: () => {
				this.notificationService.showSuccess("Your message has been sent successfully.");
				this.neighborDetailForm.reset();
			},
			error: () => {
				this.notificationService.showError("Failed to send message. Please try again later.");
			},
		});
	}
}
