import { askAnswers } from "../prompt";
import type { PromptPack, PromptContext, PromptQuestion } from "@appinit/types";

/**
 * Project type
 */
const PROJECT_TYPES = [
	{ label: "Frontend Application", value: "frontend" },
	{ label: "Backend API", value: "backend" },
	{ label: "Fullstack (UI + API)", value: "fullstack" },
	{ label: "Library / SDK", value: "library" },
	{ label: "CLI Tool", value: "cli" },
];
export const projectTypePack: PromptPack = {
	name: "project-type",
	priority: 15,

	handler: async (ctx: PromptContext, accum) => {
		const flags = ctx.flags ?? {};
		const fallback = flags?.projectType ?? "frontend";
		const hooks = ctx.hooks;
		const nonInteractive = flags.nonInteractive;
		const api = ctx.runtime === "api";
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

		console.log("PROJECT TYPE RETURN", result);
		return { projectType: result.projectType };
	},
};
