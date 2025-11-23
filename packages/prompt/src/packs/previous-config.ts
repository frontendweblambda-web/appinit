import type { PromptPack } from "@appinit/types";
import { validateName } from "@appinit/utils";
import { askAnswers } from "../prompt";

export const previousConfigPack: PromptPack = {
	name: "previous-config",
	priority: 5, // MUST run before metaPack

	async handler(config, ctx, accum) {
		const savedConfig = config.config ?? null;
		const api = config.runtime === "api";
		const interactive = config.interactive;

		// ---------------------------------------------
		// 1) Non-interactive → skip reuse logic
		// ---------------------------------------------
		// Skip reuse prompts in non-interactive or API mode
		if (!interactive || api) return {};
		if (!savedConfig) {
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
		const initialName = ctx.projectName ?? `${savedConfig.projectName}-2`;
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
