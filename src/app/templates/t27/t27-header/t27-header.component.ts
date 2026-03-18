import { Component, Input, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { AngularSvgIconModule } from "angular-svg-icon";
import { MenuComponent } from "../../../components/menu/menu.component";
import { SiteConfig } from "../../../models/SiteConfig";
import { PhoneNumberFormatPipe } from "../../../pipes/phone-format";
import { environment } from "../../../environments/environment.development";

@Component({
	selector: "app-t27-header",
	imports: [AngularSvgIconModule, PhoneNumberFormatPipe, RouterModule, MenuComponent],
	templateUrl: "./t27-header.component.html",
	styleUrls: ["./t27-header.component.scss", "../t27.component.scss"],
})
export class T27HeaderComponent implements OnInit {
	@Input("siteConfig") siteConfig: SiteConfig | any;
	localImageUrl = environment.localImageUrl;
	constructor() {}

	ngOnInit(): void {}
}
