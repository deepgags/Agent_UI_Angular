import { Component, Input, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { AngularSvgIconModule } from "angular-svg-icon";
import { MenuComponent } from "../../../components/menu/menu.component";
import { SiteConfig } from "../../../models/SiteConfig";
import { PhoneNumberFormatPipe } from "../../../pipes/phone-format";
import { SideMenuComponent } from "../../../components/side-menu/side-menu.component";

@Component({
	selector: "app-t5-header",
	imports: [AngularSvgIconModule, PhoneNumberFormatPipe, RouterModule, MenuComponent, SideMenuComponent],
	templateUrl: "./t5-header.component.html",
	styleUrls: ["./t5-header.component.scss", "../t5.component.scss"],
})
export class T5HeaderComponent implements OnInit {
	@Input("siteConfig") siteConfig: SiteConfig | any;

	constructor() {}

	ngOnInit(): void {}
}
