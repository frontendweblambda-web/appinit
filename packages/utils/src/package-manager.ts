import { exec as _exec } from "node:child_process";
import { promisify } from "node:util";
import path from "node:path";
import fs from "node:fs/promises";
import { DEFAULT_SHELL } from "./shell";
import type { PackageManager, PackageManagerAPI } from "@appinit/types";

const exec = promisify(_exec);

/** Detect package manager by lockfile */
export async function detectPackageManager(
	cwd: string,
): Promise<PackageManager> {
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

	return "npm";
}

/** Create a unified PM interface */
export async function getPackageManager(
	cwd: string = process.cwd(),
): Promise<PackageManagerAPI> {
	const pm = await detectPackageManager(cwd);

	const runCmd = async (parts: string[]) => {
		await exec(parts.join(" "), { cwd, shell: DEFAULT_SHELL });
	};
	return {
		name: pm,

		async install(deps) {
			if (!deps.length) return;
			if (pm === "npm") return runCmd(["npm", "install", ...deps]);
			if (pm === "yarn") return runCmd(["yarn", "add", ...deps]);
			if (pm === "pnpm") return runCmd(["pnpm", "add", ...deps]);
			if (pm === "bun") return runCmd(["bun", "add", ...deps]);
		},

		async installDev(deps) {
			if (!deps.length) return;
			if (pm === "npm") return runCmd(["npm", "install", "-D", ...deps]);
			if (pm === "yarn") return runCmd(["yarn", "add", "-D", ...deps]);
			if (pm === "pnpm") return runCmd(["pnpm", "add", "-D", ...deps]);
			if (pm === "bun") return runCmd(["bun", "add", "-d", ...deps]);
		},

		async remove(deps) {
			if (!deps.length) return;
			if (pm === "npm") return runCmd(["npm", "uninstall", ...deps]);
			if (pm === "yarn") return runCmd(["yarn", "remove", ...deps]);
			if (pm === "pnpm") return runCmd(["pnpm", "remove", ...deps]);
			if (pm === "bun") return runCmd(["bun", "remove", ...deps]);
		},

		async run(script) {
			if (pm === "npm") return runCmd(["npm", "run", script]);
			if (pm === "yarn") return runCmd(["yarn", script]);
			if (pm === "pnpm") return runCmd(["pnpm", "run", script]);
			if (pm === "bun") return runCmd(["bun", script]);
		},
		/** NEW: run arbitrary PM commands */
		async runRaw(args) {
			return runCmd([pm, ...args]);
		},
	};
}
