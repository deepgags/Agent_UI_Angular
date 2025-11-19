import { Component, Input } from "@angular/core";
import { GalleriaModule } from "primeng/galleria";
import { environment } from "../../environments/environment.development";
import { PropertyModel } from "../../models/PropertyModel";
import { TimeAgo } from "../../pipes/time-ago";
import { SharedDataService } from "../../services/shared-data.service";
@Component({
	selector: "app-property",
	imports: [TimeAgo, GalleriaModule],
	templateUrl: "./property.component.html",
	styleUrl: "./property.component.scss",
})
export class PropertyComponent {
	imageUrl = environment.imageUrl;
	isUserLoggedIn = false;
	@Input("property") property!: PropertyModel;
	@Input("onPropertyClick") onPropertyClick: Function = () => {};

	activeIndex: number = 0;

	constructor(private sharedDataService: SharedDataService) {
		this.isUserLoggedIn = this.sharedDataService.userToken() ? true : false;
	}

	previousImage(event: any) {
		const _length = this.property.Media?.length || 0;
		if (this.activeIndex > 0) {
			this.activeIndex--;
		} else {
			this.activeIndex = _length - 1;
		}
	}
	nextImage(event: any) {
		const _length = this.property.Media?.length || 0;
		if (_length && _length - 1 == this.activeIndex) {
			this.activeIndex = 0;
		} else {
			this.activeIndex++;
		}
	}
}
