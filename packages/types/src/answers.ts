/**
 * @appinit/types
 * Global type definitions for scaffolding configuration.
 */

export type Answers = {
	projectName: string;
	description?: string;
	author?: string;
	license?: string;
	packageScope?: string | null;

	registry: "npm" | "pnpm" | "yarn" | "bun";
	workspace: "single" | "turborepo";

	framework: "react" | "next" | "vue" | "svelte" | "framer" | "react-router";
	ui: "tailwind" | "mui" | "shadcn" | "antd" | "none";
	routing?: "app" | "pages" | "react-router" | "vue-router";
	store?: "pinia" | "zustand" | "redux";

	language: "typescript" | "javascript";
	structure: "flat" | "src-folder";

	testing: "vitest" | "jest" | "none" | "playwright" | "cypress";
	linting: "eslint" | "none";
	formatting: "prettier" | "none";
	commitConventions: boolean;

	editor: "vscode" | "sublime" | "atom" | "none";

	auth: boolean;
	authProvider?: "custom" | "nextauth" | "clerk" | "supabase" | "none";

	database?: "none" | "postgresql" | "supabase" | "mongo" | "sqlite";
	orm?: "prisma" | "typeorm" | "mongoose" | "none";

	caching?: "none" | "api-cache" | "edge" | "redis";
	analytics?: boolean;
	monitoring?: boolean;

	initGit: boolean;
	createRemote: boolean;
	repoVisibility?: "public" | "private";
	remoteOrg?: string | null;

	setupCI: boolean;
	ciProvider?: "vercel" | "netlify" | "github-actions" | "none";
	autoInstall: boolean;
	autoStart: boolean;

	useAI?: boolean;
};
