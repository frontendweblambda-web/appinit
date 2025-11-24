import {
	AppinitConfig,
	ResolvedTemplate,
	TemplateConfig,
	TemplateMetaJson,
} from "@appinit/types";
import {
	ensureDir,
	joinPath,
	pathExists,
	readDirRecursive,
	readFileUtf8,
	readJson,
	removeDir,
} from "@appinit/utils";
import fs from "node:fs/promises";
import path from "node:path";
import { loadHooks } from "./core/load-hooks";
import { loadVariables } from "./core/load-variable";
import { resolveLocalTemplate } from "./core/resolve-local-template";
import { templateSource } from "./core/template-source-type";
import { resolveVariables } from "./resolver/resolve-variables";
import { selectBaseTemplate } from "./select-template";
import { shouldIgnore } from "./utils/ignore";
import { loadTemplateModule } from "./utils/load-template-module";
import { normalizeTemplateFilePath } from "./utils/normalize-file-path";
import { normalizePath } from "./utils/normalize-path";
import { applyRename } from "./utils/rename-file";
import { renderTemplate } from "./utils/render-template";
import { shouldIncludeByFilters } from "./utils/should-include-by-filter";
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
export async function templateResolver(config: AppinitConfig) {
	const { cacheDir, answers, targetDir } = config;

	// selecte template source
	const source = selectBaseTemplate(answers!);

	// 1. Template dir
	const tempDir = path.join(
		cacheDir,
		"temp",
		answers?.projectType ?? "frontend",
		answers?.projectName!,
	);

	await removeDir(tempDir);
	await ensureDir(tempDir);

	// 2. Detect source type
	const type = templateSource(source);
	switch (type) {
		case "appinit":
			await resolveLocalTemplate(
				source,
				answers?.projectType ?? "frontend",
				tempDir,
			);
			break;
		case "github":
			//	await downloadGithubTemplate(source.replace(/^github:/, ""), tempDir);
			break;

		case "npm":
			//await downloadNpmTemplate(source.replace(/^npm:/, ""), tempDir);
			break;

		case "url":
			//await downloadUrlTemplate(source, tempDir);
			break;

		case "market":
			//await downloadMarketTemplate(source.replace(/^market:/, ""), tempDir);
			break;
		default:
			throw new Error(`Unsupported template source: ${source}`);
	}

	// 3. Template directory
	const templateDir = joinPath(tempDir, "template");
	if (!(await pathExists(templateDir))) {
		throw new Error(
			`❌ Template folder not found: ${templateDir}\n` +
				`Your template package must contain a "template/" directory.`,
		);
	}

	// 4.1 appinit.template.json → static template metadata
	const templateJson: Record<string, any> =
		(await readJson(joinPath(templateDir, "appinit.template.json"))) ?? null;

	// 4.2 template.meta.json → root folder, rename rules, ignore
	const templateMeta: TemplateMetaJson =
		(await readJson(joinPath(templateDir, "template.meta.json"))) ?? {};

	//  root folder
	const rootFolder = templateMeta.root || "base"; // support both
	const renameRules: Record<string, string> = templateMeta.rename ?? {};
	const ignorePatterns: string[] = templateMeta.ignore ?? [];

	// 4.3 Load template logic module (appinit.template.ts)
	const templateModules = await loadTemplateModule(templateDir); // module object
	const templateConfig: TemplateConfig =
		templateModules?.default ?? templateModules ?? {};

	// 4.4 Load variables modules (defaults, schema, transform)
	const variables = await loadVariables(templateDir);
	// 4.5 Load hooks (before/after) — but DO NOT RUN them here
	const hooks = await loadHooks(templateDir);

	// 4.6 Optional docs (docs/usage.md)
	const docsPath = joinPath(tempDir, "docs/usage.md");
	const docs = (await pathExists(docsPath))
		? await readFileUtf8(docsPath)
		: null;

	const resolvedVariables = await resolveVariables(variables, answers ?? {}, {
		templateDir,
		tempDir,
		targetDir,
		templateJson,
	});

	// Context passed to filters/injection/etc
	const ctx = {
		variables: resolvedVariables,
		answers: answers ?? {},
		templateDir,
		tempDir,
		targetDir,
		templateJson,
	};

	const vfs = new VFS();
	const baseDir = joinPath(templateDir, rootFolder);

	if (!(await pathExists(baseDir))) {
		throw new Error(
			`❌ rootFolder "${rootFolder}" not found inside template. Expected at: ${baseDir}`,
		);
	}

	// Read all files inside rootFolder (e.g. base/)
	const entries = await readDirRecursive(baseDir);

	console.log("entries", entries);
	for (const rel of entries) {
		const absPath = joinPath(baseDir, rel);

		const stat = await fs.stat(absPath);
		if (!stat.isFile()) continue;

		const relNormalized = normalizePath(rel); // unix-style: src/App.tsx__tmpl

		// 6.1 Ignore patterns from template.meta.json
		if (shouldIgnore(relNormalized, ignorePatterns)) continue;

		const filters = templateConfig.filters ?? {};

		// 6.2 Filters from appinit.template.ts (optional)
		if (!shouldIncludeByFilters(relNormalized, filters, ctx)) {
			continue;
		}

		// Read raw content
		let content: string = await readFileUtf8(absPath);

		// 6.3 Handle __tmpl / _tmpl / .tmpl / .tpl / .hbs suffixes
		const { outputPath, isTemplateFile } =
			normalizeTemplateFilePath(relNormalized);

		if (isTemplateFile) {
			content = renderTemplate(content, resolvedVariables);
		}

		// 6.4 Apply rename rules (_gitignore → .gitignore, etc.)
		const finalPath = applyRename(outputPath, renameRules);

		// Write to VFS
		vfs.write(finalPath, content);
	}

	const result: ResolvedTemplate = {
		tempDir,
		templateDir,
		targetDir,
		templateJson,
		templateMeta,
		templateConfig: templateConfig,
		variables: resolvedVariables,
		hooks,
		docs: docs!,
		files: vfs.files,
	};

	return result;
}
