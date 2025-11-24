/* ────────────────────────────────────────────────
   AppInit Template Metadata Types (Final)
   Supports: Local, GitHub, NPM, URL, Marketplace
   With Hooks, Template Logic Modules, Variables, FS
────────────────────────────────────────────────── */
import { log } from "@clack/prompts";
import { BackendFramework, FrontendFramework, Language } from "../common";

import { AppEngineContext } from "../engine";
import { PromptResult } from "../prompt";
import { TemplateMetaJson } from "./template-meta-json";

export interface Variables {
	defaults?: Record<string, any>;
	schema?: Record<string, any>;
	transform?: (vars: Record<string, any>, ctx: TemplateContext) => any;
}

export interface TemplateHooks {
	before?: (ctx: AppEngineContext) => Promise<void> | void;
	after?: (ctx: AppEngineContext) => Promise<void> | void;
}

export interface InjectionRule {
	imports?: string[];
	prepend?: string[];
	append?: string[];

	replace?: Array<{
		find: string | RegExp;
		with: string;
	}>;
}

export interface TemplateConfig {
	id: string; // required
	version: string; // semver string
	appinitSpec?: string; // e.g. "1.0"
	kind?: "template"; // future-proofing
	variables?: Variables;
	filters?: Record<string, (ctx: TemplateContext, file: string) => boolean>;
	hooks?: TemplateHooks;
	inject?: Record<string, InjectionRule | InjectionRule[]>;
	resolvers?: {
		rename?: Record<string, string>; // e.g. _gitignore → .gitignore
	};
}

export interface ResolvedTemplate {
	tempDir: string;
	templateDir: string;
	targetDir?: string;
	packageJson?: Record<string, any>;
	templateJson?: Record<string, any> | null;
	templateMeta?: TemplateMetaJson | null;
	templateConfig?: TemplateConfig;
	variables?: Record<string, any>;
	hooks?: TemplateHooks;
	inlineVariables?: Record<string, any>;
	docs?: string;
	files?: Map<string, string>;
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
	frontendFramework?: FrontendFramework;
	backendFramework?: BackendFramework;
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
	// ------------------------------------------------------
	// 1. Project Identity
	// ------------------------------------------------------
	projectName: string; // folder name of the output project
	targetDir: string; // absolute output directory
	templateDir: string; // template root directory (template/)
	tempDir: string; // internal workspace (extraction, packs)

	answers: PromptResult;

	variables: Variables;
	inlineVariables?: Record<string, any>;

	files: Map<string, string>;
	log?: typeof log;
	templateMeta?: TemplateMetaJson | null;
}
