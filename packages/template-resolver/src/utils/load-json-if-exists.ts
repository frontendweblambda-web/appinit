// packages/template-resolver/src/utils/loadJsonIfExists.ts

import { pathExists, readJson } from "@appinit/utils";

export async function loadJsonIfExists(file: string) {
	if (!(await pathExists(file))) return null;
	try {
		return await readJson(file);
	} catch {
		return null;
	}
}
