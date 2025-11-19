import { TemplateSource } from "@appinit/types";
import { fileURLToPath } from "url";
import path from "path";

export function detectSourceType(source: string): TemplateSource {
	if (source.startsWith("github:")) return "github";
	if (source.startsWith("npm:")) return "npm";
	if (source.startsWith("market:")) return "market";
	if (source.startsWith("http://") || source.startsWith("https://"))
		return "url";
	return "appinit";
}

/**
 * Auto-detect the root of @appinit/templates.
 */

export async function findTemplatesRoot(): Promise<string> {
	try {
		// Works in npm install, pnpm workspace, yarn workspace
		const resolvedUrl = import.meta.resolve("@appinit/templates");
		const resolvedPath = fileURLToPath(resolvedUrl);

		// resolved path points inside dist: .../templates/dist/index.js
		// so return the parent folder
		return path.dirname(resolvedPath);
	} catch (e) {
		console.error("❌ Cannot resolve @appinit/templates via Node resolver", e);
		throw new Error("AppInit: Cannot locate @appinit/templates.");
	}
}
