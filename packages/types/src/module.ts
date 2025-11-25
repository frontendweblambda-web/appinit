import { Log } from "./common";
import { VFS } from "./vfs";

export interface ModuleMeta {
	name: string;
	title?: string;
	version: string;
	description?: string;
	author?: string;

	amsSpec: string;
	appinitSpec?: string;

	tags?: string[];
	categories?: string[];

	log?: Log;

	compatibility?: {
		framework?: string[];
		language?: ("js" | "ts")[];
	};

	entry: string; // module.ts

	options?: {
		askUser?: boolean;
		schema?: string; // path to JSON schema
	};

	dependencies?: {
		runtime?: string[];
		dev?: string[];
	};
}

export interface ResolvedModuleSource {
	type: "local" | "npm" | "git" | "marketplace" | "template";
	path: string; // absolute path to module root
	entry: string; // absolute path to module.ts
	metaPath: string; // absolute path to module.json

	loadMeta(): Promise<ModuleMeta>;
	loadEntry(): Promise<any>; // default export of module.ts
}

export interface ModuleContext {
	moduleRoot: string;
	projectRoot: string;

	meta: ModuleMeta;
	moduleEntry: any; // module.ts default export

	options: Record<string, any>;
	answers: Record<string, any>;

	files: VFS;
	log: Log;

	framework: string;
	language: "js" | "ts";

	installDependency(deps: string[]): Promise<void>;
	installDevDependency(deps: string[]): Promise<void>;

	applyTransform(name: string): Promise<void>;
}

export interface ModuleInstallResult {
	name: string;
	version: string;
	installedAt: string;
	options: Record<string, any>;
}

export interface ModuleRegistryFile {
	installed: ModuleInstallResult[];
}

export interface AppInitModule {
	beforeInstall?: (ctx: ModuleContext) => Promise<void> | void;
	install: (ctx: ModuleContext) => Promise<void> | void;
	afterInstall?: (ctx: ModuleContext) => Promise<void> | void;
}

export type ModuleSource =
	| string // @appinit/module-tailwind OR ./local
	| {
			path: string;
			type?: "local" | "npm" | "git" | "marketplace" | "template";
	  };

export interface ModuleResolver {
	resolve(source: ModuleSource): Promise<ResolvedModuleSource>;
}
export interface ValidationError {
	field: string;
	message: string;
}

export interface ModuleValidationResult {
	valid: boolean;
	errors: ValidationError[];
}
