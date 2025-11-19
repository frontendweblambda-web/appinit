// packages/template-resolver/src/utils/templateSources/local.ts

import path from "path";
import { copySafe } from "./file";

export async function resolveLocalTemplate(source: string, tempDir: string) {
	const abs = path.resolve(source);
	await copySafe(abs, tempDir);
	return { ok: true, type: "appinit", tempDir };
}
