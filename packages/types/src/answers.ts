import type { FrontendOptions } from "./frontend.js";
import type { BackendOptions } from "./backend.js";
import type { AuthOptions } from "./auth.js";
import type { DeployOptions } from "./deploy.js";

export interface Answers
	extends FrontendOptions,
		BackendOptions,
		AuthOptions,
		DeployOptions {
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

	repoVisibility?: "public" | "private";
	remoteOrg?: string | null;

	setupCI: boolean;
	setupCD?: boolean;

	autoInstall: boolean;
	autoStart: boolean;
	autoOpen?: boolean;

	organization?: string;
	projectVisibility?: "public" | "private" | "internal";
	licenseType?: "MIT" | "ISC" | "Apache-2.0" | "Proprietary";

	useAI?: boolean;
}
