import { askAnswers } from "../prompt";
import type { PromptPack, PromptContext } from "@appinit/types";
import { validateName } from "@appinit/utils";

export const metaPack: PromptPack = {
	name: "meta",
	priority: 20,

	async handler(ctx: PromptContext, accum) {
		const flags = ctx.flags || {};
		const prev = ctx.config || {};
		const ai = ctx.hooks;

		// ----------------------------------------------------
		// 0. BEFORE HOOK (AI can prefill)
		// ----------------------------------------------------
		if (ai?.beforePrompt) {
			await ai.beforePrompt(ctx, accum);
		}

		// ----------------------------------------------------
		// 1. Non-interactive mode (CI / API / script)
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
					? `@${flags.packageScope}`
					: (prev.packageScope ?? accum.packageScope ?? null),
			};
		}

		// ----------------------------------------------------
		// 2. Interactive mode
		// ----------------------------------------------------
		const questions = [];

		// --------------------------
		// Project Name
		// --------------------------
		if (!flags.projectName && !ctx.cliName) {
			questions.push({
				type: "text",
				name: "projectName",
				message: "🧱 Project name:",
				initial:
					accum.projectName ??
					ctx.cliName ??
					prev.projectName ??
					ctx.cliName ??
					"my-app",
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
			],
			initial: flags.license ?? accum.license ?? prev.license ?? "MIT",
		});

		// --------------------------
		// Package Scope
		// --------------------------
		questions.push({
			type: "text",
			name: "packageScope",
			message: "📦 Package scope (optional, without @):",
			initial:
				flags.packageScope ??
				(prev.packageScope ? prev.packageScope.replace("@", "") : "") ??
				"",
			format: (v: string) => (v ? `@${v}` : null),
		});

		// --------------------------
		// Ask questions
		// --------------------------
		const res = await askAnswers(questions, accum);

		// ----------------------------------------------------
		// 3. AFTER HOOK (AI can validate or adjust)
		// ----------------------------------------------------
		if (ai?.afterPrompt) {
			await ai.afterPrompt(ctx, res);
		}

		return res;
	},
};
