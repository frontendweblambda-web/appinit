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
	TemplateContext,
	TemplateMeta,
} from "@appinit/types";

import { logger } from "@appinit/core";
import { resolveBuiltinTemplate } from "./utils/builtin-map";
import { loadJsonIfExists } from "./utils/load-json-if-exists";
import { loadTemplateModule } from "./utils/load-template-module";
import { normalizePath } from "./utils/normalize-path";

/**
 * Used to resolve template
 * @param source
 * @param options
 * @returns
 */
export async function templateResolver(
	source: string, // appinit:react, appinit:vue, appinit:express etc
	options: ResolveOptions,
): Promise<ResolvedTemplate> {
	const { cwd = process.cwd(), cacheDir, projectName, answers } = options;

	// Temp directory for unpacked template
	const tempDir = path.join(
		cacheDir ?? path.join(os.homedir(), ".appinit/cache"),
		"temp",
		answers?.projectType ?? "frontend",
		projectName,
	);
	await removeDir(tempDir);
	await ensureDir(tempDir);

	// source type: [appinit, github, npm, market, https,http]
	const type = detectSourceType(source); // default appinit

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

	console.log("-----META + PKG-----", meta, packageJson);

	// LOAD TEMPLATE MODULE
	const templateModule = await loadTemplateModule(templateDir);

	// ----------------------------------------------
	// BUILD VIRTUAL FILE SYSTEM
	// ----------------------------------------------
	const files = new Map<string, string>();
	const entries = await readDirRecursive(tempDir);

	// console.log("ENTRIES", entries);

	for (const relPath of entries) {
		if (relPath.startsWith("node_modules")) continue;

		const fullPath = joinPath(tempDir, relPath);
		const stat = await fs.stat(fullPath);

		if (!stat.isFile()) continue;

		const content = await fs.readFile(fullPath, "utf8");
		files.set(normalizePath(relPath), content);
	}

	// ----------------------------------------------
	// PREPARE LANGUAGE MODE
	// ----------------------------------------------
	const language =
		options.language === "javascript" ? "javascript" : "typescript";

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
			log: logger,
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
			log: logger,
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
