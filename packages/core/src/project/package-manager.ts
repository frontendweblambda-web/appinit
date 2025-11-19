import { exec as _exec, spawn } from "node:child_process";
import { promisify } from "node:util";
import path from "node:path";
import fs from "node:fs/promises";
import { DEFAULT_SHELL } from "../utils/shell";
import type { PackageManager, PackageManagerAPI } from "@appinit/types";

const exec = promisify(_exec);

/* -----------------------------------------------------
   SAFE, STREAMING, CROSS-PLATFORM COMMAND EXECUTOR
   (better than exec, similar to execa behavior)
------------------------------------------------------ */
export function runCommand(
	cmd: string,
	args: string[],
	opts: { cwd?: string; env?: NodeJS.ProcessEnv } = {},
) {
	return new Promise((resolve, reject) => {
		const child = spawn(cmd, args, {
			cwd: opts.cwd,
			env: { ...process.env, ...opts.env },
			stdio: "inherit",
			shell: false, // MOST IMPORTANT: prevents shell injection
		});

		child.on("error", reject);
		child.on("exit", (code) => {
			if (code === 0) return resolve(code);
			reject(
				new Error(
					`Command failed: ${cmd} ${args.join(" ")} (exit code ${code})`,
				),
			);
		});
	});
}

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
		} catch {
			throw new Error("No package manager find!");
		}
	}

	return "npm";
}

/** Create a unified PM interface */
export async function getPackageManager(
	cwd: string = process.cwd(),
): Promise<PackageManagerAPI> {
	const pm = await detectPackageManager(cwd);

	const bin = {
		npm: "npm",
		yarn: "yarn",
		pnpm: "pnpm",
		bun: "bun",
	}[pm];

	const installCmd = {
		npm: ["install"],
		yarn: ["add"],
		pnpm: ["add"],
		bun: ["add"],
	}[pm];

	const installDevCmd = {
		npm: ["install", "-D"],
		yarn: ["add", "-D"],
		pnpm: ["add", "-D"],
		bun: ["add", "-d"],
	}[pm];

	const removeCmd = {
		npm: ["uninstall"],
		yarn: ["remove"],
		pnpm: ["remove"],
		bun: ["remove"],
	}[pm];

	const runScriptCmd = {
		npm: ["run"],
		yarn: [],
		pnpm: ["run"],
		bun: [],
	}[pm];

	return {
		name: pm,

		/* Install regular deps */
		async install(deps) {
			if (!deps.length) return;
			await runCommand(bin, [...installCmd, ...deps], { cwd });
		},

		/* Install dev-deps */
		async installDev(deps) {
			if (!deps.length) return;
			await runCommand(bin, [...installDevCmd, ...deps], { cwd });
		},

		/* Remove deps */
		async remove(deps) {
			if (!deps.length) return;
			await runCommand(bin, [...removeCmd, ...deps], { cwd });
		},

		/* Run a package.json script */
		async run(script) {
			if (!script) return;
			await runCommand(bin, [...runScriptCmd, script], { cwd });
		},

		/* Run arbitrary package manager command */
		async runRaw(args) {
			if (!args.length) return;
			await runCommand(bin, args, { cwd });
		},
	};
}
