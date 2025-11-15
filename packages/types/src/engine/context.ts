// --- src/engine/context.ts (Synchronized) ---

import type { ResolvedTemplate } from "../template";
import type { AppinitPlugin } from "../plugin";
import { PackageManagerAPI } from "../package-manager";
import { Answers } from "../answers";

export interface EngineContext {
	/** Final project configuration (fully validated Answers) */
	answers: Answers;

	/** Current working directory (where CLI was run) */
	cwd: string;

	/** Final directory where project is written */
	targetDir: string;

	/** The resolved template package */
	template: ResolvedTemplate;

	/** The package manager API utility */
	pkg: PackageManagerAPI; // (Imported from package-manager.ts)

	/** All currently enabled plugins */
	plugins: AppinitPlugin[];

	/** Shared utility for file operations (like fs-extra) */
	fs: typeof import("fs-extra");

	/** Project-wide computed variables (meta + template logic) */
	variables: Record<string, any>;

	/** Global logger utility */
	log: {
		info(msg: string): void;
		warn(msg: string): void;
		error(msg: string): void;
	};

	// ... Any other core system utilities
}
