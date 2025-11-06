import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SiteConfig } from "../../../models/SiteConfig";
import { PhoneNumberFormatPipe } from "../../../pipes/phone-format";
import { SharedDataService } from "../../../services/shareddata.service";
import { TestimonialService } from "../../../services/testimonial.service";

@Component({
	selector: "app-about",
	imports: [RouterModule, PhoneNumberFormatPipe],
	templateUrl: "./about.component.html",
	styleUrl: "./about.component.scss",
})
export class AboutComponent {
	aboutText =
		"I believe every client has the right to be treated fairly, honestly and with integrity. My aim is to educate and prepare my clients to insure that they are always in a position to make informed decisions. Every engagement is an opportunity to create a lasting impression and a forever client. Ajay is a well serving in real estate with the reputation of providing quality services and keeping excellent relations with the clients. My intend to provide our clients with the best personalized real estate experience from beginning to end. I enjoy sharing my expertise by giving you the scoop on the local real estate market. My aim is to guide & prepare our clients to ensure that they are always in a position to make informed decision. I put our client’s interest above everything. I am professionally trained and licensed realtors who work for seeking to experience satisfaction and feel good emotions.";

	siteConfig: SiteConfig = {} as SiteConfig;
	testimonials: any[] = [];
	siteId: string = "";

	constructor(private sharedDataService: SharedDataService, private testimonialService: TestimonialService) {}

	ngOnInit(): void {
		this.siteConfig = this.sharedDataService.siteData();
		this.siteId = this.sharedDataService.siteId();

		this.getTestimonials();
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
}
