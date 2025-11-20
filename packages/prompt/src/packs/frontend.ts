import { PromptContext, PromptPack } from "@appinit/types";

import { askAnswers } from "../prompt";
import {
	getFormChoices,
	getRoutingChoices,
	getStoreChoices,
	getUIChoices,
} from "../static/framework.data";

export const frontendPack: PromptPack = {
	name: "frontend",
	priority: 35,

	/**
	 * Runs when the project requires a UI layer.
	 * For fullstack projects, this pack complements frameworkPack.
	 */
	condition: (_, accum) =>
		accum.projectType === "frontend" || accum.projectType === "fullstack",

	handler: async (ctx: PromptContext, accum) => {
		const flags = ctx.flags ?? {};
		const projectType = accum.projectType ?? flags.projectType;
		const nonInteractive = flags.nonInteractive;
		const framework = accum.framework ?? ctx.answers.framework;

		// -------------------------------------------------
		// If no frontend framework → skip UI stack
		// -------------------------------------------------
		if (!framework || framework === "none") {
			return {
				ui: "none",
				form: "none",
				store: "none",
				// fullstack will already have routing
				routing: accum.projectType === "frontend" ? "none" : accum.routing,
			};
		}

		// -------------------------------------------------
		// NON-INTERACTIVE MODE
		// -------------------------------------------------
		if (nonInteractive) {
			return {
				ui: flags.ui,
				form: flags.forms,
				store: flags.store,
				// fullstack might already have routing, so reuse
				routing: accum.routing ?? flags.routing,
			};
		}

		const storeChoices = getStoreChoices(framework);
		const uiChoices = getUIChoices(framework);
		const formChoices = getFormChoices(framework);
		const askRouting = projectType === "frontend";
		const routingChoices = askRouting ? getRoutingChoices(framework) : null;

		return await askAnswers(
			[
				{
					type: "select",
					name: "ui",
					message: "🎨 UI Component Library:",
					choices: uiChoices,
					initial: uiChoices[0].value,
				},
				{
					type: "select",
					name: "form",
					message: "✏️ Form Handling:",
					choices: formChoices,
					initial: formChoices[0].value,
				},
				{
					type: "select",
					name: "store",
					message: "🧠 State management:",
					choices: storeChoices,
					initial: storeChoices[0].value,
				},
				...(askRouting
					? [
							{
								type: "select",
								name: "routing",
								message: "🗺 Routing:",
								choices: routingChoices!,
								initial: routingChoices![0]?.value,
							} as const,
						]
					: []),
			],
			accum,
			ctx,
		);
	},
};
