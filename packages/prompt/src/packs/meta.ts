import type {
	PromptPack,
	PromptContext,
	PromptQuestion,
	ChoiceOption,
} from "@appinit/types";
import { validateName } from "@appinit/utils";
import { askAnswers } from "../prompt";

export const metaPack: PromptPack = {
	name: "meta",
	priority: 20,

	async handler(ctx: PromptContext, accum) {
		const flags = ctx.flags ?? {};
		const prev = ctx.config ?? {};
		const ai = ctx.hooks;

		// ----------------------------------------------------
		// 0. BEFORE HOOK
		// ----------------------------------------------------
		if (ai?.beforePrompt) {
			await ai.beforePrompt(ctx, accum);
		}

		// ----------------------------------------------------
		// 1. NON-INTERACTIVE MODE
		// ----------------------------------------------------
		if (flags["non-interactive"] || ctx.runtime === "api") {
			return {
				projectName:
					flags.projectName ??
					ctx.cliName ??
					prev.projectName ??
					accum.projectName ??
					"my-app",

				description:
					flags.description ?? prev.description ?? accum.description ?? "",

				author: flags.author ?? prev.author ?? accum.author ?? "",

				license: flags.license ?? prev.license ?? accum.license ?? "MIT",

				packageScope: flags.packageScope
					? `@${flags.packageScope.replace(/^@/, "")}`
					: (prev.packageScope ?? accum.packageScope ?? null),
			};
		}

		// ----------------------------------------------------
		// 2. INTERACTIVE MODE
		// ----------------------------------------------------
		const questions: PromptQuestion[] = [];

		// --------------------------
		// Project Name
		// --------------------------
		if (!flags.projectName && !ctx.cliName) {
			questions.push({
				type: "text",
				name: "projectName",
				message: "🧱 Project name:",
				initial:
					accum.projectName ?? prev.projectName ?? ctx.cliName ?? "my-app",
				validate: validateName,
			});
		} else {
			accum.projectName =
				flags.projectName ??
				ctx.cliName ??
				prev.projectName ??
				accum.projectName;
		}

		// --------------------------
		// Description
		// --------------------------
		questions.push({
			type: "text",
			name: "description",
			message: "📝 Short description:",
			initial: flags.description ?? accum.description ?? prev.description ?? "",
		});

		// --------------------------
		// Author
		// --------------------------
		questions.push({
			type: "text",
			name: "author",
			message: "👤 Author (name/email):",
			initial: flags.author ?? accum.author ?? prev.author ?? "",
		});

		// --------------------------
		// License
		// --------------------------
		questions.push({
			type: "select",
			name: "license",
			message: "📜 License:",
			choices: [
				{ label: "MIT", value: "MIT" },
				{ label: "Apache-2.0", value: "Apache-2.0" },
				{ label: "GPL-3.0", value: "GPL-3.0" },
				{ label: "Unlicense", value: "Unlicense" },
				{ label: "Other", value: "Other" },
			] as ChoiceOption[],
			initial: flags.license ?? accum.license ?? prev.license ?? "MIT",
		});

		// --------------------------
		// Package Scope
		// --------------------------
		questions.push({
			type: "text",
			name: "packageScope",
			message: "📦 Package scope (optional, without @):",
			initial: flags.packageScope ?? prev.packageScope?.replace(/^@/, "") ?? "",
			format: (v: string) => (v ? `@${v.replace(/^@/, "")}` : null),
		});

		// --------------------------
		// Ask questions
		// --------------------------
		const res = await askAnswers(questions, accum, ctx);

		// ----------------------------------------------------
		// 3. AFTER HOOK
		// ----------------------------------------------------
		if (ai?.afterPrompt) {
			await ai.afterPrompt(ctx, res);
		}

		return res;
	},
};
