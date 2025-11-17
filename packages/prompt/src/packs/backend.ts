import {
	PromptContext,
	PromptPack,
	ChoiceOption,
	PromptResult,
} from "@appinit/types";
import { askAnswers } from "../prompt";

export const backendPack: PromptPack = {
	name: "backend",
	priority: 45,

	// Only runs when backend functionality is required
	condition: (_, accum) =>
		accum.projectType === "backend" || accum.projectType === "fullstack",

	handler: async (ctx: PromptContext, accum) => {
		const flags = ctx.flags ?? {};
		const nonInteractive = flags.nonInteractive;

		// ===================================================================================
		// NON-INTERACTIVE MODE: return flags (no questions)
		// ===================================================================================
		if (nonInteractive) {
			return {
				backendFramework: flags.backendFramework ?? "express",
				apiStyle: flags.apiStyle ?? "rest",
				database: flags.database ?? "none",
				orm: flags.orm ?? "none",
				authStrategy: flags.authStrategy ?? "none",
				deployTarget: flags.deployTarget ?? "node",
			};
		}

		// ===================================================================================
		// 1️⃣ BACKEND FRAMEWORK + API STYLE
		// ===================================================================================
		const base = await askAnswers(
			[
				{
					type: "select",
					name: "backendFramework",
					message: "🧱 Backend Framework:",
					choices: [
						{
							label: "Express",
							value: "express",
							hint: "**Most popular Node backend.** Simple routing, middleware based, huge ecosystem.",
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
							label: "Hono (Edge-optimized)",
							value: "hono",
							hint: "**Tiny + ultra fast for edge runtimes.** Perfect for Cloudflare, Deno, Bun.",
						},
						{
							label: "Elysia (Bun)",
							value: "elysia",
							hint: "**Deep Bun integration.** Modern type-safe router + middleware.",
						},
					] satisfies ChoiceOption[],
					initial:
						flags.backendFramework ?? accum.backendFramework ?? "express",
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
					initial: flags.apiStyle ?? accum.apiStyle ?? "rest",
				},
			] as const,
			accum,
			ctx,
		);

		const isEdgeRuntime = ["hono"].includes(base.projectType!);

		// ===================================================================================
		// 2️⃣ DATABASE (skip automatically for edge-only)
		// ===================================================================================
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
				{ ...accum, ...base },
				ctx,
			);
		}

		// ===================================================================================
		// 3️⃣ ORM (database-aware with smart hinting)
		// ===================================================================================

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
				{ ...accum, ...base, ...dbPart },
				ctx,
			);
		}

		// ===================================================================================
		// 4️⃣ AUTH STRATEGY
		// ===================================================================================
		const authPart = await askAnswers(
			[
				{
					type: "select",
					name: "authStrategy",
					message: "🔐 Authentication Strategy:",
					choices: [
						{
							label: "None",
							value: "none",
							hint: "**For open/public API.** Add later anytime.",
						},
						{
							label: "JWT",
							value: "jwt",
							hint: "**Most universal.** Works across browsers, mobile, microservices.",
						},
						{
							label: "Session",
							value: "session",
							hint: "**Secure server-side auth.** Works best with SSR frameworks.",
						},
						{
							label: "Clerk",
							value: "clerk",
							hint: "**Drop-in auth + user mgmt.** Modern SaaS-friendly solution.",
						},
						{
							label: "Auth.js (NextAuth)",
							value: "nextauth",
							hint: "**Fullstack React auth.** Works best with Next.js.",
						},
						{
							label: "Supabase Auth",
							value: "supabase",
							hint: "**Managed, built-in auth.** Works with Supabase DB.",
						},
					] satisfies ChoiceOption[],
					initial: flags.authStrategy ?? accum.authStrategy ?? "none",
				},
			] as const,
			{ ...accum, ...base, ...dbPart, ...ormPart },
			ctx,
		);

		// ===================================================================================
		// 5️⃣ DEPLOYMENT TARGET
		// ===================================================================================
		const deployChoices: ChoiceOption[] = isEdgeRuntime
			? [
					{
						label: "Cloudflare Workers",
						value: "cloudflare",
						hint: "**Best match for Hono.** Global edge performance.",
					},
					{
						label: "Vercel Edge Runtime",
						value: "vercel",
						hint: "**Edge-based compute.** Deploy UI + API together.",
					},
				]
			: [
					{
						label: "Node (Self-hosted / VPS)",
						value: "node",
						hint: "**Most flexible.** Use PM2, Docker, or systemd.",
					},
					{
						label: "Vercel",
						value: "vercel",
						hint: "**Best for fullstack Next.js.** Automatic CI + preview deployments.",
					},
					{
						label: "Docker",
						value: "docker",
						hint: "**Containerized & portable.** Works on any cloud provider.",
					},
				];

		const deployPart = await askAnswers(
			[
				{
					type: "select",
					name: "deployTarget",
					message: "🚀 Deployment Target:",
					choices: deployChoices,
					initial:
						flags.deployTarget ??
						accum.deployTarget ??
						(isEdgeRuntime ? "cloudflare" : "node"),
				},
			] as const,
			{ ...accum, ...base, ...dbPart, ...ormPart, ...authPart },
			ctx,
		);

		// ===================================================================================
		// RETURN FINAL MERGED RESULT
		// ===================================================================================
		return {
			...base,
			...dbPart,
			...ormPart,
			...authPart,
			...deployPart,
		};
	},
};
