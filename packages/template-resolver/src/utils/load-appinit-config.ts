import { joinPath, pathExists } from "@appinit/utils";
import { loadFile } from "./loader-file";

/**
 * Appinit.config.ts
 * @param templateDir
 * @returns
 */
export async function loadAppInitConfig(templateDir: string) {
	const moduleTs = joinPath(templateDir, "appinit.config.ts.ejs");

	if (await pathExists(moduleTs)) return await loadFile(moduleTs);
	return null;
}
