import { askAnswers } from "../prompt";
import type { PromptPack, PromptContext } from "@appinit/types";

export const infraPack: PromptPack = {
	name: "infra",

	handler: async (ctx: PromptContext, accum) => {
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

		const base = await askAnswers(
			[
				{
					type: "confirm",
					name: "auth",
					message: "🔐 Add authentication?",
					initial: ctx.flags.auth ?? false,
				},
				{
					type: "select",
					name: "database",
					message: "🗄 Database:",
					choices: [
						{ label: "none", value: "none" },
						{ label: "postgresql", value: "postgresql" },
						{ label: "supabase", value: "supabase" },
						{ label: "mongo", value: "mongo" },
						{ label: "sqlite", value: "sqlite" },
					],
					initial: ctx.flags.database ?? "none",
				},
			],
			accum,
		);

		// Dynamic: auth provider
		let authProviderResult = {};
		if (base.auth) {
			authProviderResult = await askAnswers(
				[
					{
						type: "select",
						name: "authProvider",
						message: "🔑 Auth Provider:",
						choices: [
							{ label: "custom", value: "custom" },
							{ label: "nextauth", value: "nextauth" },
							{ label: "clerk", value: "clerk" },
							{ label: "supabase", value: "supabase" },
							{ label: "none", value: "none" },
						],
						initial: ctx.flags.authProvider ?? "nextauth",
					},
				],
				{ ...accum, ...base },
			);
		}

		// Dynamic: ORM
		let ormChoices;
		switch (base.database) {
			case "mongo":
				ormChoices = [
					{ label: "mongoose", value: "mongoose" },
					{ label: "typeorm", value: "typeorm" },
					{ label: "none", value: "none" },
				];
				break;

			case "none":
				ormChoices = [{ label: "none", value: "none" }];
				break;

			default:
				ormChoices = [
					{ label: "prisma", value: "prisma" },
					{ label: "typeorm", value: "typeorm" },
					{ label: "none", value: "none" },
				];
		}

		const ormResult = await askAnswers(
			[
				{
					type: "select",
					name: "orm",
					message: "🧭 ORM:",
					choices: ormChoices,
					initial: ctx.flags.orm ?? "none",
				},
				{
					type: "select",
					name: "caching",
					message: "⚡ Caching strategy:",
					choices: [
						{ label: "none", value: "none" },
						{ label: "api-cache", value: "api-cache" },
						{ label: "edge", value: "edge" },
						{ label: "redis", value: "redis" },
					],
					initial: ctx.flags.caching ?? "none",
				},
				{
					type: "confirm",
					name: "analytics",
					message: "📈 Add analytics?",
					initial: ctx.flags.analytics ?? false,
				},
				{
					type: "confirm",
					name: "monitoring",
					message: "🛠 Add monitoring?",
					initial: ctx.flags.monitoring ?? false,
				},
			],
			{ ...accum, ...base, ...authProviderResult },
		);

		return { ...base, ...authProviderResult, ...ormResult };
	},
};
