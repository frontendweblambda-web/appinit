// packages/template-resolver/src/utils/templateSources/local.ts

import { ProjectType } from "@appinit/types";
import { copySafe, pathExists } from "@appinit/utils";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function resolveLocalTemplate(
	source: string,
	projectType: ProjectType,
	tempDir: string,
) {
	const name = source.replace(/^appinit:/, "");
	const root = path.join(__dirname, "..", "..", "..");

	// Support both src and dist transparently
	const srcPath = path.join(
		root,
		"packages",
		"templates",
		"src",
		"base",
		projectType,
		name,
	);

	if (!(await pathExists(srcPath))) return null;

	const template = path.resolve(srcPath);
	await copySafe(template, tempDir);
	return { ok: true, type: name, tempDir };
}
