// packages/template-resolver/src/utils/loadJsonIfExists.ts

import { pathExists, readJsonSafe } from "@appinit/utils";

export async function loadJsonIfExists(file: string) {
	if (!(await pathExists(file))) return null;
	try {
		return await readJsonSafe(file);
	} catch {
		return null;
	}
}
