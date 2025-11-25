import {
	AppInitModule,
	ModuleMeta,
	ResolvedModuleSource,
} from "@appinit/types";
import { checkAccess, readFileUtf8 } from "@appinit/utils";
import path from "node:path";
import { pathToFileURL } from "node:url";
const MODULE_JSON = "module.json";
/**
 * Main module resolver.
 *
 * Accepts:
 *  - string name (e.g. "tailwind" or "@appinit/module-tailwind")
 *  - explicit object with path/type (future)
 *  - already ResolvedModuleSource (shortcut)
 */
export async function resolveModule(
	source: string | ResolvedModuleSource,
	opts?: { projectRoot?: string },
): Promise<ResolvedModuleSource> {
	// 1. Already resolved
	if (typeof source !== "string") {
		return source;
	}

	const projectRoot = opts?.projectRoot ?? process.cwd();

	// 2. If string looks like explicit path → treat as local dir
	if (looksLikePath(source)) {
		const abs = path.isAbsolute(source)
			? source
			: path.resolve(projectRoot, source);

		return createResolvedFromDir(abs, "local");
	}

	// Normalize module name
	const name = source.trim();

	// 3. Project-local modules: <projectRoot>/modules/<name>
	const projectModuleDir = path.join(projectRoot, "modules", name);
	try {
		return await createResolvedFromDir(projectModuleDir, "local");
	} catch {
		// ignore, fallthrough
	}

	// 4. Builtin modules: in this package's modules dir
	const builtinModuleDir = path.join(BUILTIN_MODULES_DIR, name);
	try {
		return await createResolvedFromDir(builtinModuleDir, "template");
	} catch {
		// ignore, fallthrough
	}

	// 5. NPM / node_modules resolution (outline, optional for now)
	// You can later implement:
	// - require.resolve(`${name}/module.json`)
	// - derive rootDir from that
	// For now, we throw a clear error.

	throw new Error(
		`Module "${name}" not found.\n` +
			`Tried:\n` +
			`  - Local path: ${looksLikePath(name) ? name : "(not a path)"}\n` +
			`  - Project modules: ${projectModuleDir}\n` +
			`  - Builtin modules: ${builtinModuleDir}\n` +
			`Later: support npm/git/marketplace.`,
	);
}
const BUILTIN_MODULES_DIR = path.resolve(
	__dirname,
	"../../modules", // e.g. packages/module-engine/modules
);
/**
 * Try to detect if a string is a path (absolute, ./, ../)
 */
function looksLikePath(source: string): boolean {
	if (source.startsWith("./") || source.startsWith("../")) return true;
	if (source.startsWith("/") || /^[A-Za-z]:[\\/]/.test(source)) return true; // Windows drive
	return false;
}

/**
 * Helper: create a ResolvedModuleSource from a directory
 */
async function createResolvedFromDir(
	rootDir: string,
	type: ResolvedModuleSource["type"],
): Promise<ResolvedModuleSource> {
	const metaPath = path.join(rootDir, MODULE_JSON);

	// Basic existence check
	await checkAccess(metaPath);

	// Load meta once to find entry
	const raw = await readFileUtf8(metaPath);
	const meta = JSON.parse(raw) as ModuleMeta;

	const entryRel = meta.entry || "./module.ts";
	const entry = path.resolve(rootDir, entryRel);

	return {
		type,
		path: rootDir,
		metaPath,
		entry,

		async loadMeta(): Promise<ModuleMeta> {
			const json = await readFileUtf8(metaPath);
			return JSON.parse(json) as ModuleMeta;
		},

		async loadEntry(): Promise<AppInitModule> {
			const mod = await import(pathToFileURL(entry).href);
			if (!mod.default) {
				throw new Error(
					`Module entry at ${entry} must export default AppInitModule`,
				);
			}
			return mod.default as AppInitModule;
		},
	};
}
