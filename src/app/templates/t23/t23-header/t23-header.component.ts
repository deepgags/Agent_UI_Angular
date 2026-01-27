import { Component, Input, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { AngularSvgIconModule } from "angular-svg-icon";
import { MenuComponent } from "../../../components/menu/menu.component";
import { SiteConfig } from "../../../models/SiteConfig";
import { PhoneNumberFormatPipe } from "../../../pipes/phone-format";
import { environment } from "../../../environments/environment.development";

@Component({
	selector: "app-t23-header",
	imports: [AngularSvgIconModule, PhoneNumberFormatPipe, RouterModule, MenuComponent],
	templateUrl: "./t23-header.component.html",
	styleUrls: ["./t23-header.component.scss", "../t23.component.scss"],
})
export class T23HeaderComponent implements OnInit {
	@Input("siteConfig") siteConfig: SiteConfig | any;
	localImageUrl = environment.localImageUrl;
	constructor() {}

	ngOnInit(): void {}
}
