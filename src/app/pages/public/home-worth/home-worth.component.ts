import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";
import { GooglePlaceComponent } from "../../../components/google-place/google-place.component";
import { SiteConfig } from "../../../models/SiteConfig";
import { SharedDataService } from "../../../services/shareddata.service";

@Component({
	selector: "app-home-worth",
	imports: [RouterModule, GooglePlaceComponent],
	templateUrl: "./home-worth.component.html",
	styleUrl: "./home-worth.component.scss",
})
export class WorthComponent {
	siteConfig: SiteConfig = {} as SiteConfig;

	constructor(private sharedDataService: SharedDataService) {}

	ngOnInit(): void {
		this.siteConfig = this.sharedDataService.siteData();
	}

	onPlaceSelect() {}
}
