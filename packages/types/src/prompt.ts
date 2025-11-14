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
	flags: Flags;
	config?: Record<string, any> | null;
	templateName?: string | null;
	templateMeta?: Record<string, any> | null;
	defaultName?: string | null;
	// ⭐ NEW: allow templates/plugins to inject their own prompt packs
	templatePromptPacks?: (string | PromptPackDefinition)[];
	// ⭐ NEW: allow template to skip default builtin packs
	skipDefaultPacks?: boolean;
	// ⭐ NEW: Fire hooks (AI/autofill/validation)
	hooks?: PromptHooks;
	// ⭐ NEW: runtime environment (CLI, UI, API, Dashboard, CodeEditor)
	runtime?: "cli" | "api" | "web" | "vscode";
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
