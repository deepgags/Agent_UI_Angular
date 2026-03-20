export interface Page {
	_id: string;
	title: string;
	slug: string;
	content: string;
	metaTitle?: string;
	metaDescription?: string;
	keywords?: string;
	homeSectionText1?: string;
	homeSectionText2?: string;
	homeSectionText3?: string;
	homeSectionText4?: string;
	pageKey?: string;
	heroImages?: string[];
	allowHeroImage?: boolean;
	heroImageLimit?: number;
	isPredefined: boolean;
	isEditable: boolean;
	isDeletable: boolean;
	siteId: string;
	createdAt: string;
	updatedAt: string;
}

export interface CreatePageRequest {
	title: string;
	slug: string;
	content: string;
	metaTitle?: string;
	metaDescription?: string;
	keywords?: string;
	homeSectionText1?: string;
	homeSectionText2?: string;
	homeSectionText3?: string;
	homeSectionText4?: string;
	siteId: string;
}

export interface UpdatePageRequest {
	title?: string;
	slug?: string;
	content?: string;
	metaTitle?: string;
	metaDescription?: string;
	keywords?: string;
	homeSectionText1?: string;
	homeSectionText2?: string;
	homeSectionText3?: string;
	homeSectionText4?: string;
}

export interface PredefinedPageTemplate {
	id: string;
	name: string;
	description?: string;
	content: string;
	metaTitle?: string;
	metaDescription?: string;
	keywords?: string;
}
