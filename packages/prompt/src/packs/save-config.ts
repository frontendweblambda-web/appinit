import { askAnswers } from "../prompt";

import type { PromptPack, PromptContext, PromptQuestion } from "@appinit/types";

export const saveConfigPack: PromptPack = {
	name: "save-config",
	priority: 100, // runs towards the end

	handler: async (ctx: PromptContext, accum) => {
		const flags = ctx.flags ?? {};

		// ----------------------------------------------------
		// NON-INTERACTIVE MODE
		// ----------------------------------------------------
		if (flags["non-interactive"]) {
			return { saveConfig: Boolean(flags.saveConfig) };
		}

		// ----------------------------------------------------
		// INTERACTIVE MODE
		// ----------------------------------------------------
		const questions: PromptQuestion[] = [
			{
				type: "confirm",
				name: "saveConfig",
				message: "💾 Do you want to save this configuration for future use?",
				initial: false, // default to not saving
			},
		];

		// Get answers from user
		const res = await askAnswers(questions, accum, ctx);

		// Return the user's responses
		return res;
	},
};
