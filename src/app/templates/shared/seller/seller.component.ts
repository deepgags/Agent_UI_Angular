import { Component } from "@angular/core";
import { Router } from "@angular/router";

@Component({
	selector: "app-seller",
	imports: [],
	templateUrl: "./seller.component.html",
	styleUrl: "./seller.component.scss",
})
export class SellerComponent {

	constructor(private router: Router) { }

	goToSellerDetail() {
		this.router.navigate(["/sellerdetails"]);
	}

	goToReSellDetail() {
		this.router.navigate(["/sellerdetails2"]);
	}

	goToSellerCommonSellingMistake() {
		this.router.navigate(["/sellerdetails3"]);
	}
}
