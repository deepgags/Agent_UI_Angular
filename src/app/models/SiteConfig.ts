export interface SiteConfig {
	id: string;
	firstName: string;
	lastName: string;
	designation: string;
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
		showFindDreamHomePage: boolean;
		showHomeWorthPage: boolean;
		showSellingInNeighborHoodPage: boolean;
	};

	brokerageTypeId: string;
	// brokerage: {
	// 	name: string;
	// 	alternateName: string;
	// 	logoPath: string;
	// };
	secondaryAgent?: {
		enableSecondaryAgent: boolean;
		firstName: string;
		lastName: string;
		websiteEmail: string;
		websitePhone: string;
		profileImage: string;
		designation: string;
	};
}
