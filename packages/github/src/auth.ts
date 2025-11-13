import { exec } from "node:child_process";
import { promisify } from "node:util";
import fs from "node:fs/promises";
import path from "node:path";
import { GitHubAuth } from "@appinit/types";

const run = promisify(exec);

export async function detectGitHubAuth(): Promise<GitHubAuth> {
	// 1 — Check env token
	if (process.env.GITHUB_TOKEN) {
		return { type: "token", token: process.env.GITHUB_TOKEN };
	}

	// 2 — Check GitHub CLI
	try {
		const { stdout } = await run("gh auth status");
		if (stdout.includes("Logged in")) {
			return { type: "gh-cli" };
		}
	} catch {}

	// 3 — Check SSH keys
	try {
		await fs.access(path.join(process.env.HOME || "~", ".ssh", "id_rsa"));
		return { type: "ssh" };
	} catch {}

	return { type: "none" };
}
