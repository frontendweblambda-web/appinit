import { joinPath, pathExists } from "@appinit/utils";
import { loadFile } from "./loader-file";

/**
 * Load template module
 * appinit.template.ts
 * @param tempDir
 * @returns
 */
export async function loadTemplateModule(tempDir: string) {
	const file = "appinit.template.ts";
	const fullPath = joinPath(tempDir, file);

	if (await pathExists(fullPath)) {
		const mod = await loadFile(fullPath);

		if (mod && typeof mod === "object") {
			return mod; // return loaded module
		}
	}
	console.warn(`⚠ No appinit.template.{js,mjs,cjs,ts} found in ${tempDir}`);
	return null;
}
