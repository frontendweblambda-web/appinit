export type ID = string;
export type Nullable<T> = T | null | undefined;
export type Maybe<T> = T | null | undefined;
export type JSONValue =
	| string
	| number
	| boolean
	| null
	| JSONValue[]
	| { [key: string]: JSONValue };
export type Capability =
	| "i18n"
	| "auth"
	| "cloud"
	| "ssr"
	| "edge"
	| "db"
	| "cache";
export type Variables = Record<string, any>;
export type WorkspaceTool = "single" | "turborepo" | "nx" | "monorepo"; // Workspace toolchains
export type Language = "typescript" | "javascript";
export type ProjectType =
	| "frontend"
	| "backend"
	| "fullstack"
	| "library"
	| "cli"; // Project Types
export type ProjectStructure =
	| "flat"
	| "src-folder"
	| "feature-based"
	| "domain-driven";
export type Formatter = "prettier" | "rome" | "none";
export type Linter = "eslint" | "biome" | "none";
export type TestRunner =
	| "vitest"
	| "jest"
	| "playwright"
	| "cypress"
	| "storybook"
	| "none";
export type Editor = "vscode" | "sublime" | "webstorm" | "cursor" | "none"; // Git editor preference
export type RepoVisibility = "public" | "private" | "internal"; // Repository visibility
export type CIProvider =
	| "github-actions"
	| "gitlab-ci"
	| "vercel"
	| "netlify"
	| "aws-pipeline"
	| "none";
export type PackageManager = "npm" | "pnpm" | "yarn" | "bun";
export type Validation = "zod" | "yup" | "none";
export interface CommonFrontendOptions {
	pwa?: boolean;
	i18n?: boolean;
	strictMode?: boolean;
	devServer?: boolean;
	validation?: Validation;
}
export type LicenseType =
	| "MIT"
	| "ISC"
	| "Apache-2.0"
	| "GPL-3.0"
	| "UNLICENSED"
	| "Proprietary"
	| "Custom";
