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

	install(opts?: { cwd?: string }): Promise<void>;
	installDeps(deps: string[], opts?: { cwd?: string }): Promise<void>;
	installDevDeps(deps: string[], opts?: { cwd?: string }): Promise<void>;
	remove(deps: string[], opts?: { cwd?: string }): Promise<void>;
	run(script: string, opts?: { cwd?: string }): Promise<void>;
	runRaw(args: string[], opts?: { cwd?: string }): Promise<void>;
}
