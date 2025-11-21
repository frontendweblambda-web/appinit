import type { PromptPack } from "@appinit/types";
import { askAnswers } from "../prompt";
import {
	FRONTEND_FRAMEWORK_CHOICES,
	FULLSTACK_META_FRAMEWORKS,
} from "../static/framework.data";

export const frameworkPack: PromptPack = {
	name: "framework",
	priority: 20,

	/**
	 * Runs only when projectType is frontend or fullstack.
	 */
	condition: (_, accum) =>
		accum.projectType === "frontend" || accum.projectType === "fullstack",

	handler: async (config, ctx, accum) => {
		const interactive = config.interactive;
		const projectType = accum.projectType;
		const frontendFramework = accum.frontendFramework;

		const isFullstack = projectType === "fullstack";
		// non-interactive mode
		if (!interactive) {
			return {
				frontendFramework,
			};
		}

		// ask for framework
		const base = await askAnswers(
			[
				{
					type: "select",
					name: "frontendFramework",
					message: `⚙️ ${isFullstack ? "Fullstack" : "Frontend"} Framework:`,
					choices: isFullstack
						? FULLSTACK_META_FRAMEWORKS
						: FRONTEND_FRAMEWORK_CHOICES,
					initial: frontendFramework ?? (isFullstack ? "next" : "react"),
				},
			],
			accum,
			ctx,
		);

		// 🚀 ALWAYS RETURN THE SELECTED FRAMEWORK
		return base;
	},
};
