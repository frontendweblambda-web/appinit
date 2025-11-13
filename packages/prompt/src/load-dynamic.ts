// packages/prompt/src/dynamic-loader.ts
import fs from "fs-extra";
import path from "node:path";
import { logger } from "@appinit/utils";
import type {
	PromptContext,
	PromptPack,
	PromptPackDefinition,
	PromptResult,
} from "@appinit/types";
import { askAnswers } from "./prompt.js";

const DEFAULT_MODULE_FILENAMES = [
	"prompt.js",
	"prompt.ts",
	"prompt.cjs",
	"prompt.mjs",
	"prompt.mts",
];
const DEFAULT_JSON_FILENAME = "appinit.template.json";

/**
 * Load dynamic packs declared in ctx.templateMeta or ctx.templatePromptPacks
 */
export async function loadDynamicPromptPacks(
	ctx: PromptContext,
): Promise<PromptPack[]> {
	const packs: PromptPack[] = [];

	// 1) If templatePromptPacks is explicitly provided (already resolved by template-resolver)
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

	// 2) If templateMeta has file references (common when resolver points to template root)
	const templateRoot = ctx.templateMeta?.__rootPath as string | undefined;
	if (templateRoot) {
		// 2.a) look for appinit.template.json
		const jsonPath = path.join(templateRoot, DEFAULT_JSON_FILENAME);
		if (await fs.pathExists(jsonPath)) {
			try {
				const json = await fs.readJSON(jsonPath);
				// If it contains a `prompts` array (simple), wrap into pack
				if (Array.isArray(json.prompts) && json.prompts.length) {
					packs.push(
						jsonPromptsToPack(
							json.prompts,
							json.name ?? "template-json-prompts",
						),
					);
				}

				// Optionally template may declare script packs list
				if (Array.isArray(json.promptPacks)) {
					for (const rel of json.promptPacks) {
						const p = path.join(templateRoot, rel);
						try {
							const pack = await loadPackFromPath(p, ctx);
							if (pack) packs.push(pack);
						} catch (err) {
							logger.error(
								`Failed to load prompt pack ${p}:`,
								(err as Error).message,
							);
						}
					}
				}
			} catch (err) {
				logger.error(
					"Failed to parse template JSON prompts:",
					(err as Error).message,
				);
			}
		}

		// 2.b) auto-scan default filenames like prompt.js / prompt.ts
		for (const fname of DEFAULT_MODULE_FILENAMES) {
			const p = path.join(templateRoot, fname);
			if (await fs.pathExists(p)) {
				try {
					const pack = await loadPackFromPath(p, ctx);
					if (pack) packs.push(pack);
				} catch (err) {
					logger.error(`Failed to load ${p}:`, (err as Error).message);
				}
			}
		}
	}

	// dedupe by name (later packs can override earlier by name)
	const deduped = dedupeAndSortPacks(packs);
	logger.info(`Loaded ${deduped.length} dynamic prompt pack(s).`);
	return deduped;
}

/** Load a module (js/ts) that exports either `pack` or default or `prompts` */
async function loadPackFromPath(
	filePath: string,
	ctx: PromptContext,
): Promise<PromptPack | null> {
	const abs = path.isAbsolute(filePath)
		? filePath
		: path.resolve(process.cwd(), filePath);
	if (!(await fs.pathExists(abs))) return null;

	// dynamic import — wrap in try/catch
	try {
		const mod = await import(abs);
		// First: module exports `pack` or `default` object with handler
		const maybePack = mod.pack ?? mod.default ?? mod;
		// If module exported array `prompts`, wrap it
		if (Array.isArray(maybePack?.prompts) || Array.isArray(mod.prompts)) {
			const promptsArray = maybePack.prompts ?? mod.prompts;
			return jsonPromptsToPack(promptsArray, path.basename(abs));
		}

		// If module is a function (old pack), wrap as handler
		if (typeof maybePack === "function") {
			return {
				name: path.basename(abs),
				handler: async (ctx2, accum) => maybePack(ctx2, accum),
			};
		}

		// If module exported a prompt pack-like object, validate
		if (
			maybePack &&
			typeof maybePack === "object" &&
			typeof maybePack.handler === "function"
		) {
			// ensure name
			if (!maybePack.name) maybePack.name = path.basename(abs);
			return maybePack as PromptPack;
		}

		logger.error(`Module ${abs} did not export a valid prompt pack.`);
		return null;
	} catch (err) {
		logger.error(`Dynamic import failed for ${abs}:`, (err as Error).message);
		throw err;
	}
}

/** Convert a plain prompts array (prompts library format) into a PromptPack */
function jsonPromptsToPack(
	promptsArray: any[],
	name = "json-prompts",
): PromptPack {
	return {
		name,
		priority: 100,
		handler: async (_ctx, accum: PromptResult) => {
			// use askAnswers to return Partial<Answers>
			const res = await askAnswers(promptsArray, accum as any);
			return res;
		},
	};
}

/** Deduplicate packs by name and sort by priority */
function dedupeAndSortPacks(packs: PromptPack[]): PromptPack[] {
	const map = new Map<string, PromptPack>();
	for (const p of packs) {
		if (!p?.name) continue;
		// if existing, prefer higher priority (lower number wins)
		const existing = map.get(p.name);
		if (!existing) {
			map.set(p.name, p);
			continue;
		}
		const exPriority = existing.priority ?? 100;
		const pPriority = p.priority ?? 100;
		// choose the one with lower priority number (earlier)
		if (pPriority <= exPriority) map.set(p.name, p);
	}

	// sort by priority asc
	return Array.from(map.values()).sort(
		(a, b) => (a.priority ?? 100) - (b.priority ?? 100),
	);
}

async function loadPackDefinition(
	def: PromptPackDefinition,
	ctx: PromptContext,
): Promise<PromptPack | null> {
	// 1) Already a full PromptPack
	if ((def as any).handler && (def as any).name) {
		return def as PromptPack;
	}

	// 2) A module reference { type: "module", path }
	if ("type" in def && def.type === "module") {
		const pack = await loadPackFromPath(def.path, ctx);
		if (!pack) {
			logger.error(`Failed to load module prompt pack at: ${def.path}`);
		}
		return pack;
	}

	// 3) A JSON reference { type: "json", path }
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
