import fs from "fs-extra";
import { pathToFileURL } from "url";
export async function loadAppinitConfig(configPath = "appinit.config.ts") {
	if (!(await fs.pathExists(configPath))) {
		throw new Error(`No appinit.config.ts found at ${configPath}`);
	}
	const moduleUrl = pathToFileURL(configPath).href;
	const mod = await import(moduleUrl);
	const config =
		typeof mod.default === "function" ? await mod.default() : mod.default;
	return config;
}
