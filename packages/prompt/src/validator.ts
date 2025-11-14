// packages/prompt/src/template-validator.ts
import fs from "fs-extra";
import path from "node:path";

import type { PromptQuestion, PromptPack } from "@appinit/types";

export interface TemplateValidationResult {
	ok: boolean;
	errors: string[];
	warnings: string[];
}

/* -------------------------------------------------------------
 * Public API: Validate a full template directory
 * ------------------------------------------------------------- */
export async function validateTemplateDirectory(
	templateRoot: string,
): Promise<TemplateValidationResult> {
	const errors: string[] = [];
	const warnings: string[] = [];

	// 1. Basic structure checks
	if (!(await fs.pathExists(templateRoot))) {
		errors.push(`Template directory does not exist: ${templateRoot}`);
		return { ok: false, errors, warnings };
	}

	// 2. Look for appinit.template.json
	const jsonPath = path.join(templateRoot, "appinit.template.json");
	if (await fs.pathExists(jsonPath)) {
		const result = await validateTemplateJSON(jsonPath);
		errors.push(...result.errors);
		warnings.push(...result.warnings);
	} else {
		warnings.push(`No appinit.template.json found. This is optional.`);
	}

	// 3. Validate default module: prompt.ts / prompt.js
	const moduleFiles = [
		"prompt.ts",
		"prompt.js",
		"prompt.mjs",
		"prompt.cjs",
		"prompt.mts",
	];

	for (const file of moduleFiles) {
		const abs = path.join(templateRoot, file);
		if (await fs.pathExists(abs)) {
			const modResult = await validatePromptModule(abs);
			errors.push(...modResult.errors);
			warnings.push(...modResult.warnings);
		}
	}

	return {
		ok: errors.length === 0,
		errors,
		warnings,
	};
}

/* -------------------------------------------------------------
 * Validate appinit.template.json
 * ------------------------------------------------------------- */
export async function validateTemplateJSON(
	jsonPath: string,
): Promise<TemplateValidationResult> {
	const errors: string[] = [];
	const warnings: string[] = [];

	let json: any;

	try {
		json = await fs.readJSON(jsonPath);
	} catch (err) {
		errors.push(`Failed to parse ${jsonPath}: ${(err as Error).message}`);
		return { ok: false, errors, warnings };
	}

	/* ----------------------------
	 * Required structure
	 * ---------------------------- */
	if (!json.name) {
		warnings.push(`Missing "name" field in appinit.template.json`);
	}

	if (json.prompts && !Array.isArray(json.prompts)) {
		errors.push(`"prompts" must be an array`);
	}

	if (json.prompts) {
		for (const p of json.prompts) {
			const r = validatePromptQuestion(p);
			errors.push(...r.errors);
			warnings.push(...r.warnings);
		}
	}

	if (json.promptPacks && !Array.isArray(json.promptPacks)) {
		errors.push(`"promptPacks" must be an array`);
	}

	if (json.promptPacks) {
		for (const pack of json.promptPacks) {
			if (typeof pack !== "string") {
				errors.push(`promptPacks entries must be paths (string)`);
			}
		}
	}

	return {
		ok: errors.length === 0,
		errors,
		warnings,
	};
}

/* -------------------------------------------------------------
 * Validate TS/JS prompt module
 * ------------------------------------------------------------- */
export async function validatePromptModule(
	modulePath: string,
): Promise<TemplateValidationResult> {
	const errors: string[] = [];
	const warnings: string[] = [];

	let mod;
	try {
		mod = await import(modulePath);
	} catch (err) {
		errors.push(
			`Failed to import module: ${modulePath} — ${(err as Error).message}`,
		);
		return { ok: false, errors, warnings };
	}

	const maybePack = mod.pack ?? mod.default ?? mod;

	if (!maybePack) {
		errors.push(`Module ${modulePath} does not export a PromptPack`);
		return { ok: false, errors, warnings };
	}

	const result = validatePromptPack(maybePack);
	errors.push(...result.errors);
	warnings.push(...result.warnings);

	return { ok: errors.length === 0, errors, warnings };
}

/* -------------------------------------------------------------
 * Validate a PromptPack object
 * ------------------------------------------------------------- */
export function validatePromptPack(pack: PromptPack): TemplateValidationResult {
	const errors: string[] = [];
	const warnings: string[] = [];

	if (!pack.name || typeof pack.name !== "string") {
		errors.push(`PromptPack missing valid "name" property`);
	}

	if (typeof pack.handler !== "function") {
		errors.push(`PromptPack "${pack.name}" missing valid "handler()"`);
	}

	if (pack.priority && typeof pack.priority !== "number") {
		errors.push(`PromptPack "${pack.name}" has invalid "priority"`);
	}

	return { ok: errors.length === 0, errors, warnings };
}

/* -------------------------------------------------------------
 * Validate a PromptQuestion (Clack compatible normalization)
 * ------------------------------------------------------------- */
export function validatePromptQuestion(
	q: Partial<PromptQuestion>,
): TemplateValidationResult {
	const errors: string[] = [];
	const warnings: string[] = [];

	// type is required
	if (!q.type) {
		errors.push(`Prompt question missing "type" field: ${JSON.stringify(q)}`);
		return { ok: false, errors, warnings };
	}

	// name required
	if (!q.name) {
		errors.push(`Prompt "${q.type}" missing "name"`);
	}

	// message required
	if (!q.message) {
		warnings.push(`Prompt "${q.name}" has no "message"`);
	}

	// Clack select types require options
	if (q.type === "select" || q.type === "multiselect") {
		if (!Array.isArray(q.options) && !Array.isArray((q as any).choices)) {
			errors.push(
				`Select prompt "${q.name}" must include "options[]" (Clack), got none`,
			);
		} else {
			// Validate each choice
			const opts = q.options ?? (q as any).choices;
			for (const opt of opts) {
				if (!opt.value) {
					errors.push(`Select option missing "value": ${JSON.stringify(opt)}`);
				}
			}
		}
	}

	// toggle/confirm cannot have choices/options
	if ((q.type === "confirm" || q.type === "toggle") && q.options) {
		warnings.push(
			`Confirm/toggle prompt "${q.name}" should not contain options[]`,
		);
	}

	return { ok: errors.length === 0, errors, warnings };
}
