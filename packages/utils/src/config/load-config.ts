import path from "path";

import { logger } from "../logger";
import { exists } from "../exists";

export async function loadConfig(
	projectRoot: string,
	fileNames = ["appinit.config.mjs", "appinit.config.js", "appinit.config.cjs"],
) {
	for (const name of fileNames) {
		const full = path.join(projectRoot, name);
		if (await exists(full)) {
			logger.debug("Loading config", full);
			// dynamic import works for ESM .mjs and .js when node resolves them
			const imported = await import(full);
			return imported.default ?? imported;
		}
	}

	logger.debug("No config found in", projectRoot);
	return null;
}
