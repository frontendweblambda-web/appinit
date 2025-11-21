import { ChoiceOption, PromptPack, PromptResult } from "@appinit/types";
import { askAnswers } from "../prompt";

export const backendPack: PromptPack = {
	name: "backend",
	priority: 40,

	// Only runs when backend functionality is required
	condition: (_, accum) => {
		if (["next", "framer", "nuxt"].includes(accum.frontendFramework!))
			return false;
		return ["backend", "fullstack"].includes(accum.projectType ?? "");
	},

	handler: async (config, ctx, accum) => {
		const interactive = config.interactive;

		const defaults = {
			backendFramework: "express",
			apiStyle: "rest",
			backendMode: "none",
		};

		// ===================================================================================
		// NON-INTERACTIVE MODE: return flags (no questions)
		// ===================================================================================
		if (!interactive) {
			return {
				backendFramework: defaults.backendFramework,
				apiStyle: defaults.apiStyle,
				backendMode: defaults.backendMode,
			} as PromptResult;
		}

		// ===================================================================================
		// 1️⃣ BACKEND FRAMEWORK + API STYLE
		// ===================================================================================
		const base = await askAnswers(
			[
				{
					type: "select",
					name: "backend",
					message: "🧱 Backend Framework:",
					choices: [
						{
							label: "Express",
							value: "express",
							hint: "**Most popular Node backend.** Simple routing, middleware based, huge ecosystem.",
						},
						{
							label: "Koa",
							value: "koa",
							hint: "A **minimalist framework** designed by the Express team. Smaller footprint, uses `async/await` for cleaner middleware flow and better error handling.",
						},
						{
							label: "Fastify",
							value: "fastify",
							hint: "**High-performance & plugin-based.** Best for APIs requiring throughput.",
						},
						{
							label: "NestJS",
							value: "nest",
							hint: "**Enterprise-grade architecture.** Built-in DI, modules, and scalable structure.",
						},
						{
							label: "AdonisJS",
							value: "adonis",
							hint: "A **full-featured, opinionated MVC framework** inspired by Laravel/Rails. Comes with its own ORM, CLI, and authentication built-in.",
						},
						{
							label: "Hono (Edge-optimized)",
							value: "hono",
							hint: "**Tiny + ultra fast for edge runtimes.** Perfect for Cloudflare, Deno, Bun.",
						},
						{
							label: "Elysia (Bun)",
							value: "elysia",
							hint: "**Deep Bun integration.** Modern type-safe router + middleware.",
						},
						{
							label: "None",
							value: "none",
							hint: "Choose this if you intend to use a different framework or build your server from scratch.",
						},
					] satisfies ChoiceOption[],
					initialValue:
						accum.backendFramework ?? defaults.backendFramework ?? "express",
				},
				{
					type: "select",
					name: "apiStyle",
					message: "🔌 API Style:",
					choices: [
						{
							label: "REST",
							value: "rest",
							hint: "**Standard + universal.** Works everywhere and easy to scale gradually.",
						},
						{
							label: "tRPC",
							value: "trpc",
							hint: "**Full end-to-end types.** Great with React/Next fullstack workflows.",
						},
						{
							label: "GraphQL",
							value: "graphql",
							hint: "**Flexible querying.** Best for complex relational or mobile apps.",
						},
					] satisfies ChoiceOption[],
					initialValue: accum.apiStyle ?? "rest",
				},
				{
					type: "select",
					name: "backendMode",
					message: "⚙️ Backend Architecture Mode:",
					choices: [
						{
							label: "Monolith",
							value: "monolith",
							hint: "**Single, unified unit.** All components (UI, logic, data) are in one codebase and deployed together. **Simple to develop initially**.",
						},
						{
							label: "Modular",
							value: "modular",
							hint: "A Monolith where code is **logically separated** into independent modules (features/domains) within the *same* codebase. Easier to maintain than a traditional Monolith.",
						},
						{
							label: "Microservices",
							value: "microservices",
							hint: "**Independent, specialized services.** Each feature runs as its own separate application with its own database, communicating via APIs. **Highly scalable and fault-tolerant**.",
						},
						{
							label: "None",
							value: "none",
							hint: "No default architecture",
						},
					] satisfies ChoiceOption[],
					initialValue: accum.backendMode ?? defaults.backendMode,
				},
			] as const,
			accum,
			ctx,
		);

		// ===================================================================================
		// RETURN FINAL MERGED RESULT
		// ===================================================================================
		return base;
	},
};
