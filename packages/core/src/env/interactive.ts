import { Flags } from "@appinit/types";

import { isCI } from "./is-ci";
import { isRunningInDocker, isRunningInNpmLifecycle } from "../project/detect";

export async function shouldUseInteractiveUI(flags: Flags): Promise<boolean> {
	// default to empty flags
	const f = flags ?? {};
	if (f.nonInteractive) return false;
	if (!process.stdin.isTTY || !process.stdout.isTTY) return false;
	if (isCI()) return false;
	if (isRunningInNpmLifecycle()) return false;
	if (await isRunningInDocker()) return false;
	return true;
}

export const isInteractive = shouldUseInteractiveUI;
