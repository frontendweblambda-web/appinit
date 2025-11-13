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
