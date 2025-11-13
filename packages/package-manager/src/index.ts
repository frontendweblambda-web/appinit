// packages/package-manager/src/index.ts
// ESM-ready, turborepo-friendly package manager detection + execution layer

import { exec as _exec } from "node:child_process";
import { promisify } from "node:util";
import path from "node:path";
import fs from "node:fs/promises";

const exec = promisify(_exec);

export type PackageManager = "npm" | "yarn" | "pnpm" | "bun";

export interface PM {
	name: PackageManager;
	install(deps: string[]): Promise<void>;
	installDev(deps: string[]): Promise<void>;
	remove(deps: string[]): Promise<void>;
	run(script: string): Promise<void>;
}

/** Detect package manager via lockfiles */
export async function detectPM(cwd: string): Promise<PackageManager> {
	const checks: Array<[PackageManager, string]> = [
		["pnpm", "pnpm-lock.yaml"],
		["yarn", "yarn.lock"],
		["bun", "bun.lockb"],
		["npm", "package-lock.json"],
	];

	for (const [pm, file] of checks) {
		try {
			await fs.access(path.join(cwd, file));
			return pm;
		} catch {}
	}

	// fallback: npm
	return "npm";
}

/** Create a unified PM interface */
export async function getPM(cwd: string): Promise<PM> {
	const pm = await detectPM(cwd);

	function cmd(parts: string[]) {
		return exec(parts.join(" "), { cwd });
	}

	const api: PM = {
		name: pm,

		async install(deps) {
			if (!deps.length) return;
			if (pm === "npm") return cmd(["npm", "install", ...deps]);
			if (pm === "yarn") return cmd(["yarn", "add", ...deps]);
			if (pm === "pnpm") return cmd(["pnpm", "add", ...deps]);
			if (pm === "bun") return cmd(["bun", "add", ...deps]);
		},

		async installDev(deps) {
			if (!deps.length) return;
			if (pm === "npm") return cmd(["npm", "install", "-D", ...deps]);
			if (pm === "yarn") return cmd(["yarn", "add", "-D", ...deps]);
			if (pm === "pnpm") return cmd(["pnpm", "add", "-D", ...deps]);
			if (pm === "bun") return cmd(["bun", "add", "-d", ...deps]);
		},

		async remove(deps) {
			if (!deps.length) return;
			if (pm === "npm") return cmd(["npm", "uninstall", ...deps]);
			if (pm === "yarn") return cmd(["yarn", "remove", ...deps]);
			if (pm === "pnpm") return cmd(["pnpm", "remove", ...deps]);
			if (pm === "bun") return cmd(["bun", "remove", ...deps]);
		},

		async run(script) {
			if (pm === "npm") return cmd(["npm", "run", script]);
			if (pm === "yarn") return cmd(["yarn", script]);
			if (pm === "pnpm") return cmd(["pnpm", "run", script]);
			if (pm === "bun") return cmd(["bun", script]);
		},
	};

	return api;
}

export default getPM;
