// packages/types/src/package-manager.ts

import { PackageManager } from "./common";

/**
 * Unified package manager API used across:
 * - @appinit/engine
 * - @appinit/cli
 * - @appinit/plugins
 * - @appinit/package-manager
 * - @appinit/ui
 * - @appinit/git-tools
 */
export interface PackageManagerAPI {
	name: PackageManager;

	/** Install normal dependencies */
	install(deps: string[]): Promise<void>;

	/** Install dev dependencies */
	installDev(deps: string[]): Promise<void>;

	/** Remove dependencies */
	remove(deps: string[]): Promise<void>;

	/** Run a script (e.g. build / dev / lint / start) */
	run(script: string): Promise<void>;

	/** Run raw flags/commands (e.g. npm audit fix --force) */
	runRaw(args: string[]): Promise<void>;
}
