// packages/template-resolver/src/helpers/builtin-map.ts
import { ProjectType } from "@appinit/types";
import { pathExists } from "@appinit/utils";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function resolveBuiltinTemplate(
	source: string,
	type: ProjectType,
) {
	const name = source.replace(/^appinit:/, "");

	// Locate templates relative to the template-resolver package root
	// ../../../ gets you from helpers/builtin-map.ts → template-resolver root
	const root = path.join(__dirname, "..", "..", "..");

	// Support both src and dist transparently
	const srcPath = path.join(
		root,
		"packages",
		"templates",
		"src",
		"base",
		type,
		name,
	);
	const distPath = path.join(
		root,
		"packages",
		"templates",
		"src",
		"base",
		type,
		name,
	);

	try {
		if (await pathExists(srcPath)) {
			return srcPath;
		}
		return distPath;
	} catch {
		return distPath;
	}
}
