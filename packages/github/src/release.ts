import { githubRequest } from "./github";
import type { ReleaseOptions } from "@appinit/types";
import { logger } from "@appinit/utils";

export async function createRelease(repo: string, opts: ReleaseOptions) {
	logger.step(`Creating release: ${opts.tag}`);

	return githubRequest(`/repos/${repo}/releases`, {
		method: "POST",
		body: JSON.stringify({
			tag_name: opts.tag,
			name: opts.name ?? opts.tag,
			body: opts.body ?? "",
		}),
	});
}
