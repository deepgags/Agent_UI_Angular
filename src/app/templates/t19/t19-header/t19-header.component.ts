import { Component, Input, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { AngularSvgIconModule } from "angular-svg-icon";
import { MenuComponent } from "../../../components/menu/menu.component";
import { SiteConfig } from "../../../models/SiteConfig";
import { PhoneNumberFormatPipe } from "../../../pipes/phone-format";
import { environment } from "../../../environments/environment.development";

@Component({
	selector: "app-t19-header",
	imports: [AngularSvgIconModule, PhoneNumberFormatPipe, RouterModule, MenuComponent],
	templateUrl: "./t19-header.component.html",
	styleUrls: ["./t19-header.component.scss", "../t19.component.scss"],
})
export class T19HeaderComponent implements OnInit {
	@Input("siteConfig") siteConfig: SiteConfig | any;
	localImageUrl = environment.localImageUrl;
	constructor() {}

	ngOnInit(): void {}
}
