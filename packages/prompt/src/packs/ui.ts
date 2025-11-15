import { UI_BY_FRAMEWORK } from "@appinit/utils";
import { askAnswers } from "../prompt";
import type {
	PromptPack,
	PromptContext,
	PromptQuestion,
	ChoiceOption,
	Framework,
} from "@appinit/types";

export const uiPack: PromptPack = {
	name: "ui",
	priority: 30, // runs after frameworkPack

	async handler(ctx: PromptContext, accum) {
		const flags = ctx.flags ?? {};
		const prev = ctx.config ?? {};

		// Determine project type and framework
		const projectType = accum.type ?? flags.type;
		const framework = accum.framework ?? flags.framework;

		// If there is no UI in libraries OR no frontend
		if (
			projectType === "backend" ||
			projectType === "cli" ||
			projectType === "library"
		) {
			return {}; // No UI questions apply here
		}

		// ---------------------------------------------------------
		// NON-INTERACTIVE MODE
		// ---------------------------------------------------------
		if (flags["non-interactive"]) {
			return {
				ui:
					flags.ui ??
					prev.ui ??
					accum.ui ??
					UI_BY_FRAMEWORK[framework as Framework]?.[0] ??
					"none",
			};
		}

		// ---------------------------------------------------------
		// UI options based on framework
		// ---------------------------------------------------------
		const allowedUI = UI_BY_FRAMEWORK[framework as Framework] ?? ["none"];

		const uiChoices: ChoiceOption[] = allowedUI.map((uiName) => ({
			label: uiName,
			value: uiName,
		}));

		// ---------------------------------------------------------
		// INTERACTIVE MODE
		// ---------------------------------------------------------
		const questions: PromptQuestion[] = [
			{
				type: "select",
				name: "ui",
				message: "🎨 Choose UI library:",
				choices: uiChoices,
				initial:
					flags.ui ?? accum.ui ?? prev.ui ?? uiChoices[0]?.value ?? "none",
			},
		];

		const res = await askAnswers(questions, accum, ctx);
		return res;
	},
};
