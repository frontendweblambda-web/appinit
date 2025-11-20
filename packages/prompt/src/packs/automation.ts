import type { PromptContext, PromptPack, PromptQuestion } from "@appinit/types";
import { askAnswers } from "../prompt";

export const automationPack: PromptPack = {
	name: "automation",
	priority: 90, // runs towards the end

	handler: async (ctx: PromptContext, accum) => {
		const flags = ctx.flags ?? {};
		const nonInteractive = flags.nonInteractive;
		// ----------------------------------------------------
		// NON-INTERACTIVE MODE
		// ----------------------------------------------------
		if (nonInteractive) {
			return {
				autoInstall: flags.install ?? true,
				// autoStart: flags.autoStart ?? false,
				useAI: flags.ai ?? false,
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
				initial: flags.install ?? true,
			},
			{
				type: "confirm",
				name: "autoStart",
				message: "▶️ Start dev server after install?",
				initial: false,
			},
			{
				type: "confirm",
				name: "useAI",
				message: "🤖 Let AI optimize setup?",
				initial: flags.ai ?? false,
			},
		];

		const res = await askAnswers(questions, accum, ctx);

		return res;
	},
};
