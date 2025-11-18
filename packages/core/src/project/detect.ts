import { PromptContext, PromptResult, Answers } from "@appinit/types";
import { pathExists, readFileSync } from "@appinit/utils";

export const isMonorepo = (answers: Partial<Answers>): boolean =>
	["turborepo", "nx", "monorepo"].includes(answers.workspaceTool as string);

export function isRunningInNpmLifecycle(): boolean {
	return Boolean(process.env.npm_lifecycle_event);
}

export function isRunningViaNpm(): boolean {
	return Boolean(process.env.npm_execpath);
}

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
	ctx: PromptContext,
	accum: PromptResult,
): boolean {
	const type = (accum.projectType ?? ctx.flags?.projectType) as
		| string
		| undefined;

	return (
		type === "library" ||
		type === "cli" ||
		type === "plugin" ||
		isMonorepo(ctx?.answers as Answers)
	);
}
