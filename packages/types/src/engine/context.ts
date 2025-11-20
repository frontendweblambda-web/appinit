// --- src/engine/context.ts (Synchronized) ---

import { PackageManagerAPI } from "../package-manager";
import type { AppinitPlugin } from "../plugin";
import { PromptResult } from "../prompt";
import type { ResolvedTemplate } from "../template";

export interface EngineContext {
	/** Final project configuration (fully validated Answers) */
	answers: PromptResult;

	/** Current working directory (where CLI was run) */
	cwd: string;

	/** Final directory where project is written */
	targetDir: string;

	/** The resolved template package */
	template: ResolvedTemplate;

	/** The package manager API utility */
	pkg: PackageManagerAPI; // (Imported from package-manager.ts)

	/** All currently enabled plugins */
	plugins?: AppinitPlugin[];

	/** Shared utility for file operations (like fs-extra) */
	utils: typeof import("@appinit/utils");

	/** Project-wide computed variables (meta + template logic) */
	variables: Record<string, any>;

	/** Global logger utility */
	log: {
		info(msg: string): void;
		warn(msg: string): void;
		error(msg: string): void;
	};
	run: (
		cmd: string,
		args: string[],
		opts?: {
			cwd?: string | undefined;
			env?: NodeJS.ProcessEnv | undefined;
		},
	) => Promise<unknown>;

	files?: Map<string, string>;
}
