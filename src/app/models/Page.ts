export interface Page {
	_id: string;
	title: string;
	slug: string;
	content: string;
	metaTitle?: string;
	metaDescription?: string;
	keywords?: string;
	pageKey?: string;
	heroImages?: string[];
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
	siteId: string;
}

export interface UpdatePageRequest {
	title?: string;
	slug?: string;
	content?: string;
	metaTitle?: string;
	metaDescription?: string;
	keywords?: string;
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
