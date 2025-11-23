import { joinPath, pathExists } from "@appinit/utils";
import { loadFile } from "./loader-file";

/**
 * Fastest possible loader for appinit.template.*
 * - Parallel fs checks
 * - First result wins
 * - No redundant awaits
 * - No extra arrays after startup
 */
export async function loadTemplateModule(templateDir: string) {
	const filenames = [
		"appinit.template.ts",
		"appinit.template.js",
		"appinit.template.mjs",
	];

	// Construct all candidate paths
	const paths = filenames.map((f) => joinPath(templateDir, f));

	// Create a list of async checks that either return a valid path or throw
	const checks = paths.map((p) =>
		pathExists(p).then((ok) => {
			if (ok) return p;
			// Reject so Promise.any skips it
			throw null;
		}),
	);

	let foundPath: string;
	try {
		// ⚡ Promise.any = fastest winner-takes-all race
		foundPath = await Promise.any(checks);
	} catch {
		console.warn(`⚠ No appinit.template.{ts,js,mjs} found in ${templateDir}`);
		return null;
	}

	// Load the module (single async op)
	const mod = await loadFile(foundPath);

	return mod && typeof mod === "object" ? mod : null;
}
