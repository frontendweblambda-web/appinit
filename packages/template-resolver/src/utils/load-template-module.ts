// packages/template-resolver/src/utils/loadTemplateModule.ts

import path from "path";

import { pathExists } from "@appinit/utils";

export async function loadTemplateModule(tempDir: string) {
	const modulePath = path.join(tempDir, "appinit.template.ts");
	const modulePathJs = path.join(tempDir, "appinit.template.js");

	if (await pathExists(modulePathJs)) {
		return import(modulePathJs);
	}
	if (await pathExists(modulePath)) {
		return import(modulePath);
	}
	return null;
}
