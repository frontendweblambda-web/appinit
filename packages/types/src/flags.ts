import { ProjectType } from "./common";

export interface Flags {
	help?: boolean;
	version?: boolean;
	debug?: boolean;
	json?: string;
	nonInteractive?: boolean;
	skipInstall?: boolean;
	skipGit?: boolean;
	skipDefaultPacks?: boolean;

	// template
	template?: string;
	projectType?: ProjectType;
}

export type CLICommand = {
	name: string;
	args: string[];
	flags: Flags;
};
