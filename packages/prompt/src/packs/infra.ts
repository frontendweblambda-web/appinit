import { askAnswers } from "../prompt";
import type { PromptPack, PromptContext, PromptQuestion } from "@appinit/types";

export const infraPack: PromptPack = {
	name: "infra",
	priority: 50, // runs after backend + framework

	async handler(ctx: PromptContext, accum) {
		const flags = ctx.flags ?? {};
		const type = accum.type ?? flags.type;

		// ====================================================================
		// 0️⃣ Early Skip: No infra for library or CLI
		// ====================================================================
		if (type === "library" || type === "cli") {
			return {};
		}

		// ====================================================================
		// 1️⃣ NON-INTERACTIVE MODE
		// ====================================================================
		if (flags["non-interactive"]) {
			return {
				database: flags.database ?? "none",
				orm: flags.orm ?? "none",
				caching: flags.caching ?? "none",
				authStrategy: flags.authStrategy ?? "none",
				analytics: flags.analytics ?? false,
				monitoring: flags.monitoring ?? false,
			};
		}

		// ====================================================================
		// 2️⃣ FRONTEND MODE — minimal infra
		// ====================================================================
		if (type === "frontend") {
			const frontendQuestions: PromptQuestion[] = [
				{
					type: "confirm",
					name: "analytics",
					message: "📈 Add analytics (e.g., Vercel / Google Analytics)?",
					initial: flags.analytics ?? false,
				},
				{
					type: "confirm",
					name: "monitoring",
					message: "🛠 Add monitoring (Sentry, Log Rocket)?",
					initial: flags.monitoring ?? false,
				},
			];

			return await askAnswers(frontendQuestions, accum, ctx);
		}

		// ====================================================================
		// 3️⃣ BACKEND / FULLSTACK MODE — full infra flow
		// ====================================================================
		if (type === "backend" || type === "fullstack") {
			// ---------------------------------------------------------------
			// Database
			// ---------------------------------------------------------------
			const dbRes = await askAnswers(
				[
					{
						type: "select",
						name: "database",
						message: "🗄 Choose database:",
						choices: [
							{ label: "None", value: "none" },
							{ label: "PostgreSQL", value: "postgresql" },
							{ label: "MySQL", value: "mysql" },
							{ label: "MongoDB", value: "mongo" },
							{ label: "SQLite", value: "sqlite" },
							{ label: "Supabase", value: "supabase" },
						],
						initial: flags.database ?? accum.database ?? "none",
					},
				],
				accum,
				ctx,
			);

			// ---------------------------------------------------------------
			// ORM based on selected DB
			// ---------------------------------------------------------------
			let ormChoices;

			switch (dbRes.database) {
				case "mongo":
					ormChoices = [
						{ label: "Mongoose", value: "mongoose" },
						{ label: "TypeORM", value: "typeorm" },
						{ label: "None", value: "none" },
					];
					break;

				case "none":
					ormChoices = [{ label: "None", value: "none" }];
					break;

				default:
					ormChoices = [
						{ label: "Prisma", value: "prisma" },
						{ label: "Drizzle ORM", value: "drizzle" },
						{ label: "TypeORM", value: "typeorm" },
						{ label: "None", value: "none" },
					];
			}

			const ormRes = await askAnswers(
				[
					{
						type: "select",
						name: "orm",
						message: "🧭 Choose ORM:",
						choices: ormChoices,
						initial: flags.orm ?? "none",
					},
				],
				{ ...accum, ...dbRes },
				ctx,
			);

			// ---------------------------------------------------------------
			// Auth strategy
			// ---------------------------------------------------------------
			const authRes = await askAnswers(
				[
					{
						type: "select",
						name: "authStrategy",
						message: "🔐 Authentication strategy:",
						choices: [
							{ label: "None", value: "none" },
							{ label: "JWT", value: "jwt" },
							{ label: "OAuth2", value: "oauth2" },
							{ label: "Clerk", value: "clerk" },
							{ label: "Supabase Auth", value: "supabase" },
						],
						initial: flags.authStrategy ?? "none",
					},
				],
				{ ...accum, ...dbRes, ...ormRes },
				ctx,
			);

			// ---------------------------------------------------------------
			// Caching
			// ---------------------------------------------------------------
			const cachingRes = await askAnswers(
				[
					{
						type: "select",
						name: "caching",
						message: "⚡ Caching strategy:",
						choices: [
							{ label: "None", value: "none" },
							{ label: "API Cache (short-lived)", value: "api-cache" },
							{ label: "Edge Cache", value: "edge" },
							{ label: "Redis", value: "redis" },
						],
						initial: flags.caching ?? "none",
					},
				],
				{ ...accum, ...dbRes, ...ormRes, ...authRes },
				ctx,
			);

			// ---------------------------------------------------------------
			// Monitoring & Analytics
			// ---------------------------------------------------------------
			const optionalInfraRes = await askAnswers(
				[
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
				{ ...accum, ...dbRes, ...ormRes, ...authRes, ...cachingRes },
				ctx,
			);

			return {
				...dbRes,
				...ormRes,
				...authRes,
				...cachingRes,
				...optionalInfraRes,
			};
		}

		// ====================================================================
		// Safety fallback
		// ====================================================================
		return {};
	},
};
