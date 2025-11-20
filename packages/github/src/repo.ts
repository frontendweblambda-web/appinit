import { logger } from "@appinit/core";
import { CreateRepoOptions } from "@appinit/types";
import { exec } from "node:child_process";
import { promisify } from "node:util";
import { githubRequest } from "./github";

const run = promisify(exec);

export async function createGitHubRepo(opts: CreateRepoOptions) {
	logger.step(`Creating GitHub repository: ${opts.name}`);

	const repo = await githubRequest("/user/repos", {
		method: "POST",
		body: JSON.stringify({
			name: opts.name,
			private: opts.private ?? true,
			description: opts.description ?? "Created by Appinit",
		}),
	});

	return repo;
}

export async function setRemoteOrigin(cwd: string, url: string) {
	await run(`git remote remove origin || true`, { cwd });
	await run(`git remote add origin ${url}`, { cwd });
}

export async function pushInitialCommit(cwd: string) {
	await run(`git push -u origin main`, { cwd });
}
