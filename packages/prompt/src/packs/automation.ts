import { askAnswers } from "../prompt";
import type { PromptPack, PromptContext, PromptQuestion } from "@appinit/types";

export const automationPack: PromptPack = {
	name: "automation",
	priority: 90, // runs towards the end

	handler: async (ctx: PromptContext, accum) => {
		const flags = ctx.flags ?? {};

		// ----------------------------------------------------
		// NON-INTERACTIVE MODE
		// ----------------------------------------------------
		if (flags["non-interactive"]) {
			return {
				autoInstall: flags.autoInstall ?? true,
				autoStart: flags.autoStart ?? false,
				useAI: flags.useAI ?? false,
			};
		}

		// ----------------------------------------------------
		// INTERACTIVE MODE
		// ----------------------------------------------------
		const questions: PromptQuestion[] = [
			{
				type: "confirm",
				name: "autoInstall",
				message: "⚙️ Install dependencies after generation?",
				initial: flags.autoInstall ?? true,
			},
			{
				type: "confirm",
				name: "autoStart",
				message: "▶️ Start dev server after install?",
				initial: flags.autoStart ?? false,
			},
			{
				type: "confirm",
				name: "useAI",
				message: "🤖 Let AI optimize setup?",
				initial: flags.useAI ?? false,
			},
		];

		const res = await askAnswers(questions, accum, ctx);

		return res;
	},
};
