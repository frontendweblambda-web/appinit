export interface GitInitOptions {
	cwd: string;
	enable: boolean; // user chooses yes/no
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
export interface GitHubAuth {
	type: "token" | "gh-cli" | "ssh" | "none";
	token?: string;
}

export interface CreateRepoOptions {
	name: string;
	description?: string;
	private?: boolean;
}

export interface ReleaseOptions {
	tag: string;
	name?: string;
	body?: string;
}
