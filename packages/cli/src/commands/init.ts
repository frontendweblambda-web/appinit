import * as fs from "node:fs";
import { parseFlags } from "../flags";
import path from "node:path";

export async function runInit(argv: string[]) {
	const { args, flags } = parseFlags(argv);
	const cwd = process.cwd();

	// If user provided --yes or --defaults, skip prompts
	const skipPrompts = flags.yes || flags.y || false;

	// 1) Check for existing appinit.config.* files
	const candidates = [
		"appinit.config.js",
		"appinit.config.cjs",
		"appinit.config.mjs",
		"appinit.json",
	];
	const existing = candidates.find((f) => fs.existsSync(path.join(cwd, f)));

	if (existing && !skipPrompts) {
		const resp: any = await ask([
			{
				type: "confirm",
				name: "useExisting",
				message: `Found ${existing}. Overwrite?`,
				initial: false,
			},
		]);
		if (!resp.useExisting) {
			logger.info("Init cancelled by user.");
			return;
		}
	}
}
