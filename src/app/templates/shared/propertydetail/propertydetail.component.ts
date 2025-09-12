import { BreakpointObserver } from "@angular/cdk/layout";
import { CommonModule, Location } from "@angular/common";
import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { GoogleMap, GoogleMapsModule, MapInfoWindow, MapMarker } from "@angular/google-maps";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { Title } from "@angular/platform-browser";
import { provideAnimations } from "@angular/platform-browser/animations";
import { Router, RouterModule } from "@angular/router";
import { NgbCarouselConfig, NgbModule } from "@ng-bootstrap/ng-bootstrap";
// import { Gallery, GalleryConfig, GalleryModule, GalleryRef, ImageItem, ThumbnailsPosition } from "ng-gallery";
import { BehaviorSubject, Observable, Subscription } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "../../../environments/environment.development";
import { InterestedUserModel } from "../../../models/InterestedUserModel";
import { PropertyModel } from "../../../models/PropertyModel";
import { PropertyService } from "../../../services/property.service";

import { AccordionModule } from "primeng/accordion";
import { CarouselModule } from "primeng/carousel";
import { DialogService, DynamicDialogConfig } from "primeng/dynamicdialog";
import { GalleriaModule } from "primeng/galleria";
import { IftaLabelModule } from "primeng/iftalabel";
import { InputMaskModule } from "primeng/inputmask";
import { InputTextModule } from "primeng/inputtext";
import { MultiSelectModule } from "primeng/multiselect";
import { SelectModule } from "primeng/select";
import { TabsModule } from "primeng/tabs";
import { PropertyComponent } from "../../../components/property/property.component";
import { SiteConfig } from "../../../models/SiteConfig";
import { PhoneSearch } from "../../../pipes/phoneSearch";
import { TimeAgo } from "../../../Pipes/time-ago";
import { NotificationService } from "../../../services/notification.service";
import { PublicService } from "../../../services/public.service";
import { SiteConfigService } from "../../../services/site-config.service";
declare var window: any;

@Component({
	selector: "app-propertydetail",
	imports: [
		CommonModule,
		NgbModule,
		FormsModule,
		ReactiveFormsModule,
		MatDialogModule,
		// SearchComponent,
		MatFormFieldModule,
		MatInputModule,
		GoogleMapsModule,
		RouterModule,
		// GalleryModule,
		PhoneSearch,
		AccordionModule,
		IftaLabelModule,
		InputMaskModule,
		InputTextModule,
		SelectModule,
		MultiSelectModule,
		TimeAgo,
		CarouselModule,
		GalleriaModule,
		PropertyComponent,
		TabsModule,
	],
	providers: [provideAnimations(), NgbCarouselConfig, DialogService],
	templateUrl: "./propertydetail.component.html",
	encapsulation: ViewEncapsulation.None,
	styleUrls: ["./propertydetail.component.scss"],
	standalone: true,
})
export class PropertydetailComponent implements OnInit {
	imageUrl = environment.imageUrl;
	property: PropertyModel | undefined;
	Latitude: number = 0;
	Longitude: number = 0;
	private loadingSubject = new BehaviorSubject<boolean>(false);
	loading$ = this.loadingSubject.asObservable();

	requestShowingForm: FormGroup;
	propertyHistoryForm: FormGroup;
	recentSaleInAreaForm: FormGroup;
	haveQuestionForm: FormGroup;
	contactForm: FormGroup;

	userModel: InterestedUserModel = new InterestedUserModel();

	@ViewChild(MapInfoWindow) infoWindow: MapInfoWindow | undefined;
	zoom = 14;
	center: google.maps.LatLngLiteral = { lat: 56.1304, lng: 106.3468 }; // Center of Canada

	private siteConfigSubscription: Subscription | undefined;

	siteConfigBS: BehaviorSubject<any>;
	siteConfigObservable: Observable<any>;
	mlsId: string = "";
	propertyId: string = "";
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

	private _leadTypes: any[] = [];
	requestShowingLeadTypeDropdown: any[] = [];
	propertyHistoryLeadTypeDropdown: any[] = [];
	recentSalesInAreaLeadTypeDropdown: any[] = [];
	haveQuestionLeadTypeDropdown: any[] = [];
	contactFormLeadTypeDropdown: any[] = [];
	roomDetails: any;
	similarProperties: any[] = [];
	siteConfig: SiteConfig | undefined;
	constructor(
		breakpointObserver: BreakpointObserver,
		private propertyService: PropertyService,
		private titleService: Title,
		private location: Location,
		private router: Router,
		private siteConfigService: SiteConfigService,
		private dialogConfig: DynamicDialogConfig,
		private notificationService: NotificationService,
		private publicService: PublicService
	) {
		this.titleService.setTitle("Property Detail");
		this.siteConfigBS = new BehaviorSubject(null);
		this.siteConfigObservable = this.siteConfigBS.asObservable();

		const { mlsId, propertyId, address, property_type, property_subtype } = this.dialogConfig.data;
		console.log("data", mlsId, propertyId, address, property_type, property_subtype);
		this.mlsId = mlsId;
		this.propertyId = propertyId;

		if (this.propertyId && this.mlsId) {
			this.getPropertyInformation();
		}

		this.requestShowingForm = new FormGroup({
			name: new FormControl("", Validators.required),
			email: new FormControl("", [Validators.required, Validators.email]),
			phone: new FormControl("", [Validators.required]),
			date: new FormControl(""),
			message: new FormControl("I would like more information regarding a property", Validators.required),
			userType: new FormControl("seller", Validators.required),
			leadType: new FormControl("", Validators.required),
		});

		this.propertyHistoryForm = new FormGroup({
			name: new FormControl("", Validators.required),
			email: new FormControl("", [Validators.required, Validators.email]),
			phone: new FormControl("", [Validators.required]),
			message: new FormControl("I would like more information regarding a property", Validators.required),
			userType: new FormControl("seller", Validators.required),
			leadType: new FormControl("", Validators.required),
		});

		this.recentSaleInAreaForm = new FormGroup({
			name: new FormControl("", Validators.required),
			email: new FormControl("", [Validators.required, Validators.email]),
			phone: new FormControl("", [Validators.required]),
			message: new FormControl("I would like more information regarding a property", Validators.required),
			userType: new FormControl("seller", Validators.required),
			leadType: new FormControl("", Validators.required),
		});

		this.haveQuestionForm = new FormGroup({
			name: new FormControl("", Validators.required),
			email: new FormControl("", [Validators.required, Validators.email]),
			phone: new FormControl("", [Validators.required]),
			message: new FormControl("I would like more information regarding a property", Validators.required),
			userType: new FormControl("seller", Validators.required),
			leadType: new FormControl("", Validators.required),
		});

		this.contactForm = new FormGroup({
			name: new FormControl("", Validators.required),
			email: new FormControl("", [Validators.required, Validators.email]),
			phone: new FormControl("", [Validators.required]),
			message: new FormControl("I would like more information regarding a property", Validators.required),
			userType: new FormControl("seller", Validators.required),
			leadType: new FormControl("", Validators.required),
		});

		// this.galleryConfig$ = breakpointObserver.observe([Breakpoints.HandsetPortrait]).pipe(
		// 	map((res) => {
		// 		if (res.matches) {
		// 			return {
		// 				thumbPosition: ThumbnailsPosition.Top,
		// 				thumbWidth: 80,
		// 				thumbHeight: 80,
		// 			};
		// 		}
		// 		return {
		// 			thumbPosition: ThumbnailsPosition.Left,
		// 			thumbWidth: 120,
		// 			thumbHeight: 90,
		// 		};
		// 	})
		// );
	}

	get requestShowingName() {
		return this.requestShowingForm.get("name");
	}
	get requestShowingEmail() {
		return this.requestShowingForm.get("email");
	}
	get requestShowingPhone() {
		return this.requestShowingForm.get("phone");
	}
	get requestShowingMessage() {
		return this.requestShowingForm.get("message");
	}
	get requestLeadType() {
		return this.requestShowingForm.get("leadType");
	}

	get propertyHistoryName() {
		return this.propertyHistoryForm.get("name");
	}
	get propertyHistoryEmail() {
		return this.propertyHistoryForm.get("email");
	}
	get propertyHistoryPhone() {
		return this.propertyHistoryForm.get("phone");
	}
	get propertyHistoryMessage() {
		return this.propertyHistoryForm.get("message");
	}
	get propertyLeadType() {
		return this.propertyHistoryForm.get("leadType");
	}

	get recentSaleName() {
		return this.recentSaleInAreaForm.get("name");
	}
	get recentSaleEmail() {
		return this.recentSaleInAreaForm.get("email");
	}
	get recentSalePhone() {
		return this.recentSaleInAreaForm.get("phone");
	}
	get recentSaleMessage() {
		return this.recentSaleInAreaForm.get("message");
	}
	get recentLeadType() {
		return this.recentSaleInAreaForm.get("leadType");
	}

	get haveQuestionName() {
		return this.haveQuestionForm.get("name");
	}
	get haveQuestionEmail() {
		return this.haveQuestionForm.get("email");
	}
	get haveQuestionPhone() {
		return this.haveQuestionForm.get("phone");
	}
	get haveQuestionMessage() {
		return this.haveQuestionForm.get("message");
	}
	get haveQuestionLeadType() {
		return this.haveQuestionForm.get("leadType");
	}

	get contactName() {
		return this.contactForm.get("name");
	}
	get contactEmail() {
		return this.contactForm.get("email");
	}
	get contactPhone() {
		return this.contactForm.get("phone");
	}
	get contactMessage() {
		return this.contactForm.get("message");
	}
	get contactLeadType() {
		return this.contactForm.get("leadType");
	}

	ngOnInit(): void {
		// this.galleryRef = this.gallery.ref("propertyGallery");

		// this.route.queryParams.subscribe((params) => {
		// 	if (Object.keys(params).length > 0) {
		// 		this.selectedFilters = {
		// 			...this.selectedFilters,
		// 			...params,
		// 		};
		// 		this.getPropertyInformation();
		// 	}
		// });

		this.siteConfigSubscription = this.siteConfigService.currentConfig$.subscribe((config) => {
			if (config) {
				this.siteConfig = config;
				this.siteConfigBS.next(config);
			}
		});

		this.getLocation();
		this.getLeadTypeDropdown();
		this.getPropertyInformation();
	}

	ngOnDestroy(): void {
		if (this.siteConfigSubscription) {
			this.siteConfigSubscription.unsubscribe();
		}
	}

	openInfoWindow(property: PropertyModel, marker: MapMarker): void {
		if (this.infoWindow) {
			this.infoWindow.open(marker);
		}
	}

	getPropertyInformation(): void {
		this.property = undefined;
		this.loadingSubject.next(true);
		this.propertyService.getPropertyDetails(this.propertyId, this.mlsId).subscribe({
			next: (response) => {
				this.property = response;
				this.center.lat = this.property.Latitude;
				this.center.lng = this.property.Longitude;
				// if (this.galleryRef && this.property.Media) {
				// 	this.property?.Media?.forEach((x) => {
				// 		this.galleryRef?.add(
				// 			new ImageItem({
				// 				src: `${this.imageUrl}${x.Media_url}`,
				// 				thumb: `${this.imageUrl}${x.Media_url}`,
				// 			})
				// 		);
				// 	});
				// }
				this.getRoomDetails();
				this.getSimilarProperties();
				setTimeout(() => {
					this.loadWalkScore();
				}, 1500);
			},
			error: (err) => {
				// this.notificationService.showNotification("Error occurred while getting property information");
				this.loadingSubject.next(false);
			},
			complete: () => {
				this.loadingSubject.next(false);
			},
		});
	}

	back() {
		this.location.back();
	}

	searchProperties = (selectedFilters: any, searchByMap: boolean = false) => {
		const { address, property_type, bedrooms, bathrooms, min_price, max_price, property_status, sqFt } = selectedFilters;
		this.router.navigate(["/t2", searchByMap ? "map" : "search"], {
			queryParams: {
				address,
				property_type,
				bedrooms,
				bathrooms,
				min_price,
				max_price,
				property_status,
				sqFt,
			},
		});
	};

	getLocation(): void {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition((position) => {
				const longitude = position.coords.longitude;
				const latitude = position.coords.latitude;
				this.Latitude = latitude;
				this.Longitude = longitude;
			});
		} else {
		}
	}

	loadWalkScore() {
		(window as any).ws_wsid = "ge7127abd982e495d9fe2d24cba96d9fb";
		(window as any).ws_address = this.property?.UnparsedAddress || "";
		(window as any).ws_format = "wide";
		(window as any).ws_width = "690";
		(window as any).ws_height = "525";

		const script = document.createElement("script");
		script.type = "text/javascript";
		script.src = "http://www.walkscore.com/tile/show-walkscore-tile.php";
		document.getElementById("ws-walkscore-tile")?.appendChild(script);
	}

	submitRequestShowingForm() {
		console.log(this.requestShowingForm);
		if (this.requestShowingForm.invalid) {
			this.requestShowingForm.markAllAsTouched();
			this.notificationService.showError("Please fill all required fields correctly.");
			return;
		}

		const params = {
			...this.requestShowingForm.value,
			leadSource: "requestShowing",
			siteId: this.siteConfig?.id,
			mlsId: this.mlsId,
		};
		this.publicService.submitContactForm(params).subscribe({
			next: () => {
				this.notificationService.showSuccess("Your message has been sent successfully.");
				this.requestShowingForm.reset();
			},
			error: () => {
				this.notificationService.showError("Failed to send message. Please try again later.");
			},
		});
	}

	submitPropertyHistoryForm() {
		if (this.propertyHistoryForm.invalid) {
			this.propertyHistoryForm.markAllAsTouched();
			this.notificationService.showError("Please fill all required fields correctly.");
			return;
		}

		const params = {
			...this.propertyHistoryForm.value,
			leadSource: "propertyHistory",
			siteId: this.siteConfig?.id,
			mlsId: this.mlsId,
		};
		this.publicService.submitContactForm(params).subscribe({
			next: () => {
				this.notificationService.showSuccess("Your message has been sent successfully.");
				this.propertyHistoryForm.reset();
			},
			error: () => {
				this.notificationService.showError("Failed to send message. Please try again later.");
			},
		});
	}

	submitRecentSalesInAreaForm() {
		if (this.recentSaleInAreaForm.invalid) {
			this.recentSaleInAreaForm.markAllAsTouched();
			this.notificationService.showError("Please fill all required fields correctly.");
			return;
		}

		const params = {
			...this.recentSaleInAreaForm.value,
			leadSource: "recentSalesInArea",
			siteId: this.siteConfig?.id,
			mlsId: this.mlsId,
		};
		this.publicService.submitContactForm(params).subscribe({
			next: () => {
				this.notificationService.showSuccess("Your message has been sent successfully.");
				this.recentSaleInAreaForm.reset();
			},
			error: () => {
				this.notificationService.showError("Failed to send message. Please try again later.");
			},
		});
	}

	submitHaveQuestionForm() {
		if (this.haveQuestionForm.invalid) {
			this.haveQuestionForm.markAllAsTouched();
			this.notificationService.showError("Please fill all required fields correctly.");
			return;
		}

		const params = {
			...this.haveQuestionForm.value,
			leadSource: "haveQuestion",
			siteId: this.siteConfig?.id,
			mlsId: this.mlsId,
		};
		this.publicService.submitContactForm(params).subscribe({
			next: () => {
				this.notificationService.showSuccess("Your message has been sent successfully.");
				this.haveQuestionForm.reset();
			},
			error: () => {
				this.notificationService.showError("Failed to send message. Please try again later.");
			},
		});
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
			mlsId: this.mlsId,
		};
		this.publicService.submitContactForm(params).subscribe({
			next: () => {
				this.notificationService.showSuccess("Your message has been sent successfully.");
				this.contactForm.reset();
			},
			error: () => {
				this.notificationService.showError("Failed to send message. Please try again later.");
			},
		});
	}

	getLeadTypeDropdown() {
		this.publicService.getLeadTypes().subscribe({
			next: (res: any) => {
				this._leadTypes = res.data;
				this.getLeadTypesForForms("requestShowingForm");
				this.getLeadTypesForForms("propertyHistoryForm");
				this.getLeadTypesForForms("recentSaleInAreaForm");
				this.getLeadTypesForForms("haveQuestionForm");
				this.getLeadTypesForForms("contactForm");
			},
			error: () => {},
		});
	}

	private getLeadTypesFromUserType(userType: string) {
		return this._leadTypes.filter((type) => type.userType == userType);
	}

	getLeadTypesForForms(from: string) {
		switch (from) {
			case "requestShowingForm":
				{
					const { userType } = this.requestShowingForm.value;
					this.requestShowingForm.patchValue({ leadType: "" });
					this.requestShowingForm.updateValueAndValidity();
					this.requestShowingLeadTypeDropdown = this.getLeadTypesFromUserType(userType);
				}
				break;
			case "propertyHistoryForm":
				{
					const { userType } = this.propertyHistoryForm.value;
					this.propertyHistoryForm.patchValue({ leadType: "" });
					this.propertyHistoryForm.updateValueAndValidity();
					this.propertyHistoryLeadTypeDropdown = this.getLeadTypesFromUserType(userType);
				}
				break;
			case "recentSaleInAreaForm":
				{
					const { userType } = this.recentSaleInAreaForm.value;
					this.recentSaleInAreaForm.patchValue({ leadType: "" });
					this.recentSaleInAreaForm.updateValueAndValidity();
					this.recentSalesInAreaLeadTypeDropdown = this.getLeadTypesFromUserType(userType);
				}
				break;
			case "haveQuestionForm":
				{
					const { userType } = this.haveQuestionForm.value;
					this.haveQuestionForm.patchValue({ leadType: "" });
					this.haveQuestionForm.updateValueAndValidity();
					this.haveQuestionLeadTypeDropdown = this.getLeadTypesFromUserType(userType);
				}
				break;
			case "contactForm":
				{
					const { userType } = this.contactForm.value;
					this.contactForm.patchValue({ leadType: "" });
					this.contactForm.updateValueAndValidity();
					this.contactFormLeadTypeDropdown = this.getLeadTypesFromUserType(userType);
				}
				break;
			default:
				break;
		}
	}

	getRoomDetails() {
		this.loadingSubject.next(true);
		this.propertyService.getRoomDetails(this.mlsId).subscribe({
			next: (response) => {
				console.log("room details", response);
				this.roomDetails = response;
				this.loadingSubject.next(false);
			},
			error: (err) => {
				this.loadingSubject.next(false);
				// this.notificationService.showNotification("Error occurred while getting property information");
			},
			complete: () => {
				this.loadingSubject.next(false);
			},
		});
	}

	getSimilarProperties() {
		const params = {
			property_type: this.property?.PropertyType,
			property_subtype: this.property?.PropertySubType,
			city: this.property?.City,
			town: this.property?.Town,
		};
		this.propertyService.getSimilarProperties(params).subscribe({
			next: (response) => {
				this.similarProperties = response;
			},
			error: (err) => {
				this.loadingSubject.next(false);
			},
			complete: () => {
				this.loadingSubject.next(false);
			},
		});
	}

	openSimilarPropertyDetails = (property: PropertyModel) => {
		this.mlsId = property.ListingKey;
		this.propertyId = property._id;

		if (this.propertyId && this.mlsId) {
			this.getPropertyInformation();
		}
	};
}
