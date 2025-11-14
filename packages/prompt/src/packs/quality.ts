import { askAnswers } from "../prompt";
import type { PromptPack, PromptContext, PromptQuestion } from "@appinit/types";

export const qualityPack: PromptPack = {
	name: "quality",
	priority: 70,

	handler: async (ctx: PromptContext, accum) => {
		const flags = ctx.flags ?? {};

		// ---------------------------------------------------------
		// NON-INTERACTIVE MODE
		// ---------------------------------------------------------
		if (flags["non-interactive"]) {
			return {
				editor: flags.editor ?? "vscode",
				testing: flags.testing ?? "vitest",
				linting: flags.linting ?? "eslint",
				formatting: flags.formatting ?? "prettier",
				commitConventions: flags.commitConventions ?? true,
			};
		}

		// ---------------------------------------------------------
		// INTERACTIVE MODE
		// ---------------------------------------------------------
		const questions: PromptQuestion[] = [
			{
				type: "select",
				name: "editor",
				message: "🧠 Preferred editor:",
				choices: [
					{ label: "VS Code", value: "vscode" },
					{ label: "Sublime", value: "sublime" },
					{ label: "WebStorm", value: "webstorm" },
					{ label: "Cursor", value: "cursor" },
					{ label: "None", value: "none" },
				],
				initial: flags.editor ?? accum.editor ?? "vscode",
			},
			{
				type: "select",
				name: "testing",
				message: "🧪 Testing framework:",
				choices: [
					{ label: "Vitest", value: "vitest" },
					{ label: "Jest", value: "jest" },
					{ label: "Playwright", value: "playwright" },
					{ label: "Cypress", value: "cypress" },
					{ label: "Storybook", value: "storybook" },
					{ label: "None", value: "none" },
				],
				initial: flags.testing ?? accum.testing ?? "vitest",
			},
			{
				type: "select",
				name: "linting",
				message: "🔍 Linting:",
				choices: [
					{ label: "ESLint", value: "eslint" },
					{ label: "Biome", value: "biome" },
					{ label: "None", value: "none" },
				],
				initial: flags.linting ?? accum.linting ?? "eslint",
			},
			{
				type: "select",
				name: "formatting",
				message: "🎨 Code formatter:",
				choices: [
					{ label: "Prettier", value: "prettier" },
					{ label: "Rome", value: "rome" },
					{ label: "None", value: "none" },
				],
				initial: flags.formatting ?? accum.formatting ?? "prettier",
			},
			{
				type: "confirm",
				name: "commitConventions",
				message: "🔁 Use Conventional Commits?",
				initial: flags.commitConventions ?? accum.commitConventions ?? true,
			},
		];

		// Run prompt engine
		const result = await askAnswers(questions, accum, ctx);

		return result;
	},
};
