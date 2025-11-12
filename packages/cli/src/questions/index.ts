import inquirer from "inquirer";
import { Answers } from "src/types/answers.js";

export function isFlat(structure: string) {
	return structure === "flat";
}

export async function askQuestions(
	defaultName?: string,
	flags: any = {},
): Promise<Answers> {
	const validateName = (v: string) => {
		if (!v || !v.trim()) return "Project name cannot be empty";
		if (!/^[a-z0-9\-_]+$/i.test(v)) return "Use only letters, numbers, - or _";
		return true;
	};

	if (defaultName && !flags.projectName) flags.projectName = defaultName;
	const answers: Partial<Answers> = {};

	// ──────────────── 1️⃣ GIT & CI FIRST ────────────────
	const git = await inquirer.prompt([
		{
			type: "confirm",
			name: "initGit",
			message: "🐙 Initialize a Git repository?",
			default: true,
		},
		{
			type: "confirm",
			name: "createRemote",
			message: "📦 Create a remote GitHub repository?",
			default: false,
			when: (a) => a.initGit === true,
		},
		{
			type: "input",
			name: "remoteOrg",
			message: "🏢 GitHub organization (optional):",
			when: (a) => a.createRemote === true,
			default: flags.remoteOrg || "",
		},
		{
			type: "list",
			name: "repoVisibility",
			message: "🔒 Repository visibility:",
			choices: [
				{ name: "Public", value: "public" },
				{ name: "Private", value: "private" },
			],
			default: "public",
			when: (a) => a.createRemote === true,
		},
		{
			type: "confirm",
			name: "setupCI",
			message: "⚙️ Setup CI/CD pipeline?",
			default: false,
			when: (a) => a.createRemote === true,
		},
		{
			type: "list",
			name: "ciProvider",
			message: "🚀 Choose deployment target:",
			choices: [
				{ name: "Vercel", value: "vercel" },
				{ name: "Netlify", value: "netlify" },
				{ name: "GitHub Actions", value: "github-actions" },
				{ name: "None", value: "none" },
			],
			when: (a) => a.setupCI === true,
		},
	]);
	Object.assign(answers, git);

	// ──────────────── 2️⃣ PROJECT METADATA ────────────────
	const meta = await inquirer.prompt([
		{
			type: "input",
			name: "projectName",
			message: "🧱 Project name:",
			default: defaultName || flags.projectName || "my-codex-app",
			validate: validateName,
			when: !(defaultName || flags.projectName),
		},
		{
			type: "input",
			name: "description",
			message: "📝 Short description:",
			default: flags.description || "",
		},
		{
			type: "input",
			name: "author",
			message: "👤 Author (name/email):",
			default: flags.author || "",
		},
		{
			type: "list",
			name: "license",
			message: "📜 License:",
			choices: ["MIT", "Apache-2.0", "GPL-3.0", "Unlicense", "Other"],
			default: flags.license || "MIT",
		},
		{
			type: "input",
			name: "packageScope",
			message: "📦 Package scope (optional, without @):",
			default: flags.packageScope || "",
			filter: (v: string) => (v ? `@${v}` : null),
		},
	]);
	Object.assign(answers, meta);

	// ──────────────── 3️⃣ LANGUAGE & STRUCTURE ────────────────
	const language = await inquirer.prompt([
		{
			type: "list",
			name: "language",
			message: "💬 Language preference:",
			choices: [
				{ name: "TypeScript", value: "typescript" },
				{ name: "JavaScript", value: "javascript" },
			],
			default: "typescript",
		},
		{
			type: "list",
			name: "structure",
			message: "📁 Project structure:",
			choices: [
				{ name: "Flat (no src folder)", value: "flat" },
				{ name: "With src/ folder", value: "src-folder" },
			],
			default: "src-folder",
		},
	]);
	Object.assign(answers, language);

	// ──────────────── 4️⃣ ENVIRONMENT / PACKAGE SETUP ────────────────
	const env = await inquirer.prompt([
		{
			type: "list",
			name: "registry",
			message: "📦 Package manager:",
			choices: ["npm", "pnpm", "yarn", "bun"],
			default: flags.registry || "pnpm",
		},
		{
			type: "list",
			name: "workspace",
			message: "🧩 Workspace type:",
			choices: [
				{ name: "Single project", value: "single" },
				{ name: "Turborepo (monorepo)", value: "turborepo" },
			],
			default: flags.workspace || "single",
		},
	]);
	Object.assign(answers, env);

	// ──────────────── 5️⃣ FRAMEWORK / UI / ROUTING / STORE ────────────────
	const fw = await inquirer.prompt([
		{
			type: "list",
			name: "framework",
			message: "⚙️ Choose framework:",
			choices: [
				{ name: "React (Vite)", value: "react" },
				{ name: "Next.js (App Router)", value: "next" },
				{ name: "Vue (Vite)", value: "vue" },
				{ name: "Svelte", value: "svelte" },
				{ name: "Framer", value: "framer" },
				{ name: "React Router (SPA)", value: "rect-router" },
			],
			default: flags.framework || "react",
			when: !flags.framework,
		},
		{
			type: "list",
			name: "ui",
			message: "🎨 UI library:",
			choices: ["tailwind", "mui", "shadcn", "antd", "none"],
			default: flags.ui || "tailwind",
			when: !flags.ui,
		},
		{
			type: "list",
			name: "routing",
			message: "🗺 Routing:",
			choices: (a) => {
				if (a.framework === "next")
					return [
						{ name: "App Router (recommended)", value: "app" },
						{ name: "Pages Router", value: "pages" },
					];
				if (a.framework === "vue")
					return [{ name: "Vue Router", value: "vue-router" }];
				return [{ name: "React Router", value: "react-router" }];
			},
		},
		{
			type: "list",
			name: "store",
			message: "🧠 State management:",
			choices: ["zustand", "redux", "pinia", "none"],
			default: "zustand",
		},
	]);
	Object.assign(answers, fw);

	// ──────────────── 6️⃣ QUALITY TOOLS ────────────────
	const quality = await inquirer.prompt([
		{
			type: "list",
			name: "editor",
			message: "🧠 Preferred editor:",
			choices: ["vscode", "sublime", "atom", "none"],
			default: "vscode",
		},
		{
			type: "list",
			name: "testing",
			message: "🧪 Testing framework:",
			choices: ["vitest", "jest", "playwright", "cypress", "none"],
			default: flags.testing || "vitest",
		},
		{
			type: "list",
			name: "linting",
			message: "🔍 Linting:",
			choices: ["eslint", "none"],
			default: flags.linting || "eslint",
		},
		{
			type: "list",
			name: "formatting",
			message: "🎨 Formatter:",
			choices: ["prettier", "none"],
			default: flags.formatting || "prettier",
		},
		{
			type: "confirm",
			name: "commitConventions",
			message: "🔁 Use Conventional Commits?",
			default: true,
		},
	]);
	Object.assign(answers, quality);

	// ──────────────── 7️⃣ INFRASTRUCTURE ────────────────
	const infra = await inquirer.prompt([
		{
			type: "confirm",
			name: "auth",
			message: "🔐 Add authentication?",
			default: !!flags.auth,
		},
		{
			type: "list",
			name: "authProvider",
			message: "🔑 Auth Provider:",
			choices: ["custom", "nextauth", "clerk", "supabase", "none"],
			when: (a) => a.auth === true,
			default: "nextauth",
		},
		{
			type: "list",
			name: "database",
			message: "🗄 Database:",
			choices: ["none", "postgresql", "supabase", "mongo", "sqlite"],
			default: flags.database || "none",
		},
		{
			type: "list",
			name: "orm",
			message: "🧭 ORM:",
			choices: (a) => {
				if (a.database === "mongo") return ["mongoose", "typeorm", "none"];
				if (a.database !== "none") return ["prisma", "typeorm", "none"];
				return ["none"];
			},
			when: (a) => a.database !== "none",
			default: flags.orm || "prisma",
		},
		{
			type: "list",
			name: "caching",
			message: "⚡ Caching strategy:",
			choices: ["none", "api-cache", "edge", "redis"],
			default: flags.caching || "none",
		},
		{
			type: "confirm",
			name: "analytics",
			message: "📈 Add analytics (Plausible / PostHog)?",
			default: false,
		},
		{
			type: "confirm",
			name: "monitoring",
			message: "🛠 Add monitoring (Sentry / Playwright traces)?",
			default: false,
		},
	]);
	Object.assign(answers, infra);

	// ──────────────── 8️⃣ AUTOMATION & AI ────────────────
	const automation = await inquirer.prompt([
		{
			type: "confirm",
			name: "autoInstall",
			message: "⚙️ Run install after generation?",
			default: true,
		},
		{
			type: "confirm",
			name: "autoStart",
			message: "▶️ Start dev server after install?",
			default: false,
		},
		{
			type: "confirm",
			name: "useAI",
			message: "🤖 Let AI suggest or optimize setup?",
			default: false,
		},
	]);
	Object.assign(answers, automation);

	return answers as Answers;
}
