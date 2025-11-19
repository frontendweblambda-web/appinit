// packages/template-resolver/src/utils/readDirRecursive.ts

import { isDirectory, joinPath, readDir } from "@appinit/utils";

export async function readDirRecursive(
	dir: string,
	prefix = "",
): Promise<string[]> {
	const output: string[] = [];

	const items = await readDir(dir);
	for (const item of items) {
		const abs = joinPath(dir, item);
		const rel = joinPath(prefix, item);

		if (await isDirectory(abs)) {
			const nested = await readDirRecursive(abs, rel);
			output.push(...nested);
		} else {
			output.push(rel.replace(/\\/g, "/"));
		}
	}

	return output;
}
