import { askAnswers } from "../prompt";
import type { PromptPack, PromptContext, PromptQuestion } from "@appinit/types";
import {
	FRAMEWORK_CHOICES,
	getRoutingChoices,
	getStoreChoices,
} from "../static/framework.data";

export const frameworkPack: PromptPack = {
	name: "framework",
	priority: 20,

	handler: async (ctx: PromptContext, accum) => {
		const flags = ctx.flags ?? {};
		const projectType = accum.projectType ?? flags.projectType;
		const nonInteractive = flags.nonInteractive;

		// -----------------------------------------
		// NON-INTERACTIVE MODE
		// -----------------------------------------
		if (nonInteractive) {
			return {
				framework: flags.framework,
				routing: flags.routing,
				store: flags.store,
			};
		}

		// =================================================================
		// 1️⃣ FRONTEND PROJECTS
		// =================================================================
		if (projectType === "frontend") {
			const base = await askAnswers(
				[
					{
						type: "select",
						name: "framework",
						message: "⚙️ Frontend Framework:",
						choices: FRAMEWORK_CHOICES,
						initial: accum.framework ?? "react",
					},
				],
				accum,
				ctx,
			);

			const routingChoices = getRoutingChoices(base.framework);
			const storeChoices = getStoreChoices(base.framework);

			const rest = await askAnswers(
				[
					{
						type: "select",
						name: "routing",
						message: "🗺 Routing:",
						choices: routingChoices,
						initial: routingChoices[0].value,
					},
					{
						type: "select",
						name: "store",
						message: "🧠 State management:",
						choices: storeChoices,
						initial: storeChoices[0].value,
					},
				],
				{ ...accum, ...base },
				ctx,
			);

			return { ...base, ...rest };
		}

		// =================================================================
		// 2️⃣ BACKEND PROJECTS — no frontend framework
		// =================================================================
		if (projectType === "backend") {
			return {};
		}

		// =================================================================
		// 3️⃣ FULLSTACK PROJECTS
		// =================================================================
		if (projectType === "fullstack") {
			const base = await askAnswers(
				[
					{
						type: "select",
						name: "framework",
						message: "⚙️ Fullstack Framework:",
						choices: [
							{ label: "Next.js", value: "next" },
							{ label: "Remix", value: "react-router" },
							{ label: "SvelteKit", value: "svelte" },
							{ label: "Nuxt (Vue)", value: "vue" },
						],
						initial: accum.framework ?? "next",
					},
				],
				accum,
				ctx,
			);

			const routingChoices = getRoutingChoices(base.framework);
			const storeChoices = getStoreChoices(base.framework);

			const rest = await askAnswers(
				[
					{
						type: "select",
						name: "routing",
						message: "🗺 Routing:",
						choices: routingChoices,
						initial: routingChoices[0].value,
					},
					{
						type: "select",
						name: "store",
						message: "🧠 State management:",
						choices: storeChoices,
						initial: storeChoices[0].value,
					},
				],
				{ ...accum, ...base },
				ctx,
			);

			return { ...base, ...rest };
		}

		return {};
	},
};
