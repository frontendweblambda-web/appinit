export interface Flags {
	help?: boolean;
	version?: boolean;
	debug?: boolean;
	json?: boolean;
	nonInteractive?: boolean;

	// Project basics
	projectName?: string;
	description?: string;
	author?: string;
	license?: string;

	// Technical overrides
	projectType?: string;
	language?: string;
	framework?: string;
	ui?: string;
	routing?: string;
	store?: string;
	backend?: string;

	verbose?: boolean;
	quiet?: boolean;
	noConsole?: boolean;
	ignoreConfig?: boolean;

	// Project Setup
	targetDir?: string;

	workspace?: string;
	lang?: string;
	architecture?: string;
	packageManager?: string;
	template?: string;
	testing?: string;
	linting?: boolean;
	formatting?: boolean;
	commitConventions?: boolean;
	saveConfig?: boolean;
	// Frontend

	forms?: string;
	animation?: string;
	pwa?: boolean;
	i18n?: boolean;
	validation?: string;

	// Backend
	runtime?: string;

	apiStyle?: string;
	database?: string;
	orm?: string;
	cache?: string;
	queue?: string;
	serverless?: string;
	docker?: boolean;
	logging?: boolean;
	monitoring?: boolean;
	strict?: boolean;

	// Auth
	auth?: string;

	// Deploy & CI
	deploy?: string | boolean;
	deployStrategy?: string;
	deployFrontend?: string;
	deployBackend?: string;
	ci?: boolean;
	monitor?: boolean;
	analytics?: boolean;

	// Tooling
	formatter?: string;
	linter?: string;
	test?: string;
	buildTool?: string;
	editor?: string;
	commit?: boolean;

	// Features
	features?: string[]; // comma-separated → array

	// AI
	ai?: boolean;
	aiMode?: string;
	aiEnhance?: boolean;
	aiScaffold?: boolean;

	// Install / Git
	install?: boolean;
	skipInstall?: boolean;
	git?: boolean;
	noGit?: boolean;

	// Plugins
	plugin?: string | string[];
	removePlugin?: string;

	authProvider?: string[];
	multiTenant?: boolean;
	mfa?: boolean;

	modules?: string[];

	market?: boolean;
	registry?: string;
	registryAuth?: boolean;
	source?: string;

	createRemote?: boolean;
	remoteOrg?: boolean;
	repoVisibility?: string;

	setupCI?: boolean;
	ciProvider?: boolean;
	setupCD?: boolean;

	structure?: string;

	packageScope?: string;
}

export type FlagOption = Flags & {
	/** Accepts repeated flags:  --modules a --modules b */
	modules?: string[];

	/** Accepts repeated plugin flags:  --plugin auth --plugin analytics */
	plugin?: string[];

	/** Custom runtime env:  --env prod */
	env?: string;

	/** Marketplace-specific flags */
	market?: boolean;

	/** Upgrade support: --upgrade or --upgrade latest */
	upgrade?: string | boolean;

	/** Cloud support */
	cloud?: boolean;

	/** Enable sync mode */
	sync?: boolean;

	/** Machine/agent mode */
	machine?: string;

	/** Force prompt pack */
	prompt?: string;
};

export type CLICommand = {
	/** e.g. create, add, doctor, deploy */
	name: string;

	/** Positional args: appinit create myapp */
	args: string[];

	/** Fully normalized, final flag map */
	flags: FlagOption;
};
