import { normalizePath } from "./normalize-path";

/**
 * Apply rename rules from template.config.resolvers.rename
 *
 * Example:
 *   "_gitignore" → ".gitignore"
 *   "env.example" → ".env"
 *
 * NOTE: Non-breaking — only last path segment is affected.
 */
export function applyRename(
	filePath: string,
	rename: Record<string, string> = {},
): string {
	if (!filePath) return filePath;

	// Normalize OS-specific paths -> unix-like
	const norm = normalizePath(filePath);

	// Split into folder segments
	const segments = norm.split("/");

	const last = segments[segments.length - 1];

	// Only rename exact filename matches (non-breaking behavior)
	if (rename && Object.prototype.hasOwnProperty.call(rename, last)) {
		segments[segments.length - 1] = rename[last];
	}

	return segments.join("/");
}
