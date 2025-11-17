import { askAnswers } from "../prompt";
import type { PromptPack, PromptContext, PromptQuestion } from "@appinit/types";
import {
	FRONTEND_FRAMEWORK_CHOICES,
	FULLSTACK_META_FRAMEWORKS,
	getFormChoices,
	getRoutingChoices,
	getStoreChoices,
	getUIChoices,
} from "../static/framework.data";

export const frameworkPack: PromptPack = {
	name: "framework",
	priority: 20,

	/**
	 * Runs only when projectType is frontend or fullstack.
	 */
	condition: (_, accum) => {
		const type = accum.projectType;
		return type === "frontend" || type === "fullstack";
	},

	handler: async (ctx: PromptContext, accum) => {
		const flags = ctx.flags ?? {};
		const projectType = accum.projectType ?? flags.projectType;
		const nonInteractive = flags.nonInteractive;
		const selectedFramework = accum.framework ?? flags.framework;

		const isFullstack = projectType === "fullstack";
		// -----------------------------------------
		// NON-INTERACTIVE MODE
		// -----------------------------------------
		if (nonInteractive) {
			return {
				framework: flags.framework,
			};
		}

		// =================================================================
		// 1️⃣ FRONTEND PROJECTS
		// =================================================================
		const base = await askAnswers(
			[
				{
					type: "select",
					name: "framework",
					message: `⚙️ ${isFullstack ? "Fullstack" : "Frontend"} Framework:`,
					choices:
						accum.projectType === "fullstack"
							? FULLSTACK_META_FRAMEWORKS
							: FRONTEND_FRAMEWORK_CHOICES,
					initial:
						selectedFramework ??
						(accum.projectType === "fullstack" ? "next" : "react"),
				},
			],
			accum,
			ctx,
		);

		if (accum.projectType === "frontend") {
			return base;
		}

		return {
			framework: undefined,
		};
	},
};
