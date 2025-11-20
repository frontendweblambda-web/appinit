import {
	detectSourceType,
	downloadGithubTemplate,
	downloadMarketTemplate,
	downloadNpmTemplate,
	downloadUrlTemplate,
	ensureDir,
	joinPath,
	pathExists,
	readDirRecursive,
	removeDir,
	resolveLocalTemplate,
} from "@appinit/utils";
import os from "node:os";
import path from "path";

import type { ResolvedTemplate, ResolveOptions } from "@appinit/types";

import fs from "node:fs/promises";
import { resolveBuiltinTemplate } from "./utils/builtin-map";
import { loadAppInitConfig } from "./utils/load-appinit-config";
import { loadHooks } from "./utils/load-hooks";
import { loadJsonIfExists } from "./utils/load-json-if-exists";
import { loadTemplateModule } from "./utils/load-template-module";
import { loadVariables } from "./utils/load-variable";
import { loadFile } from "./utils/loader-file";
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
	source: string,
	options: ResolveOptions,
): Promise<ResolvedTemplate> {
	const { cacheDir, projectName, answers, targetDir } = options;

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
		// copying base as it is here
		// no renaming and no transforming
		case "appinit":
			const builtinPath = await resolveBuiltinTemplate(
				source,
				options.answers?.projectType!,
			);

			// copy in tempDir
			await resolveLocalTemplate(type, builtinPath, tempDir);
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

	// ---- LOAD METADATA ----
	const templateJson = await loadJsonIfExists(
		joinPath(tempDir, "template.json"),
	);
	const registryJson = await loadJsonIfExists(
		joinPath(tempDir, "registry.json"),
	);
	const loadDocs = await loadFile(joinPath(tempDir, "docs/usage.md"));
	const packageJson = await loadJsonIfExists(
		joinPath(templateDir, "package.json__tmpl"),
	);

	// ---- LOAD MODULES ----
	const hooks = await loadHooks(tempDir);
	const variables = await loadVariables(tempDir);
	const appInitConfig = await loadAppInitConfig(templateDir);
	const templateModule = await loadTemplateModule(tempDir);

	// const templateModule = loadedModule?.default ?? null;
	// ----------------------------------------------
	// BUILD VIRTUAL FILE SYSTEM
	// ----------------------------------------------
	const vfs = new VFS();
	const entries = await readDirRecursive(templateDir);

	for (const rel of entries) {
		const full = joinPath(templateDir, rel);
		const stat = await fs.stat(full);
		if (!stat.isFile()) continue;

		const content = await fs.readFile(full, "utf8");

		// normalize
		const cleanPath = normalizeTemplatePath(rel);

		vfs.write(cleanPath, content);
	}

	// ---------------------------------
	// RETURN PURE RESOLVED TEMPLATE
	// ---------------------------------

	const result = {
		sourceType: type,
		sourceLocator: source,
		tempDir,
		templateDir,
		targetDir: targetDir!,
		registry: registryJson,
		templateJson,
		packageJson: {}, // tmpl => not load JSON
		templateModule,
		appInitConfig,
		hooks,
		variables,
		loadDocs,
		files: vfs.files,
	};

	return result;
}

function normalizeTemplatePath(rel: string): string {
	// remove template/ prefix
	rel = rel.replace(/^template[\\/]/, "");

	// remove config/ folder (if needed)
	if (rel.startsWith("config/")) {
		rel = rel.replace(/^config[\\/]/, "");
	}
	// common suffixes added to template files
	// examples: file.ts__tmpl, file.ts_tmpl, index.html.tmpl, config.json.tmpl, readme.md.tpl
	rel = rel.replace(
		/(\.([a-z0-9]+))?(?:__tmpl|_tmpl|\.tmpl|\.tpl|\.hbs)$/,
		"$1",
	);

	// normalize windows slashes
	rel = rel.replace(/\\/g, "/");

	return rel;
}
