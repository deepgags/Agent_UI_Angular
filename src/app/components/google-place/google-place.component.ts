import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, NgZone, Output, ViewChild } from "@angular/core";

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
	@ViewChild("search") public searchElementRef!: ElementRef;

	constructor(private ngZone: NgZone) {}

	ngAfterViewInit(): void {
		if (typeof google !== "undefined" && google.maps && google.maps.places) {
			this.initAutocomplete();
		} else {
			console.error("Google Maps JavaScript API not loaded.");
		}
	}

	private initAutocomplete(): void {
		const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
			types: ["geocode"],
			componentRestrictions: { country: "ca" }, // Restrict to Canada
		});

		autocomplete.addListener("place_changed", () => {
			this.ngZone.run(() => {
				const place: google.maps.places.PlaceResult = autocomplete.getPlace();

				if (place.geometry === undefined || place.geometry === null) {
					return;
				}

				// Call the input function with the selected place details
				this.onPlaceSelect(place);
			});
		});
	}
}
