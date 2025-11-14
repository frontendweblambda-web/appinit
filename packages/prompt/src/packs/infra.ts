import { askAnswers } from "../prompt";
import type { PromptPack, PromptContext, ChoiceOption } from "@appinit/types";

export const infraPack: PromptPack = {
	name: "infra",
	priority: 60,

	handler: async (ctx: PromptContext, accum) => {
		const flags = ctx.flags ?? {};

		// ----------------------------------------------------
		// NON-INTERACTIVE MODE
		// ----------------------------------------------------
		if (flags["non-interactive"]) {
			return {
				auth: flags.auth ?? false,
				authProvider: flags.authProvider ?? "nextauth",
				database: flags.database ?? "none",
				orm: flags.orm ?? "none",
				caching: flags.caching ?? "none",
				analytics: flags.analytics ?? false,
				monitoring: flags.monitoring ?? false,
			};
		}

		// ----------------------------------------------------
		// BASE QUESTIONS
		// ----------------------------------------------------
		const base = await askAnswers(
			[
				{
					type: "confirm",
					name: "auth",
					message: "🔐 Add authentication?",
					initial: flags.auth ?? false,
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
					] as ChoiceOption[],
					initial: flags.database ?? "none",
				},
			],
			accum,
			ctx,
		);

		// ----------------------------------------------------
		// AUTH PROVIDER (Conditional)
		// ----------------------------------------------------
		let authProviderResult = {};

		if (base.auth === true) {
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
						] as ChoiceOption[],
						initial: flags.authProvider ?? "nextauth",
					},
				],
				{ ...accum, ...base },
				ctx,
			);
		}

		// ----------------------------------------------------
		// ORM CHOICES BASED ON DATABASE
		// ----------------------------------------------------
		let ormChoices: ChoiceOption[];

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

		// ----------------------------------------------------
		// ORM, Caching, Analytics, Monitoring
		// ----------------------------------------------------
		const ormResult = await askAnswers(
			[
				{
					type: "select",
					name: "orm",
					message: "🧭 ORM:",
					choices: ormChoices,
					initial: flags.orm ?? "none",
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
					] as ChoiceOption[],
					initial: flags.caching ?? "none",
				},
				{
					type: "confirm",
					name: "analytics",
					message: "📈 Add analytics?",
					initial: flags.analytics ?? false,
				},
				{
					type: "confirm",
					name: "monitoring",
					message: "🛠 Add monitoring?",
					initial: flags.monitoring ?? false,
				},
			],
			{ ...accum, ...base, ...authProviderResult },
			ctx,
		);

		// ----------------------------------------------------
		// RESULT
		// ----------------------------------------------------
		return {
			...base,
			...authProviderResult,
			...ormResult,
		};
	},
};
