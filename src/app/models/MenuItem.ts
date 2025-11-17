export interface MenuItem {
	_id: string;
	name: string;
	pageMetaTitle?: string;
	metaDescription?: string;
	keywords?: string;
	menuType: MenuType;
	pageKey?: string;
	linkUrl?: string;
	order: number;
	parentId?: string;
	children?: MenuItem[];
	isExpanded?: boolean;
}

export enum MenuType {
	PAGE = "page",
	LINK = "link",
}

export interface PredefinedPage {
	key: string;
	name: string;
	hasCustomContent: boolean;
}
