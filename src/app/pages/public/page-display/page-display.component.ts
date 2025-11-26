import { CommonModule } from "@angular/common";
import { Component, OnInit, inject, signal } from "@angular/core";
import { DomSanitizer, Meta, Title } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { ButtonModule } from "primeng/button";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { Page } from "../../../models/Page";
import { PageService } from "../../../services/page.service";
@Component({
	selector: "app-page-display",
	standalone: true,
	imports: [CommonModule, ButtonModule, ProgressSpinnerModule],
	templateUrl: "./page-display.component.html",
	styleUrl: "./page-display.component.scss",
})
export class PageDisplayComponent implements OnInit {
	private route = inject(ActivatedRoute);
	private router = inject(Router);
	private pageService = inject(PageService);
	private titleService = inject(Title);
	private metaService = inject(Meta);
	private sanitizer = inject(DomSanitizer);

	page = signal<Page | null>(null);
	loading = true;
	error: string | null = null;

	ngOnInit() {
		this.route.params.subscribe((params) => {
			const slug = params["slug"];
			this.pageService.getPageBySlug(slug).subscribe({
				next: (res) => {
					this.loading = false;
					this.page.set(res);
					this.updateMetaTags(res);
				},
				error: (err) => {
					this.loading = false;
				},
			});
		});
	}

	private updateMetaTags(page: Page) {
		const title = page.metaTitle || page.title;
		this.titleService.setTitle(title);

		if (page.metaDescription) {
			this.metaService.updateTag({ name: "description", content: page.metaDescription });
		} else {
			this.metaService.updateTag({ name: "description", content: page.content });
		}

		if (page.keywords) {
			this.metaService.updateTag({ name: "keywords", content: page.keywords });
		}
	}

	getSafeHtml(content: string | undefined) {
		return this.sanitizer.bypassSecurityTrustHtml(content ?? "");
	}

	goBack() {
		this.router.navigate(["/"]);
	}
}
