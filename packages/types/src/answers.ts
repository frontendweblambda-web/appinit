/* ────────────────────────────────────────────────
   AppInit Answers Type (Final)
   Combines: Frontend + Backend + Auth + Deploy
   Fully typed & framework-specific
────────────────────────────────────────────────── */

import type { FrontendOptions } from "./frontend.js";
import type { BackendOptions } from "./backend.js";
import type { AuthOptions } from "./auth.js";
import type { DeployOptions } from "./deploy.js";
import { DeployContext } from "./provider.js";

// -------------------------------------
// Workspace toolchains
// -------------------------------------
export type WorkspaceTool = "single" | "turborepo" | "nx" | "monorepo";

// -------------------------------------
// Language
// -------------------------------------
export type Language = "typescript" | "javascript";

// -------------------------------------
// Project Types
// -------------------------------------
export type ProjectType =
	| "frontend"
	| "backend"
	| "fullstack"
	| "library"
	| "cli";

// -------------------------------------
// Project structure strategy
// -------------------------------------
export type ProjectStructure =
	| "flat"
	| "src-folder"
	| "feature-based"
	| "domain-driven";

// -------------------------------------
// Formatting / Linting / Testing
// -------------------------------------
export type Formatter = "prettier" | "rome" | "none";
export type Linter = "eslint" | "biome" | "none";

export type TestRunner =
	| "vitest"
	| "jest"
	| "playwright"
	| "cypress"
	| "storybook"
	| "none";

// -------------------------------------
// Git editor preference
// -------------------------------------
export type Editor = "vscode" | "sublime" | "webstorm" | "cursor" | "none";

// -------------------------------------
// License types
// -------------------------------------
export type LicenseType = "MIT" | "ISC" | "Apache-2.0" | "Proprietary";

// -------------------------------------
// Repository visibility
// -------------------------------------
export type RepoVisibility = "public" | "private" | "internal";
export type CIProvider =
	| "github-actions"
	| "gitlab-ci"
	| "vercel"
	| "netlify"
	| "aws-pipeline"
	| "none";

// -------------------------------------
// Final Answers Type
// Merged union of all AppInit categories
// -------------------------------------

export interface BaseAnswers {
	projectName: string;
	description?: string;
	author?: string;
	license?: string;
	packageScope?: string | null;

	registry: "npm" | "pnpm" | "yarn" | "bun";
	workspace: "single" | "turborepo" | "nx" | "monorepo";

	type: "frontend" | "backend" | "fullstack" | "library" | "cli";
	language: "typescript" | "javascript";
	structure: "flat" | "src-folder" | "feature-based" | "domain-driven";

	formatting: "prettier" | "rome" | "none";
	linting: "eslint" | "biome" | "none";
	testing: "vitest" | "jest" | "playwright" | "cypress" | "storybook" | "none";

	commitConventions: boolean;
	editor: "vscode" | "sublime" | "webstorm" | "cursor" | "none";

	initGit: boolean;
	createRemote: boolean;
	repoVisibility?: "public" | "private" | "internal";
	remoteOrg?: string | null;

	setupCI: boolean;
	setupCD?: boolean;
	ciProvider?: CIProvider;

	autoInstall: boolean;
	autoStart: boolean;
	autoOpen?: boolean;

	organization?: string;
	projectVisibility?: "public" | "private" | "internal";
	licenseType?: "MIT" | "ISC" | "Apache-2.0" | "Proprietary";

	useAI?: boolean;
	deploy?: DeployOptions;
}

// ─────────────────────────────────────────────
// Frontend-only answers
// ─────────────────────────────────────────────
export type FrontendAnswers = BaseAnswers &
	FrontendOptions &
	DeployOptions & {
		type: "frontend";
	} & AuthOptions<"frontend">;

// ─────────────────────────────────────────────
// Backend-only answers
// ─────────────────────────────────────────────
export type BackendAnswers = BaseAnswers &
	BackendOptions &
	DeployOptions & {
		type: "backend";
	} & AuthOptions<"backend">;

// ─────────────────────────────────────────────
// Fullstack answers (Frontend + Backend)
// ─────────────────────────────────────────────
export type FullstackAnswers = BaseAnswers &
	FrontendOptions &
	BackendOptions &
	DeployOptions & {
		type: "fullstack";
	} & AuthOptions<"fullstack">;

// ─────────────────────────────────────────────
// Library / CLI answers (auth always disabled)
// ─────────────────────────────────────────────
export type LibraryAnswers = BaseAnswers & {
	type: "library" | "cli";
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
