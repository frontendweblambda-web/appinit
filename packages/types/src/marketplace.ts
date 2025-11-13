export interface MarketplaceItem {
	id: string;
	name: string;
	type: "component" | "template" | "snippet" | "workflow" | "layout";
	version: string;
	author?: string;
	rating?: number;
	tags?: string[];
	createdAt: string;
	updatedAt?: string;
}
