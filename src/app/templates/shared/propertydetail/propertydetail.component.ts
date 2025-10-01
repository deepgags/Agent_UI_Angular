import { BreakpointObserver } from "@angular/cdk/layout";
import { CommonModule, Location } from "@angular/common";
import { AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { GoogleMap, GoogleMapsModule, MapInfoWindow, MapMarker } from "@angular/google-maps";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { Title } from "@angular/platform-browser";
import { provideAnimations } from "@angular/platform-browser/animations";
import { Router, RouterModule } from "@angular/router";
import { NgbCarouselConfig, NgbModule } from "@ng-bootstrap/ng-bootstrap";
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
import { BehaviorSubject } from "rxjs";
import { PropertyComponent } from "../../../components/property/property.component";
import { environment } from "../../../environments/environment.development";
import { InterestedUserModel } from "../../../models/InterestedUserModel";
import { PropertyModel } from "../../../models/PropertyModel";
import { SiteConfig } from "../../../models/SiteConfig";
import { PhoneNumberPipe } from "../../../pipes/phoneSearch";
import { TimeAgo } from "../../../pipes/time-ago";
import { NotificationService } from "../../../services/notification.service";
import { PropertyService } from "../../../services/property.service";
import { PublicService } from "../../../services/public.service";
import { SharedDataService } from "../../../services/shareddata.service";
declare var window: any;
declare var google: any;

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
		PhoneNumberPipe,
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
export class PropertyDetailComponent implements OnInit, AfterViewInit {
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
	@ViewChild("map", { static: false }) map!: GoogleMap;
	zoom = 14;
	center: google.maps.LatLngLiteral = { lat: 56.1304, lng: 106.3468 }; // Center of Canada

	// Map controls properties
	private drawingManager: any;
	private amenityMarkers: google.maps.Marker[] = [];
	private currentMapType: string = "roadmap";
	private isAmenitiesBarOpen = false;
	private amenities: any[] = [
		{ type: "school", icon: "fas fa-graduation-cap" },
		{ type: "park", icon: "fas fa-tree" },
		{ type: "hospital", icon: "fas fa-hospital" },
		{ type: "shopping_mall", icon: "fas fa-shopping-cart" },
		{ type: "restaurant", icon: "fas fa-utensils" },
		{ type: "store", icon: "fas fa-store" },
		{ type: "bank", icon: "fas fa-university" },
		{ type: "gas_station", icon: "fas fa-gas-pump" },
		{ type: "camera", icon: "fas fa-camera" },
		{ type: "coffee", icon: "fas fa-coffee" },
		{ type: "stroller", icon: "fas fa-baby-carriage" },
		{ type: "bus", icon: "fas fa-bus" },
	];

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
	roomDetails: any[] = [];
	similarProperties: any[] = [];
	siteConfig: SiteConfig = {} as SiteConfig;

	constructor(
		private propertyService: PropertyService,
		private titleService: Title,
		private location: Location,
		private router: Router,
		private sharedDataService: SharedDataService,
		private dialogConfig: DynamicDialogConfig,
		private notificationService: NotificationService,
		private publicService: PublicService
	) {
		this.titleService.setTitle("Property Detail");

		const { mlsId, propertyId, address, property_type, property_subtype } = this.dialogConfig.data;
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

		this.siteConfig = this.sharedDataService.siteData();

		this.getLocation();
		this.getLeadTypeDropdown();
		this.getPropertyInformation();
	}

	ngAfterViewInit(): void {
		this.addMapControls();
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
		const feedType = this.property?.PropertyFeedType ?? "";
		this.propertyService.getRoomDetails(this.mlsId, feedType).subscribe({
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

	private addMapControls(): void {
		setTimeout(() => {
			if (this.map) {
				const googleMap = this.map.googleMap;
				if (googleMap) {
					this.addCustomControls(googleMap);
				}
			}
		}, 1000);
	}

	private addCustomControls(googleMap: google.maps.Map) {
		const controlDiv = document.createElement("div");
		controlDiv.className = "custom-map-controls";

		const drawControl = this.createMapButton("fas fa-pencil-alt", () => this.toggleDrawingMode(googleMap), "Draw Region", false);

		const amenitiesControl = this.createMapButton("fas fa-info", () => this.toggleAmenities(googleMap), "Amenities", true);

		const locationControl = this.createMapButton(
			"fas fa-location-arrow",
			() => this.centerOnUserLocation(googleMap),
			"My Location",
			true
		);

		controlDiv.appendChild(drawControl);
		controlDiv.appendChild(amenitiesControl);
		controlDiv.appendChild(locationControl);

		googleMap.controls[google.maps.ControlPosition.TOP_RIGHT].push(controlDiv);
	}

	// Create a circular icon button
	private createMapButton(iconClass: string, onClick: () => void, title: string, isBlue: boolean): HTMLElement {
		const button = document.createElement("button");
		button.className = `control-button ${isBlue ? "blue-button" : "white-button"}`;
		button.title = title;
		button.innerHTML = `<i class="${iconClass}"></i>`;
		button.onclick = onClick;
		return button;
	}

	// Toggle amenities
	private toggleAmenities(googleMap: google.maps.Map): void {
		this.isAmenitiesBarOpen = !this.isAmenitiesBarOpen;
		const amenitiesBar = document.getElementById("amenities-bar");

		if (this.isAmenitiesBarOpen) {
			if (!amenitiesBar) {
				this.createAmenitiesBar(googleMap);
			} else {
				amenitiesBar.style.display = "flex";
			}
		} else {
			if (amenitiesBar) {
				amenitiesBar.style.display = "none";
			}
			this.clearAmenityMarkers();
		}
	}

	// Create the amenities bar
	private createAmenitiesBar(googleMap: google.maps.Map): void {
		const amenitiesBar = document.createElement("div");
		amenitiesBar.id = "amenities-bar";
		amenitiesBar.className = "amenities-bar";

		this.amenities.forEach((amenity) => {
			const amenityButton = document.createElement("button");
			amenityButton.className = "amenity-button";
			amenityButton.title = amenity.type.replace(/_/g, " ");
			amenityButton.innerHTML = `<i class="${amenity.icon}"></i>`;
			amenityButton.onclick = () => this.searchForAmenity(googleMap, amenity.type);
			amenitiesBar.appendChild(amenityButton);
		});

		googleMap.controls[google.maps.ControlPosition.TOP_RIGHT].push(amenitiesBar);
	}

	// Toggle drawing mode
	private toggleDrawingMode(googleMap: google.maps.Map): void {
		if (this.drawingManager) {
			this.drawingManager.setMap(null);
			this.drawingManager = null;
			this.notificationService.showSuccess("Drawing mode disabled");
		} else {
			// Initialize Drawing Manager
			this.drawingManager = new google.maps.drawing.DrawingManager({
				drawingMode: google.maps.drawing.OverlayType.POLYGON,
				drawingControl: true,
				drawingControlOptions: {
					position: google.maps.ControlPosition.TOP_CENTER,
					drawingModes: [google.maps.drawing.OverlayType.POLYGON, google.maps.drawing.OverlayType.RECTANGLE],
				},
				polygonOptions: {
					fillColor: "#FF0000",
					fillOpacity: 0.3,
					strokeColor: "#FF0000",
					strokeWeight: 2,
					clickable: true,
					editable: true,
					zIndex: 1,
				},
			});

			this.drawingManager.setMap(googleMap);
			this.notificationService.showSuccess("Drawing mode enabled - Click and drag to draw regions");

			// Listen for overlay complete
			google.maps.event.addListener(this.drawingManager, "overlaycomplete", (event: any) => {
				if (event.type === google.maps.drawing.OverlayType.POLYGON) {
					const polygon = event.overlay;
					this.notificationService.showSuccess("Region drawn successfully!");
				}
			});
		}
	}

	// Search for a specific amenity
	private searchForAmenity(googleMap: google.maps.Map, type: string): void {
		this.clearAmenityMarkers();
		const service = new google.maps.places.PlacesService(googleMap);
		const request = {
			location: googleMap.getCenter(),
			radius: 2000, // 2km radius
			type: type,
		};

		service.nearbySearch(request, (results: any[], status: any) => {
			if (status === google.maps.places.PlacesServiceStatus.OK && results) {
				const bounds = new google.maps.LatLngBounds();
				results.forEach((place) => {
					const marker = new google.maps.Marker({
						position: place.geometry.location,
						map: googleMap,
						title: place.name,
						icon: {
							url: this.getAmenityIcon(type),
							scaledSize: new google.maps.Size(32, 32),
						},
					});
					this.amenityMarkers.push(marker);
					bounds.extend(place.geometry.location);
				});
				googleMap.fitBounds(bounds);
			} else {
				this.notificationService.showError(`No ${type.replace(/_/g, " ")} found nearby`);
			}
		});
	}

	// Get appropriate icon for amenity type
	private getAmenityIcon(type: string): string {
		const iconMap: { [key: string]: string } = {
			school: "📚",
			park: "🌳",
			hospital: "🏥",
			shopping_mall: "🏬",
			restaurant: "🍽️",
			grocery_or_supermarket: "🛒",
			bank: "🏦",
			gas_station: "⛽",
			bus_station: "🚌",
		};
		return iconMap[type] || "📍";
	}

	// Clear amenity markers
	private clearAmenityMarkers(): void {
		this.amenityMarkers.forEach((marker) => {
			marker.setMap(null);
		});
		this.amenityMarkers = [];
	}

	// Toggle map layers
	private toggleMapLayers(googleMap: google.maps.Map): void {
		const mapTypes = ["roadmap", "satellite", "terrain"];
		const currentIndex = mapTypes.indexOf(this.currentMapType);
		const nextIndex = (currentIndex + 1) % mapTypes.length;
		this.currentMapType = mapTypes[nextIndex];

		googleMap.setMapTypeId(this.currentMapType);
		this.notificationService.showSuccess(`Map type changed to ${this.currentMapType}`);
	}

	// Center on user location
	private centerOnUserLocation(googleMap: google.maps.Map): void {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					const userLocation = {
						lat: position.coords.latitude,
						lng: position.coords.longitude,
					};

					googleMap.setCenter(userLocation);
					googleMap.setZoom(15);

					// Add marker for user location
					const marker = new google.maps.Marker({
						position: userLocation,
						map: googleMap,
						title: "Your Location",
						icon: "👤",
					});

					this.notificationService.showSuccess("Centered on your location");
				},
				(error) => {
					this.notificationService.showError("Unable to get your location. Please enable location services.");
				}
			);
		} else {
			this.notificationService.showError("Geolocation is not supported by this browser.");
		}
	}
}
