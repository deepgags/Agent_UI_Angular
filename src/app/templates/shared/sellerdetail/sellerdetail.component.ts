import { CommonModule } from "@angular/common";
import { Component, inject, signal } from "@angular/core";
import { DomSanitizer, Meta, Title } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { ButtonModule } from "primeng/button";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { environment } from "../../../environments/environment.development";
import { Page } from "../../../models/Page";
import { PageService } from "../../../services/page.service";

@Component({
	selector: "app-sellerdetail",
	imports: [CommonModule, ButtonModule, ProgressSpinnerModule],
	templateUrl: "./sellerdetail.component.html",
	styleUrl: "./sellerdetail.component.scss",
})
export class SellerdetailComponent {
	localImageUrl = environment.localImageUrl;
	private router = inject(Router);
	private pageService = inject(PageService);
	private titleService = inject(Title);
	private metaService = inject(Meta);
	private sanitizer = inject(DomSanitizer);

	page = signal<Page | null>(null);
	loading = true;
	error: string | null = null;

	constructor() {}

	ngOnInit(): void {
		const preDefinedPage = this.router.url.replaceAll("/", "");
		if (preDefinedPage) {
			this.pageService.getPredefinedPageContent(preDefinedPage).subscribe({
				next: (res) => {
					this.loading = false;
					this.page.set(res);

					const title = res.metaTitle || res.title;
					this.titleService.setTitle(title);

					if (res.metaDescription) {
						this.metaService.updateTag({ name: "description", content: res.metaDescription });
					} else {
						this.metaService.updateTag({ name: "description", content: res.content });
					}

					if (res.keywords) {
						this.metaService.updateTag({ name: "keywords", content: res.keywords });
					}
				},
				error: (err) => {
					this.loading = false;
				},
			});
		}
	}

	getSafeHtml(content: string | undefined) {
		return this.sanitizer.bypassSecurityTrustHtml(content ?? "");
	}

	get heroImageSrc(): string {
		const heroImage = this.page()?.heroImages?.[0];
		return heroImage ? this.localImageUrl + heroImage : "/images/banner3.jpg";
	}
}
