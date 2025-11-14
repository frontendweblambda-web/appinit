// packages/template-resolver/src/utils/templateSources/github.ts

import path from "path";
import fs from "fs-extra";
import { downloadZip, extractZip } from "./download-zip";

export async function downloadGithubTemplate(repo: string, tempDir: string) {
	const [user, name] = repo.split("/");
	const branch = "main";

	const url = `https://codeload.github.com/${user}/${name}/zip/refs/heads/${branch}`;

	const zip = await downloadZip(url);
	await extractZip(zip, tempDir);

	// GitHub ZIPs wrap content in folder <repo>-<branch>/
	const root = path.join(tempDir, `${name}-${branch}`);

	if (await fs.pathExists(root)) {
		await fs.copy(root, tempDir, { overwrite: true });
		await fs.remove(root);
	}

	return { ok: true, type: "github", tempDir };
}
