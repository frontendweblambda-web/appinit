import { askAnswers } from "../prompt";
import type { PromptPack, PromptContext } from "@appinit/types";

export const environmentPack: PromptPack = {
	name: "environment",
	handler: async (ctx: PromptContext, accum) => {
		// ---------------------------------------------------
		// 1. Non-interactive mode
		// ---------------------------------------------------
		if (ctx.flags["non-interactive"]) {
			return {
				registry: ctx.flags.registry ?? "pnpm",
				workspace: ctx.flags.workspace ?? "single",
			};
		}

		// ---------------------------------------------------
		// 2. Interactive mode — using numeric `initial` indexes
		// ---------------------------------------------------
		const res = await askAnswers(
			[
				{
					type: "select",
					name: "registry",
					message: "📦 Package manager:",
					choices: [
						{ title: "npm", value: "npm" },
						{ title: "pnpm", value: "pnpm" },
						{ title: "yarn", value: "yarn" },
						{ title: "bun", value: "bun" },
					],
					// numeric index required by prompts
					initial: (() => {
						const order = ["npm", "pnpm", "yarn", "bun"] as const;
						const idx = order.indexOf(ctx.flags.registry);
						return idx >= 0 ? idx : 1; // default to pnpm
					})(),
				},
				{
					type: "select",
					name: "workspace",
					message: "🧩 Workspace type:",
					choices: [
						{ title: "Single project", value: "single" },
						{ title: "Turborepo (monorepo)", value: "turborepo" },
					],
					initial: ctx.flags.workspace === "turborepo" ? 1 : 0,
				},
			],
			accum,
		);

		return res;
	},
};
