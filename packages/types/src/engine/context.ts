import type { Answers } from "../answers.js";

export interface EngineContext extends Answers {
	cwd: string;
	targetDir: string;
	templateDir: string;
	configPath: string;

	// computed metadata
	packageManager: "npm" | "pnpm" | "yarn" | "bun";
	nodeVersion?: string;
}
