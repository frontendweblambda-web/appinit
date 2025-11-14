import { askAnswers } from "../prompt";
import type { PromptContext, PromptPack } from "@appinit/types";

export const languagePack: PromptPack = {
	name: "language",

	handler: async (ctx: PromptContext, accum) => {
		if (ctx.flags["non-interactive"]) {
			return {
				language: ctx.flags.language ?? "typescript",
				structure: ctx.flags.structure ?? "src-folder",
			};
		}

		const res = await askAnswers(
			[
				{
					type: "select",
					name: "language",
					message: "💬 Language preference:",
					choices: [
						{ label: "TypeScript", value: "typescript" },
						{ label: "JavaScript", value: "javascript" },
					],
					initial: ctx.flags.language ?? accum.language ?? "typescript",
				},
				{
					type: "select",
					name: "structure",
					message: "📁 Project structure:",
					choices: [
						{ label: "Flat (no src folder)", value: "flat" },
						{ label: "With src/ folder", value: "src-folder" },
					],
					initial: ctx.flags.structure ?? accum.structure ?? "src-folder",
				},
			],
			accum,
		);

		return res;
	},
};
