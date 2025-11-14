import { askAnswers } from "../prompt";
import type { PromptPack, PromptContext } from "@appinit/types";

export const qualityPack: PromptPack = {
	name: "quality",

	handler: async (ctx: PromptContext, accum) => {
		if (ctx.flags["non-interactive"]) {
			return {
				editor: ctx.flags.editor ?? "vscode",
				testing: ctx.flags.testing ?? "vitest",
				linting: ctx.flags.linting ?? "eslint",
				formatting: ctx.flags.formatting ?? "prettier",
				commitConventions: ctx.flags.commitConventions ?? true,
			};
		}

		const res = await askAnswers(
			[
				{
					type: "select",
					name: "editor",
					message: "🧠 Preferred editor:",
					choices: [
						{ label: "vscode", value: "vscode" },
						{ label: "sublime", value: "sublime" },
						{ label: "atom", value: "atom" },
						{ label: "none", value: "none" },
					],
					initial: ctx.flags.editor ?? "vscode",
				},
				{
					type: "select",
					name: "testing",
					message: "🧪 Testing:",
					choices: [
						{ label: "vitest", value: "vitest" },
						{ label: "jest", value: "jest" },
						{ label: "playwright", value: "playwright" },
						{ label: "cypress", value: "cypress" },
						{ label: "none", value: "none" },
					],
					initial: ctx.flags.testing ?? "vitest",
				},
				{
					type: "select",
					name: "linting",
					message: "🔍 Linting:",
					choices: [
						{ label: "eslint", value: "eslint" },
						{ label: "none", value: "none" },
					],
					initial: ctx.flags.linting ?? "eslint",
				},
				{
					type: "select",
					name: "formatting",
					message: "🎨 Formatter:",
					choices: [
						{ label: "prettier", value: "prettier" },
						{ label: "none", value: "none" },
					],
					initial: ctx.flags.formatting ?? "prettier",
				},
				{
					type: "confirm",
					name: "commitConventions",
					message: "🔁 Use Conventional Commits?",
					initial: ctx.flags.commitConventions ?? true,
				},
			],
			accum,
		);

		return res;
	},
};
