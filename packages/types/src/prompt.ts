/* ────────────────────────────────────────────────
   AppInit Prompt Types
   Prompt Packs • Prompt Context • Prompt Handler
   Supports: CLI, API, Web, VSCode, Marketplace Plugins
────────────────────────────────────────────────── */

import type { Answers } from "./answers";

// -------------------------------------------------
// FLAGS (parsed CLI arguments)
// -------------------------------------------------
export type Flags = Record<string, any>;

// -------------------------------------------------
// Prompt Result (partial Answers per pack)
// -------------------------------------------------
export type PromptResult = Partial<Answers>;

// -------------------------------------------------
// Prompt Pack Handler Signature
// -------------------------------------------------
export type PromptPackHandler = (
	ctx: PromptContext,
	accum: PromptResult,
) => Promise<Partial<Answers>>;

// -------------------------------------------------
// Prompt Hooks (AI and validation hooks)
// -------------------------------------------------
export interface PromptHooks {
	// Before prompts: can mutate flags or defaults
	beforePrompt?: (
		ctx: PromptContext,
		accum: PromptResult,
	) => void | Promise<void>;

	// After prompts: validate or inject computed values
	afterPrompt?: (
		ctx: PromptContext,
		result: PromptResult,
	) => void | Promise<void>;
}

// -------------------------------------------------
// Prompt Pack Definition
// -------------------------------------------------
export interface PromptPack {
	name: string;
	priority?: number; // lower = earlier (default: 100)
	tags?: string[]; // filter packs by tags (auth/frontend/backend/etc.)
	handler: PromptPackHandler;
}

// -------------------------------------------------
// External (dynamic) prompt pack definitions
// -------------------------------------------------
export type PromptPackDefinition =
	| { type: "module"; path: string } // JS/TS module exporting a PromptPack
	| { type: "json"; path: string } // JSON prompts for simple packs
	| PromptPack; // Direct inline pack

// -------------------------------------------------
// Universal Prompt Base
// -------------------------------------------------
export type PromptBase = {
	name: string; // key in Answers
	message: string; // display label

	when?: (accum: Record<string, any>) => boolean | Promise<boolean>;
	validate?: (value: any) => true | string | Promise<true | string>;
	format?: (value: any) => any;
	initial?: any;

	// Universal choice support
	choices?: { title?: string; label?: string; value: any }[];
	options?: { title?: string; label?: string; value: any }[];
};

// -------------------------------------------------
// Prompt Types (text, select, confirm, multiselect, etc.)
// -------------------------------------------------
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

// Generic fallback — allows plugin templates to define custom prompt types
export type PromptQuestion =
	| PromptText
	| PromptSelect
	| PromptConfirm
	| PromptMulti
	| (Record<string, any> & { type: string });

// -------------------------------------------------
// Prompt Context (central state passed to all packs)
// -------------------------------------------------
export interface PromptContext {
	// CLI command: create, add, deploy
	command: string;

	// Project name argument
	cliName?: string | null;

	// Parsed flags
	flags: Flags;

	// Directories
	cwd: string;
	targetDir?: string | null;

	// Package manager (npm | pnpm | yarn | bun | auto)
	packageManager?: string | null;

	// Template metadata (resolved by template resolver)
	templateId?: string | null;
	templateName?: string | null;
	templateMeta?: Record<string, any> | null;
	templateDir?: string | null;
	templateResolved?: boolean;

	// Template packs included in template
	templatePromptPacks?: (string | PromptPackDefinition)[];

	// Marketplace plugin prompt packs
	pluginPromptPacks?: PromptPackDefinition[];

	// Dynamic config (loaded from previous run)
	config?: Record<string, any> | null;
	previousConfigLoaded?: boolean;

	// Control default packs
	skipDefaultPacks?: boolean;

	// Execution environment
	runtime?: "cli" | "api" | "web" | "vscode";
	outputMode?: "text" | "rich" | "minimal" | "json";

	// Optional Hooks (AI, validators, etc.)
	hooks?: PromptHooks;

	// Shared workspace (for packs to pass data)
	extra?: Record<string, any>;

	// Accumulated answers (set by prompt orchestrator)
	answers?: PromptResult;
}

export type ChoiceOption = {
	title?: string;
	label?: string;
	value: any;
};
