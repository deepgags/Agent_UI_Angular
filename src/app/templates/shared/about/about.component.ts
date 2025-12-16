import { Component, inject, signal } from "@angular/core";
import { environment } from "../../../environments/environment.development";
import { DomSanitizer, Meta, Title } from "@angular/platform-browser";
import { Router, RouterModule } from "@angular/router";
import { Page } from "../../../models/Page";
import { SiteConfig } from "../../../models/SiteConfig";
import { PhoneNumberFormatPipe } from "../../../pipes/phone-format";
import { PageService } from "../../../services/page.service";
import { SharedDataService } from "../../../services/shared-data.service";
import { TestimonialService } from "../../../services/testimonial.service";

@Component({
	selector: "app-about",
	imports: [RouterModule, PhoneNumberFormatPipe],
	templateUrl: "./about.component.html",
	styleUrl: "./about.component.scss",
})
export class AboutComponent {
localImageUrl = environment.localImageUrl;
	aboutText =
		"I believe every client has the right to be treated fairly, honestly and with integrity. My aim is to educate and prepare my clients to insure that they are always in a position to make informed decisions. Every engagement is an opportunity to create a lasting impression and a forever client. I well serving in real estate with the reputation of providing quality services and keeping excellent relations with the clients. My intend to provide our clients with the best personalized real estate experience from beginning to end. I enjoy sharing my expertise by giving you the scoop on the local real estate market. My aim is to guide & prepare our clients to ensure that they are always in a position to make informed decision. I put our client’s interest above everything. I am professionally trained and licensed realtors who work for seeking to experience satisfaction and feel good emotions.";

	siteConfig: SiteConfig = {} as SiteConfig;
	testimonials: any[] = [];
	siteId: string = "";

	private router = inject(Router);
	private pageService = inject(PageService);
	private titleService = inject(Title);
	private metaService = inject(Meta);
	private sanitizer = inject(DomSanitizer);
	private sharedDataService = inject(SharedDataService);
	private testimonialService = inject(TestimonialService);

	page = signal<Page | null>(null);
	loading = true;
	error: string | null = null;

	constructor() {}

	ngOnInit(): void {
		this.siteConfig = this.sharedDataService.siteData();
		this.siteId = this.sharedDataService.siteId();

		this.getTestimonials();

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

	getTestimonials() {
		this.testimonialService.getTestimonials(this.siteId).subscribe({
			next: (res: any) => {
				this.testimonials = res.data;
			},
			error: (error) => {
				console.error("Error loading testimonial:", error);
			},
		});
	}

	getSafeHtml(content: string | undefined) {
		return this.sanitizer.bypassSecurityTrustHtml(content ?? "");
	}
}
