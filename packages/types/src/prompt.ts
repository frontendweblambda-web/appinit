import type { Answers } from "./answers";
import { ResolvedTemplate } from "./template";

// -------------------------------------------------
// FLAGS (parsed CLI arguments)
// -------------------------------------------------
export type Flags = Record<string, any>;

// -------------------------------------------------
// Prompt Result (partial Answers per pack)
// -------------------------------------------------
export type PromptResult = Record<string, any> & {
	// You can keep typed fields but avoid spreading entire Answers
	projectName?: string;
	description?: string;
	author?: string;
	license?: string;
	packageScope?: string | null;
	[key: string]: any;
};

// -------------------------------------------------
// Prompt Pack Handler
// -------------------------------------------------
export type PromptPackHandler = (
	ctx: PromptContext,
	accum: PromptResult,
) => Promise<PromptResult>;

// -------------------------------------------------
// Prompt Hooks
// -------------------------------------------------
export interface PromptHooks {
	beforePrompt?: (
		ctx: PromptContext,
		accum: PromptResult,
	) => void | Promise<void>;
	afterPrompt?: (
		ctx: PromptContext,
		result: PromptResult,
	) => void | Promise<void>;
}

// -------------------------------------------------
// Prompt Pack
// -------------------------------------------------
export interface PromptPack {
	name: string;
	priority?: number; // lower = earlier
	tags?: string[];
	handler: PromptPackHandler;
}

// -------------------------------------------------
// Prompt Pack Definitions
// -------------------------------------------------
export type PromptPackDefinition =
	| { type: "module"; path: string }
	| { type: "json"; path: string }
	| PromptPack;

// -------------------------------------------------
// Base Prompt
// -------------------------------------------------
export interface PromptBase<T = any> {
	name: string;
	message: string;
	initial?: T;
	when?: (accum: Record<string, any>) => boolean | Promise<boolean>;
	validate?: (value: T) => true | string | Promise<true | string>;
	format?: (value: T) => any;
	choices?: ChoiceOption[];
}

// -------------------------------------------------
// Prompt Types
// -------------------------------------------------
export interface PromptText extends PromptBase<string> {
	type: "text";
}

export interface PromptSelect extends PromptBase<any> {
	type: "select";
}

export interface PromptConfirm extends PromptBase<boolean> {
	type: "confirm" | "toggle";
}

export interface PromptMulti extends PromptBase<any[]> {
	type: "multiselect";
}

// Flattened union, avoid recursive `any` hacks
type CustomPrompt = PromptBase & { type: `custom-${string}` };
export type PromptQuestion =
	| PromptText
	| PromptSelect
	| PromptConfirm
	| PromptMulti
	| CustomPrompt;

export interface PromptBaseContext {
	command: string;
	flags: Flags; // Parsed CLI arguments
	cwd: string; // Current working directory (always present)
	targetDir?: string | null; // Final output directory (may be resolved later)
	answers?: PromptResult; // Accumulated prompt results
}
// -------------------------------------------------
// Prompt Context
// -------------------------------------------------
export interface PromptContext extends PromptBaseContext {
	command: string;
	cliName?: string | null;
	flags: Flags;
	cwd: string;
	targetDir?: string | null;
	packageManager?: string | null;
	templateId?: string | null;
	templateName?: string | null;
	templateMeta?: Record<string, any> | null;
	templateDir?: string | null;
	templateResolved?: boolean;
	templatePromptPacks?: (string | PromptPackDefinition)[];
	pluginPromptPacks?: PromptPackDefinition[];
	config?: Record<string, any> | null;
	previousConfigLoaded?: boolean;
	skipDefaultPacks?: boolean;
	runtime?: "cli" | "api" | "web" | "vscode";
	outputMode?: "text" | "rich" | "minimal" | "json";
	hooks?: PromptHooks;
	extra?: Record<string, any>;
	// answers?: PromptResult;
	template?: ResolvedTemplate;
}

// -------------------------------------------------
// Choice Option
// -------------------------------------------------
export interface ChoiceOption {
	title?: string;
	label?: string;
	value: any;
}
