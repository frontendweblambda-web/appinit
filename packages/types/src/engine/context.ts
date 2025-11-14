import type { Answers } from "../answers";

export type EngineContext = Answers & {
	cwd: string;
	targetDir: string;
	templateDir: string;
	configPath: string;

	// computed metadata
	packageManager: "npm" | "pnpm" | "yarn" | "bun";
	nodeVersion?: string;
};
