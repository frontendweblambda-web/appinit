import type { PromptPack, PromptQuestion } from "@appinit/types";
import { askAnswers } from "../prompt";
import { PROJECT_TYPES } from "../static/project-type.data";

/**
 * Project type
 */

export const projectTypePack: PromptPack = {
	name: "project-type",
	priority: 15,

	handler: async (config, ctx, accum) => {
		const flags = config.cliCommand?.flags ?? {};
		const fallback = flags?.projectType ?? "frontend";
		const interactive = config.interactive;

		// -----------------------------------------
		// NON-INTERACTIVE MODE
		// -----------------------------------------
		if (!interactive) {
			const projectType = fallback;
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
				initial: accum?.projectType ?? "frontend",
			},
		];

		const result = await askAnswers(questions, accum, ctx);

		return { projectType: result.projectType };
	},
};
