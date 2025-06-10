import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { CommonModule, Location } from "@angular/common";
import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { GoogleMap, GoogleMapsModule, MapInfoWindow, MapMarker } from "@angular/google-maps";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { Title } from "@angular/platform-browser";
import { provideAnimations } from "@angular/platform-browser/animations";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { NgbCarouselConfig, NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { BehaviorSubject, Observable, Subscription } from "rxjs";
import { InterestedUserModel } from "../../../models/InterestedUserModel";
import { PropertyModel } from "../../../models/PropertyModel";
import { PropertyService } from "../../../services/property.service";
import { SearchComponent } from "../search/search.component";

import { Gallery, GalleryConfig, GalleryModule, GalleryRef, ImageItem, ThumbnailsPosition } from "ng-gallery";
import { map } from "rxjs/operators";
import { SiteConfig } from "../../../models/SiteConfig";
import { PhoneSearch } from "../../../pipes/phoneSearch";
import { UpperCase } from "../../../pipes/upper";
import { SiteConfigService } from "../../../services/site-config.service";
// import { LightboxModule, Lightbox } from 'ng-gallery/lightbox';

@Component({
	selector: "app-propertydetail",
	imports: [
		CommonModule,
		NgbModule,
		FormsModule,
		ReactiveFormsModule,
		MatDialogModule,
		SearchComponent,
		MatFormFieldModule,
		MatInputModule,
		GoogleMapsModule,
		RouterModule,
		GalleryModule,
		PhoneSearch,
	],
	providers: [provideAnimations(), NgbCarouselConfig],
	templateUrl: "./propertydetail.component.html",
	encapsulation: ViewEncapsulation.None,
	styleUrls: ["./propertydetail.component.scss"],
	standalone: true,
})
export class PropertydetailComponent implements OnInit {
	property: PropertyModel | undefined;
	Latitude: number = 0;
	Longitude: number = 0;
	private loadingSubject = new BehaviorSubject<boolean>(false);
	loading$ = this.loadingSubject.asObservable();

	userForm!: FormGroup;
	userModel: InterestedUserModel = new InterestedUserModel();

	@ViewChild(MapInfoWindow) infoWindow: MapInfoWindow | undefined;
	galleryConfig$: Observable<GalleryConfig>;
	galleryRef: GalleryRef | undefined;
	zoom = 14;
	center: google.maps.LatLngLiteral = { lat: 56.1304, lng: 106.3468 }; // Center of Cananda

	selectedFilters: any = {
		propertyId: "",
		mlsId: "",
	};

	siteConfig: SiteConfig | undefined;
	private siteConfigSubscription: Subscription | undefined;

	constructor(
		breakpointObserver: BreakpointObserver,
		private route: ActivatedRoute,
		private propertyService: PropertyService,
		private titleService: Title,
		private location: Location,
		private router: Router,
		private fb: FormBuilder,
		private gallery: Gallery,
		private siteConfigService: SiteConfigService
	) {
		this.titleService.setTitle("Property Detail");

		this.galleryConfig$ = breakpointObserver.observe([Breakpoints.HandsetPortrait]).pipe(
			map((res) => {
				if (res.matches) {
					return {
						thumbPosition: ThumbnailsPosition.Top,
						thumbWidth: 80,
						thumbHeight: 80,
					};
				}
				return {
					thumbPosition: ThumbnailsPosition.Left,
					thumbWidth: 120,
					thumbHeight: 90,
				};
			})
		);
	}

	ngOnInit(): void {
		this.galleryRef = this.gallery.ref("propertyGallery");

		this.route.queryParams.subscribe((params) => {
			if (Object.keys(params).length > 0) {
				this.selectedFilters = {
					...this.selectedFilters,
					...params,
				};
				this.getPropertyInformation();
			}
		});

		this.siteConfigSubscription = this.siteConfigService.currentConfig$.subscribe((config) => {
			if (config) {
				this.siteConfig = config;
			}
		});

		const interestedUserInfo: any = "";

		this.userForm = this.fb.group({
			firstName: new FormControl(interestedUserInfo.firstName, Validators.required),
			phoneNumber: new FormControl(interestedUserInfo.phoneNumber, [
				Validators.required,
				Validators.pattern("^(([0-9]{3}) |[0-9]{3}-)[0-9]{3}-[0-9]{4}$"),
			]),
			emailAddress: new FormControl(interestedUserInfo.emailAddress, [Validators.required, Validators.email]),
			comment: new FormControl(
				interestedUserInfo.comment ? interestedUserInfo.comment : "I would like more information regarding a property",
				Validators.required
			),
		});

		this.userForm.valueChanges.subscribe((data) => {
			if (JSON.stringify(data) !== JSON.stringify({})) {
				this.userModel.firstName = data.firstName;
				this.userModel.phoneNumber = data.phoneNumber;
				this.userModel.emailAddress = data.emailAddress;
				this.userModel.comment = data.comment;
			}
		});

		this.getLocation();
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
		this.loadingSubject.next(true);
		this.propertyService.getProperty(this.selectedFilters.propertyId, this.selectedFilters.mlsId).subscribe({
			next: (response) => {
				this.property = response;
				this.center.lat = this.property.Latitude;
				this.center.lng = this.property.Longitude;
				if (this.galleryRef && this.property.Media) {
					this.property?.Media?.forEach((x) => {
						this.galleryRef?.add(
							new ImageItem({
								src: x.Media_url,
								thumb: x.Media_url,
							})
						);
					});
				}
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

	save() {
		// const { valid } = this.userForm;
		// if (valid) {
		// 	const userInfo = this.storageService.getLoggedUserFromUserInfo();
		// 	this.userModel.latitude = this.Latitude;
		// 	this.userModel.longitude = this.Longitude
		// 	this.userModel.propertyId = this.selectedFilters.propertyId;
		// 	this.userModel.mlsId = this.selectedFilters.mlsId;
		// 	this.userModel._id = userInfo._id;
		// 	this.userModel.templateId = userInfo.templateId;
		// 	this.loadingSubject.next(true);
		// 	this.interestdUserService.save(this.userModel).subscribe({
		// 		next: (v) => { },
		// 		error: (e) => {
		// 			this.notificationService.showNotification('Something went wrong while saving information');
		// 		},
		// 		complete: () => {
		// 			this.storageService.saveUserInfo(JSON.stringify(this.userModel), "InterestedUser");
		// 			this.notificationService.showNotification('Information has been saved');
		// 			this.loadingSubject.next(false);
		// 			this.userModel = new InterestedUserModel();
		// 			this.userForm.reset();
		// 		}
		// 	})
		// }
	}
}
