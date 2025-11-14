// packages/template-resolver/src/templateResolver.ts

import path from "path";
import fs from "fs-extra";

import {
	downloadGithubTemplate,
	downloadMarketTemplate,
	downloadNpmTemplate,
	downloadUrlTemplate,
	resolveLocalTemplate,
} from "@appinit/utils";

import { readDirRecursive } from "./utils/read-dir-recursive";

import type {
	TemplateSource,
	ResolveOptions,
	TemplateMeta,
	ResolvedTemplate,
	TemplateContext,
} from "@appinit/types";

import { mergeJson } from "@appinit/utils";
import { loadJsonIfExists } from "./utils/load-json-if-exists";
import { loadTemplateModule } from "./utils/load-template-module";
import { normalizePath } from "./utils/normalize-path";

export async function resolveTemplate(
	source: string,
	options: ResolveOptions,
): Promise<ResolvedTemplate> {
	const { cwd = process.cwd(), cacheDir, projectName } = options;

	// Temp directory for unpacked template
	const tempDir = path.join(cacheDir ?? path.join(cwd, ".appinit"), "temp");
	await fs.remove(tempDir);
	await fs.ensureDir(tempDir);

	// ----------------------------------------------
	// DETECT SOURCE TYPE
	// ----------------------------------------------

	const type: TemplateSource = detectSourceType(source);

	// ----------------------------------------------
	// DOWNLOAD / RESOLVE TEMPLATE
	// ----------------------------------------------
	switch (type) {
		case "local":
			await resolveLocalTemplate(source, tempDir);
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

	// ----------------------------------------------
	// LOAD TEMPLATE META
	// ----------------------------------------------
	const templateJsonPath = path.join(tempDir, "appinit.template.json");
	const packageJsonPath = path.join(tempDir, "package.json");

	const meta = (await loadJsonIfExists(
		templateJsonPath,
	)) as TemplateMeta | null;

	const packageJson = await loadJsonIfExists(packageJsonPath);

	// ----------------------------------------------
	// LOAD TEMPLATE MODULE
	// ----------------------------------------------
	const templateModule = await loadTemplateModule(tempDir);

	// ----------------------------------------------
	// BUILD VIRTUAL FILE SYSTEM
	// ----------------------------------------------
	const files = new Map<string, string>();
	const entries = await readDirRecursive(tempDir);

	for (const relPath of entries) {
		if (relPath.startsWith("node_modules")) continue;

		const fullPath = path.join(tempDir, relPath);
		const stat = await fs.stat(fullPath);

		if (!stat.isFile()) continue;

		const content = await fs.readFile(fullPath, "utf8");
		files.set(normalizePath(relPath), content);
	}

	// ----------------------------------------------
	// PREPARE LANGUAGE MODE
	// ----------------------------------------------
	const language =
		options.language === "JavaScript" ? "JavaScript" : "TypeScript";

	// ----------------------------------------------
	// COMPOSE RESOLVED TEMPLATE
	// ----------------------------------------------
	const resolved: ResolvedTemplate = {
		source: type,
		sourceLocator: source,

		tempDir,
		templateDir: tempDir,
		files,

		meta,
		packageJson,
		templateModule,

		language,

		variables: {},
	};

	// ----------------------------------------------
	// COMPUTE VARIABLES (if module exports .variables)
	// ----------------------------------------------
	if (templateModule?.variables) {
		resolved.variables = await templateModule.variables({
			targetDir: "",
			projectName,
			answers: options.answers ?? {},
			language,
			files,
			variables: {},
			log: silentLogger,
			framework: options.framework,
			ui: options.ui,
			inlineVariables: options.inlineVariables,
			tempDir,
			templateDir: tempDir,
			meta,
			fs,
		} as TemplateContext);
	}

	// ----------------------------------------------
	// HOOK: beforeWrite
	// ----------------------------------------------
	if (templateModule?.beforeWrite) {
		await templateModule.beforeWrite({
			targetDir: "",
			projectName,
			answers: options.answers ?? {},
			language,
			files,
			variables: resolved.variables,
			log: silentLogger,
			framework: options.framework,
			ui: options.ui,
			inlineVariables: options.inlineVariables,
			tempDir,
			templateDir: tempDir,
			meta,
			fs,
		} as TemplateContext);
	}

	return resolved;
}

// ------------------------------------------------------------------
// Utilities
// ------------------------------------------------------------------

function detectSourceType(source: string): TemplateSource {
	if (source.startsWith("github:")) return "github";
	if (source.startsWith("npm:")) return "npm";
	if (source.startsWith("market:")) return "market";
	if (source.startsWith("http://") || source.startsWith("https://"))
		return "url";

	// Otherwise → local path
	return "local";
}

const silentLogger = {
	info() {},
	warn() {},
	error(msg: string) {
		console.error(msg);
	},
};
