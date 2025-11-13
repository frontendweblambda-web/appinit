export interface InstallOptions {
	cwd?: string;
	deps?: string[];
	devDeps?: string[];
	retry?: number;
	stdout?: boolean;
}

export interface InstallResult {
	success: boolean;
	installedDeps?: string[];
	installedDevDeps?: string[];
}
