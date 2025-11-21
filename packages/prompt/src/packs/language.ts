import type { PromptPack } from "@appinit/types";
import { askAnswers } from "../prompt";
import { folderStructureChoices } from "../static/framework.data";
import { languageChoices } from "../static/language";

export const languagePack: PromptPack = {
	name: "language",
	priority: 25,

	// --------------------------------------------------------------------------
	// Only ask if the project actually contains source code (not docs/config only)
	// --------------------------------------------------------------------------
	condition: (_, accum) => {
		const codeProjects = ["frontend", "backend", "fullstack", "library"];
		return codeProjects.includes(accum.projectType ?? "");
	},

	handler: async (config, ctx, accum) => {
		const prev = config.config ?? {};
		const interactive = config.interactive;

		const defaultLanguage = prev.language ?? accum.language ?? "typescript";

		const defaultStructure =
			prev.structure ??
			(defaultLanguage === "typescript" ? "src-folder" : "flat");
		// ----------------------------------------------------
		// NON-INTERACTIVE MODE
		// ----------------------------------------------------
		if (!interactive) {
			return {
				language: defaultLanguage,
				structure: defaultStructure,
			};
		}

		console.log("defaultLanguage", defaultLanguage);
		// ----------------------------------------------------
		// INTERACTIVE MODE
		// ----------------------------------------------------
		const answers = await askAnswers(
			[
				{
					type: "select",
					name: "language",
					message: "💬 Language preference:",
					choices: languageChoices,
					initial: defaultLanguage,
				},
				{
					type: "select",
					name: "structure",
					message: "📁 Project structure:",
					choices: folderStructureChoices,
					initial: defaultStructure,
				},
			],
			accum,
			ctx,
		);

		return answers;
	},
};
