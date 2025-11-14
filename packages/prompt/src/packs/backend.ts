import { askAnswers } from "../prompt";
import type { PromptPack, PromptContext } from "@appinit/types";

export const backendPack: PromptPack = {
	name: "backend",
	priority: 45, // runs after language & environment

	async handler(ctx: PromptContext, accum) {
		// ----------------------------------------------------
		// 1. Non-interactive mode
		// ----------------------------------------------------
		if (ctx.flags["non-interactive"]) {
			return {
				backendFramework: ctx.flags.backendFramework ?? "express",
				apiStyle: ctx.flags.apiStyle ?? "rest",
				database: ctx.flags.database ?? "none",
				orm: ctx.flags.orm ?? "none",
				authStrategy: ctx.flags.authStrategy ?? "none",
				deployTarget: ctx.flags.deployTarget ?? "node",
			};
		}

		// ----------------------------------------------------
		// 2. Interactive mode
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
					],
					initial:
						ctx.flags.backendFramework ?? accum.backendFramework ?? "express",
				},
				{
					type: "select",
					name: "apiStyle",
					message: "🔌 API style:",
					choices: [
						{ label: "REST", value: "rest" },
						{ label: "tRPC", value: "trpc" },
						{ label: "GraphQL", value: "graphql" },
					],
					initial: ctx.flags.apiStyle ?? accum.apiStyle ?? "rest",
				},
			],
			accum,
		);

		// ------------------------------
		// Database + ORM
		// ------------------------------
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
					],
					initial: ctx.flags.database ?? accum.database ?? "none",
				},
			],
			{ ...accum, ...base },
		);

		// ORM depends on database
		let ormChoices;

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
					initial: ctx.flags.orm ?? accum.orm ?? "none",
				},
			],
			{ ...accum, ...base, ...dbPart },
		);

		// ------------------------------
		// Auth Strategy
		// ------------------------------
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
					],
					initial: ctx.flags.authStrategy ?? "none",
				},
			],
			{ ...accum, ...base, ...dbPart, ...ormPart },
		);

		// ------------------------------
		// Deployment target
		// ------------------------------
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
					],
					initial: ctx.flags.deployTarget ?? "node",
				},
			],
			{ ...accum, ...base, ...dbPart, ...ormPart, ...authPart },
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
