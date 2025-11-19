// packages/template-resolver/src/utils/templateSources/github.ts

import path from "path";

import { downloadZip, extractZip } from "./download-zip";
import { copySafe, pathExists, removeDir } from "./file";

export async function downloadGithubTemplate(repo: string, tempDir: string) {
	const [user, name] = repo.split("/");
	const branch = "main";

	const url = `https://codeload.github.com/${user}/${name}/zip/refs/heads/${branch}`;

	const zip = await downloadZip(url);
	await extractZip(zip, tempDir);

	// GitHub ZIPs wrap content in folder <repo>-<branch>/
	const root = path.join(tempDir, `${name}-${branch}`);

	if (await pathExists(root)) {
		await copySafe(root, tempDir, { overwrite: true });
		await removeDir(root);
	}

	return { ok: true, type: "github", tempDir };
}
