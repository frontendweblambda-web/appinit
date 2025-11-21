import { askAnswers } from "../prompt";

import type { PromptContext, PromptPack, PromptQuestion } from "@appinit/types";

export const saveConfigPack: PromptPack = {
	name: "save-config",
	priority: 100, // runs towards the end

	handler: async (ctx: PromptContext, accum) => {
		const flags = ctx.flags ?? {};
		const interactive = ctx.interactive;
		// ----------------------------------------------------
		// NON-INTERACTIVE MODE
		// ----------------------------------------------------
		if (!interactive) {
			return { config: null };
		}

		// ----------------------------------------------------
		// INTERACTIVE MODE
		// ----------------------------------------------------
		const questions: PromptQuestion[] = [
			{
				type: "confirm",
				name: "config",
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
