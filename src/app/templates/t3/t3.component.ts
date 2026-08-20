import { AfterViewInit, Component, OnDestroy, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SiteConfig } from "../../models/SiteConfig";
import { SharedDataService } from "../../services/shared-data.service";
import { T3FooterComponent } from "./t3-footer/t3-footer.component";
import { T3HeaderComponent } from "./t3-header/t3-header.component";

@Component({
	selector: "app-t3",
	imports: [T3HeaderComponent, T3FooterComponent, RouterModule],
	templateUrl: "./t3.component.html",
	styleUrl: "./t3.component.scss",
})
export class T3Component implements OnInit, AfterViewInit, OnDestroy {
	siteConfig: SiteConfig = {} as SiteConfig;
	private resizeObserver?: ResizeObserver;

	constructor(private sharedDataService: SharedDataService) {}

	ngOnInit(): void {
		this.siteConfig = this.sharedDataService.siteData();
	}

	ngAfterViewInit(): void {
		const headerEl = document.querySelector(".t3-header") as HTMLElement | null;
		if (!headerEl) {
			return;
		}

		if (typeof ResizeObserver !== "undefined") {
			this.resizeObserver = new ResizeObserver(() => this.syncHeaderHeight(headerEl));
			this.resizeObserver.observe(headerEl);
		} else {
			window.addEventListener("resize", () => this.syncHeaderHeight(headerEl));
		}

		setTimeout(() => this.syncHeaderHeight(headerEl), 200);
	}

	ngOnDestroy(): void {
		this.resizeObserver?.disconnect();
	}

	private syncHeaderHeight(headerEl: HTMLElement): void {
		document.documentElement.style.setProperty("--t3-header-height", `${headerEl.offsetHeight}px`);
	}
}
