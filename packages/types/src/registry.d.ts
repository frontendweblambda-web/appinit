export type RegistryPackageType =
	| "template"
	| "plugin"
	| "config"
	| "component"
	| "ui-package";
export interface RegistryPackage {
	id: string;
	name: string;
	type: RegistryPackageType;
	version: string;
	author?: string;
	keywords?: string[];
	description?: string;
	compatibility?: string[];
	downloads?: number;
	rating?: number;
	createdAt?: string;
}
export interface RegistryQuery {
	search?: string;
	type?: RegistryPackageType;
	limit?: number;
	offset?: number;
}
