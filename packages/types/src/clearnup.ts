export interface CleanupItem {
	path: string;
	type: "file" | "dir" | "unknown";
}

export interface RollbackContext {
	cwd: string;
	createdFiles: string[];
	createdDirs: string[];
}
