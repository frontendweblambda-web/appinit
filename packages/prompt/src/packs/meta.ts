import { ask } from "../prompt.js";
import type { PromptPack } from "@appinit/types";
import { validateName } from "@appinit/utils";

export const metaPack: PromptPack = async (ctx, accum) => {
	const questions: any[] = [];

	if (!ctx.defaultName && !ctx.flags.projectName) {
		questions.push({
			type: "text",
			name: "projectName",
			message: "🧱 Project name:",
			initial: ctx.flags.projectName || "my-app",
			validate: validateName,
		});
	} else {
		// ensure value present
		accum.projectName =
			ctx.flags.projectName ?? ctx.defaultName ?? accum.projectName;
	}

	questions.push({
		type: "text",
		name: "description",
		message: "📝 Short description:",
		initial: ctx.flags.description || "",
	});
	questions.push({
		type: "text",
		name: "author",
		message: "👤 Author (name/email):",
		initial: ctx.flags.author || "",
	});
	questions.push({
		type: "select",
		name: "license",
		message: "📜 License:",
		choices: [
			{ title: "MIT", value: "MIT" },
			{ title: "Apache-2.0", value: "Apache-2.0" },
			{ title: "GPL-3.0", value: "GPL-3.0" },
			{ title: "Unlicense", value: "Unlicense" },
			{ title: "Other", value: "Other" },
		],
		initial: ctx.flags.license || "MIT",
	});
	questions.push({
		type: "text",
		name: "packageScope",
		message: "📦 Package scope (optional, without @):",
		initial: ctx.flags.packageScope || "",
		format: (v: string) => (v ? `@${v}` : null),
	});

	if (questions.length === 0) return {};
	const res = await ask(questions);
	return res as any;
};
