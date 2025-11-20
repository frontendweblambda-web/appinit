import type { PackageManager, PackageManagerAPI } from "@appinit/types";
import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";

export function runCommand(
	cmd: string,
	args: string[] = [],
	opts: { cwd?: string; env?: NodeJS.ProcessEnv } = {},
) {
	return new Promise((resolve, reject) => {
		const child = spawn(cmd, args, {
			cwd: opts.cwd,
			env: { ...process.env, ...opts.env },
			stdio: "inherit",
			shell: false,
		});

		child.on("error", reject);
		child.on("exit", (code) => {
			if (code === 0) return resolve(code);
			reject(new Error(`${cmd} ${args.join(" ")} failed with exit ${code}`));
		});
	});
}

/** Safe lockfile-based auto detection */
export async function detectPackageManager(
	cwd: string,
): Promise<PackageManager> {
	const list: [PackageManager, string][] = [
		["pnpm", "pnpm-lock.yaml"],
		["yarn", "yarn.lock"],
		["bun", "bun.lockb"],
		["npm", "package-lock.json"],
	];

	for (const [pm, lock] of list) {
		try {
			await fs.access(path.join(cwd, lock));
			return pm;
		} catch {}
	}

	return "npm"; // fallback
}

/** Create unified PM interface */
export async function getPackageManager(
	pm: PackageManager = "npm",
	cwd: string,
): Promise<PackageManagerAPI> {
	const bin = {
		npm: "npm",
		yarn: "yarn",
		pnpm: "pnpm",
		bun: "bun",
	}[pm];

	return {
		name: pm,

		/** npm install */
		async install(opts = {}) {
			await runCommand(bin, ["install"], { cwd: opts.cwd ?? cwd });
		},

		/** npm install react */
		async installDeps(deps, opts = {}) {
			if (!deps.length) return;

			const args = {
				npm: ["install"],
				yarn: ["add"],
				pnpm: ["add"],
				bun: ["add"],
			}[pm];

			await runCommand(bin, [...args, ...deps], { cwd: opts.cwd ?? cwd });
		},

		/** npm install -D typescript */
		async installDevDeps(deps, opts = {}) {
			if (!deps.length) return;

			const args = {
				npm: ["install", "-D"],
				yarn: ["add", "-D"],
				pnpm: ["add", "-D"],
				bun: ["add", "-d"],
			}[pm];

			await runCommand(bin, [...args, ...deps], { cwd: opts.cwd ?? cwd });
		},

		/** npm uninstall react */
		async remove(deps, opts = {}) {
			if (!deps.length) return;

			const args = {
				npm: ["uninstall"],
				yarn: ["remove"],
				pnpm: ["remove"],
				bun: ["remove"],
			}[pm];

			await runCommand(bin, [...args, ...deps], { cwd: opts.cwd ?? cwd });
		},

		/** npm run build */
		async run(script, opts = {}) {
			if (!script) return;

			const args = pm === "yarn" ? [script] : ["run", script];

			await runCommand(bin, args, { cwd: opts.cwd ?? cwd });
		},

		/** npm <raw args> */
		async runRaw(args, opts = {}) {
			if (!args.length) return;
			await runCommand(bin, args, { cwd: opts.cwd ?? cwd });
		},
	};
}
