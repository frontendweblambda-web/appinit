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
	currentDir?: string;
	targetDir?: string;
	projectName: string;
	description?: string;
	author?: string;
	license?: string;
	packageScope?: string | null;

	packageManager: PackageManager;
	workspaceTool: WorkspaceTool;

	projectType: ProjectType;
	language: Language;
	projectStructure: ProjectStructure;

	formattingTool: Formatter;
	lintingTool: Linter;
	testingTool: TestRunner;

	commitConventions: boolean;
	editor: Editor;

	initGit: boolean;
	createRemote: boolean;
	repoVisibility?: RepoVisibility;
	projectVisibility?: RepoVisibility;
	remoteOrg?: string | null;

	setupCI: boolean;
	setupCD?: boolean;
	ciProvider?: CIProvider;

	autoInstall: boolean;
	autoStart: boolean;
	autoOpen?: boolean;

	organization?: string;
	licenseType?: LicenseType;

	useAI?: boolean;
	deploy?: DeployOptions;
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
