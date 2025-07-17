export interface SiteConfig {
	firstName: string;
	lastName: string;
	// templateId: string;
	// phone: string;
	// email: string;
	// address: string;
	// primaryColor?: string;
	// secondaryColor?: string;
	// logoUrl?: string;
	// domain?: string;
	websiteSettings: {
		contactInfo: {
			email: string;
			phone: string;
			address: string;
		};
		aboutText: string;
		contactText: string;
		sellingYourHouseText: string;
		renovatingForResellText: string;
		commonSellingMistakeText: string;
		buyerText: string;
		socialLinks: {
			facebook: string;
			twitter: string;
			instagram: string;
			linkedin: string;
			youtube: string;
		};
		faviconUrl: string;
		siteUrl: string;
		templateId: string;
		primaryColor: string;
		secondaryColor: string;
		profileImage: string;
		logoImage: string;
		brokerageImage: string;
	};

	brokerage: {
		name: string;
		alternateName: string;
		logoPath: string;
	};
	secondaryAgent?: {
		firstName: string;
		lastName: string;
		websiteEmail: string;
		websitePhone: string;
		profileImage: string;
	};
}
