/* ────────────────────────────────────────────────
   AppInit Answers Type (Final)
   Combines: Frontend + Backend + Auth + Deploy
   Fully typed & framework-specific
────────────────────────────────────────────────── */

import type { AuthOptions } from "./auth.js";
import type { BackendOptions } from "./backend";
import {
	Architecture,
	CIProvider,
	Editor,
	Formatter,
	Language,
	Linter,
	PackageManager,
	ProjectStructure,
	ProjectType,
	RepoVisibility,
	TestRunner,
	WorkspaceTool,
} from "./common";
import type { DeployOptions } from "./deploy";
import type { FrontendOptions } from "./frontend";

export interface BaseAnswers {
	projectType: ProjectType;
	packageManager: PackageManager;
	language: Language;
	targetDir: string;
	projectStructure: ProjectStructure;
	workspaceTool: WorkspaceTool;

	// 🧩 Architecture — applies to any buildable app
	architecture?: Architecture;

	formattingTool: Formatter;
	lintingTool: Linter;
	testingTool: TestRunner;

	// ⚙️ Build & Runtime Configuration
	buildTool?: string; // e.g., webpack, esbuild, rollup, Rust cargo
	runtimeEnvironment?: string; // e.g., Node.js, Deno, JVM, Browser, WASM

	// 🤝 Collaboration & Quality
	commitConventions: boolean;
	editor: Editor; // Editor configuration (e.g., VSCode settings)

	initGit: boolean;
	createRemote: boolean;
	repoVisibility?: RepoVisibility;
	remoteOrg?: string | null;

	setupCI: boolean;
	setupCD?: boolean;
	ciProvider?: CIProvider;

	autoInstall?: boolean;
	autoStart: boolean;
	autoOpen?: boolean;

	organization?: string;

	useAI?: boolean;
	deploy?: DeployOptions;

	features?: string[];
	setting: Record<string, any>;
}

// ─────────────────────────────────────────────
// Frontend-only answers
// ─────────────────────────────────────────────
export type FrontendAnswers = BaseAnswers &
	FrontendOptions &
	DeployOptions & { projectType: "frontend" } & AuthOptions<"frontend">;
// ─────────────────────────────────────────────
// Backend-only answers
// ─────────────────────────────────────────────
export type BackendAnswers = BaseAnswers &
	BackendOptions &
	DeployOptions & { projectType: "backend" } & AuthOptions<"backend">;
// ─────────────────────────────────────────────
// Fullstack answers (Frontend + Backend)
// ─────────────────────────────────────────────
export type FullstackAnswers = BaseAnswers &
	FrontendOptions &
	BackendOptions &
	DeployOptions & { projectType: "fullstack" } & AuthOptions<"fullstack">;
// ─────────────────────────────────────────────
// Library / CLI answers (auth always disabled)
// ─────────────────────────────────────────────
export type LibraryAnswers = BaseAnswers & {
	projectType: "library" | "cli";
	auth: "none";
	authConfig?: undefined;
};

// ─────────────────────────────────────────────
// FINAL ANSWERS UNION (Correct)
// ─────────────────────────────────────────────
export type Answers =
	| FrontendAnswers
	| BackendAnswers
	| FullstackAnswers
	| LibraryAnswers;

export type ValidatedAnswers<T extends Answers = Answers> = T & {
	_validated: true;
};
