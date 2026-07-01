import { CommonModule } from "@angular/common";
import { Component, Input, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { AngularSvgIconModule } from "angular-svg-icon";
import { MenuComponent } from "../../../components/menu/menu.component";
import { SiteConfig } from "../../../models/SiteConfig";
import { PhoneNumberFormatPipe } from "../../../pipes/phone-format";
import { environment } from "../../../environments/environment.development";

@Component({
	selector: "app-t1-header",
	imports: [CommonModule, AngularSvgIconModule, PhoneNumberFormatPipe, RouterModule, MenuComponent],
	templateUrl: "./t1-header.component.html",
	styleUrls: ["./t1-header.component.scss", "../t1.component.scss"],
})
export class T1HeaderComponent implements OnInit {
	@Input("siteConfig") siteConfig: SiteConfig | any;
	localImageUrl = environment.localImageUrl;
	constructor() {}

	ngOnInit(): void {}
}
