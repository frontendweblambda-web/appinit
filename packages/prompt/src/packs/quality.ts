import type { ChoiceOption, PromptPack, PromptQuestion } from "@appinit/types";
import { askAnswers } from "../prompt";
import {
	editorChoices,
	formatterChoices,
	lintingToolChoices,
	testingToolChoices,
} from "../static/quality.data";

export const qualityPack: PromptPack = {
	name: "quality",
	priority: 60,

	// Only ask if code exists
	condition: (_, accum) => {
		const codeProjects = ["frontend", "backend", "fullstack", "library", "cli"];
		return codeProjects.includes(accum.projectType ?? "");
	},

	async handler(config, ctx, accum) {
		const prev = config.config ?? {};

		const interactive = config.interactive;

		// ---------------------------------------------------------
		// Smart defaults based on project type
		// ---------------------------------------------------------
		const determineDefaults = (type?: string) => {
			switch (type) {
				case "backend":
					return {
						testing: "vitest",
						linting: "biome",
						formatting: "prettier",
						editor: "vscode",
					};
				case "library":
					return {
						testing: "vitest",
						linting: "biome",
						formatting: "prettier",
						editor: "vscode",
					};
				case "cli":
					return {
						testing: "none",
						linting: "biome",
						formatting: "prettier",
						editor: "vscode",
					};
				default:
					return {
						testing: "vitest",
						linting: "eslint",
						formatting: "prettier",
						editor: "vscode",
					};
			}
		};

		const smartDefault = determineDefaults(ctx.projectType);

		const editorDefault = ctx.editor ?? prev.editor ?? smartDefault.editor;
		const testingDefault = ctx.testing ?? prev.testing ?? smartDefault.testing;
		const lintingDefault = ctx.linting ?? prev.linting ?? smartDefault.linting;
		const formattingDefault =
			ctx.formatting ?? prev.formatting ?? smartDefault.formatting;
		const commitDefault =
			ctx.commitConventions ?? prev.commitConventions ?? true;

		// ---------------------------------------------------------
		// NON-INTERACTIVE MODE
		// ---------------------------------------------------------
		if (!interactive) {
			return {
				editor: editorDefault,
				testing: testingDefault,
				linting: lintingDefault,
				formatting: formattingDefault,
				commitConventions: commitDefault,
			};
		}

		// ---------------------------------------------------------
		// UI with recommended tag
		// ---------------------------------------------------------
		const withRecommended = (choices: ChoiceOption[], recommended: string) =>
			choices.map((c) => ({
				...c,
				label:
					c.value === recommended ? `⭐ ${c.label} (Recommended)` : c.label,
			}));

		const questions: PromptQuestion[] = [
			{
				type: "select",
				name: "editor",
				message: "🧠 Preferred editor:",
				choices: withRecommended(editorChoices, editorDefault),
				initial: editorDefault,
			},
			{
				type: "select",
				name: "testing",
				message: "🧪 Testing framework:",
				choices: withRecommended(testingToolChoices, testingDefault),
				initial: testingDefault,
			},
			{
				type: "select",
				name: "linting",
				message: "🔍 Linting engine:",
				choices: withRecommended(lintingToolChoices, lintingDefault),
				initial: lintingDefault,
			},
			{
				type: "select",
				name: "formatting",
				message: "🎨 Code formatter:",
				choices: withRecommended(formatterChoices, formattingDefault),
				initial: formattingDefault,
			},
			{
				type: "confirm",
				name: "commitConventions",
				message: "🔁 Use Conventional Commits?",
				initial: commitDefault,
			},
		];

		const answers = await askAnswers(questions, accum, ctx);
		return answers;
	},
};
