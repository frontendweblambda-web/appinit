import { askAnswers } from "../prompt";
import type { PromptPack, PromptContext, PromptQuestion } from "@appinit/types";

export const frameworkPack: PromptPack = {
	name: "framework",
	priority: 20,

	handler: async (ctx: PromptContext, accum) => {
		const flags = ctx.flags ?? {};
		const projectType = accum.type ?? flags.type;

		// -----------------------------------------
		// NON-INTERACTIVE MODE
		// -----------------------------------------
		if (flags["non-interactive"]) {
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
						choices: [
							{ label: "React (Vite)", value: "react" },
							{ label: "Next.js (App Router)", value: "next" },
							{ label: "Vue (Vite)", value: "vue" },
							{ label: "Svelte", value: "svelte" },
							{ label: "SolidJS", value: "solid" },
							{ label: "Qwik", value: "qwik" },
							{ label: "Astro", value: "astro" },
						],
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

// ===============================================
// Helpers
// ===============================================
function getRoutingChoices(framework: string) {
	switch (framework) {
		case "next":
			return [
				{ label: "App Router", value: "app" },
				{ label: "Pages Router", value: "pages" },
			];
		case "vue":
			return [{ label: "Vue Router", value: "vue-router" }];
		case "react-router":
			return [{ label: "React Router", value: "react-router" }];
		default:
			return [{ label: "File-System Router", value: "file-system" }];
	}
}

function getStoreChoices(framework: string) {
	switch (framework) {
		case "vue":
			return [
				{ label: "Pinia", value: "pinia" },
				{ label: "None", value: "none" },
			];
		case "react":
		case "next":
			return [
				{ label: "Zustand", value: "zustand" },
				{ label: "Redux", value: "redux" },
				{ label: "Jotai", value: "jotai" },
				{ label: "None", value: "none" },
			];
		default:
			return [{ label: "None", value: "none" }];
	}
}
