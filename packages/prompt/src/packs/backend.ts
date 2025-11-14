import { askAnswers } from "../prompt";
import type {
	PromptPack,
	PromptContext,
	PromptQuestion,
	ChoiceOption,
	PromptResult,
} from "@appinit/types";

export const backendPack: PromptPack = {
	name: "backend",
	priority: 45, // Runs after language/environment

	async handler(ctx: PromptContext, accum) {
		const flags = ctx.flags ?? {};

		const type = accum.type ?? ctx.flags.type;
		if (type !== "backend" && type !== "fullstack") {
			return {};
		}
		// ----------------------------------------------------
		// NON-INTERACTIVE MODE
		// ----------------------------------------------------
		if (flags["non-interactive"]) {
			return {
				backendFramework: flags.backendFramework ?? "express",
				apiStyle: flags.apiStyle ?? "rest",
				database: flags.database ?? "none",
				orm: flags.orm ?? "none",
				authStrategy: flags.authStrategy ?? "none",
				deployTarget: flags.deployTarget ?? "node",
			};
		}

		// ----------------------------------------------------
		// BASE BACKEND QUESTIONS
		// ----------------------------------------------------
		const base = await askAnswers(
			[
				{
					type: "select",
					name: "backendFramework",
					message: "🖥️ Choose backend framework:",
					choices: [
						{ label: "Express", value: "express" },
						{ label: "Fastify", value: "fastify" },
						{ label: "NestJS", value: "nest" },
						{ label: "Hono", value: "hono" },
						{ label: "Elysia (Bun)", value: "elysia" },
					] as ChoiceOption[],
					initial:
						flags.backendFramework ?? accum.backendFramework ?? "express",
				},
				{
					type: "select",
					name: "apiStyle",
					message: "🔌 API style:",
					choices: [
						{ label: "REST", value: "rest" },
						{ label: "tRPC", value: "trpc" },
						{ label: "GraphQL", value: "graphql" },
					] as ChoiceOption[],
					initial: flags.apiStyle ?? accum.apiStyle ?? "rest",
				},
			],
			accum,
			ctx,
		);

		// ----------------------------------------------------
		// DATABASE QUESTIONS
		// ----------------------------------------------------
		const dbPart = await askAnswers(
			[
				{
					type: "select",
					name: "database",
					message: "🗄 Database:",
					choices: [
						{ label: "none", value: "none" },
						{ label: "PostgreSQL", value: "postgresql" },
						{ label: "MySQL", value: "mysql" },
						{ label: "MongoDB", value: "mongo" },
						{ label: "SQLite", value: "sqlite" },
						{ label: "Supabase", value: "supabase" },
					] as ChoiceOption[],
					initial: flags.database ?? accum.database ?? "none",
				},
			],
			{ ...accum, ...base },
			ctx,
		);

		// ----------------------------------------------------
		// ORM CHOICES DEPEND ON DATABASE
		// ----------------------------------------------------
		let ormChoices: ChoiceOption[];

		switch (dbPart.database) {
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

		const ormPart = await askAnswers(
			[
				{
					type: "select",
					name: "orm",
					message: "🧭 ORM:",
					choices: ormChoices,
					initial: flags.orm ?? accum.orm ?? "none",
				},
			],
			{ ...accum, ...base, ...dbPart },
			ctx,
		);

		// ----------------------------------------------------
		// AUTH STRATEGY
		// ----------------------------------------------------
		const authPart = await askAnswers(
			[
				{
					type: "select",
					name: "authStrategy",
					message: "🔐 Auth strategy:",
					choices: [
						{ label: "none", value: "none" },
						{ label: "JWT", value: "jwt" },
						{ label: "OAuth2", value: "oauth2" },
						{ label: "Clerk", value: "clerk" },
						{ label: "Supabase Auth", value: "supabase" },
					] as ChoiceOption[],
					initial: flags.authStrategy ?? "none",
				},
			],
			{ ...accum, ...base, ...dbPart, ...ormPart },
			ctx,
		);

		// ----------------------------------------------------
		// DEPLOYMENT TARGET
		// ----------------------------------------------------
		const deployPart = await askAnswers(
			[
				{
					type: "select",
					name: "deployTarget",
					message: "🚀 Deployment target:",
					choices: [
						{ label: "Node server", value: "node" },
						{ label: "Vercel", value: "vercel" },
						{ label: "Cloudflare Workers", value: "cloudflare" },
						{ label: "Docker", value: "docker" },
					] as ChoiceOption[],
					initial: flags.deployTarget ?? "node",
				},
			],
			{ ...accum, ...base, ...dbPart, ...ormPart, ...authPart },
			ctx,
		);

		return {
			...base,
			...dbPart,
			...ormPart,
			...authPart,
			...deployPart,
		};
	},
};
