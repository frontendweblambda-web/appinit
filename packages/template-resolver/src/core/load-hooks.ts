import { TemplateHooks } from "@appinit/types";
import { joinPath, pathExists } from "@appinit/utils";
import { pathToFileURL } from "node:url";

export async function loadHooks(templateDir: string) {
	const hooks: TemplateHooks = {};

	async function loadHook(filePath: string) {
		const url = pathToFileURL(filePath).href;
		const mod = await import(url);

		// Prefer default export
		if (typeof mod.default === "function") return mod.default;

		// Fallback: first exported function
		for (const key of Object.keys(mod)) {
			if (typeof mod[key] === "function") return mod[key];
		}

		console.warn(`⚠ Hook file ${filePath} does not export any function.`);
		return null;
	}

	const beforePath = joinPath(templateDir, "hooks/before.ts");
	const afterPath = joinPath(templateDir, "hooks/after.ts");

	if (await pathExists(beforePath)) {
		hooks.before = await loadHook(beforePath);
	}

	if (await pathExists(afterPath)) {
		hooks.after = await loadHook(afterPath);
	}

	return hooks;
}
