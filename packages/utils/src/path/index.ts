// packages/@appinit/utils/path.ts

import path from "node:path";

/**
 * Normalize path to POSIX (always uses `/` separators).
 * Useful for template paths, manifests, cross-platform operations.
 */
export function normalizeToPosix(p: string): string {
	return p.replace(/\\/g, "/");
}

/**
 * Resolve a path from a given cwd.
 */
export function resolveFrom(cwd: string, target: string): string {
	return path.resolve(cwd, target);
}

/**
 * Join paths and normalize to POSIX for consistency.
 */
export function joinPath(base: string, target: string): string {
	return normalizeToPosix(path.join(base, target));
}

/**
 * Resolve and normalize to POSIX.
 * The most common usage in Appinit.
 */
export function resolvePosix(cwd: string, target: string): string {
	return normalizeToPosix(path.resolve(cwd, target));
}
