import { CommonModule } from "@angular/common";
import { Component, inject, OnInit, signal, ViewEncapsulation } from "@angular/core";
import { DomSanitizer, Meta, Title } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { ButtonModule } from "primeng/button";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { Page } from "../../../models/Page";
import { SiteConfig } from "../../../models/SiteConfig";
import { PageService } from "../../../services/page.service";

@Component({
	selector: "app-buyer",
	standalone: true,
	imports: [CommonModule, ButtonModule, ProgressSpinnerModule],
	templateUrl: "./buyer.component.html",
	styleUrls: ["./buyer.component.scss"],
	encapsulation: ViewEncapsulation.None,
})
export class BuyerComponent implements OnInit {
	siteConfig: SiteConfig = {} as SiteConfig;
	private route = inject(ActivatedRoute);
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
}
