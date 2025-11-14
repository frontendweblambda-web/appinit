import type { Answers } from "./answers";

// A single prompt pack (template or built-in)
export interface PromptPack {
	name: string;
	priority?: number; // lower => earlier; default 100
	tags?: string[]; // optional tags used for filtering
	handler: PromptPackHandler;
}

// Optional hooks for future AI auto-answer and UX improvements
export interface PromptHooks {
	// called before prompts, can modify flags or context
	beforePrompt?: (
		ctx: PromptContext,
		accum: PromptResult,
	) => void | Promise<void>;

	// called after prompts, can validate, inject defaults, etc.
	afterPrompt?: (
		ctx: PromptContext,
		result: PromptResult,
	) => void | Promise<void>;
}

// Central context provided to every prompt pack
export interface PromptContext {
	// ↓ Provided by CLI (create/add/etc)
	command: string; // "create", "add", "deploy"
	cliName?: string | null; // project name argument
	flags: Flags; // CLI flags
	cwd: string; // current working directory
	targetDir?: string | null; // project output directory
	packageManager?: string | null; // npm | pnpm | yarn | bun | auto

	// ↓ Template information
	templateId?: string | null; // passed via flags or pack
	templateName?: string | null; // canonical name
	templateMeta?: Record<string, any> | null;
	templateDir?: string | null; // resolved filesystem dir
	templateResolved?: boolean; // set by template resolver
	templatePromptPacks?: (string | PromptPackDefinition)[];

	// ↓ Plugin system (marketplace)
	pluginPromptPacks?: PromptPackDefinition[];

	// ↓ Dynamic defaults
	config?: Record<string, any> | null; // previous config
	previousConfigLoaded?: boolean; // flag for packs

	// ↓ Prompt control
	skipDefaultPacks?: boolean;
	runtime?: "cli" | "api" | "web" | "vscode";
	outputMode?: "text" | "rich" | "minimal" | "json";

	// ↓ AI hooks / validation / defaults
	hooks?: PromptHooks;

	// ↓ Shared workspace for packs
	extra?: Record<string, any>;

	// ↓ Shared accumulated answers (optional)
	answers?: PromptResult;
}
// Flags parsed from CLI arguments (like commander or your own parser)
export type Flags = Record<string, any>;
export type PromptPackHandler = (
	ctx: PromptContext,
	accum: PromptResult,
) => Promise<Partial<Answers>>;

// What each pack returns (a slice of partial Answers)
export type PromptResult = Partial<Answers>;
export type PromptPackDefinition =
	| { type: "module"; path: string } // path to js/ts module exporting { pack | default }
	| { type: "json"; path: string } // path to JSON file with `prompts` array (simple)
	| PromptPack;

export type PromptBase = {
	name: string;
	message: string;
	when?: (accum: Record<string, any>) => boolean | Promise<boolean>;
	validate?: (value: any) => true | string | Promise<true | string>;
	format?: (value: any) => any;
	initial?: any;

	// ⭐ NEW universal fields (safe for all prompts)
	choices?: { title?: string; label?: string; value: any }[];
	options?: { title?: string; label?: string; value: any }[];
};

export type PromptText = PromptBase & {
	type: "text";
};

export type PromptSelect = PromptBase & {
	type: "select";
};

export type PromptConfirm = PromptBase & {
	type: "confirm" | "toggle";
};

export type PromptMulti = PromptBase & {
	type: "multiselect";
};

export type PromptQuestion =
	| PromptText
	| PromptSelect
	| PromptConfirm
	| PromptMulti
	| (Record<string, any> & { type: string }); // fallback for plugin/template custom fields
