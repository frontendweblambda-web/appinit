// packages/template-resolver/src/utils/templateSources/downloadGitTemplate.ts

import degit from "degit";
import fs from "fs-extra";

export async function downloadGitTemplate(repo: string, tempDir: string) {
	await fs.ensureDir(tempDir);

	const emitter = degit(repo, { cache: false, force: true, verbose: false });
	await emitter.clone(tempDir);

	return { ok: true, type: "github", tempDir };
}
