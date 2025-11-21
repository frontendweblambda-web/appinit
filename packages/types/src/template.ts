/* ────────────────────────────────────────────────
   AppInit Template Metadata Types (Final)
   Supports: Local, GitHub, NPM, URL, Marketplace
   With Hooks, Template Logic Modules, Variables, FS
────────────────────────────────────────────────── */
import { Framework, Language, TemplateSource, Variables } from "./common";
import { EngineContext } from "./engine";

import { PromptResult } from "./prompt";

// ================================================
// Template Metadata (template.json or appinit.meta.json)
// ================================================
export interface TemplateMeta {
	name?: string; // Marketplace / registry ID
	version?: string;
	description?: string;
	categories?: string[];
	frameworks?: string[];
	languages?: Language[];

	// Simple template-defined prompt questions
	prompts?: Array<{
		name: string;
		message: string;
		type?: "input" | "select" | "confirm" | "multiselect";
		default?: any;
		choices?: { label?: string; value: any }[];
	}>;

	requires?: string[];

	author?: { name: string; url?: string };

	appinitVersion?: string;
	postInstall?: string[];

	// 📌 renames from template.json (optional)
	rename?: Record<string, string>;
}

// ================================================
// Template Logic Module (appinit.template.ts)
// ================================================
export interface TemplateLogicModule {
	/** Compute variables inserted into template files */
	variables?: (ctx: TemplateContext) => Promise<Record<string, any>>;

	/** Pattern-based file filtering */
	filters?: Record<
		string,
		(ctx: TemplateContext, filepath?: string) => boolean
	>;

	/** Pre-write hook */
	beforeWrite?: (ctx: TemplateContext) => Promise<void>;

	/** Post-write hook */
	afterWrite?: (ctx: TemplateContext) => Promise<void>;

	/** Additional file renames */
	rename?: Record<string, string>;

	/** Package.json overrides */
	package?: {
		dependencies?: Record<string, string>;
		devDependencies?: Record<string, string>;
		peerDependencies?: Record<string, string>;
		scripts?: Record<string, string>;
	};

	/** File transform step (optional) */
	transform?: (ctx: TemplateContext) => Promise<void>;
}

// ================================================
// Template Hook Files (/hooks/before.ts, /hooks/after.ts)
// ================================================
export interface TemplateHooks {
	before?: (ctx: EngineContext) => Promise<void>;
	after?: (ctx: EngineContext) => Promise<void>;
}

// ================================================
// Template Resolution Output
// ================================================
export interface ResolvedTemplate {
	sourceType: TemplateSource;
	sourceLocator: string;
	tempDir: string;
	templateDir: string;
	targetDir?: string;
	packageJson?: Record<string, any>;
	templateJson?: Record<string, any> | null;
	loadDocs?: string;
	files?: Map<string, string>;
	meta?: TemplateMeta | null;
	templateModule?: TemplateLogicModule;
	hooks?: TemplateHooks;
	language?: Language;
	variables?: Record<string, any>;
	inlineVariables?: Record<string, any>;
	templateConfig?: Record<string, any> | null;
	registry?: Record<string, any> | null;
	appInitConfig?: Record<string, any> | null;
	variablesFolder?: {
		default?: string | null;
		schema?: string | null;
		transform?: string | null;
	};
}

// ================================================
// Template Resolver Options
// ================================================
export interface ResolveOptions {
	cwd?: string;
	cacheDir?: string;
	targetDir?: string;
	projectName: string;
	ui?: string;
	framework?: string;
	backend?: string;
	language: Language;
	answers?: PromptResult;
	inlineVariables?: Record<string, any>;
	convertToJavaScript?: boolean;
	mergeStrategy?: "ask" | "overwrite" | "skip";
}

// ================================================
// Template Context — The brain passed to all hooks
// ================================================
export interface TemplateContext {
	/** Directory where final project is written */
	targetDir: string;

	projectName: string;
	language: Language;

	answers: PromptResult;

	/** Variables created from appinit.template.ts + meta */
	variables: Variables;

	/** All template files (virtual filesystem) */
	files: Map<string, string>;

	log: {
		info(msg: string): void;
		warn(msg: string): void;
		error(msg: string): void;
	};

	framework: Framework;
	ui?: string;

	inlineVariables?: Record<string, any>;

	tempDir: string; // extraction workspace
	templateDir: string; // inside pack

	meta?: TemplateMeta;

	/** All helpers from @appinit/utils */
	utils: typeof import("@appinit/utils");
}
