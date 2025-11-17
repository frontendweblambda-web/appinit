import { Flags } from "@appinit/types";
import { isRunningInDocker, isRunningInNpmLifecycle } from "./helpers";
import { isCI } from "./env";

export async function shouldUseInteractiveUI(flags: Flags): Promise<boolean> {
	// explicit opt-out
	if (flags.nonInteractive) return false;

	// terminal required
	if (!process.stdin.isTTY || !process.stdout.isTTY) return false;

	// running in CI/CD pipeline
	if (isCI()) return false;

	// npm scripts (postinstall, prepare, test)
	if (isRunningInNpmLifecycle()) return false;

	// docker based execution
	if (await isRunningInDocker()) return false;

	return true;
}

// optional alias for old API naming
export const isInteractive = shouldUseInteractiveUI;
