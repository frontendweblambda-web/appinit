// packages/engine

import { Flags, PromptResult, ResolvedTemplate } from "@appinit/types";
import { log } from "@clack/prompts";
import { runBeforeHook } from "./core";
import { installDependencies } from "./core/install-deps";
import { runAfterHook } from "./core/run-after-hook";
import { writeFilesToDisk } from "./core/write-to-disk";

/**
 * Start engine
 * @param answers
 */

export async function runTemplateEngine(
	resolvedTemplate: ResolvedTemplate,
	{
		answers,
		dryRun,
		force,
		flags,
		logger,
	}: {
		dryRun?: boolean;
		force?: boolean;
		logger: typeof log;
		flags?: Flags;
		answers: PromptResult;
	},
) {
	const scratch = new Map<string, any>();

	const ctx = {
		variables: resolvedTemplate.variables ?? {},
		answers: answers ?? {},

		paths: {
			templateRoot: resolvedTemplate.templateDir!,
			tempDir: resolvedTemplate.tempDir!,
			targetRoot: resolvedTemplate.targetDir!,
		},

		flags: flags!,

		logger, // allow printing inside hooks

		set: (key: string, value: any) => scratch.set(key, value),
		get: (key: string) => scratch.get(key),
	};

	// For debugging:
	logger.info("⚙️ Engine context created.");

	if (resolvedTemplate.hooks?.before) {
		await runBeforeHook(ctx, resolvedTemplate.hooks.before!);
	}

	await writeFilesToDisk(ctx, resolvedTemplate.files!);

	if (resolvedTemplate.hooks?.after) {
		await runAfterHook(ctx, resolvedTemplate.hooks?.after);
	}

	if (!ctx.flags.skipInstall) {
		await installDependencies(ctx);
	}
	console.log("Scratch", scratch);
}
