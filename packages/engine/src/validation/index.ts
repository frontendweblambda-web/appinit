import { z } from "zod";

export const EngineAnswersSchema = z.object({
	projectName: z.string().min(1),
	description: z.string().optional(),
	author: z.string().optional(),
	license: z.string().default("MIT"),
	packageScope: z.string().nullable().optional(),

	registry: z.enum(["npm", "pnpm", "yarn", "bun"]).default("pnpm"),
	workspace: z.enum(["single", "turborepo"]).default("single"),

	framework: z.enum([
		"react",
		"next",
		"vue",
		"svelte",
		"framer",
		"react-router",
	]),
	ui: z.enum(["tailwind", "mui", "shadcn", "antd", "none"]),
	routing: z.enum(["app", "pages", "react-router", "vue-router"]).optional(),
	store: z.enum(["pinia", "zustand", "redux"]).optional(),

	language: z.enum(["typescript", "javascript"]).default("typescript"),
	structure: z.enum(["flat", "src-folder"]).default("src-folder"),

	testing: z
		.enum(["vitest", "jest", "none", "playwright", "cypress"])
		.default("none"),
	linting: z.enum(["eslint", "none"]).default("eslint"),
	formatting: z.enum(["prettier", "none"]).default("prettier"),
	commitConventions: z.boolean().default(true),

	editor: z.enum(["vscode", "sublime", "atom", "none"]).default("vscode"),

	auth: z.boolean().default(false),
	authProvider: z
		.enum(["custom", "nextauth", "clerk", "supabase", "none"])
		.optional(),

	database: z
		.enum(["none", "postgresql", "supabase", "mongo", "sqlite"])
		.default("none"),
	orm: z.enum(["prisma", "typeorm", "mongoose", "none"]).default("none"),

	caching: z.enum(["none", "api-cache", "edge", "redis"]).default("none"),
	analytics: z.boolean().default(false),
	monitoring: z.boolean().default(false),

	initGit: z.boolean().default(true),
	createRemote: z.boolean().default(false),
	repoVisibility: z.enum(["public", "private"]).optional(),
	remoteOrg: z.string().nullable().optional(),

	setupCI: z.boolean().default(false),
	ciProvider: z
		.enum(["vercel", "netlify", "github-actions", "none"])
		.default("none"),

	autoInstall: z.boolean().default(true),
	autoStart: z.boolean().default(false),

	useAI: z.boolean().default(false),
});

export type ValidatedAnswers = z.infer<typeof EngineAnswersSchema>;
