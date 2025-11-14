import type { PromptPack, PromptContext, PromptQuestion } from "@appinit/types";
import { askAnswers } from "../prompt";
import { validateName } from "@appinit/utils";

export const previousConfigPack: PromptPack = {
	name: "previous-config",
	priority: 5, // MUST run before metaPack

	async handler(ctx: PromptContext, accum) {
		const flags = ctx.flags ?? {};
		const saved = ctx.config ?? null;

		// ---------------------------------------------
		// 1) Non-interactive → skip reuse logic
		// ---------------------------------------------
		if (flags["non-interactive"] || ctx.runtime === "api") {
			return {};
		}

		// ---------------------------------------------
		// 2) No previous config → proceed normally
		// ---------------------------------------------
		if (!saved) return {};

		// ---------------------------------------------
		// 3) Ask: reuse previous config?
		// ---------------------------------------------
		const reuseAnswer = await askAnswers(
			[
				{
					type: "confirm",
					name: "reusePrevious",
					message: "🧠 Reuse your last configuration?",
					initial: true,
				},
			],
			accum,
			ctx,
		);

		if (reuseAnswer.reusePrevious !== true) {
			return {}; // user wants a fresh config → continue to metaPack
		}

		// ---------------------------------------------
		// 4) Ask only for projectName override
		// ---------------------------------------------
		const rename = await askAnswers(
			[
				{
					type: "text",
					name: "projectName",
					message: "🧱 New project name:",
					initial: ctx.cliName ?? saved.projectName + "-2",
					validate: validateName,
				},
			],
			accum,
			ctx,
		);

		console.log(
			`\n✨ Reusing previous config → new project: ${rename.projectName}\n`,
		);

		// ---------------------------------------------
		// 5) Merge into accum (but override projectName)
		// ---------------------------------------------
		const merged = {
			...saved,
			projectName: rename.projectName,
		};

		return merged;
	},
};
