import { askAnswers } from "../prompt";
import type { PromptPack, PromptContext } from "@appinit/types";

export const environmentPack: PromptPack = {
	name: "environment",

	handler: async (ctx: PromptContext, accum) => {
		if (ctx.flags["non-interactive"]) {
			return {
				registry: ctx.flags.registry ?? "pnpm",
				workspace: ctx.flags.workspace ?? "single",
			};
		}

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
					],
					initial: ctx.flags.registry ?? accum.registry ?? "pnpm",
				},
				{
					type: "select",
					name: "workspace",
					message: "🧩 Workspace type:",
					choices: [
						{ label: "Single project", value: "single" },
						{ label: "Turborepo (monorepo)", value: "turborepo" },
					],
					initial: ctx.flags.workspace ?? accum.workspace ?? "single",
				},
			],
			accum,
		);

		return res;
	},
};
