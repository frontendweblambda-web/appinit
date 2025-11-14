import { askAnswers } from "../prompt";
import type { PromptPack, PromptContext } from "@appinit/types";

export const automationPack: PromptPack = {
	name: "automation",

	handler: async (ctx: PromptContext, accum) => {
		if (ctx.flags["non-interactive"]) {
			return {
				autoInstall: ctx.flags.autoInstall ?? true,
				autoStart: ctx.flags.autoStart ?? false,
				useAI: ctx.flags.useAI ?? false,
			};
		}

		const res = await askAnswers(
			[
				{
					type: "confirm",
					name: "autoInstall",
					message: "⚙️ Install dependencies after generation?",
					initial: ctx.flags.autoInstall ?? true,
				},
				{
					type: "confirm",
					name: "autoStart",
					message: "▶️ Start dev server after install?",
					initial: ctx.flags.autoStart ?? false,
				},
				{
					type: "confirm",
					name: "useAI",
					message: "🤖 Let AI optimize setup?",
					initial: ctx.flags.useAI ?? false,
				},
			],
			accum,
		);

		return res;
	},
};
