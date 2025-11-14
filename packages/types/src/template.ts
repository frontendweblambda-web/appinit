/* ────────────────────────────────────────────────
   AppInit Template Metadata Types (Final)
   Supports: Local, GitHub, NPM, URL, Marketplace
   With Hooks, Template Logic Modules, Variables, FS
────────────────────────────────────────────────── */

import type { Answers, Language } from "./answers";

// ================================================
// Template Origin
// ================================================
export type TemplateSource = "local" | "github" | "npm" | "url" | "market";

// ================================================
// Template Metadata (template.json or appinit.meta.json)
// ================================================
export interface TemplateMeta {
	/** Template ID used in marketplace */
	name: string;

	/** Semantic versioning for marketplace */
	version?: string;

	/** Human description */
	description?: string;

	/** Categories used for marketplace search */
	categories?: string[]; // e.g. ["react", "ui", "tailwind"]

	/** Supported frameworks: react, next, vue, svelte, angular... */
	frameworks?: string[];

	/** Supported languages: TS/JS */
	languages?: ("typeScript" | "javaScript")[];

	/** Template-defined custom prompts (simple mode) */
	prompts?: Array<{
		name: string;
		message: string;
		type?: "input" | "select" | "confirm" | "multiselect";
		default?: any;
		choices?: { label?: string; value: any }[];
	}>;

	/** Dependencies on other template packs */
	requires?: string[];

	/** Marketplace author */
	author?: {
		name: string;
		url?: string;
	};

	/** Minimum AppInit version required */
	appinitVersion?: string;

	/** Instructions displayed after installation */
	postInstall?: string[];
}

// ================================================
// Template Logic Module (appinit.template.ts)
// ================================================
export interface TemplateLogicModule {
	/** Compute variables inserted in template files */
	variables?: (ctx: TemplateContext) => Record<string, any>;

	/** Filter which template files are included */
	filter?: (ctx: TemplateContext, filepath: string) => boolean;

	/** Runs before writing files to project */
	beforeWrite?: (ctx: TemplateContext) => Promise<void>;

	/** Runs after project is generated */
	afterWrite?: (ctx: TemplateContext) => Promise<void>;
}

// ================================================
// Template Hook Files (/hooks/before.ts, /hooks/after.ts)
// ================================================
export interface TemplateHooks {
	before?: (ctx: TemplateContext) => Promise<void>;
	after?: (ctx: TemplateContext) => Promise<void>;
}

// ================================================
// Template Resolution Output
// ================================================
export interface ResolvedTemplate {
	/** Where the template was loaded from */
	source: TemplateSource;

	/** Resolver locator (npm:package, path, url...) */
	sourceLocator: string;

	/** Temporary extraction directory (isolated) */
	tempDir: string;

	/** Actual template directory inside the pack */
	templateDir: string;

	/** Virtual file system to be written to target */
	files: Map<string, string>;

	/** Metadata defined in template.json / appinit.meta.json */
	meta: TemplateMeta | null;

	/** Raw package.json if template is a Node package */
	packageJson?: Record<string, any>;

	/** Loaded template logic module */
	templateModule?: TemplateLogicModule;

	/** Additional lifecycle hooks from /hooks folder */
	hooks?: TemplateHooks;

	/** Computed language value (TS/JS) */
	language: Language;

	/** Merged computed variables (meta + logic + CLI) */
	variables?: Record<string, any>;
}

// ================================================
// Template Resolver Options
// ================================================
export interface ResolveOptions {
	/** Current working directory */
	cwd?: string;

	/** Cache directory for downloading templates */
	cacheDir?: string;

	/** Project folder name */
	projectName: string;

	/** UI pack selected by user (tailwind / mui / shadcn / none) */
	ui?: string;

	/** Framework (react / next / vue / etc.) */
	framework: string;

	/** Language mode */
	language: Language;

	/** Answers from prompt packs */
	answers?: Answers;

	/** Additional variables from CLI flags */
	inlineVariables?: Record<string, any>;

	/** If true, TSX files are down-converted to JSX */
	convertToJavaScript?: boolean;

	/** When file conflicts occur */
	mergeStrategy?: "ask" | "overwrite" | "skip";
}

// ================================================
// Template Context — The brain passed to all hooks
// ================================================
export interface TemplateContext {
	/** Final directory where project is written */
	targetDir: string;

	/** Project name */
	projectName: string;

	/** Selected language */
	language: Language;

	/** Answers from the prompt engine (fully typed) */
	answers: Answers;

	/** Variables created by appinit.template.ts */
	variables: Record<string, any>;

	/** Virtual file system being built */
	files: Map<string, string>;

	/** Minimal logger utilities */
	log: {
		info(msg: string): void;
		warn(msg: string): void;
		error(msg: string): void;
	};

	/** Framework chosen by user */
	framework: string;

	/** UI library chosen by user */
	ui?: string;

	/** CLI override variables */
	inlineVariables?: Record<string, any>;

	/** Temp workspace used during template resolution */
	tempDir: string;

	/** Actual directory inside template pack */
	templateDir: string;

	/** Template metadata (parsed) */
	meta?: TemplateMeta;

	/** fs-extra for easy file ops */
	fs: typeof import("fs-extra");
}
