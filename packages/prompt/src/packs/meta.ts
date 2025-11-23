import { shouldAskPackageScope } from "@appinit/core";
import type { PromptPack, PromptQuestion, PromptResult } from "@appinit/types";
import { formatName, normalizeScope, validateName } from "@appinit/utils";
import { askAnswers } from "../prompt";
import { licenseChoices } from "../static/license";

export const metaPack: PromptPack = {
	name: "meta",
	priority: 10,

	async handler(config, ctx, accum) {
		const flags = config.cliCommand?.flags ?? {};
		const prev = config.config ?? {};
		const api = config.runtime === "api";
		const interactive = config.interactive;

		// LOCAL UTILITY: get value in correct priority order
		const get = (flagKey: string, fallback: any, format?: (v: any) => any) => {
			let raw = flags[flagKey as keyof typeof flags] ?? fallback;
			return format ? format(raw) : raw;
		};

		if (!interactive || api) {
			const result: PromptResult = {
				projectName: get(
					"projectName",
					config.cliName ?? prev.projectName ?? accum.projectName ?? "my-app",
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

				projectType: get(
					"license",
					prev.license ?? accum.projectType ?? "MIT",
					(v) => String(v ?? "MIT"),
				),

				packageScope: normalizeScope(prev.packageScope ?? accum.packageScope),
			};

			return result;
		}

		const questions: PromptQuestion[] = [];

		// --------------------------
		// Project Name
		// --------------------------
		// Project Name
		if (!ctx.projectName) {
			questions.push({
				type: "text",
				name: "projectName",
				message: "🧱 Project name:",
				initial: (accum.projectName ??
					prev.projectName ??
					"my-appinit-app") as string,
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
			accum.projectName = (ctx.projectName ?? prev.projectName) as string;
		}

		// --------------------------
		// Description
		// --------------------------
		questions.push({
			type: "text",
			name: "description",
			message: "📝 Short description:",
			initial: accum.description! ?? prev.description ?? "",
			defaultValue: "",
		});

		// --------------------------
		// Author
		// --------------------------
		questions.push({
			type: "text",
			name: "author",
			message: "👤 Author (name/email):",
			initial: accum.author! ?? prev.author ?? "",
			defaultValue: "appinit",
		});

		// --------------------------
		// License
		// --------------------------
		questions.push({
			type: "select",
			name: "license",
			message: "📜 License:",
			choices: licenseChoices,
			initial: accum.licenseType ?? prev.license ?? "MIT",
		});

		// --------------------------
		// Package Scope
		// --------------------------

		if (shouldAskPackageScope(config, ctx, accum)) {
			questions.push({
				type: "text",
				name: "packageScope",
				message: "📦 Package scope (optional, without @):",
				initial: (prev.packageScope as string)?.replace?.(/^@/, "") ?? "",
				format: (v) => (v ? normalizeScope(v) : null),
			});
		}

		const res = await askAnswers(questions, accum, ctx);

		// Normalize scope
		if (res.packageScope) {
			res.packageScope = normalizeScope(res.packageScope);
		}

		return res;
	},
};
