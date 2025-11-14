// packages/prompt/src/dynamic-loader.ts
import fs from "fs-extra";
import path from "node:path";
import { logger } from "@appinit/utils";
import type {
	PromptContext,
	PromptPack,
	PromptPackDefinition,
	PromptResult,
	PromptQuestion,
} from "@appinit/types";

import { askAnswers } from "./prompt.js";

/* -------------------------------------------------------------
 * Default filenames to scan in template directories
 * ------------------------------------------------------------- */
const DEFAULT_MODULE_FILENAMES = [
	"prompt.js",
	"prompt.ts",
	"prompt.cjs",
	"prompt.mjs",
	"prompt.mts",
];

const DEFAULT_JSON_FILENAME = "appinit.template.json";

/* -------------------------------------------------------------
 * MAIN LOADER
 * ------------------------------------------------------------- */
export async function loadDynamicPromptPacks(
	ctx: PromptContext,
): Promise<PromptPack[]> {
	const packs: PromptPack[] = [];

	/* -----------------------------
	 * 1. templatePromptPacks (explicit)
	 * ----------------------------- */
	if (Array.isArray(ctx.templatePromptPacks)) {
		for (const def of ctx.templatePromptPacks) {
			try {
				const pack = await loadPackDefinition(def as PromptPackDefinition, ctx);
				if (pack) packs.push(pack);
			} catch (err) {
				logger.error(
					`Failed to load dynamic prompt pack:`,
					(err as Error).message,
				);
			}
		}
	}

	/* -----------------------------
	 * 2. Scan template root
	 * ----------------------------- */
	const templateRoot = ctx.templateMeta?.__rootPath as string | undefined;

	if (templateRoot) {
		// 2.a JSON spec: appinit.template.json
		const jsonPath = path.join(templateRoot, DEFAULT_JSON_FILENAME);

		if (await fs.pathExists(jsonPath)) {
			try {
				const json = await fs.readJSON(jsonPath);

				/* simple JSON-based prompts */
				if (Array.isArray(json.prompts) && json.prompts.length > 0) {
					packs.push(
						jsonPromptsToPack(
							json.prompts,
							json.name ?? "template-json-prompts",
						),
					);
				}

				/* promptPack modules */
				if (Array.isArray(json.promptPacks)) {
					for (const rel of json.promptPacks) {
						const abs = path.join(templateRoot, rel);

						try {
							const pack = await loadPackFromPath(abs, ctx);
							if (pack) packs.push(pack);
						} catch (err) {
							logger.error(
								`Failed to load prompt pack ${abs}:`,
								(err as Error).message,
							);
						}
					}
				}
			} catch (err) {
				logger.error(`Failed to parse template JSON:`, (err as Error).message);
			}
		}

		// 2.b auto-discover prompt.js/prompt.ts/etc
		for (const fname of DEFAULT_MODULE_FILENAMES) {
			const abs = path.join(templateRoot, fname);
			if (await fs.pathExists(abs)) {
				try {
					const pack = await loadPackFromPath(abs, ctx);
					if (pack) packs.push(pack);
				} catch (err) {
					logger.error(`Failed to load ${abs}:`, (err as Error).message);
				}
			}
		}
	}

	/* -----------------------------
	 * Dedupe & sort
	 * ----------------------------- */
	const deduped = dedupeAndSortPacks(packs);
	logger.info(`Loaded ${deduped.length} dynamic prompt pack(s).`);

	return deduped;
}

/* -------------------------------------------------------------
 * Load a JS/TS module that exports a prompt pack
 * ------------------------------------------------------------- */
async function loadPackFromPath(
	filePath: string,
	ctx: PromptContext,
): Promise<PromptPack | null> {
	const abs = path.isAbsolute(filePath)
		? filePath
		: path.resolve(process.cwd(), filePath);

	if (!(await fs.pathExists(abs))) return null;

	try {
		const mod = await import(abs);

		const maybePack = mod.pack ?? mod.default ?? mod;

		/* case 1: module exports prompts[] directly */
		if (Array.isArray(maybePack?.prompts) || Array.isArray(mod.prompts)) {
			const prompts = maybePack.prompts ?? mod.prompts;
			return jsonPromptsToPack(prompts, path.basename(abs));
		}

		/* case 2: module exports a function (legacy pack) */
		if (typeof maybePack === "function") {
			return {
				name: path.basename(abs),
				handler: async (ctx2, accum) => maybePack(ctx2, accum),
			};
		}

		/* case 3: module exports a correct PromptPack */
		if (
			maybePack &&
			typeof maybePack === "object" &&
			typeof maybePack.handler === "function"
		) {
			if (!maybePack.name) {
				maybePack.name = path.basename(abs);
			}
			return maybePack as PromptPack;
		}

		logger.error(`Module ${abs} did not export a valid prompt pack.`);
		return null;
	} catch (err) {
		logger.error(`Dynamic import failed for ${abs}:`, (err as Error).message);
		throw err;
	}
}

/* -------------------------------------------------------------
 * Convert JSON prompts (user template) → PromptPack
 * ------------------------------------------------------------- */
function jsonPromptsToPack(
	promptsArray: any[],
	name = "json-prompts",
): PromptPack {
	const normalized = promptsArray.map(normalizeJsonPrompt);

	return {
		name,
		priority: 100,
		handler: async (_ctx, accum: PromptResult) => {
			return askAnswers(normalized as PromptQuestion[], accum);
		},
	};
}

/* -------------------------------------------------------------
 * Normalize JSON prompt structure for Clack
 * ------------------------------------------------------------- */
function normalizeJsonPrompt(q: any): PromptQuestion {
	const out: any = { ...q };

	// title → label
	if (q.title && !q.label) out.label = q.title;

	// Clack uses initialValue instead of initial
	if (q.initial !== undefined && !q.initialValue) {
		out.initialValue = q.initial;
	}

	// Inquirer choices[] → Clack options[]
	if (Array.isArray(q.choices) && !q.options) {
		out.options = q.choices.map((c: any) => ({
			label: c.label ?? c.title ?? c.value,
			value: c.value,
		}));
	}

	// delete unsupported fields
	delete out.title;
	delete out.choices;

	return out as PromptQuestion;
}

/* -------------------------------------------------------------
 * Dedupe prompt packs by name (later overrides earlier)
 * ------------------------------------------------------------- */
function dedupeAndSortPacks(packs: PromptPack[]): PromptPack[] {
	const map = new Map<string, PromptPack>();

	for (const p of packs) {
		if (!p?.name) continue;
		const existing = map.get(p.name);

		if (!existing) {
			map.set(p.name, p);
			continue;
		}

		const prioNew = p.priority ?? 100;
		const prioOld = existing.priority ?? 100;

		if (prioNew <= prioOld) map.set(p.name, p);
	}

	return Array.from(map.values()).sort(
		(a, b) => (a.priority ?? 100) - (b.priority ?? 100),
	);
}

/* -------------------------------------------------------------
 * Parse PromptPackDefinition from templatePromptPacks[]
 * ------------------------------------------------------------- */
async function loadPackDefinition(
	def: PromptPackDefinition,
	ctx: PromptContext,
): Promise<PromptPack | null> {
	// 1. Direct object
	if ((def as any).handler && (def as any).name) {
		return def as PromptPack;
	}

	// 2. Module reference
	if ("type" in def && def.type === "module") {
		return await loadPackFromPath(def.path, ctx);
	}

	// 3. JSON reference
	if ("type" in def && def.type === "json") {
		const abs = path.isAbsolute(def.path)
			? def.path
			: path.resolve(process.cwd(), def.path);

		if (!(await fs.pathExists(abs))) {
			logger.error(`JSON prompt pack not found: ${abs}`);
			return null;
		}

		const json = await fs.readJSON(abs);

		if (!Array.isArray(json.prompts)) {
			logger.error(`Invalid JSON pack at ${abs}: missing prompts[]`);
			return null;
		}

		return jsonPromptsToPack(json.prompts, path.basename(abs));
	}

	logger.error("Invalid PromptPackDefinition:", def);
	return null;
}
