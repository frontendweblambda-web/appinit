export interface AppinitContext {
	projectName: string;
	targetDir: string;
	framework: string;
	answers: Record<string, any>;
	logger: Console;
}

export interface AppinitHooks {
	onBeforeCopy?: (ctx: AppinitContext) => void | Promise<void>;
	onAfterCopy?: (ctx: AppinitContext) => void | Promise<void>;
	onBeforeInstall?: (ctx: AppinitContext) => void | Promise<void>;
	onAfterInstall?: (ctx: AppinitContext) => void | Promise<void>;
	onComplete?: (ctx: AppinitContext) => void | Promise<void>;
}

export interface AppinitConfig extends AppinitHooks {
	id: string;
	name?: string;
	framework?: string;
	version?: string;
	type?: "base" | "ui" | "auth" | "deploy" | "backend" | "preset" | "ci";
	description?: string;
	license?: string;
	author?: string;
	keywords?: string[];
	dependencies?: Record<string, string>;
	devDependencies?: Record<string, string>;
	includes?: string[]; // Which files to copy
	excludes?: string[];
	compatibleWith?: string[];
	extends?: string[]; // base templates
	variables?: Record<string, string | boolean | number>;
	options?: Record<string, any>;
	async?: boolean; // Indicates dynamic config
}

export interface LoadedConfig<T = AppinitConfig> {
	config: T;
	path: string;
}
