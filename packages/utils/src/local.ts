// packages/template-resolver/src/utils/templateSources/local.ts

import path from "path";
import { copySafe } from "./filesystem";

export async function resolveLocalTemplate(
	type: string,
	source: string,
	tempDir: string,
) {
	const abs = path.resolve(source);
	await copySafe(abs, tempDir);
	return { ok: true, type: type, tempDir };
}
