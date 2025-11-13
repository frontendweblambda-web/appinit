import { askAnswers } from "../prompt";
import type { PromptContext, PromptPack } from "@appinit/types";

export const languagePack: PromptPack = {
	name: "language",
	handler: async (ctx: PromptContext, accum) => {
		// -------------------------
		// 1. Non-interactive mode
		// -------------------------
		if (ctx.flags["non-interactive"]) {
			return {
				language: ctx.flags.language ?? "typescript",
				structure: ctx.flags.structure ?? "src-folder",
			};
		}

		// -------------------------
		// 2. Interactive prompt
		// Note: "initial" must be an index, NOT a string.
		// -------------------------
		const res = await askAnswers(
			[
				{
					type: "select",
					name: "language",
					message: "💬 Language preference:",
					choices: [
						{ title: "TypeScript", value: "typescript" },
						{ title: "JavaScript", value: "javascript" },
					],
					initial: ctx.flags.language === "javascript" ? 1 : 0,
				},
				{
					type: "select",
					name: "structure",
					message: "📁 Project structure:",
					choices: [
						{ title: "Flat (no src/ folder)", value: "flat" },
						{ title: "With src/ folder", value: "src-folder" },
					],
					initial: ctx.flags.structure === "flat" ? 0 : 1,
				},
			],
			accum,
		);

		return res;
	},
};
