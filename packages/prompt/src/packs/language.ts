import { askAnswers } from "../prompt";
import type {
	PromptContext,
	PromptPack,
	ChoiceOption,
	Answers,
} from "@appinit/types";
import { languageChoices } from "../static/language";
import { folderStructureChoices } from "../static/framework.data";

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

	handler: async (ctx: PromptContext, accum) => {
		const flags = ctx.flags ?? {};
		const prev = ctx.config ?? {};
		const nonInteractive = flags.nonInteractive === true;

		const defaultLanguage = flags.language ?? prev.language ?? "typescript";
		const defaultStructure =
			flags.structure ??
			prev.structure ??
			(defaultLanguage === "typescript" ? "src-folder" : "flat");
		// ----------------------------------------------------
		// NON-INTERACTIVE MODE
		// ----------------------------------------------------
		if (nonInteractive) {
			return {
				language: defaultLanguage,
				structure: defaultStructure,
			};
		}

		console.log("DEFAULT", defaultLanguage);
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
					initial: (answers: Answers, ctxState: PromptContext) => {
						const lang = answers?.language ?? defaultLanguage;
						return lang === "typescript" ? "src-folder" : "flat";
					},
				},
			],
			accum,
			ctx,
		);

		return answers;
	},
};
