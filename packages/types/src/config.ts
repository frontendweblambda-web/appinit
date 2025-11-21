import { log } from "@clack/prompts";
import { LicenseType, outputMode, runtime } from "./common";
import { CLICommand } from "./flags";
import { PromptResult } from "./prompt";
import { SpinnerInstance } from "./spinner";

export type ProjectMeta = {
	projectName?: string;
	description?: string;
	author?: string;
	licenseType?: LicenseType;
	packageScope?: string | null;
	version?: string;
};

export type AppinitConfig = {
	// cli info + command
	command: string;
	cwd: string;
	cacheDir: string;
	cliName: string;
	cliVersion: string;
	runtime: runtime;
	outputMode: outputMode;
	interactive: boolean;
	// cli flags
	cliCommand?: CLICommand;
	skipDefaultPacks?: boolean;

	// clack/prompt
	sp?: SpinnerInstance;
	log?: typeof log;

	// previous
	config?: Record<string, any> | null;
	// saved config
	savedConfig?: Record<string, any> | null;
	// prompt result
	answers?: PromptResult;
};
