import { pathExists, readFileUtf8 } from "@appinit/utils";
import path from "node:path";
import { pathToFileURL } from "url";

/**
 * Load file
 * @param path
 * @returns
 */
export async function loadFile(filePath: string) {
	if (!(await pathExists(filePath))) {
		console.warn(`⚠ File not found: ${filePath}`);
		return null;
	}

	const ext = path.extname(filePath).toLowerCase();

	switch (ext) {
		case ".js":
		case ".mjs":
		case ".cjs":
		case ".ts":
			return await import(pathToFileURL(filePath).href);

		case ".json":
			return JSON.parse(await readFileUtf8(filePath));

		case ".md":
		case ".txt":
		case ".yaml":
		case ".yml":
			return await readFileUtf8(filePath);

		default:
			// Return buffer for unknown binary types
			return await readFileUtf8(filePath);
	}
}
