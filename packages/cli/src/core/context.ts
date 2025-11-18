import type { Flags, PromptContext } from "@appinit/types";
import { loadUserConfig } from "./config-store.js";
import { getCliName } from "../utils/cli-name.js";
import {
	isCI,
	isRunningInNpmLifecycle,
	shouldUseInteractiveUI,
	detectPackageManager,
	getPackageManager,
} from "@appinit/core";

export async function buildContext(cmd: {
	name: string;
	args: string[];
	flags: Flags;
}): Promise<PromptContext> {
	const saved = await loadUserConfig();
	const cwd = process.cwd();
	// console.log("SAVED CONFIG", saved);
	const ctx: PromptContext = {
		// from PromptBaseContext
		command: cmd.name,
		flags: cmd.flags ?? {},
		cwd,
		// cli metadata
		cliName: getCliName(),
		cliVersion: process.env.APPINIT_CLI_VERSION ?? null,
		nodeVersion: process.version,
		os: process.platform,
		debug: Boolean(cmd.flags.debug),

		// config & runtime
		config: saved ?? null,
		previousConfigLoaded: !!saved,
		skipDefaultPacks: false,

		runtime: "cli",
		outputMode: cmd.flags.json ? "json" : "text",

		// template info (will be filled later)
		templateId: cmd.flags.template ?? null,
		templateName: null,
		templateMeta: null,
		templateDir: null,
		template: undefined,
		templateResolved: false,
		templatePromptPacks: [],
		pluginPromptPacks: [],

		// environment snapshot
		env: {
			ci: isCI(),
			docker: false, // can be set async later if you want
			tty: !!(process.stdin.isTTY && process.stdout.isTTY),
			npmLifecycle: isRunningInNpmLifecycle(),
		},

		answers: {},
		hooks: undefined,
		extra: {},
	};

	// Seed projectName from positional args: `appinit create my-app`
	if (cmd.args[0]) {
		ctx.answers!.projectName = cmd.args[0];
	}

	// Package manager detection (flag wins, else auto-detect)
	ctx.packageManager =
		cmd.flags.packageManager ?? (await detectPackageManager(cwd)) ?? null;

	// Determine interactive mode once
	ctx.interactive = await shouldUseInteractiveUI(cmd.flags);
	// console.log("CLI CONTEXT RETURN", ctx);
	return ctx;
}
