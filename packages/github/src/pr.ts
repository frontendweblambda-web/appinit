import { logger } from "@appinit/core";
import { githubRequest } from "./github";

export async function createPR(repo: string, title: string, body?: string) {
	logger.step(`Creating PR: ${title}`);

	return githubRequest(`/repos/${repo}/pulls`, {
		method: "POST",
		body: JSON.stringify({
			title,
			body: body ?? "Created via Appinit",
			head: "main",
			base: "main",
		}),
	});
}
