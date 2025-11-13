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
	sourceLocator: string; // git URL, folder, npm pkg, marketplace ID, etc.
	tempDir: string; // extracted template root
	meta: TemplateMeta | null;

	/** Virtual file system returned by resolver */
	files: Map<string, string>;

	/** Optional loaded package.json from template root */
	packageJson?: Record<string, any>;

	/** Optional template hooks */
	hooks?: {
		before?: string;
		after?: string;
	};
}

export interface ResolveOptions {
	cwd?: string;
	cacheDir?: string;
	inlineVariables?: Record<string, any>;
}
