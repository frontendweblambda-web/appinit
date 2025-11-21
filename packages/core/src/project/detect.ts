import {
	AppinitConfig,
	PromptContext,
	PromptResult,
	WorkspaceTool,
} from "@appinit/types";
import { pathExists, readFileSync } from "@appinit/utils";

export const isMonorepo = (tool: WorkspaceTool) =>
	["turborepo", "nx", "monorepo"].includes(tool);

export const isRunningInNpmLifecycle = () =>
	Boolean(process.env.npm_lifecycle_event);

export const isRunningViaNpm = () => Boolean(process.env.npm_execpath);

export async function isRunningInDocker(): Promise<boolean> {
	try {
		if (process.env.DOCKER || process.env.CONTAINER) return true;
		if (await pathExists("/.dockerenv")) return true;
		if (await pathExists("/proc/1/cgroup")) {
			const cgroup = readFileSync("/proc/1/cgroup");
			if (cgroup.includes("docker") || cgroup.includes("container"))
				return true;
		}
		return false;
	} catch {
		return false;
	}
}

export function shouldAskPackageScope(
	config: AppinitConfig,
	ctx: PromptContext,
	accum: PromptResult,
): boolean {
	const type = accum.projectType ?? config.promptResult?.projectType;

	return (
		type === "library" || type === "cli" || isMonorepo(ctx?.workspaceTool!)
	);
}
