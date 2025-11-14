// packages/template-resolver/src/utils/templateSources/resolveLocalTemplate.ts

import fs from "fs-extra";
import path from "path";

export async function resolveLocalTemplate(
	sourcePath: string,
	tempDir: string,
) {
	const abs = path.resolve(sourcePath);
	await fs.copy(abs, tempDir, { overwrite: true });
	return { ok: true, type: "local", tempDir };
}
