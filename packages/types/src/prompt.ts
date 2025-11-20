import {
	ConfirmOptions,
	MultiSelectOptions,
	SelectOptions,
	TextOptions,
} from "@clack/prompts";
import { PackageManager, ProjectType } from "./common";
import { Flags } from "./flags";
import { Framework } from "./frontend";
import { ResolvedTemplate, TemplateMeta } from "./template";

// -------------------------------------------------
// Choice Option
// -------------------------------------------------
export interface ChoiceOption<T = any> {
	title?: string;
	label?: string;
	value: T;
	hint?: string;
}

export type ChoiceUnion<
	T,
	Accum extends Record<string, unknown> = Record<string, unknown>,
> =
	| ChoiceOption<T>[]
	| ((accum: Accum) => ChoiceOption<T>[] | Promise<ChoiceOption<T>[]>);

// -------------------------------------------------
// Base Prompt
// -------------------------------------------------
export interface PromptBase<
	T,
	Accum extends Record<string, unknown> = Record<string, unknown>,
> {
	name: string;
	initial?: T;
	message: string;
	when?: (accum: Accum) => boolean | Promise<boolean>;
	validate?: (value: T) => true | string | Promise<true | string>;
	format?: (value: T) => T | null; // allow null
}

// -------------------------------------------------
// Specific Prompt Types
// -------------------------------------------------
export type PromptText<
	Accum extends Record<string, unknown> = Record<string, unknown>,
> = PromptBase<string, Accum> &
	Pick<TextOptions, "placeholder" | "defaultValue" | "initialValue"> & {
		type: "text";
	};

export interface PromptSelect<
	Value = unknown,
	Accum extends Record<string, unknown> = Record<string, unknown>,
> extends PromptBase<Value, Accum>,
		Omit<SelectOptions<Value>, "options" | "initialValue"> {
	type: "select";
	choices?: ChoiceUnion<Value, Accum>;
}

export interface PromptConfirm<
	Accum extends Record<string, unknown> = Record<string, unknown>,
> extends PromptBase<boolean, Accum>,
		Pick<ConfirmOptions, "initialValue"> {
	type: "confirm" | "toggle";
}

export interface PromptMulti<
	Value = unknown,
	Accum extends Record<string, unknown> = Record<string, unknown>,
> extends PromptBase<Value[], Accum>,
		Omit<MultiSelectOptions<Value>, "options" | "initialValues"> {
	type: "multiselect";
	choices?: ChoiceUnion<Value, Accum>;
}

export type PromptQuestion<
	Accum extends Record<string, unknown> = Record<string, unknown>,
> =
	| PromptText<Accum>
	| PromptSelect<any, Accum>
	| PromptConfirm<Accum>
	| PromptMulti<any, Accum>;

// -------------------------------------------------
// Prompt Result Types
// -------------------------------------------------
export type PromptResultFromQuestions<Q extends readonly PromptQuestion[]> = {
	[K in Q[number] as K["name"]]: K extends PromptBase<infer T> ? T : unknown;
};

export type PromptResult = Record<string, any> & {
	projectName?: string;
	description?: string;
	author?: string;
	license?: string;
	packageScope?: string | null;

	// ─────────────── AppInit dynamic answer fields ───────────────
	projectType?: ProjectType;
	framework?: Framework;
	architecture?: string;

	form?: string;
	store?: string;
	routing?: string;

	// Backend-specific
	backend?: string;
	backendMode?: string;
	apiStyle?: string;
	database?: string;
	orm?: string;
	authStrategy?: string;
	deployTarget?: string;
	autoInstall?: true;

	packageManager?: PackageManager;
};

// -------------------------------------------------
// Prompt Pack / Hooks
// -------------------------------------------------
export type PromptPackHandler = (
	ctx: PromptContext,
	accum: PromptResult,
) => Promise<PromptResult | null>;

export interface PromptHooks {
	// Called once before **any** pack starts
	beforeAll?: (ctx: PromptContext, accum: PromptResult) => void | Promise<void>;

	// Called before **each** pack runs
	beforeEach?: (
		pack: PromptPack,
		ctx: PromptContext,
		accum: PromptResult,
	) => void | Promise<void>;

	// Called after **each** pack completes
	afterEach?: (
		pack: PromptPack,
		ctx: PromptContext,
		result: PromptResult,
	) => void | Promise<void>;

	// Called once after **all packs** are finished
	afterAll?: (ctx: PromptContext, final: PromptResult) => void | Promise<void>;
}

export interface PromptPack {
	name: string;
	priority?: number; // lower = earlier
	tags?: string[];

	// 🔍 Optional conditional execution
	condition?: (
		ctx: PromptContext,
		accum: PromptResult,
	) => boolean | Promise<boolean>;

	// ✅ OPTIONAL: pack dependencies by name (for future)
	dependsOn?: string[];

	// Local hooks – scoped only to this pack
	before?: (ctx: PromptContext, accum: PromptResult) => void | Promise<void>;
	after?: (ctx: PromptContext, result: PromptResult) => void | Promise<void>;

	handler: PromptPackHandler;
}

export type PromptPackDefinition =
	| { type: "module"; path: string }
	| { type: "json"; path: string }
	| PromptPack;

// -------------------------------------------------
// Prompt Context
// -------------------------------------------------

export interface PromptContext {
	// where cli has executed
	cwd: string;

	// 💻 CLI & OS Environment
	command: string;
	cliName?: string | null;
	cliVersion?: string | null;
	nodeVersion?: string;
	os?: NodeJS.Platform;
	// 🌐 Environment Variables
	env?: {
		ci?: boolean;
		docker?: boolean;
		tty?: boolean;
		npmLifecycle?: boolean;
	};

	// args + flags
	flags: Flags;
	args?: string[];

	// execution mode
	interactive?: boolean;
	debug?: boolean;

	// prompt answers
	answers: PromptResult;

	// User config (optional future feature)
	// ⚙️ Configuration & History
	config?: Record<string, unknown> | null;
	previousConfigLoaded?: boolean;

	// package manager
	packageManager?: string | null;

	targetDir?: string | null;
	// 🔄 Execution Mode
	runtime?: "cli" | "api" | "web" | "vscode";
	outputMode?: "text" | "rich" | "minimal" | "json";

	sourceId?: string;
	templateId?: string | null;
	templateName?: string | null;
	templateMeta?: TemplateMeta | null;
	templateDir?: string | null;
	template?: ResolvedTemplate;
	templateResolved?: boolean;

	templatePromptPacks?: (string | PromptPackDefinition)[];
	pluginPromptPacks?: PromptPackDefinition[];

	skipDefaultPacks?: boolean;

	hooks?: PromptHooks;
	extra?: Record<string, unknown>;
}
