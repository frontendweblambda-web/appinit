import { joinPath, pathExists } from "@appinit/utils";
import { pathToFileURL } from "node:url";

export async function loadTemplateModule(templateDir: string) {
	const moduleTs = joinPath(templateDir, "appinit.template.ts");
	const moduleJs = joinPath(templateDir, "appinit.template.js");

	// Convert to file URL before import
	const load = async (filePath: string) => {
		const fileUrl = pathToFileURL(filePath).href;
		return import(fileUrl);
	};

	if (await pathExists(moduleTs)) return await load(moduleTs);
	if (await pathExists(moduleJs)) return await load(moduleJs);

	console.log("⚠ No appinit.template.ts|js found");
	return null;
}
