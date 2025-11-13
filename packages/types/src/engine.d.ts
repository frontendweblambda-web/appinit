import type { Answers } from "./answers.js";
/**
 * Extended internal context used by the Engine during execution.
 * Enriched version of `Answers` with computed paths, versions, etc.
 */
export interface EngineContext extends Answers {
	cwd: string;
	targetDir: string;
	templateDir: string;
	configPath: string;
}
