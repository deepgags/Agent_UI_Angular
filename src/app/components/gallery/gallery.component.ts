import { Component, Input } from "@angular/core";
import { GalleriaModule } from "primeng/galleria";
import { MediaModel } from "../../models/PropertyModel";

@Component({
	selector: "app-gallery",
	imports: [GalleriaModule],
	templateUrl: "./gallery.component.html",
	styleUrl: "./gallery.component.scss",
})
export class GalleryComponent {
	responsiveOptions: any[] = [
		{
			breakpoint: "1300px",
			numVisible: 4,
		},
		{
			breakpoint: "575px",
			numVisible: 1,
		},
	];

	@Input("images") images: any[] | MediaModel[] | undefined = [];
}
