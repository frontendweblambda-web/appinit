// packages/types/src/plugin.ts
// Final unified plugin architecture for Appinit OS

import type { Answers } from "./answers.js";
import type { EngineContext } from "./engine/context.js";
import { TemplateFile, TransformContext } from "./file.js";
import type { ResolvedTemplate } from "./template.js";
/* -----------------------------------------------------------
 * Shared Context
 * -------------------------------------------------------- */

/** Context passed to plugin.apply() and lifecycle hooks */
export interface PluginContext extends EngineContext {
	cwd: string;
	engine: EngineContext;
	logger: Console;
}

/* -----------------------------------------------------------
 * Lifecycle Hooks (modular)
 * -------------------------------------------------------- */

export interface PluginHooks {
	/** BEFORE prompting user */
	onBeforePrompt?(answers: Partial<Answers>): void | Promise<void>;

	/** AFTER prompting user */
	onAfterPrompt?(answers: Answers): void | Promise<void>;

	/** Modify template before rendering */
	onResolveTemplate?(
		ctx: EngineContext,
		template: ResolvedTemplate,
	): ResolvedTemplate | void | Promise<ResolvedTemplate | void>;

	/** Transform content / inject / modify */
	onTransform?(ctx: TransformContext): void | Promise<void>;

	/** Process each file during generation */
	onFile?(
		file: TemplateFile,
		ctx: TransformContext,
	): TemplateFile | void | Promise<TemplateFile | void>;

	/** AFTER template files are copied */
	onAfterCopy?(ctx: EngineContext): void | Promise<void>;

	/** BEFORE dependency installation */
	onBeforeInstall?(ctx: EngineContext): void | Promise<void>;

	/** AFTER dependency installation */
	onAfterInstall?(ctx: EngineContext): void | Promise<void>;

	/** FINAL step after scaffolding is complete */
	onComplete?(ctx: EngineContext): void | Promise<void>;
}

/* -----------------------------------------------------------
 * Main Plugin Interface
 * -------------------------------------------------------- */

export interface AppinitPlugin {
	id: string; // unique ID for registry + marketplace
	name?: string;
	version?: string;
	description?: string;
	enabled?: boolean;
	priority?: number; // determines order of execution

	/**
	 * Advanced full control entrypoint.
	 * Optional — most plugins will use only `hooks`.
	 */
	apply?(ctx: PluginContext): void | Promise<void>;

	/** Lifecycle hooks object */
	hooks?: Partial<PluginHooks>;
}
