export interface GitInitOptions {
	cwd: string;
	enable: boolean;
	initialCommitMessage?: string;
}
export interface GitOpContext {
	cwd: string;
	commit?: string;
}
export interface CommitInfo {
	hash: string;
	author: string;
	date: string;
	message: string;
}
