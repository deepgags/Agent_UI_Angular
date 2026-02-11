import { CommonModule } from "@angular/common";
import { Component, inject, signal, ViewChild } from "@angular/core";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { DomSanitizer, Meta, Title } from "@angular/platform-browser";
import { Router, RouterModule } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { IftaLabelModule } from "primeng/iftalabel";
import { InputMaskModule } from "primeng/inputmask";
import { InputTextModule } from "primeng/inputtext";
import { MultiSelectModule } from "primeng/multiselect";
import { SelectModule } from "primeng/select";
import { CaptchaComponent } from "../../../components/captcha/captcha.component";
import { environment } from "../../../environments/environment.development";
import { Page } from "../../../models/Page";
import { SiteConfig } from "../../../models/SiteConfig";
import { PhoneNumberFormatPipe } from "../../../pipes/phone-format";
import { NotificationService } from "../../../services/notification.service";
import { PageService } from "../../../services/page.service";
import { PublicService } from "../../../services/public.service";
import { SharedDataService } from "../../../services/shared-data.service";

@Component({
	selector: "app-contact",
	imports: [
		CommonModule,
		NgbModule,
		FormsModule,
		ReactiveFormsModule,
		RouterModule,
		PhoneNumberFormatPipe,
		IftaLabelModule,
		InputMaskModule,
		InputTextModule,
		SelectModule,
		MultiSelectModule,
		CaptchaComponent,
	],
	templateUrl: "./contact.component.html",
	styleUrl: "./contact.component.scss",
	standalone: true,
})
export class ContactComponent {
	contactForm!: FormGroup;
	siteConfig: SiteConfig = {} as SiteConfig;
	localImageUrl = environment.localImageUrl;
	page = signal<Page | null>(null);

	@ViewChild(CaptchaComponent) captchaComponent!: CaptchaComponent;

	userTypes = [
		{
			title: "Seller",
			value: "seller",
		},
		{
			title: "Buyer",
			value: "buyer",
		},
		{
			title: "Renter",
			value: "renter",
		},
		{
			title: "Buyer And Seller",
			value: "buyerAndSeller",
		},
	];

	private router = inject(Router);
	private pageService = inject(PageService);
	private titleService = inject(Title);
	private metaService = inject(Meta);
	private sanitizer = inject(DomSanitizer);
	private sharedDataService = inject(SharedDataService);
	private notificationService = inject(NotificationService);
	private publicService = inject(PublicService);

	constructor() {
		this.contactForm = new FormGroup({
			name: new FormControl("", Validators.required),
			email: new FormControl("", [Validators.required, Validators.email]),
			phone: new FormControl("", [Validators.required]),
			message: new FormControl("", Validators.required),
			userType: new FormControl("seller", Validators.required),
		});
	}

	get name() {
		return this.contactForm.get("name");
	}
	get email() {
		return this.contactForm.get("email");
	}
	get phone() {
		return this.contactForm.get("phone");
	}
	get message() {
		return this.contactForm.get("message");
	}

	get requestLeadType() {
		return this.contactForm.get("leadType");
	}

	ngOnInit(): void {
		this.siteConfig = this.sharedDataService.siteData();

		const preDefinedPage = this.router.url.replaceAll("/", "");
		if (preDefinedPage) {
			this.pageService.getPredefinedPageContent(preDefinedPage).subscribe({
				next: (res) => {
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
				error: (err) => {},
			});
		}
	}

	submitContactForm() {
		if (this.contactForm.invalid) {
			this.contactForm.markAllAsTouched();
			this.notificationService.showError("Please fill all required fields correctly.");
			return;
		}

		if (!this.captchaComponent.isCaptchaValid()) {
			this.notificationService.showError("Please solve the math problem correctly.");
			return;
		}

		const params = {
			...this.contactForm.value,
			leadSource: "contactForm",
			siteId: this.siteConfig?.id,
		};
		this.publicService.submitContactForm(params).subscribe({
			next: () => {
				this.notificationService.showSuccess("Your request has been submitted successfully.");
				this.contactForm.reset();
				this.captchaComponent.reset();
			},
			error: () => {
				this.notificationService.showError("Failed to submit request. Please try again later.");
			},
		});
	}

	getSafeHtml(content: string | undefined) {
		return this.sanitizer.bypassSecurityTrustHtml(content ?? "");
	}
}
