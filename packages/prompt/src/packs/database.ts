import {
	ChoiceOption,
	PromptContext,
	PromptPack,
	PromptResult,
} from "@appinit/types";
import { askAnswers } from "../prompt";

export const database: PromptPack = {
	name: "database",
	priority: 45,

	condition: (_, accum) =>
		["backend", "fullstack"].includes(accum.projectType ?? ""),

	handler: async (ctx: PromptContext, accum) => {
		const flags = ctx.flags ?? {};
		const nonInteractive = flags.nonInteractive;

		const defaults = {
			database: "postgresql",
			orm: "primsa",
		};

		if (nonInteractive) {
			return {
				database: flags.database ?? defaults.database,
				orm: flags.orm ?? defaults.orm,
			};
		}

		const isEdgeRuntime = ["hono", "elysia"].includes(
			ctx.answers.backendFramework as string,
		);
		let dbPart: Partial<PromptResult> = { database: "none" as string };
		let ormPart: Partial<PromptResult> = { orm: "none" };

		if (!isEdgeRuntime) {
			dbPart = await askAnswers(
				[
					{
						type: "select",
						name: "database",
						message: "🗄 Database Layer:",
						choices: [
							{
								label: "None",
								value: "none",
								hint: "**No DB needed.** Suitable for static / micro endpoints.",
							},
							{
								label: "PostgreSQL",
								value: "postgresql",
								hint: "**Best default.** Strong, reliable, relational, scalable.",
							},
							{
								label: "MySQL",
								value: "mysql",
								hint: "**Legacy & enterprise-friendly.** Great for transactional workloads.",
							},
							{
								label: "SQLite",
								value: "sqlite",
								hint: "**Lightweight & embedded.** Best for prototyping or small apps.",
							},
							{
								label: "MongoDB",
								value: "mongo",
								hint: "**Flexible NoSQL.** Best for JSON-like unstructured data.",
							},
							{
								label: "Supabase",
								value: "supabase",
								hint: "**Managed Postgres + Auth + Storage.** Best for indie/SaaS teams.",
							},
						] satisfies ChoiceOption[],
						initial: flags.database ?? accum.database ?? "none",
					},
				] as const,
				accum,
				ctx,
			);
		}

		if (!isEdgeRuntime && dbPart.database !== "none") {
			const ormChoices: ChoiceOption[] =
				dbPart.database === "mongo"
					? [
							{
								label: "Mongoose",
								value: "mongoose",
								hint: "**Most used for Mongo.** Schema-based with robust plugins.",
							},
							{
								label: "TypeORM",
								value: "typeorm",
								hint: "**Class-based ORM.** Works with SQL + NoSQL including Mongo.",
							},
							{
								label: "None",
								value: "none",
								hint: "**Direct native queries.** More freedom, more work.",
							},
						]
					: [
							{
								label: "Prisma",
								value: "prisma",
								hint: "**Best DX.** Typed client, easy migrations, modern tooling.",
							},
							{
								label: "Drizzle",
								value: "drizzle",
								hint: "**Lightweight, compile-time safety.** Great for edge + migrations.",
							},
							{
								label: "TypeORM",
								value: "typeorm",
								hint: "**Enterprise-style ORM.** Decorators + traditional patterns.",
							},
							{
								label: "None",
								value: "none",
								hint: "**Raw SQL.** Maximum performance, zero abstraction.",
							},
						];

			ormPart = await askAnswers(
				[
					{
						type: "select",
						name: "orm",
						message: "🧭 ORM / DB Client:",
						choices: ormChoices,
						initial: flags.orm ?? accum.orm ?? "none",
					},
				] as const,
				{ ...accum, ...dbPart },
				ctx,
			);
		}

		return {
			...dbPart,
			...ormPart,
		};
	},
};
