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
	brokerId?: string;
	siteUrl?: string;
	profileImage: string;
	brokerage?: BrokerageTypeModel | undefined;
	websiteSettings: {
		logoImage?: string;
		profileImage: string;
		aboutText?: string;
		contactText?: string;
		sellingYourHouseText?: string;
		renovatingForResellText?: string;
		commonSellingMistakeText?: string;
		buyerText?: string;
		showHomeWorthPage?: boolean;
		showSellingInNeighborHoodPage?: boolean;
		showFindDreamHomePage?: boolean;
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
