// packages/template-resolver/src/utils/templateSources/local.ts

import fs from "fs-extra";
import path from "path";

export async function resolveLocalTemplate(source: string, tempDir: string) {
	const abs = path.resolve(source);
	console.log("DIR", abs);
	await fs.copy(abs, tempDir, { overwrite: true });
	return { ok: true, type: "local", tempDir };
}
