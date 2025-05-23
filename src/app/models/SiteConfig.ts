export interface SiteConfig {
	templateId: string;
	name: string;
	phone: string;
	email: string;
	address: string;
	primaryColor?: string;
	secondaryColor?: string;
	logoUrl?: string;
	domain?: string;
	[key: string]: any; // Allow other dynamic properties
}