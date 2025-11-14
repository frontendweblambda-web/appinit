import { askAnswers } from "../prompt";
import type { PromptContext, PromptPack, ChoiceOption } from "@appinit/types";

export const languagePack: PromptPack = {
	name: "language",
	priority: 15,

	handler: async (ctx: PromptContext, accum) => {
		// ----------------------------------------------------
		// NON-INTERACTIVE MODE
		// ----------------------------------------------------
		if (ctx.flags["non-interactive"]) {
			return {
				language: ctx.flags.language ?? "typescript",
				structure: ctx.flags.structure ?? "src-folder",
			};
		}

		// ----------------------------------------------------
		// INTERACTIVE MODE
		// ----------------------------------------------------
		const res = await askAnswers(
			[
				{
					type: "select",
					name: "language",
					message: "💬 Language preference:",
					choices: [
						{ label: "TypeScript", value: "typescript" },
						{ label: "JavaScript", value: "javascript" },
					] as ChoiceOption[],
					initial: ctx.flags.language ?? accum.language ?? "typescript",
				},
				{
					type: "select",
					name: "structure",
					message: "📁 Project structure:",
					choices: [
						{ label: "Flat (no src folder)", value: "flat" },
						{ label: "With src/ folder", value: "src-folder" },
					] as ChoiceOption[],
					initial: ctx.flags.structure ?? accum.structure ?? "src-folder",
				},
			],
			accum,
			ctx,
		);

		return res;
	},
};
