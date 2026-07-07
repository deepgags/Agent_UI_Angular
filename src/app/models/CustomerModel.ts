import { BrokerageTypeModel } from "./BrokerageTypeModel";

import { MenuItem } from "./MenuItem";

export interface CustomerModel {
	_id?: string;
	brokerageTypeId: string;
	firstName: string;
	lastName: string;
	emailAddress: string;
	businessName: string;
	phoneNumber: string;
	cellNumber: string;
	address: string;
	password: string;
	confirmPassword: string;
	role: string;
	isBroker?: boolean;
	brokerId?: string;
	siteUrl?: string;
	profileImage: string;
	brokerage?: BrokerageTypeModel | undefined;
	websiteSettings: {
		logoImage?: string;
		profileImage: string;
		subheading?: string;
		personalBrandingLogo?: string;
		contactInfo?: {
			email?: string;
			phone?: string;
			address?: string;
			streetAddress?: string;
			municipality?: string;
			province?: string;
			postalCode?: string;
		};
		aboutText?: string;
		contactText?: string;
		sellingYourHouseText?: string;
		renovatingForResellText?: string;
		commonSellingMistakeText?: string;
		buyerText?: string;
		showHomeWorthPage?: boolean;
		showSellingInNeighborHoodPage?: boolean;
		showFindDreamHomePage?: boolean;
		secondaryAgentFirst?: boolean;
		menuItems?: MenuItem[];
		templateId: string;
	};
	secondaryAgent?: {
		firstName: string;
		lastName: string;
		websiteEmail: string;
		websitePhone: string;
		profileImage: string;
	};
}
