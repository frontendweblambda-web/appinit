import path from "path";
import fs from "fs-extra";
import type {
	TemplateContext,
	ResolvedTemplate,
	ChoiceOption,
	TemplateMeta,
} from "@appinit/types";

import { mergeJson } from "@types/utils";
import { mergeVfsMaps } from "../utils/mergeVfsMaps";
import { loadTemplateModule } from "../utils/load-template-module";

export interface UiPackLoadResult {
	files: Map<string, string>;
	packageFragment: Record<string, any>;
	hooks: {
		before?: (ctx: TemplateContext) => Promise<void>;
		after?: (ctx: TemplateContext) => Promise<void>;
	};
	meta?: TemplateMeta;
}

/* -------------------------------------------------------------
 * UI PACK LOADER
 * Loads:
 *  - ui/<framework>/<ui>/*
 *  - template.meta.json
 *  - package.json.fragment
 *  - hooks
 *  - template variables
 * ------------------------------------------------------------- */

export async function loadUiPack(
	projectRoot: string,
	framework: string,
	ui: string | undefined,
): Promise<UiPackLoadResult | null> {
	if (!ui || ui === "none") return null;

	const uiDir = path.join(projectRoot, "templates", "ui", framework, ui);

	if (!fs.existsSync(uiDir)) {
		console.warn(`⚠️ UI pack not found: ${framework}/${ui}`);
		return null;
	}

	const templateDir = path.join(uiDir, "template");
	const hooksDir = path.join(uiDir, "hooks");

	const result: UiPackLoadResult = {
		files: new Map(),
		packageFragment: {},
		hooks: {},
		meta: undefined,
	};

	/* -------------------------------------------------------------
	 * 1. Load template.meta.json
	 * ------------------------------------------------------------- */
	const metaPath = path.join(uiDir, "template.meta.json");
	if (fs.existsSync(metaPath)) {
		result.meta = await fs.readJSON(metaPath);
	}

	/* -------------------------------------------------------------
	 * 2. Load package.json.fragment
	 * ------------------------------------------------------------- */
	const pkgFragmentPath = path.join(uiDir, "package.json.fragment");
	if (fs.existsSync(pkgFragmentPath)) {
		result.packageFragment = await fs.readJSON(pkgFragmentPath);
	}

	/* -------------------------------------------------------------
	 * 3. Load template files into VFS map
	 * ------------------------------------------------------------- */
	if (fs.existsSync(templateDir)) {
		const allFiles = await fs.readdir(templateDir, { recursive: true });

		for (const filename of allFiles) {
			const full = path.join(templateDir, filename);
			if (!fs.statSync(full).isDirectory()) {
				const content = await fs.readFile(full, "utf8");
				result.files.set(filename, content);
			}
		}
	}

	/* -------------------------------------------------------------
	 * 4. Load hooks (before/after)
	 * ------------------------------------------------------------- */
	const beforeHook = path.join(hooksDir, "before.ts");
	const afterHook = path.join(hooksDir, "after.ts");

	if (fs.existsSync(beforeHook)) {
		result.hooks.before = (await loadTemplateModule(beforeHook)).default;
	}

	if (fs.existsSync(afterHook)) {
		result.hooks.after = (await loadTemplateModule(afterHook)).default;
	}

	return result;
}

/* -------------------------------------------------------------
 * APPLY UI PACK TO BASE TEMPLATE
 * ------------------------------------------------------------- */

export async function applyUiPack(
	base: ResolvedTemplate,
	uiPack: UiPackLoadResult | null,
	ctx: TemplateContext,
): Promise<ResolvedTemplate> {
	if (!uiPack) return base;

	/* -------------------------------------------------------------
	 * 1. Merge VFS
	 * ------------------------------------------------------------- */
	base.files = mergeVfsMaps(base.files, uiPack.files);

	/* -------------------------------------------------------------
	 * 2. Merge package.json fragment
	 * ------------------------------------------------------------- */
	if (uiPack.packageFragment && base.packageJson) {
		base.packageJson = mergeJson(base.packageJson, uiPack.packageFragment);
	}

	/* -------------------------------------------------------------
	 * 3. Add UI metadata variables
	 * ------------------------------------------------------------- */
	if (uiPack.meta) {
		base.variables = {
			...(base.variables ?? {}),
			...(uiPack.meta.variables ?? {}),
			ui: ctx.ui,
		};
	}

	/* -------------------------------------------------------------
	 * 4. Run before-hook
	 * ------------------------------------------------------------- */
	if (uiPack.hooks.before) {
		await uiPack.hooks.before(ctx);
	}

	/* -------------------------------------------------------------
	 * 5. Attach after-hook to run later
	 * ------------------------------------------------------------- */
	if (uiPack.hooks.after) {
		base.hooks = base.hooks || {};
		base.hooks.after = uiPack.hooks.after;
	}

	return base;
}
