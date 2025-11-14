// packages/template-resolver/src/utils/readDirRecursive.ts

import fs from "fs-extra";
import path from "path";

export async function readDirRecursive(
	dir: string,
	prefix = "",
): Promise<string[]> {
	const output: string[] = [];

	const items = await fs.readdir(dir);
	for (const item of items) {
		const abs = path.join(dir, item);
		const rel = path.join(prefix, item);

		const stat = await fs.stat(abs);
		if (stat.isDirectory()) {
			const nested = await readDirRecursive(abs, rel);
			output.push(...nested);
		} else {
			output.push(rel.replace(/\\/g, "/"));
		}
	}

	return output;
}
