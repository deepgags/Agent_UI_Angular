import { HttpClient } from "@angular/common/http";
import { DOCUMENT, Inject, Injectable } from "@angular/core";
import { Route } from "@angular/router";
import { environment } from "../environments/environment.development";
import { templates } from "../templates";
import { SharedDataService } from "./shared-data.service";

interface PreviewFallbacks {
	identity: {
		firstName: string;
		lastName: string;
		businessName: string;
		designation: string;
	};
	images: {
		profileImage: string;
		logoImage: string;
		brokerageImage: string;
		secondaryProfileImage: string;
		heroImages: string[];
	};
	contactInfo: {
		email: string;
		phone: string;
		address: string;
		streetAddress: string;
		municipality: string;
		province: string;
		postalCode: string;
	};
	socialLinks: {
		facebook: string;
		twitter: string;
		instagram: string;
		linkedin: string;
		youtube: string;
	};
	content: {
		aboutText: string;
		contactText: string;
		sellingYourHouseText: string;
		renovatingForResellText: string;
		commonSellingMistakeText: string;
		buyerText: string;
		homeSectionText1: string;
		homeSectionText2: string;
		homeSectionText3: string;
		homeSectionText4: string;
	};
}

const PREVIEW_FALLBACKS: PreviewFallbacks = {
	identity: {
		firstName: "Alex",
		lastName: "Morgan",
		businessName: "Premier Home Advisors",
		designation: "Real Estate Consultant",
	},
	images: {
		profileImage: "/images/agent-1.png",
		logoImage: "/images/Nologo.png",
		brokerageImage: "/images/Nologo.png",
		secondaryProfileImage: "/images/agent-2.png",
		heroImages: ["/images/banner3.jpg", "/images/banner2.png", "/images/banner.png"],
	},
	contactInfo: {
		email: "hello@preview-example.com",
		phone: "123-456-7890",
		address: "123 Preview Street, Sample City",
		streetAddress: "123 Preview Street",
		municipality: "Sample City",
		province: "ON",
		postalCode: "A1A 1A1",
	},
	socialLinks: {
		facebook: "https://facebook.com/preview-profile",
		twitter: "https://x.com/preview-profile",
		instagram: "https://instagram.com/preview-profile",
		linkedin: "https://linkedin.com/company/preview-profile",
		youtube: "https://youtube.com/@preview-profile",
	},
	content: {
		aboutText:
			"This is preview content to help visualize your website when profile details are incomplete.",
		contactText:
			"Use this section to introduce your communication style, response time, and preferred contact channels.",
		sellingYourHouseText:
			"Our selling framework focuses on market timing, pricing strategy, and high-impact marketing.",
		renovatingForResellText:
			"Targeted renovations can improve presentation and buyer confidence before listing.",
		commonSellingMistakeText:
			"Avoid overpricing, weak listing media, and delayed follow-up to maximize qualified offers.",
		buyerText:
			"We guide buyers from first search to final closing with clear communication and local market insight.",
		homeSectionText1:
			"Discover communities, schools, and amenities that align with your lifestyle and long-term goals.",
		homeSectionText2:
			"Access curated listings and market insights tailored to your budget and timeline.",
		homeSectionText3:
			"Get step-by-step guidance from consultation through closing with a reliable local expert.",
		homeSectionText4:
			"Plan your next move confidently with practical advice for buying, selling, and investing.",
	},
};

@Injectable({
	providedIn: "root",
})
export class RoutesConfigService {
	constructor(
		private http: HttpClient,
		@Inject(DOCUMENT) private document: Document,
		private sharedDataService: SharedDataService,
	) {}

	async loadSiteConfiguration(): Promise<Route> {
		const hostname = this.document.location.hostname;
		try {
			const response = (await this.http
				.get(`${environment.baseUrl}/customer/web`, { params: { domain: hostname } })
				.toPromise()) as any;

			const { customer, mainMenu, sideMenu, team, cities, heroImages, meta, homeSections } = response.data;

			const params = new URLSearchParams(this.document.location.search);
			const previewTemplateKey = params.get("templatePreview")?.trim();
			const configuredTemplateId = customer.websiteSettings.templateId;
			const isPreviewMode = Boolean(previewTemplateKey && templates[previewTemplateKey]);
			const templateId = isPreviewMode ? previewTemplateKey! : configuredTemplateId;

			const normalized = isPreviewMode
				? this.applyPreviewFallbacks(customer, heroImages, homeSections)
				: {
					customer,
					heroImages,
					homeSections,
				};

			if (normalized.customer.websiteSettings.primaryColor) {
				this.document.documentElement.style.setProperty(
					"--primary-color",
					normalized.customer.websiteSettings.primaryColor,
				);
			}
			if (normalized.customer.websiteSettings.secondaryColor) {
				this.document.documentElement.style.setProperty(
					"--secondary-color",
					normalized.customer.websiteSettings.secondaryColor,
				);
			}

			normalized.customer.websiteSettings.contactInfo.address = this.formatContactAddress(
				normalized.customer.websiteSettings.contactInfo,
			);

			this.sharedDataService.setSiteData(normalized.customer);
			this.sharedDataService.setUserData(normalized.customer);
			this.sharedDataService.setSiteId(normalized.customer._id);
			if (mainMenu) {
				this.sharedDataService.setMainMenu(mainMenu);
			}

			if (sideMenu) {
				this.sharedDataService.setSideMenu(sideMenu);
			}

			if (team) {
				this.sharedDataService.setTeam(team);
			}

			if (cities) {
				this.sharedDataService.setCities(cities);
			}

			if (normalized.heroImages) {
				this.sharedDataService.setHeroImages(normalized.heroImages);
			}

			if (normalized.homeSections) {
				this.sharedDataService.setHomeSections(normalized.homeSections);
			}

			if (meta) {
				this.sharedDataService.setHomeMeta(meta);
			}

			return templates[templateId] || templates["t1"];
		} catch (error: any) {
			console.error("Failed to load site configuration:", error);
			return templates["t1"];
		}
	}

	private applyPreviewFallbacks(customer: any, heroImages: any, homeSections: any) {
		const normalizedCustomer = this.deepClone(customer);
		normalizedCustomer.websiteSettings = normalizedCustomer.websiteSettings ?? {};

		this.assignIfMissing(normalizedCustomer, "firstName", PREVIEW_FALLBACKS.identity.firstName);
		this.assignIfMissing(normalizedCustomer, "lastName", PREVIEW_FALLBACKS.identity.lastName);
		this.assignIfMissing(normalizedCustomer, "businessName", PREVIEW_FALLBACKS.identity.businessName);
		this.assignIfMissing(normalizedCustomer, "designation", PREVIEW_FALLBACKS.identity.designation);

		this.assignIfMissing(
			normalizedCustomer.websiteSettings,
			"profileImage",
			PREVIEW_FALLBACKS.images.profileImage,
		);
		this.assignIfMissing(normalizedCustomer.websiteSettings, "logoImage", PREVIEW_FALLBACKS.images.logoImage);
		this.assignIfMissing(
			normalizedCustomer.websiteSettings,
			"brokerageImage",
			PREVIEW_FALLBACKS.images.brokerageImage,
		);

		normalizedCustomer.websiteSettings.contactInfo = normalizedCustomer.websiteSettings.contactInfo ?? {};
		this.assignIfMissing(
			normalizedCustomer.websiteSettings.contactInfo,
			"email",
			PREVIEW_FALLBACKS.contactInfo.email,
		);
		this.assignIfMissing(
			normalizedCustomer.websiteSettings.contactInfo,
			"phone",
			PREVIEW_FALLBACKS.contactInfo.phone,
		);
		this.assignIfMissing(
			normalizedCustomer.websiteSettings.contactInfo,
			"address",
			PREVIEW_FALLBACKS.contactInfo.address,
		);
		this.assignIfMissing(
			normalizedCustomer.websiteSettings.contactInfo,
			"streetAddress",
			PREVIEW_FALLBACKS.contactInfo.streetAddress,
		);
		this.assignIfMissing(
			normalizedCustomer.websiteSettings.contactInfo,
			"municipality",
			PREVIEW_FALLBACKS.contactInfo.municipality,
		);
		this.assignIfMissing(
			normalizedCustomer.websiteSettings.contactInfo,
			"province",
			PREVIEW_FALLBACKS.contactInfo.province,
		);
		this.assignIfMissing(
			normalizedCustomer.websiteSettings.contactInfo,
			"postalCode",
			PREVIEW_FALLBACKS.contactInfo.postalCode,
		);

		normalizedCustomer.websiteSettings.socialLinks = normalizedCustomer.websiteSettings.socialLinks ?? {};
		this.assignIfMissing(
			normalizedCustomer.websiteSettings.socialLinks,
			"facebook",
			PREVIEW_FALLBACKS.socialLinks.facebook,
		);
		this.assignIfMissing(
			normalizedCustomer.websiteSettings.socialLinks,
			"twitter",
			PREVIEW_FALLBACKS.socialLinks.twitter,
		);
		this.assignIfMissing(
			normalizedCustomer.websiteSettings.socialLinks,
			"instagram",
			PREVIEW_FALLBACKS.socialLinks.instagram,
		);
		this.assignIfMissing(
			normalizedCustomer.websiteSettings.socialLinks,
			"linkedin",
			PREVIEW_FALLBACKS.socialLinks.linkedin,
		);
		this.assignIfMissing(
			normalizedCustomer.websiteSettings.socialLinks,
			"youtube",
			PREVIEW_FALLBACKS.socialLinks.youtube,
		);

		this.assignIfMissing(normalizedCustomer.websiteSettings, "aboutText", PREVIEW_FALLBACKS.content.aboutText);
		this.assignIfMissing(
			normalizedCustomer.websiteSettings,
			"contactText",
			PREVIEW_FALLBACKS.content.contactText,
		);
		this.assignIfMissing(
			normalizedCustomer.websiteSettings,
			"sellingYourHouseText",
			PREVIEW_FALLBACKS.content.sellingYourHouseText,
		);
		this.assignIfMissing(
			normalizedCustomer.websiteSettings,
			"renovatingForResellText",
			PREVIEW_FALLBACKS.content.renovatingForResellText,
		);
		this.assignIfMissing(
			normalizedCustomer.websiteSettings,
			"commonSellingMistakeText",
			PREVIEW_FALLBACKS.content.commonSellingMistakeText,
		);
		this.assignIfMissing(normalizedCustomer.websiteSettings, "buyerText", PREVIEW_FALLBACKS.content.buyerText);

		if (normalizedCustomer.secondaryAgent) {
			this.assignIfMissing(
				normalizedCustomer.secondaryAgent,
				"profileImage",
				PREVIEW_FALLBACKS.images.secondaryProfileImage,
			);
		}

		const normalizedHeroImages =
			Array.isArray(heroImages) && heroImages.filter((img: unknown) => typeof img === "string" && img.trim())
				.length > 0
				? heroImages
				: PREVIEW_FALLBACKS.images.heroImages;

		const normalizedHomeSections = { ...(homeSections ?? {}) };
		this.assignIfMissing(
			normalizedHomeSections,
			"homeSectionText1",
			PREVIEW_FALLBACKS.content.homeSectionText1,
		);
		this.assignIfMissing(
			normalizedHomeSections,
			"homeSectionText2",
			PREVIEW_FALLBACKS.content.homeSectionText2,
		);
		this.assignIfMissing(
			normalizedHomeSections,
			"homeSectionText3",
			PREVIEW_FALLBACKS.content.homeSectionText3,
		);
		this.assignIfMissing(
			normalizedHomeSections,
			"homeSectionText4",
			PREVIEW_FALLBACKS.content.homeSectionText4,
		);

		return {
			customer: normalizedCustomer,
			heroImages: normalizedHeroImages,
			homeSections: normalizedHomeSections,
		};
	}

	private assignIfMissing(target: Record<string, any>, key: string, fallbackValue: string) {
		const value = target?.[key];
		if (
			value === undefined ||
			value === null ||
			(typeof value === "string" && value.trim().length === 0)
		) {
			target[key] = fallbackValue;
		}
	}

	private formatContactAddress(contactInfo: Partial<PreviewFallbacks["contactInfo"]> | undefined): string {
		if (!contactInfo) {
			return "";
		}

		if (contactInfo.address && contactInfo.address.includes("\n")) {
			return contactInfo.address;
		}

		const lines: string[] = [];
		const brokerageAddress = contactInfo.address?.trim();
		const streetAddress = contactInfo.streetAddress?.trim();
		const municipality = contactInfo.municipality?.trim();
		const province = contactInfo.province?.trim();
		const postalCode = contactInfo.postalCode?.trim();

		if (brokerageAddress) {
			lines.push(brokerageAddress);
		}

		const streetLine = [streetAddress, municipality].filter(Boolean).join(", ");
		if (streetLine) {
			lines.push(streetLine);
		}

		const regionLine = [province, postalCode].filter(Boolean).join(" ");
		if (regionLine) {
			lines.push(regionLine);
		}

		return lines.join("\n");
	}

	private deepClone<T>(value: T): T {
		return JSON.parse(JSON.stringify(value));
	}
}
