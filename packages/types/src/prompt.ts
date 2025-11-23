import {
	ConfirmOptions,
	MultiSelectOptions,
	SelectOptions,
	TextOptions,
} from "@clack/prompts";
import { ApiStyle, BackendMode, NodeOrm } from "./backend";
import {
	Architecture,
	BackendFramework,
	Database,
	Editor,
	Formatter,
	FrontendFramework,
	Language,
	Linter,
	PackageManager,
	ProjectStructure,
	ProjectType,
	TestRunner,
	WorkspaceTool,
} from "./common";
import { AppinitConfig, ProjectMeta } from "./config";
import { Form } from "./frontend";

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
		Omit<SelectOptions<Value>, "options"> {
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
		Omit<MultiSelectOptions<Value>, "options"> {
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

// -------------------------------------------------
// Prompt Pack / Hooks
// -------------------------------------------------
export type PromptPackHandler = (
	config: AppinitConfig,
	ctx: PromptContext,
	accum: PromptResult,
) => Promise<PromptResult | null>;

export interface PromptHooks {
	beforeAll?: (ctx: PromptContext, accum: PromptResult) => void | Promise<void>;
	beforeEach?: (
		pack: PromptPack,
		ctx: PromptContext,
		accum: PromptResult,
	) => void | Promise<void>;

	afterEach?: (
		pack: PromptPack,
		ctx: PromptContext,
		result: PromptResult,
	) => void | Promise<void>;

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

	validation?: (ctx: PromptContext) => boolean;

	// Local hooks – scoped only to this pack
	before?: (
		config: AppinitConfig,
		ctx: PromptContext,
		accum: PromptResult,
	) => void | Promise<void>;
	after?: (
		config: AppinitConfig,
		ctx: PromptContext,
		result: PromptResult,
	) => void | Promise<void>;

	handler: PromptPackHandler;
}

export type PromptPackDefinition =
	| { type: "module"; path: string }
	| { type: "json"; path: string }
	| PromptPack;

// -------------------------------------------------
// Prompt Context
// -------------------------------------------------

type BasePrompt = {
	projectType?: ProjectType;
	packageManager?: PackageManager;
	frontendFramework?: FrontendFramework;
	backendFramework?: BackendFramework;
	architecture?: Architecture;
	projectStructure?: ProjectStructure;

	form?: Form;
	store?: string;
	routing?: string;
	language?: Language;

	// Backend-specific
	backendMode?: BackendMode;
	apiStyle?: ApiStyle;
	database?: Database;
	orm?: NodeOrm;
	reusePrevious?: boolean;

	hooks?: PromptHooks;
	workspaceTool?: WorkspaceTool;

	commitConventions?: boolean;
	formatting?: Formatter;
	linting?: Linter;
	testing?: TestRunner;
	editor?: Editor;
};
export type PromptContext = ProjectMeta & BasePrompt & {};

export type PromptResult = Record<string, any> &
	BasePrompt &
	ProjectMeta & {
		projectType?: ProjectType;
		frontendFramework?: FrontendFramework;
		backendFramework?: BackendFramework;
	};
