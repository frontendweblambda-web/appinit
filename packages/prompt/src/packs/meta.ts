import { askAnswers } from "../prompt";
import type { PromptPack, PromptContext } from "@appinit/types";
import { validateName } from "@appinit/utils";

export const metaPack: PromptPack = {
	name: "meta",
	priority: 20,

	async handler(ctx: PromptContext, accum) {
		// ------------------------------------------
		// 1. Non-interactive mode
		// ------------------------------------------
		if (ctx.flags["non-interactive"]) {
			return {
				projectName:
					ctx.flags.projectName ??
					ctx.defaultName ??
					accum.projectName ??
					"my-app",

				description: ctx.flags.description ?? "",
				author: ctx.flags.author ?? "",
				license: ctx.flags.license ?? "MIT",
				packageScope: ctx.flags.packageScope
					? `@${ctx.flags.packageScope}`
					: null,
			};
		}

		// ------------------------------------------
		// 2. Interactive mode
		// ------------------------------------------
		const questions = [];

		// Project name
		if (!ctx.flags.projectName && !ctx.defaultName) {
			questions.push({
				type: "text",
				name: "projectName",
				message: "🧱 Project name:",
				initial: accum.projectName ?? "my-app",
				validate: validateName,
			});
		} else {
			accum.projectName =
				ctx.flags.projectName ?? ctx.defaultName ?? accum.projectName;
		}

		// Description
		questions.push({
			type: "text",
			name: "description",
			message: "📝 Short description:",
			initial: ctx.flags.description ?? accum.description ?? "",
		});

		// Author
		questions.push({
			type: "text",
			name: "author",
			message: "👤 Author (name/email):",
			initial: ctx.flags.author ?? accum.author ?? "",
		});

		// License
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
			initial: ctx.flags.license ?? accum.license ?? "MIT",
		});

		// Package scope
		questions.push({
			type: "text",
			name: "packageScope",
			message: "📦 Package scope (optional, without @):",
			initial: ctx.flags.packageScope ?? "",
			format: (v: string) => (v ? `@${v}` : null),
		});

		const res = await askAnswers(questions, accum);
		return res;
	},
};
