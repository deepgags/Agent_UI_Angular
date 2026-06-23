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
	@Input("onAddressChange") onAddressChange: Function = () => {};
	@Input("placeholder") placeholder: string = "Enter Location";
	@ViewChild("addressInput") inputRef!: ElementRef<HTMLInputElement>;

	suggestions: any[] = [];
	showSuggestions = false;
	private autocompleteService: any;
	private placesService: any;
	private debounceTimer: any;

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
			console.error("Google Maps JavaScript API not loaded.");
		}
	}

	private async initAutocomplete(): Promise<void> {
		const { AutocompleteService, PlacesService } = (await google.maps.importLibrary("places")) as any;

		this.autocompleteService = new AutocompleteService();
		this.placesService = new PlacesService(document.createElement("div"));
	}

	onInput(event: Event): void {
		const value = (event.target as HTMLInputElement).value.trim();
		this.onAddressChange(value);

		clearTimeout(this.debounceTimer);

		if (!value || value.length < 2) {
			this.suggestions = [];
			this.showSuggestions = false;
			return;
		}

		this.debounceTimer = setTimeout(() => {
			this.autocompleteService.getQueryPredictions({ input: value, componentRestrictions: { country: "ca" } }, (predictions: any[], status: any) => {
				this.ngZone.run(() => {
					if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
						this.suggestions = predictions;
						this.showSuggestions = true;
					} else {
						this.suggestions = [];
						this.showSuggestions = false;
					}
				});
			});
		}, 300);
	}

	selectSuggestion(prediction: any): void {
		this.showSuggestions = false;

		this.placesService.getDetails({ placeId: prediction.place_id, fields: ["formatted_address", "geometry", "address_components"] }, (place: any, status: any) => {
			this.ngZone.run(() => {
				if (status === google.maps.places.PlacesServiceStatus.OK && place) {
					if (this.inputRef?.nativeElement) {
						this.inputRef.nativeElement.value = place.formatted_address;
					}
					this.onAddressChange(place.formatted_address);
					this.onPlaceSelect({
						formatted_address: place.formatted_address,
						geometry: place.geometry,
						address_components: place.address_components,
					});
				}
			});
		});
	}

	onBlur(): void {
		setTimeout(() => {
			this.showSuggestions = false;
		}, 200);
	}

	onFocus(event: Event): void {
		const value = (event.target as HTMLInputElement).value.trim();
		if (value.length >= 2 && this.suggestions.length > 0) {
			this.showSuggestions = true;
		}
	}
}
