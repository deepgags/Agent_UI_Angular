import { Component, Input } from "@angular/core";
import { GalleriaModule } from "primeng/galleria";
import { environment } from "../../environments/environment.development";
import { PropertyModel } from "../../models/PropertyModel";
import { TimeAgo } from "../../pipes/time-ago";
@Component({
	selector: "app-property",
	imports: [TimeAgo, GalleriaModule],
	templateUrl: "./property.component.html",
	styleUrl: "./property.component.scss",
})
export class PropertyComponent {
	imageUrl = environment.imageUrl;
	@Input("property") property!: PropertyModel;
	@Input("onPropertyClick") onPropertyClick: Function = () => {};
}
