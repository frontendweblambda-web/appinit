import type { PromptPack, PromptContext, PromptQuestion } from "@appinit/types";
import { askAnswers } from "../prompt";
import { validateName } from "@appinit/utils";

export const previousConfigPack: PromptPack = {
	name: "previous-config",
	priority: 5, // MUST run before metaPack

	async handler(ctx: PromptContext, accum) {
		const flags = ctx.flags ?? {};
		const savedConfig = ctx.config ?? null;
		const api = ctx.runtime === "api";
		const nonInteractive = flags.nonInteractive;

		// ---------------------------------------------
		// 1) Non-interactive → skip reuse logic
		// ---------------------------------------------
		// Skip reuse prompts in non-interactive or API mode
		if (nonInteractive || api) return {};
		if (!savedConfig) {
			console.log("NO CONFIG FOUND");
			return {};
		}

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
		const initialName = ctx.cliName ?? `${savedConfig.projectName}-2`;
		const rename = await askAnswers(
			[
				{
					type: "text",
					name: "projectName",
					message: "🧱 New project name:",
					initial: initialName,
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
			...savedConfig,
			projectName: rename.projectName,
		};

		console.log("PREVIOUS CONFIG RETURN", merged);
		return merged;
	},
};
