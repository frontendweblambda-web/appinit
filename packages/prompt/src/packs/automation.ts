import { askAnswers } from "../prompt";
import type { PromptContext, PromptPack } from "@appinit/types";

export const automationPack: PromptPack = {
	name: "automation",

	handler: async (ctx: PromptContext, accum) => {
		// ---------------------------------------------------
		// 1. Non-interactive mode (CI, scripts, automation)
		// ---------------------------------------------------
		if (ctx.flags["non-interactive"]) {
			return {
				autoInstall: ctx.flags.autoInstall ?? true,
				autoStart: ctx.flags.autoStart ?? false,
				useAI: ctx.flags.useAI ?? false,
			};
		}

		// ---------------------------------------------------
		// 2. Interactive mode
		// ---------------------------------------------------
		const res = await askAnswers(
			[
				{
					type: "toggle",
					name: "autoInstall",
					message: "⚙️ Install dependencies after generation?",
					initial: ctx.flags.autoInstall ?? true,
					active: "yes",
					inactive: "no",
				},
				{
					type: "toggle",
					name: "autoStart",
					message: "▶️ Start dev server after install?",
					initial: ctx.flags.autoStart ?? false,
					active: "yes",
					inactive: "no",
				},
				{
					type: "toggle",
					name: "useAI",
					message: "🤖 Let AI optimize setup?",
					initial: ctx.flags.useAI ?? false,
					active: "yes",
					inactive: "no",
				},
			],
			accum,
		);

		return res;
	},
};
