/* ────────────────────────────────────────────────
   AppInit Answers Type (Final)
   Combines: Frontend + Backend + Auth + Deploy
   Fully typed & framework-specific
────────────────────────────────────────────────── */

import type { FrontendOptions } from "./frontend";
import type { BackendOptions } from "./backend";
import type { AuthOptions } from "./auth.js";
import type { DeployOptions } from "./deploy";
import {
	Architecture,
	CIProvider,
	Editor,
	Formatter,
	Language,
	LicenseType,
	Linter,
	PackageManager,
	ProjectStructure,
	ProjectType,
	RepoVisibility,
	TestRunner,
	WorkspaceTool,
} from "./common";

export interface BaseAnswers {
	// 🏷️ Project Identity & Metadata
	projectName: string;
	targetDir: string; // Made required for clarity in final answers
	description?: string;
	author?: string;
	licenseType: LicenseType; // Made required for configuration completeness
	packageScope?: string | null; // e.g., @myorg

	projectType: ProjectType;
	language: Language;
	packageManager: PackageManager;
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

	autoInstall: boolean;
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
