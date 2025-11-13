import type { Answers } from "./answers";

// Flags parsed from CLI arguments (like commander or your own parser)
export type Flags = Record<string, any>;

// A single prompt pack (template or built-in)
export interface PromptPack {
	name: string;
	handler: (
		ctx: PromptContext,
		accum: PromptResult,
	) => Promise<Partial<Answers>>;
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
	templatePromptPacks?: PromptPack[];
	// ⭐ NEW: allow template to skip default builtin packs
	skipDefaultPacks?: boolean;
	// ⭐ NEW: Fire hooks (AI/autofill/validation)
	hooks?: PromptHooks;
	// ⭐ NEW: runtime environment (CLI, UI, API, Dashboard, CodeEditor)
	runtime?: "cli" | "api" | "web" | "vscode";
}

// What each pack returns (a slice of partial Answers)
export type PromptResult = Partial<Answers>;
