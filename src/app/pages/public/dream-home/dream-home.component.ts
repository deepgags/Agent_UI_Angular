import { Component, Input } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SiteConfig } from "../../../models/SiteConfig";

@Component({
    selector: "app-dream-home",
    imports: [RouterModule],
    templateUrl: "./dream-home.component.html",
    styleUrl: "./dream-home.component.scss",
})
export class DreamComponent {
    	@Input("siteConfig") siteConfig: SiteConfig | any;

	constructor() {}

	ngOnInit(): void {}
}
