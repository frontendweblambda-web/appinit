import * as fs from "node:fs";
import path from "node:path";
import { parseFlags } from "../core/parse-flags";

export async function runAdd(argv: string[]) {
	console.clear();
	console.log("\n🚀 Appinit — adding\n");
	const { args, flags } = parseFlags(argv);
	const cwd = process.cwd();

	// If user provided --yes or --defaults, skip prompts
	const skipPrompts = flags.nonInteractive || false;

	// 1) Check for existing appinit.config.* files
	const candidates = [
		"appinit.config.js",
		"appinit.config.cjs",
		"appinit.config.mjs",
		"appinit.json",
	];
	const existing = candidates.find((f) => fs.existsSync(path.join(cwd, f)));
}
