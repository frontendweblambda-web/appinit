import { askAnswers } from "../prompt";
import type { PromptPack, PromptContext, PromptQuestion } from "@appinit/types";

export const projectTypePack: PromptPack = {
	name: "project-type",
	priority: 10, // run very early

	handler: async (ctx: PromptContext, accum) => {
		const flags = ctx.flags ?? {};

		// -----------------------------------------
		// NON-INTERACTIVE MODE
		// -----------------------------------------
		if (flags["non-interactive"]) {
			return {
				type: flags.type ?? "frontend",
			};
		}

		// -----------------------------------------
		// INTERACTIVE MODE
		// -----------------------------------------
		const questions: PromptQuestion[] = [
			{
				type: "select",
				name: "type",
				message: "📦 Project type:",
				choices: [
					{ label: "Frontend Application", value: "frontend" },
					{ label: "Backend API", value: "backend" },
					{ label: "Fullstack (UI + API)", value: "fullstack" },
					{ label: "Library / SDK", value: "library" },
					{ label: "CLI Tool", value: "cli" },
				],
				initial: accum.type ?? "frontend",
			},
		];

		const result = await askAnswers(questions, accum, ctx);

		return { type: result.type };
	},
};
