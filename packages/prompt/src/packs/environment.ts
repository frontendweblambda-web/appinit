import { askAnswers } from "../prompt";
import type { PromptPack, PromptContext, ChoiceOption } from "@appinit/types";

export const environmentPack: PromptPack = {
	name: "environment",
	priority: 30,

	handler: async (ctx: PromptContext, accum) => {
		const flags = ctx.flags ?? {};

		// ------------------------------------------------------
		// NON-INTERACTIVE MODE (CI / API / scripted)
		// ------------------------------------------------------
		if (flags["non-interactive"]) {
			return {
				registry: flags.registry ?? accum.registry ?? "pnpm",
				workspace: flags.workspace ?? accum.workspace ?? "single",
			};
		}

		// ------------------------------------------------------
		// INTERACTIVE PROMPTS
		// ------------------------------------------------------
		const res = await askAnswers(
			[
				{
					type: "select",
					name: "registry",
					message: "📦 Package manager:",
					choices: [
						{ label: "npm", value: "npm" },
						{ label: "pnpm", value: "pnpm" },
						{ label: "yarn", value: "yarn" },
						{ label: "bun", value: "bun" },
					] as ChoiceOption[],
					initial: flags.registry ?? accum.registry ?? "pnpm",
				},
				{
					type: "select",
					name: "workspace",
					message: "🧩 Workspace type:",
					choices: [
						{ label: "Single project", value: "single" },
						{ label: "Turborepo (monorepo)", value: "turborepo" },
						// If you add more: nx, lerna, moon, etc.
					] as ChoiceOption[],
					initial: flags.workspace ?? accum.workspace ?? "single",
				},
			],
			accum,
			ctx,
		);

		return res;
	},
};
