import { pathExists } from "@appinit/utils";
import path from "path";
import { loadFile } from "./loader-file";

export async function loadVariables(tempDir: string) {
	let variables = {
		defaults: {},
		schema: {},
		transform: null,
	};

	try {
		const defaultVarsPath = path.join(tempDir, "variables/default.ts");
		const schemaPath = path.join(tempDir, "variables/schema.ts");
		const transformPath = path.join(tempDir, "variables/transform.ts");

		if (await pathExists(defaultVarsPath)) {
			const result = await loadFile(defaultVarsPath);

			variables.defaults = result ?? {};
		}

		if (await pathExists(schemaPath)) {
			variables.schema = (await loadFile(schemaPath)) ?? {};
		}

		if (await pathExists(transformPath)) {
			variables.transform = (await loadFile(transformPath)) ?? {};
		}
	} catch (err) {
		console.error("⚠ Error loading variables modules", err);
	}
	return variables;
}
