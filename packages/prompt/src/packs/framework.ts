import { askAnswers } from "../prompt";
import type { PromptPack, PromptContext } from "@appinit/types";

export const frameworkPack: PromptPack = {
	name: "framework",

	handler: async (ctx: PromptContext, accum) => {
		// ---------------------------------------------------
		// 1. Non-interactive mode
		// ---------------------------------------------------
		if (ctx.flags["non-interactive"]) {
			return {
				framework: ctx.flags.framework ?? "react",
				ui: ctx.flags.ui ?? "tailwind",
				routing: ctx.flags.routing ?? "react-router",
				store: ctx.flags.store ?? "zustand",
			};
		}

		// ---------------------------------------------------
		// 2. Interactive mode
		// Correct `initial` indexes
		// ---------------------------------------------------

		const frameworkOrder = [
			"react",
			"next",
			"vue",
			"svelte",
			"framer",
			"react-router",
		] as const;

		const uiOrder = ["tailwind", "mui", "shadcn", "antd", "none"] as const;

		const res = await askAnswers(
			[
				{
					type: "select",
					name: "framework",
					message: "⚙️ Choose framework:",
					choices: [
						{ title: "React (Vite)", value: "react" },
						{ title: "Next.js (App Router)", value: "next" },
						{ title: "Vue (Vite)", value: "vue" },
						{ title: "Svelte", value: "svelte" },
						{ title: "Framer", value: "framer" },
						{ title: "React Router (SPA)", value: "react-router" },
					],
					initial:
						frameworkOrder.indexOf(ctx.flags.framework) >= 0
							? frameworkOrder.indexOf(ctx.flags.framework)
							: 0,
				},

				{
					type: "select",
					name: "ui",
					message: "🎨 UI library:",
					choices: uiOrder.map((v) => ({ title: v, value: v })),
					initial:
						uiOrder.indexOf(ctx.flags.ui) >= 0
							? uiOrder.indexOf(ctx.flags.ui)
							: 0,
				},

				{
					type: "select",
					name: "routing",
					message: "🗺 Routing:",
					choices: (prev) => {
						switch (prev.framework) {
							case "next":
								return [
									{ title: "App Router (recommended)", value: "app" },
									{ title: "Pages Router", value: "pages" },
								];

							case "vue":
								return [{ title: "Vue Router", value: "vue-router" }];

							default:
								return [{ title: "React Router", value: "react-router" }];
						}
					},
				},

				{
					type: "select",
					name: "store",
					message: "🧠 State management:",
					choices: [
						{ title: "zustand", value: "zustand" },
						{ title: "redux", value: "redux" },
						{ title: "pinia", value: "pinia" },
						{ title: "none", value: "none" },
					],
					initial:
						ctx.flags.store === "redux"
							? 1
							: ctx.flags.store === "pinia"
								? 2
								: ctx.flags.store === "none"
									? 3
									: 0,
				},
			],
			accum,
		);

		return res;
	},
};
