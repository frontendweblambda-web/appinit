import path from "path";
import fs from "fs-extra";
import type {
	ResolvedTemplate,
	TemplateContext,
	TemplateMeta,
} from "@appinit/types";

import { mergeJson } from "../utils/mergeJson";
import { loadTemplateModule } from "../utils/load-template-module";

/* -------------------------------------------------------------
 * LOAD FRAMEWORK TEMPLATE (react, vue, next, svelte, etc.)
 * ------------------------------------------------------------- */

export async function loadFrameworkTemplate(
	rootDir: string,
	framework: string,
	language: "TypeScript" | "JavaScript",
): Promise<ResolvedTemplate | null> {
	const baseDir = path.join(rootDir, "templates", framework);

	if (!fs.existsSync(baseDir)) {
		console.error(`❌ Framework template not found: ${framework}`);
		return null;
	}

	const templateDir = path.join(baseDir, "template");
	const hooksDir = path.join(baseDir, "hooks");

	const resolved: ResolvedTemplate = {
		source: "local",
		sourceLocator: `framework:${framework}`,
		tempDir: baseDir,
		templateDir,
		files: new Map(),
		meta: null,
		language,
		variables: {},
		hooks: {},
		packageJson: {},
		templateModule: undefined,
	};

	/* -------------------------------------------------------------
	 * 1. Load metadata (template.meta.json)
	 * ------------------------------------------------------------- */
	const metaPath = path.join(baseDir, "template.meta.json");
	if (fs.existsSync(metaPath)) {
		resolved.meta = await fs.readJSON(metaPath);
	}

	/* -------------------------------------------------------------
	 * 2. Load base package.json or package.json.fragment
	 * ------------------------------------------------------------- */
	const pkgPath = path.join(templateDir, "package.json");
	const pkgFragmentPath = path.join(templateDir, "package.json.fragment");

	if (fs.existsSync(pkgPath)) {
		resolved.packageJson = await fs.readJSON(pkgPath);
	} else if (fs.existsSync(pkgFragmentPath)) {
		resolved.packageJson = await fs.readJSON(pkgFragmentPath);
	}

	/* -------------------------------------------------------------
	 * 3. Load all template files into VFS map
	 * ------------------------------------------------------------- */
	if (fs.existsSync(templateDir)) {
		const allFiles = await fs.readdir(templateDir, { recursive: true });

		for (const file of allFiles) {
			const filePath = path.join(templateDir, file);
			if (!fs.statSync(filePath).isDirectory()) {
				const content = await fs.readFile(filePath, "utf8");
				resolved.files.set(file, content);
			}
		}
	}

	/* -------------------------------------------------------------
	 * 4. Load appinit.template.ts module
	 * ------------------------------------------------------------- */
	const templateModulePath = path.join(templateDir, "appinit.template.ts");
	if (fs.existsSync(templateModulePath)) {
		const loaded = await loadTemplateModule(templateModulePath);

		resolved.templateModule = {
			variables: loaded.variables ?? undefined,
			filter: loaded.filter ?? undefined,
			beforeWrite: loaded.beforeWrite ?? undefined,
			afterWrite: loaded.afterWrite ?? undefined,
		};
	}

	/* -------------------------------------------------------------
	 * 5. Load before/after hooks
	 * ------------------------------------------------------------- */

	const beforeHookPath = path.join(hooksDir, "before.ts");
	const afterHookPath = path.join(hooksDir, "after.ts");

	if (fs.existsSync(beforeHookPath)) {
		resolved.hooks!.before = (await loadTemplateModule(beforeHookPath)).default;
	}
	if (fs.existsSync(afterHookPath)) {
		resolved.hooks!.after = (await loadTemplateModule(afterHookPath)).default;
	}

	return resolved;
}

/* -------------------------------------------------------------
 * APPLY FRAMEWORK TEMPLATE (variables, lifecycle hooks)
 * ------------------------------------------------------------- */

export async function applyFrameworkTemplate(
	template: ResolvedTemplate,
	ctx: TemplateContext,
): Promise<ResolvedTemplate> {
	const mod = template.templateModule;

	/* -------------------------------------------------------------
	 * 1. Compute variables via appinit.template.ts
	 * ------------------------------------------------------------- */
	if (mod?.variables) {
		const computed = mod.variables(ctx);
		template.variables = {
			...(template.variables ?? {}),
			...(computed ?? {}),
		};
	}

	/* -------------------------------------------------------------
	 * 2. Run beforeWrite hook
	 * ------------------------------------------------------------- */
	if (mod?.beforeWrite) {
		await mod.beforeWrite(ctx);
	}

	return template;
}
