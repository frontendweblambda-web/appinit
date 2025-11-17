import {
	JsonObject,
	JsonArray,
	Answers,
	PromptContext,
	PromptResult,
	WorkspaceTool,
} from "@appinit/types";
import { pathExists, readFileSync } from "./file";
import { isCI } from "./env";
// ----------------------------------------------
// Helpers
// ----------------------------------------------
export function isObject(v: unknown): v is JsonObject {
	return v !== null && typeof v === "object" && !Array.isArray(v);
}

export function isArray(v: unknown): v is JsonArray {
	return Array.isArray(v);
}

export const isFrontend = (a: Answers) =>
	a.projectType === "frontend" || a.projectType === "fullstack";

export const isBackend = (a: Answers) =>
	a.projectType === "backend" || a.projectType === "fullstack";

export const isStaticFrontend = (a: Answers) =>
	isFrontend(a) && a.deploymentStrategy === "static";

export const isServerlessBackend = (a: Answers) =>
	isBackend(a) && a.backendDeployTarget === "lambda";

export const isFullstack = (a: Answers) => a.projectType === "fullstack";

export const isLibrary = (a: Answers) => a.projectType === "library";

export function isCliProject(input: { projectType?: string }): boolean {
	const type = input.projectType;
	return type === "cli";
}

export function isPluginProject(input: { projectType?: string }): boolean {
	// If you add `plugin` as a projectType later, support here
	return input.projectType === "plugin";
}

export function isMonorepo(answers: Partial<Answers>): boolean {
	return ["turborepo", "nx", "monorepo"].includes(
		answers.workspaceTool as string,
	);
}

export function camel(str: string) {
	return str.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

// NPM lifecycle detection
export function isRunningInNpmLifecycle(): boolean {
	return Boolean(process.env.npm_lifecycle_event);
}
// Optional: whether invoked via npm or yarn
export function isRunningViaNpm(): boolean {
	return Boolean(process.env.npm_execpath);
}

// Docker detection (async, safe)
export async function isRunningInDocker(): Promise<boolean> {
	try {
		// Env variables
		if (process.env.DOCKER || process.env.CONTAINER) return true;

		// Check docker env file
		if (await pathExists("/.dockerenv")) return true;

		// Check cgroup contents (Linux only)
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
// utils/normalize.ts
export function normalizeScope(v: any): string | null {
	if (!v) return null;
	if (typeof v !== "string") return null;
	const cleaned = v.trim().replace(/^@/, "");
	return cleaned ? `@${cleaned}` : null;
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
		type === "plugin" || // future-safe
		isMonorepo(ctx.answers)
	);
}

export const formatName = (name: string) =>
	String(name)
		.trim()
		.toLowerCase()
		.replace(/\s+/g, "-") // spaces → dash
		.replace(/[^a-z0-9-_]/g, "") // remove illegal chars
		.replace(/^-+|-+$/g, "");

export function merge(
	target: Record<string, any>,
	source?: Record<string, any>,
) {
	if (!source) return;
	for (const key in source) {
		if (target[key] === undefined) {
			target[key] = source[key];
		}
	}
}
