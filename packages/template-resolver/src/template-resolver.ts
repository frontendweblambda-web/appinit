import {
	detectSourceType,
	downloadGithubTemplate,
	downloadMarketTemplate,
	downloadNpmTemplate,
	downloadUrlTemplate,
	ensureDir,
	joinPath,
	pathExists,
	removeDir,
	resolveLocalTemplate,
} from "@appinit/utils";
import fs from "fs-extra";
import os from "node:os";
import path from "path";

import { readDirRecursive } from "./utils/read-dir-recursive";

import type {
	ResolvedTemplate,
	ResolveOptions,
	TemplateMeta,
} from "@appinit/types";

import { resolveBuiltinTemplate } from "./utils/builtin-map";
import { loadJsonIfExists } from "./utils/load-json-if-exists";
import { loadTemplateModule } from "./utils/load-template-module";
import { VFS } from "./vfs";

/**
 * Template Resolver — PURE FUNCTION
 * --------------------------------
 * Responsible ONLY for:
 *  - detecting template source
 *  - downloading / copying template into temp dir
 *  - locating templateDir
 *  - loading metadata + logic module
 *  - building an in-memory VFS (Map<string,string>)
 *
 * NO HOOK EXECUTION
 * NO VARIABLE COMPUTATION
 * NO FILE WRITING
 * NO RENAME/FILTER LOGIC
 */
export async function templateResolver(
	source: string, // appinit:react, appinit:vue, appinit:express etc
	options: ResolveOptions,
): Promise<ResolvedTemplate> {
	const { cacheDir, projectName, answers } = options;

	// Temp directory for unpacked template
	const tempDir = path.join(
		cacheDir ?? path.join(os.homedir(), ".appinit/cache"),
		"temp",
		answers?.projectType ?? "frontend",
		projectName,
	);
	await removeDir(tempDir);
	await ensureDir(tempDir);

	// source type: [appinit, github, npm, market, https,http], default appinit
	const type = detectSourceType(source);

	// ----------------------------------------------
	// DOWNLOAD / RESOLVE TEMPLATE
	// ----------------------------------------------
	switch (type) {
		case "appinit":
			const builtinPath = await resolveBuiltinTemplate(
				source,
				options.answers?.projectType!,
			);
			await resolveLocalTemplate(builtinPath, tempDir);
			break;

		case "github":
			await downloadGithubTemplate(source.replace(/^github:/, ""), tempDir);
			break;

		case "npm":
			await downloadNpmTemplate(source.replace(/^npm:/, ""), tempDir);
			break;

		case "url":
			await downloadUrlTemplate(source, tempDir);
			break;

		case "market":
			await downloadMarketTemplate(source.replace(/^market:/, ""), tempDir);
			break;

		default:
			throw new Error(`Unsupported template source: ${source}`);
	}

	const templateDir = path.join(tempDir, "template");
	if (!(await pathExists(templateDir))) {
		throw new Error(
			`❌ Template folder not found: ${templateDir}\n` +
				`Your template package must contain a "template/" directory.`,
		);
	}

	// ----------------------------------------------
	// LOAD TEMPLATE META
	// ----------------------------------------------
	const metaCandidates = [
		joinPath(templateDir, "appinit.template.json"),
		joinPath(templateDir, "template.meta.json"),
	];

	let meta: TemplateMeta | null = null;
	for (const p of metaCandidates) {
		meta = await loadJsonIfExists(p);
		if (meta) break;
	}

	const packageJson = await loadJsonIfExists(joinPath(tempDir, "package.json"));

	// LOAD TEMPLATE MODULE
	const templateModule = await loadTemplateModule(templateDir);

	// ----------------------------------------------
	// BUILD VIRTUAL FILE SYSTEM
	// ----------------------------------------------
	const vfs = new VFS();
	const entries = await readDirRecursive(tempDir);

	for (const relPath of entries) {
		if (relPath.startsWith("node_modules")) continue;

		const fullPath = joinPath(tempDir, relPath);
		const stat = await fs.stat(fullPath);

		if (!stat.isFile()) continue;

		const content = await fs.readFile(fullPath, "utf8");

		vfs.write(relPath, content);
	}

	// ---------------------------------
	// RETURN PURE RESOLVED TEMPLATE
	// ---------------------------------
	return {
		source: type,
		sourceLocator: source,

		tempDir,
		templateDir, // IMPORTANT: now correct

		files: vfs.files,

		meta,
		packageJson,
		templateModule,

		language: options.language,
		variables: {}, // engine will fill this later
	};
}
