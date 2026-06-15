import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, ElementRef, Input, NgZone, ViewChild } from "@angular/core";

declare const google: any;

@Component({
	selector: "app-google-place",
	standalone: true,
	imports: [CommonModule],
	templateUrl: "./google-place.component.html",
	styleUrl: "./google-place.component.scss",
})
export class GooglePlaceComponent implements AfterViewInit {
	@Input("onPlaceSelect") onPlaceSelect: Function = () => {};
	@Input("placeholder") placeholder: string = "Enter Location";
	@ViewChild("container") containerRef!: ElementRef;

	constructor(private ngZone: NgZone) {}

	ngAfterViewInit(): void {
		this.waitForGoogleMaps();
	}

	private waitForGoogleMaps(attempts = 0): void {
		if (typeof google !== "undefined" && google?.maps?.importLibrary) {
			this.initAutocomplete();
		} else if (attempts < 40) {
			setTimeout(() => this.waitForGoogleMaps(attempts + 1), 250);
		} else {
			console.error("Google Maps JavaScript API not loaded after 10s.");
		}
	}

	private async initAutocomplete(): Promise<void> {
		const { PlaceAutocompleteElement } = (await google.maps.importLibrary("places")) as any;

		const placeAutocomplete = new PlaceAutocompleteElement({
			includedPrimaryTypes: ["geocode"],
			includedRegionCodes: ["ca"],
		});

		placeAutocomplete.setAttribute("placeholder", this.placeholder);

		this.containerRef.nativeElement.appendChild(placeAutocomplete);

		placeAutocomplete.addEventListener("gmp-placeselect", async (event: any) => {
			try {
				const place = event.place;
				await place.fetchFields({
					fields: ["location", "formattedAddress", "addressComponents"],
				});

				this.ngZone.run(() => {
					const normalizedPlace = {
						formatted_address: place.formattedAddress,
						geometry: {
							location: place.location, // LatLng — has .lat() and .lng()
						},
						address_components: place.addressComponents,
					};
					this.onPlaceSelect(normalizedPlace);
				});
			} catch (err) {
				console.error("PlaceAutocomplete fetchFields error:", err);
			}
		});
	}
}
