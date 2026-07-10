import { CommonModule } from "@angular/common";
import { Component, Input, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { AngularSvgIconModule } from "angular-svg-icon";
import { MenuComponent } from "../../../components/menu/menu.component";
import { SiteConfig } from "../../../models/SiteConfig";
import { PhoneNumberFormatPipe } from "../../../pipes/phone-format";
import { environment } from "../../../environments/environment.development";

@Component({
	selector: "app-t2-header",
	imports: [CommonModule, AngularSvgIconModule, PhoneNumberFormatPipe, RouterModule, MenuComponent],
	templateUrl: "./t2-header.component.html",
	styleUrls: ["./t2-header.component.scss", "../t2.component.scss"],
})
export class T2HeaderComponent implements OnInit {
	@Input("siteConfig") siteConfig: SiteConfig | any;
	localImageUrl = environment.localImageUrl;
	constructor() {}

	ngOnInit(): void {}
}
