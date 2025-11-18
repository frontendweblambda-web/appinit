import { Answers } from "./answers";

export interface Flags {
	// 💻 Core CLI Behavior
	help?: boolean;
	version?: boolean;
	verbose?: boolean;
	quiet?: boolean;
	json?: boolean; // Output results as JSON
	debug?: boolean;
	nonInteractive?: boolean; // Crucial for CI/scripting

	cwd?: string; // Current working directory (where command is run)
	targetDir?: string; // New: Directory name for the project (prevents ambiguity with 'dir')
	projectType?: string;
	workspace?: string;
	lang?: string;
	architecture?: string;

	template?: string;
	framework?: string;
	ui?: string;
	stack?: string;
	packageManager?: string;

	install?: boolean;
	skipInstall?: boolean;
	git?: boolean;
	noGit?: boolean;

	plugin?: string | string[];
	removePlugin?: string;

	ci?: boolean;
	deploy?: string;
	infra?: string;
	registry?: string;
	registryAuth?: boolean;
	source?: string;

	ai?: boolean;
	aiMode?: string;

	experimental?: boolean;
	trace?: boolean;
	dryRun?: boolean;

	answers?: Partial<Answers>;

	features?: string[]; // New: Comma-separated list of features to enable (e.g., --features=docker,telemetry)
	buildTool?: string; // New: Override build tool (e.g., --buildTool=esbuild)
	[key: string]: any; // extensible for plugins
}
