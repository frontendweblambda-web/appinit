import { Answers } from "./answers";

export interface AppInitSavedUserConfig {
	lastCreate: Answers;
	hostname?: string;
	ipAddress?: string;
	os?: string;
	nodeVersion?: string;
	packageManager?: string;
	editor?: string;
	lastProjectDir?: string;
	autoInstall?: boolean;
	autoStart?: boolean;
	aiAssistUsed?: boolean;
	cliVersion?: string;
	analyticsEnabled?: boolean;
	recentProjects?: string[];
	date: string; // ISO timestamp
	[key: string]: any; // Future-proof
}
