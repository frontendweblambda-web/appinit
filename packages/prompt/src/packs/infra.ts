import { askAnswers } from "../prompt";
import type { PromptPack, PromptContext } from "@appinit/types";

export const infraPack: PromptPack = {
	name: "infrastructure",

	handler: async (ctx: PromptContext, accum) => {
		// ---------------------------------------------------
		// 1. Non-interactive mode
		// ---------------------------------------------------
		if (ctx.flags["non-interactive"]) {
			return {
				auth: ctx.flags.auth ?? false,
				authProvider: ctx.flags.authProvider ?? "nextauth",
				database: ctx.flags.database ?? "none",
				orm: ctx.flags.orm ?? "none",
				caching: ctx.flags.caching ?? "none",
				analytics: ctx.flags.analytics ?? false,
				monitoring: ctx.flags.monitoring ?? false,
			};
		}

		// index helpers
		const dbOrder = [
			"none",
			"postgresql",
			"supabase",
			"mongo",
			"sqlite",
		] as const;
		const cacheOrder = ["none", "api-cache", "edge", "redis"] as const;

		const dbIdx =
			dbOrder.indexOf(ctx.flags.database) >= 0
				? dbOrder.indexOf(ctx.flags.database)
				: 0;

		const cacheIdx =
			cacheOrder.indexOf(ctx.flags.caching) >= 0
				? cacheOrder.indexOf(ctx.flags.caching)
				: 0;

		// ---------------------------------------------------
		// 2. Interactive mode
		// ---------------------------------------------------
		const res = await askAnswers(
			[
				{
					type: "toggle",
					name: "auth",
					message: "🔐 Add authentication?",
					initial: ctx.flags.auth ?? false,
					active: "yes",
					inactive: "no",
				},
				{
					type: (prev) => (prev.auth ? "select" : null),
					name: "authProvider",
					message: "🔑 Auth Provider:",
					choices: [
						{ title: "custom", value: "custom" },
						{ title: "nextauth", value: "nextauth" },
						{ title: "clerk", value: "clerk" },
						{ title: "supabase", value: "supabase" },
						{ title: "none", value: "none" },
					],
					initial: 1, // nextauth default
				},

				{
					type: "select",
					name: "database",
					message: "🗄 Database:",
					choices: dbOrder.map((v) => ({ title: v, value: v })),
					initial: dbIdx,
				},

				{
					type: (prev) => (prev.database !== "none" ? "select" : null),
					name: "orm",
					message: "🧭 ORM:",
					choices: (prev) => {
						if (prev.database === "mongo") {
							return [
								{ title: "mongoose", value: "mongoose" },
								{ title: "typeorm", value: "typeorm" },
								{ title: "none", value: "none" },
							];
						}
						if (prev.database !== "none") {
							return [
								{ title: "prisma", value: "prisma" },
								{ title: "typeorm", value: "typeorm" },
								{ title: "none", value: "none" },
							];
						}
						return [{ title: "none", value: "none" }];
					},
					initial: 0,
				},

				{
					type: "select",
					name: "caching",
					message: "⚡ Caching strategy:",
					choices: cacheOrder.map((v) => ({ title: v, value: v })),
					initial: cacheIdx,
				},

				{
					type: "toggle",
					name: "analytics",
					message: "📈 Add analytics?",
					initial: ctx.flags.analytics ?? false,
					active: "yes",
					inactive: "no",
				},

				{
					type: "toggle",
					name: "monitoring",
					message: "🛠 Add monitoring?",
					initial: ctx.flags.monitoring ?? false,
					active: "yes",
					inactive: "no",
				},
			],
			accum,
		);

		return res;
	},
};
