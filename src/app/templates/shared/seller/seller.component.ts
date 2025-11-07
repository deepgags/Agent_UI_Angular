import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Router } from "@angular/router";
import { SiteConfig } from "../../../models/SiteConfig";
import { SharedDataService } from "../../../services/shareddata.service";

@Component({
  selector: "app-seller",
  standalone: true,
  imports: [],
  templateUrl: "./seller.component.html",
  styleUrls: ["./seller.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class SellerComponent implements OnInit {
  siteConfig: SiteConfig = {} as SiteConfig;

  constructor(
    private router: Router,
    private sharedDataService: SharedDataService
  ) {}

  ngOnInit(): void {
    this.siteConfig = this.sharedDataService.siteData();
  }

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
