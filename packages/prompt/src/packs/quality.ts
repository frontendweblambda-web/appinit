import { askAnswers } from "../prompt";
import type { PromptPack, PromptContext } from "@appinit/types";

export const qualityPack: PromptPack = {
	name: "quality",

	handler: async (ctx: PromptContext, accum) => {
		// ---------------------------------------------------
		// 1. Non-interactive mode
		// ---------------------------------------------------
		if (ctx.flags["non-interactive"]) {
			return {
				editor: ctx.flags.editor ?? "vscode",
				testing: ctx.flags.testing ?? "vitest",
				linting: ctx.flags.linting ?? "eslint",
				formatting: ctx.flags.formatting ?? "prettier",
				commitConventions: ctx.flags.commitConventions ?? true,
			};
		}

		// ---- index helpers for prompts ----
		const editorOrder = ["vscode", "sublime", "atom", "none"] as const;
		const testingOrder = [
			"vitest",
			"jest",
			"playwright",
			"cypress",
			"none",
		] as const;
		const lintOrder = ["eslint", "none"] as const;
		const formatOrder = ["prettier", "none"] as const;

		const idx = (
			list: readonly string[],
			value: string | undefined,
			fallback = 0,
		) =>
			list.indexOf(value as any) >= 0 ? list.indexOf(value as any) : fallback;

		// ---------------------------------------------------
		// 2. Interactive mode
		// ---------------------------------------------------
		const res = await askAnswers(
			[
				{
					type: "select",
					name: "editor",
					message: "🧠 Preferred editor:",
					choices: editorOrder.map((v) => ({ title: v, value: v })),
					initial: idx(editorOrder, ctx.flags.editor, 0),
				},

				{
					type: "select",
					name: "testing",
					message: "🧪 Testing framework:",
					choices: testingOrder.map((v) => ({ title: v, value: v })),
					initial: idx(testingOrder, ctx.flags.testing, 0),
				},

				{
					type: "select",
					name: "linting",
					message: "🔍 Linting:",
					choices: lintOrder.map((v) => ({ title: v, value: v })),
					initial: idx(lintOrder, ctx.flags.linting, 0),
				},

				{
					type: "select",
					name: "formatting",
					message: "🎨 Formatter:",
					choices: formatOrder.map((v) => ({ title: v, value: v })),
					initial: idx(formatOrder, ctx.flags.formatting, 0),
				},

				{
					type: "toggle",
					name: "commitConventions",
					message: "🔁 Use Conventional Commits?",
					initial: ctx.flags.commitConventions ?? true,
					active: "yes",
					inactive: "no",
				},
			],
			accum,
		);

		return res;
	},
};
