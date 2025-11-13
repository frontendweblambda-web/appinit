export type TemplateSource =
	| "local"
	| "github"
	| "npm"
	| "url"
	| "registry"
	| "market";
export interface TemplateMeta {
	name: string;
	version?: string;
	description?: string;
	dependencies?: string[];
	prompts?: Array<{
		name: string;
		message: string;
		default?: any;
	}>;
	postInstall?: any[];
}
export interface ResolvedTemplate {
	source: TemplateSource;
	sourceLocator: string;
	tempDir: string;
	meta: TemplateMeta | null;
}
