import { askAnswers } from "../prompt";
import type { PromptPack, PromptContext } from "@appinit/types";
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

	handler: async (ctx: PromptContext, accum) => {
		const flags = ctx.flags ?? {};
		const nonInteractive = flags.nonInteractive;
		const projectType = accum.projectType;
		const selectedFramework = accum.framework ?? flags.framework;

		const isFullstack = projectType === "fullstack";
		// non-interactive mode
		if (nonInteractive) {
			return {
				framework: flags.framework,
			};
		}

		// ask for framework
		const base = await askAnswers(
			[
				{
					type: "select",
					name: "framework",
					message: `⚙️ ${isFullstack ? "Fullstack" : "Frontend"} Framework:`,
					choices: isFullstack
						? FULLSTACK_META_FRAMEWORKS
						: FRONTEND_FRAMEWORK_CHOICES,
					initial: selectedFramework ?? (isFullstack ? "next" : "react"),
				},
			],
			accum,
			ctx,
		);

		// 🚀 ALWAYS RETURN THE SELECTED FRAMEWORK
		return base;
	},
};
