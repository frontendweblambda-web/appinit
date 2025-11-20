import { shouldAskPackageScope } from "@appinit/core";
import type {
	PromptContext,
	PromptPack,
	PromptQuestion,
	PromptResult,
} from "@appinit/types";
import { formatName, normalizeScope, validateName } from "@appinit/utils";
import { askAnswers } from "../prompt";
import { licenseChoices } from "../static/license";

export const metaPack: PromptPack = {
	name: "meta",
	priority: 10,

	async handler(ctx: PromptContext, accum) {
		const flags = ctx.flags ?? {};
		const prev = ctx.config ?? {};
		const nonInteractive = ctx.flags.nonInteractive;
		const api = ctx.runtime === "api";
		const interactive = ctx.interactive;

		// LOCAL UTILITY: get value in correct priority order
		const get = (flagKey: string, fallback: any, format?: (v: any) => any) => {
			let raw = flags[flagKey as keyof typeof flags] ?? fallback;
			return format ? format(raw) : raw;
		};

		if (nonInteractive || api || interactive === false) {
			const result: PromptResult = {
				projectName: get(
					"projectName",
					ctx.cliName ?? prev.projectName ?? accum.projectName ?? "my-app",
					(v) => String(v),
				),

				description: get(
					"description",
					prev.description ?? accum.description ?? "",
					(v) => String(v ?? ""),
				),

				author: get("author", prev.author ?? accum.author ?? "", (v) =>
					String(v ?? ""),
				),

				license: get("license", prev.license ?? accum.license ?? "MIT", (v) =>
					String(v ?? "MIT"),
				),

				packageScope: normalizeScope(
					flags.packageScope ?? prev.packageScope ?? accum.packageScope,
				),
			};

			return result;
		}

		const questions: PromptQuestion[] = [];

		// --------------------------
		// Project Name
		// --------------------------
		// Project Name
		if (!flags.projectName && !ctx.answers?.projectName) {
			questions.push({
				type: "text",
				name: "projectName",
				message: "🧱 Project name:",
				initial: (accum.projectName ??
					prev.projectName ??
					ctx.cliName ??
					"my-app") as string,
				format: (v) => {
					if (!v) return null;
					return formatName(v);
				},
				validate: (v) => {
					const formatted = formatName(v || "");

					// Auto accept sanitized value without blocking
					if (v !== formatted) return true;

					// Validate sanitized version
					return validateName(formatted);
				},
			});
		} else {
			accum.projectName = (ctx.answers.projectName ??
				flags.projectName ??
				prev.projectName) as string;
		}

		// --------------------------
		// Description
		// --------------------------
		questions.push({
			type: "text",
			name: "description",
			message: "📝 Short description:",
			initial:
				flags.description ?? accum.description! ?? prev.description ?? "",
		});

		// --------------------------
		// Author
		// --------------------------
		questions.push({
			type: "text",
			name: "author",
			message: "👤 Author (name/email):",
			initial: flags.author ?? accum.author! ?? prev.author ?? "",
		});

		// --------------------------
		// License
		// --------------------------
		questions.push({
			type: "select",
			name: "license",
			message: "📜 License:",
			choices: licenseChoices,
			initial: flags.license ?? accum.license ?? prev.license ?? "MIT",
		});

		// --------------------------
		// Package Scope
		// --------------------------
		if (shouldAskPackageScope(ctx, accum)) {
			questions.push({
				type: "text",
				name: "packageScope",
				message: "📦 Package scope (optional, without @):",
				initial:
					(flags.packageScope as string)?.replace(/^@/, "") ??
					(prev.packageScope as string)?.replace?.(/^@/, "") ??
					"",
				format: (v) => (v ? normalizeScope(v) : null),
			});
		}

		const res = await askAnswers(questions, accum, ctx);

		// Normalize scope
		if (res.packageScope) {
			res.packageScope = normalizeScope(res.packageScope);
		}

		console.log("META: RESPONSE: ", res);
		return res;
	},
};
