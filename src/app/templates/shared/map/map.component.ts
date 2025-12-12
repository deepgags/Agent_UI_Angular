import { CommonModule } from "@angular/common";
import {
	AfterViewInit,
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	OnInit,
	ViewChild,
	ViewEncapsulation,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { GoogleMapsModule } from "@angular/google-maps";
import { MatDialog } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatPaginatorModule, PageEvent } from "@angular/material/paginator";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { MarkerClusterer, SuperClusterAlgorithm } from "@googlemaps/markerclusterer";
import { DialogService } from "primeng/dynamicdialog";
import { BehaviorSubject } from "rxjs";

import { PropertyComponent } from "../../../components/property/property.component";
import { sortTypes } from "../../../consts/DefaultTypes";
import { stringiFy } from "../../../consts/Utility";
import { environment } from "../../../environments/environment.development";
import { PropertyModel } from "../../../models/PropertyModel";
import { LoadingService } from "../../../services/loading.service";
import { PropertyService } from "../../../services/property.service";
import { SearchComponent } from "../search/search.component";

@Component({
	selector: "app-map",
	imports: [
		FormsModule,
		CommonModule,
		MatIconModule,
		SearchComponent,
		RouterModule,
		MatPaginatorModule,
		MatProgressSpinnerModule,
		GoogleMapsModule,
		PropertyComponent,
	],
	templateUrl: "./map.component.html",
	styleUrl: "./map.component.scss",
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	providers: [DialogService],
})
export class MapComponent implements OnInit, AfterViewInit {
	propertyImageUrl = environment.propertyImageUrl;
	propertiesList: PropertyModel[] | undefined;
	pageEvent: PageEvent | undefined;
	pageIndex: number = 1;
	pageSize: number = 100;
	private loadingSubject = new BehaviorSubject<boolean>(false);
	loading$ = this.loadingSubject.asObservable();

	Latitude: number = 0;
	Longitude: number = 0;
	zoom = 15;
	@ViewChild("mapComponent") mapComponent!: ElementRef<HTMLDivElement>;
	// @ViewChild('infoWindow') infoWindow!: ElementRef<MapInfoWindow>;
	previousInfoWindow: google.maps.InfoWindow | null = null;
	preventClose: boolean = false;
	map!: google.maps.Map;
	markerClusterer: MarkerClusterer | null = null;

	markers = [{ position: { lat: 56.1304, lng: 106.3468 }, property: new PropertyModel() }]; // Center of Canada

	selectedFilters: any = {
		address: "",
		property_type: "",
		property_subtype: "",
		bedrooms: "0",
		bathrooms: "0",
		min_price: "",
		max_price: "",
		property_status: "",
		sqFt: "",
		distance: "20",
		sort: "Most",
	};

	sortDropDown = sortTypes;

	constructor(
		private _interestedUserDialog: MatDialog,
		private propertyService: PropertyService,
		public loadingService: LoadingService,
		// private notificationService: NotificationService,
		// private storageService: StorageService,
		// private router: Router,
		private titleService: Title,
		private route: ActivatedRoute,
		private dialogService: DialogService
	) {
		this.titleService.setTitle("Properties on map");
	}

	ngAfterViewInit(): void {
		this.initMap();
	}

	initMap() {
		if (this.mapComponent) {
			this.map = new google.maps.Map(this.mapComponent.nativeElement, {
				center: { lat: 43.724934, lng: -79.7595439 },
				zoom: 8,
				mapTypeControl: true,
				mapId: "properties",
				disableDefaultUI: true,
				heading: 90,

				tilt: 45,
				zoomControl: true,
				streetViewControl: false,
				fullscreenControl: true,
				clickableIcons: true,
				gestureHandling: "greedy",
			});
		}
	}

	ngOnInit(): void {
		// this.pageIndex = 1;
		// this.pageSize = 12;
		this.getLocation();
		this.route.queryParams.subscribe((params) => {
			if (Object.keys(params).length > 0) {
				this.selectedFilters = {
					...this.selectedFilters,
					...params,
				};
				this.searchProperties(params);
			}
		});
	}

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

	// openUserSignupDialog(property: PropertyModel) {
	// TODO: OPen user Signup dialog
	// const userDialog = this._interestedUserDialog.open(InterestedUserComponent, {
	// 	width: "50%",
	// 	height: "auto",
	// 	disableClose: true,
	// 	autoFocus: false,
	// 	restoreFocus: false,
	// 	hasBackdrop: true,
	// 	data: property,
	// });
	// userDialog.afterClosed().subscribe((result) => {
	// 	if (result) {
	// 		this.redirectToDetail(property);
	// 	}
	// });
	// }

	async openInfoWindow(marker: google.maps.Marker, content: string, properties: PropertyModel[] = []) {
		if (this.previousInfoWindow) {
			this.previousInfoWindow.close();
		}
		const informationwindow = new google.maps.InfoWindow({
			content: content,
			maxWidth: 360,
		});
		google.maps.event.addListener(informationwindow, "domready", () => {
			const iwOuter = document.querySelector(".gm-style-iw") as HTMLElement;
			if (iwOuter) {
				iwOuter.addEventListener("mouseenter", () => {
					this.preventClose = true;
				});
				iwOuter.addEventListener("mouseleave", () => {
					this.preventClose = false;
					informationwindow.close();
				});
			}
			const buttons = document.querySelectorAll("[data-action]");
			buttons.forEach((btn) => {
				btn.addEventListener("click", (e) => {
					const action = btn.getAttribute("data-action");
					const cid = btn.getAttribute("data-carousel");
					const img = document.getElementById(`img-${cid}`) as HTMLImageElement;
					if (img) {
						const images = JSON.parse(img.getAttribute("data-images") || "[]");
						let current = parseInt(img.getAttribute("data-current") || "0");
						if (action === "next") {
							current = (current + 1) % images.length;
						} else if (action === "prev") {
							current = (current - 1 + images.length) % images.length;
						}
						img.src = this.propertyImageUrl + images[current];
						img.setAttribute("data-current", current.toString());
					}
				});
			});
			const propertyDivs = document.querySelectorAll("[data-index]");
			propertyDivs.forEach((div) => {
				const index = parseInt(div.getAttribute("data-index") || "0");
				const property = properties[index];
				if (property) {
					div.addEventListener("click", () => {
						this.selectProperty(property);
					});
				}
			});
		});
		informationwindow.open(this.map, marker);
		this.previousInfoWindow = informationwindow;
	}

	// toggleHighlight(markerView:any) {
	//   if (markerView.content.classList.contains("highlight")) {
	//     markerView.content.classList.remove("highlight");
	//     markerView.zIndex = null;
	//   } else {
	//     markerView.content.classList.add("highlight");
	//     markerView.zIndex = 1;
	//   }
	// }

	getRandomColor() {
		let n = (Math.random() * 0xfffff * 1000000).toString(16);
		return "#" + n.slice(0, 6);
	}

	buildPropertyContent(property: PropertyModel, index: number = 0): string {
		const media = property.Media || [];
		const carouselId = `carousel-${property.ListingKey || "default"}`;
		const images = media.length > 0 ? media.map((m) => m.Media_url) : ["/images/commercial_no_Image.jpg"];
		const currentSrc = this.propertyImageUrl + images[0];
		const imagesJson = JSON.stringify(images);

		const controls =
			images.length > 1
				? `<button data-action="prev" data-carousel="${carouselId}" style="position: absolute; left: 10px; top: 50%; transform: translateY(-50%); background: rgba(0,0,0,0.5); color: white; border: none; padding: 5px; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; cursor: pointer;"><i class="bi bi-chevron-left"></i></button>
				<button data-action="next" data-carousel="${carouselId}" style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: rgba(0,0,0,0.5); color: white; border: none; padding: 5px; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; cursor: pointer;"><i class="bi bi-chevron-right"></i></button>`
				: "";

		const priceFormatted = property.ListPrice ? `$${property.ListPrice.toLocaleString()}` : "Price not available";
		const beds = property.BedroomsTotal
			? `<div style="margin-right: 1rem;"><span style="font-weight: 600;">Bed ·</span> ${property.BedroomsTotal}</div>`
			: "";
		const baths = property.BathroomsTotalInteger
			? `<div style="margin-right: 1rem;"><span style="font-weight: 600;">Bath ·</span> ${property.BathroomsTotalInteger}</div>`
			: "";
		const area = property.BuildingAreaTotal
			? `<div><span style="font-weight: 600;">Area ·</span> ${property.BuildingAreaTotal} ${property.BuildingAreaUnits}</div>`
			: "";
		const officeName = property.ListOfficeName || "N/A";
		const mls = property.ListingKey || "N/A";
		const modificationDate = property.ModificationTimestamp
			? new Date(property.ModificationTimestamp).toLocaleDateString()
			: "N/A";

		const width = "300px";
		const imgHeight = "200px";
		const fontSize = "1.5rem";
		const padding = "1rem";
		const marginBottom = "10px";

		return `<div data-index="${index}" style="width: ${width}; font-family: Arial, sans-serif; border: 1px solid #dee2e6; border-radius: 0.375rem; overflow: hidden; margin-bottom: ${marginBottom};">
		<div style="position: relative;"">
		<img id="img-${carouselId}" src="${currentSrc}" data-images='${imagesJson}' data-current="0" alt="Property image" onerror="this.src='/images/commercial_no_Image.jpg'" style="width: 100%; height: ${imgHeight}; object-fit: cover;">
				${controls}
		</div>
		<div style="padding: ${padding};">
				<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
					<p style="margin: 0; font-size: ${fontSize}; font-weight: 600;">${priceFormatted}</p>
					<span style="font-weight: 600;">${property.PropertySubType || "N/A"}</span>
					</div>
					<span style="display: inline-block; padding: 0.25rem 0.5rem; background-color: #007bff; color: white; border-radius: 0.25rem; font-size: 0.875rem;">${
						property.TransactionType || "N/A"
					}</span>
			<p style="margin: 0.25rem 0; display: flex; align-items: center;"><i class="fa-solid fa-location-dot" style="margin-right: 0.5rem;"></i>
			 ${property.UnparsedAddress || "N/A"}
			 </p>
			<div style="display: flex; justify-content: space-between; align-items: center;">
				<div style="display: flex; align-items: center;">
						${beds}${baths}${area}
				</div>
				<p style="margin: 0; padding-top: 0.5rem; font-weight: 600;">MLS® ${mls}</p>
			</div>
			<div style="display: flex; justify-content: space-between; align-items: center;">
					<p style="margin: 0; padding-top: 0.5rem; font-weight: 600;">${officeName}</p>
					<small style="color: #6c757d;">${modificationDate}</small>
			</div>
		</div>
	</div>`;
	}

	selectProperty = (property: PropertyModel): void => {
		this.propertyService.selectProperty(property, this.selectedFilters);
		// if (property.IsFeatureListing) {
		// 	this.openUserSignupDialog(property);
		// } else {
		// 	this.openPropertyDetails(property);
		// }
	};

	// openPropertyDetails(property: PropertyModel): void {
	// 	this.dialogService.open(PropertyDetailComponent, {
	// 		header: `Property Information`,
	// 		width: "70%",
	// 		maximizable: true,
	// 		closable: true,
	// 		modal: true,
	// 		data: {
	// 			propertyId: property._id,
	// 			mlsId: property.ListingKey,
	// 			address: stringiFy(this.selectedFilters.address),
	// 			property_type: stringiFy(this.selectedFilters.property_type),
	// 			property_subtype: stringiFy(this.selectedFilters.property_subtype),
	// 		},
	// 	});
	// }

	zoomToFitMarkers(markers: { position: { lat: number; lng: number }; property: PropertyModel }[] = []): void {
		const bounds = new google.maps.LatLngBounds();
		// if(markers.length > 0)
		// {
		//   this.markers = markers;
		// }

		this.markers.forEach((marker) => {
			bounds.extend(marker.position);
		});

		if (this.markers.length > 0) {
			this.map?.setCenter(bounds.getCenter());
			this.map?.fitBounds(bounds);
		}
	}

	sortChange(sort: any): void {
		this.selectedFilters.sort = sort;
		this.searchProperties(this.selectedFilters);
	}

	searchProperties = (selectedFilters: any, event?: PageEvent) => {
		this.pageIndex = event ? event.pageIndex + 1 : this.pageIndex;
		this.pageSize = event?.pageSize ?? this.pageSize;

		const sort = selectedFilters.sort && selectedFilters.sort != "" ? selectedFilters.sort : "most";

		const params = {
			page: this.pageIndex,
			pageSize: this.pageSize,
			address: stringiFy(selectedFilters.address),
			property_type: stringiFy(selectedFilters.property_type),
			property_subtype: stringiFy(selectedFilters.property_subtype),
			bedrooms: stringiFy(selectedFilters.bedrooms),
			bathrooms: stringiFy(selectedFilters.bathrooms),
			property_for: stringiFy(selectedFilters.property_status),
			min_price: stringiFy(selectedFilters.min_price),
			max_price: stringiFy(selectedFilters.max_price),
			sqFt: stringiFy(selectedFilters.sqFt),
			distance: stringiFy(selectedFilters.distance),
			latitude: this.Latitude,
			longitude: this.Longitude,
			sort: sort,
			city: "",
		};

		this.loadingService.loadingOn();
		this.loadingSubject.next(true);

		this.propertyService.searchProperties(params).subscribe({
			next: async (response) => {
				// console.log(response);
				this.propertiesList = response;
				this.markers = [];

				if (this.markerClusterer) {
					this.markerClusterer.clearMarkers();
				}

				this.propertiesList.forEach(async (x) => {
					// console.log(x.Latitude, x.Longitude);
					if (x.Latitude && x.Longitude) {
						this.markers.push({ position: { lat: x.Latitude, lng: x.Longitude }, property: x });
					}
				});

				const markersForCluster = this.markers.map((markerData) => {
					const svg = `
						<svg fill="#fa1e6b" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240">
						<circle cx="120" cy="120" r="100" />
						<text x="120" y="135" font-size="60" text-anchor="middle" fill="white">1</text>
						</svg>`;

					const marker = new google.maps.Marker({
						position: markerData.position,
						icon: {
							url: `data:image/svg+xml;base64,${btoa(svg)}`,
							scaledSize: new google.maps.Size(40, 40),
						},
					});

					marker.set("property", markerData.property);

					marker.addListener("click", () => {
						const property = marker.get("property");
						if (property) {
							const content = this.buildPropertyContent(property);

							this.openInfoWindow(marker, content, [property]);
						}
					});
					return marker;
				});

				const renderer = {
					render: (cluster: any, stats: any, map: any) => {
						const count = cluster.count;
						const position = cluster.position;

						const price = count === 1 ? cluster.markers[0].get("property").ListPrice : 0;
						const priceLabel = price > 0 ? `$${(price / 1000).toFixed(0)}K` : "";

						const svg = `
<svg fill="#fa1e6b" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240">
<circle cx="120" cy="120" r="100" />
<text x="120" y="135" font-size="60" text-anchor="middle" fill="white">${count}</text>
</svg>`;

						const clusterMarker = new google.maps.Marker({
							position,
							icon: {
								url: `data:image/svg+xml;base64,${btoa(svg)}`,
								scaledSize: new google.maps.Size(40, 40),
							},
							map,
						});

						clusterMarker.addListener("mouseover", async () => {
							let content = "";
							if (count > 1) {
								content = `<div class="cluster-info-content">`;
								let i = 0;
								cluster.markers.forEach((marker: any) => {
									const property = marker.get("property");
									if (property) {
										content += this.buildPropertyContent(property, i);
										i++;
									}
								});
								content += `</div>`;
							} else {
								const property = cluster.markers[0].get("property");
								if (property) {
									content = this.buildPropertyContent(property, 0);
								}
							}
							await this.openInfoWindow(
								clusterMarker,
								content,
								count > 1
									? cluster.markers
											.map((m: any) => m.get("property") as PropertyModel)
											.filter((p: PropertyModel | undefined) => p)
									: [cluster.markers[0].get("property") as PropertyModel].filter(
											(p: PropertyModel | undefined) => p
									  )
							);
						});

						clusterMarker.addListener("mouseout", () => {
							setTimeout(() => {
								if (this.previousInfoWindow && !this.preventClose) {
									this.previousInfoWindow.close();
								}
							}, 100);
						});

						clusterMarker.addListener("click", () => {
							if (count > 1) {
								map.fitBounds(cluster.bounds);
							}
						});

						return clusterMarker;
					},
				};

				if (!this.markerClusterer) {
					this.markerClusterer = new MarkerClusterer({
						map: this.map,
						renderer: renderer,
						algorithm: new SuperClusterAlgorithm({ minPoints: 2 }),
					});
				}

				this.markerClusterer.addMarkers(markersForCluster);

				this.zoomToFitMarkers();
			},
			error: (err) => {
				// this.notificationService.showNotification("Error occurred while getting properties");
			},
			complete: () => {
				this.loadingSubject.next(false);
			},
		});
		return event;
	};
}
