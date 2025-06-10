import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { ExtendedRouteService } from "../../../services/extended-route.service";

@Component({
	selector: "app-seller",
	imports: [],
	templateUrl: "./seller.component.html",
	styleUrl: "./seller.component.scss",
})
export class SellerComponent {
	constructor(private extendedRouter: ExtendedRouteService) {}

	goToSellerDetail() {
		this.extendedRouter.navigateToSharedPage("sellerdetails");
	}

	goToReSellDetail() {
		this.extendedRouter.navigateToSharedPage("sellerdetails2");
	}

	goToSellerCommonSellingMistake() {
		this.extendedRouter.navigateToSharedPage("sellerdetails3");
	}
}
