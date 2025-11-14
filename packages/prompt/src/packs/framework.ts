import { askAnswers } from "../prompt";
import type { PromptPack, PromptContext } from "@appinit/types";

export const frameworkPack: PromptPack = {
	name: "framework",

	handler: async (ctx: PromptContext, accum) => {
		if (ctx.flags["non-interactive"]) {
			return {
				framework: ctx.flags.framework ?? "react",
				ui: ctx.flags.ui ?? "tailwind",
				routing: ctx.flags.routing ?? "react-router",
				store: ctx.flags.store ?? "zustand",
			};
		}

		const frameworkInitial = ctx.flags.framework ?? accum.framework ?? "react";
		const uiInitial = ctx.flags.ui ?? accum.ui ?? "tailwind";

		// 1️⃣ Ask framework + UI first
		const base = await askAnswers(
			[
				{
					type: "select",
					name: "framework",
					message: "⚙️ Choose framework:",
					choices: [
						{ label: "React (Vite)", value: "react" },
						{ label: "Next.js (App Router)", value: "next" },
						{ label: "Vue (Vite)", value: "vue" },
						{ label: "Svelte", value: "svelte" },
						{ label: "Framer", value: "framer" },
						{ label: "React Router (SPA)", value: "react-router" },
					],
					initial: frameworkInitial,
				},
				{
					type: "select",
					name: "ui",
					message: "🎨 UI library:",
					choices: [
						{ label: "tailwind", value: "tailwind" },
						{ label: "mui", value: "mui" },
						{ label: "shadcn", value: "shadcn" },
						{ label: "antd", value: "antd" },
						{ label: "none", value: "none" },
					],
					initial: uiInitial,
				},
			],
			accum,
		);

		let routingChoices;

		switch (base.framework) {
			case "next":
				routingChoices = [
					{ label: "App Router", value: "app" },
					{ label: "Pages Router", value: "pages" },
				];
				break;
			case "vue":
				routingChoices = [{ label: "Vue Router", value: "vue-router" }];
				break;
			default:
				routingChoices = [{ label: "React Router", value: "react-router" }];
		}

		const rest = await askAnswers(
			[
				{
					type: "select",
					name: "routing",
					message: "🗺 Routing:",
					choices: routingChoices,
					initial:
						ctx.flags.routing ?? accum.routing ?? routingChoices[0].value,
				},
				{
					type: "select",
					name: "store",
					message: "🧠 State management:",
					choices: [
						{ label: "zustand", value: "zustand" },
						{ label: "redux", value: "redux" },
						{ label: "pinia", value: "pinia" },
						{ label: "none", value: "none" },
					],
					initial: ctx.flags.store ?? accum.store ?? "zustand",
				},
			],
			{ ...accum, ...base },
		);

		return { ...base, ...rest };
	},
};
