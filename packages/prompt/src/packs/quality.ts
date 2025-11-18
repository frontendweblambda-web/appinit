import { askAnswers } from "../prompt";
import type {
	PromptPack,
	PromptContext,
	PromptQuestion,
	ChoiceOption,
} from "@appinit/types";
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

	async handler(ctx: PromptContext, accum) {
		const flags = ctx.flags ?? {};
		const prev = ctx.config ?? {};

		const nonInteractive = flags.nonInteractive === true;

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

		const smartDefault = determineDefaults(accum.projectType);

		const editorDefault =
			flags.editor ?? accum.editor ?? prev.editor ?? smartDefault.editor;
		const testingDefault =
			flags.testing ?? accum.testing ?? prev.testing ?? smartDefault.testing;
		const lintingDefault =
			flags.linting ?? accum.linting ?? prev.linting ?? smartDefault.linting;
		const formattingDefault =
			flags.formatting ??
			accum.formatting ??
			prev.formatting ??
			smartDefault.formatting;
		const commitDefault =
			flags.commitConventions ??
			accum.commitConventions ??
			prev.commitConventions ??
			true;

		// ---------------------------------------------------------
		// NON-INTERACTIVE MODE
		// ---------------------------------------------------------
		if (nonInteractive) {
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
