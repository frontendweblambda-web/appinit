import { askAnswers } from "../prompt";
import type { PromptPack, PromptContext, PromptQuestion } from "@appinit/types";
import { PROJECT_TYPES } from "../static/project-type.data";

/**
 * Project type
 */

export const projectTypePack: PromptPack = {
	name: "project-type",
	priority: 15,

	handler: async (ctx: PromptContext, accum) => {
		const flags = ctx.flags ?? {};
		const fallback = flags?.projectType ?? "frontend";
		const nonInteractive = flags.nonInteractive;
		const interactive = ctx.interactive;

		// -----------------------------------------
		// NON-INTERACTIVE MODE
		// -----------------------------------------
		if (nonInteractive || interactive === false) {
			const projectType = String(flags.projectType ?? fallback).toLowerCase();
			const valid = PROJECT_TYPES.some((t) => t.value === projectType);
			if (!valid) {
				throw new Error(
					`Invalid --projectType "${projectType}". Valid options: ${PROJECT_TYPES.map(
						(t) => t.value,
					).join(", ")}`,
				);
			}
			return { projectType };
		}

		// -----------------------------------------
		// INTERACTIVE MODE
		// -----------------------------------------
		const questions: PromptQuestion[] = [
			{
				type: "select",
				name: "projectType",
				message: "📦 Project type:",
				choices: PROJECT_TYPES,
				initial: accum.type ?? "frontend",
			},
		];

		const result = await askAnswers(questions, accum, ctx);

		return { projectType: result.projectType };
	},
};
