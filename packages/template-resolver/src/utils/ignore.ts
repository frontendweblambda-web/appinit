import { minimatch } from "minimatch";

/**
 * Ignore patterns
 * @param filePath
 * @param patterns
 * @returns
 */
export function shouldIgnore(filePath: string, patterns: string[]): boolean {
	for (const pattern of patterns ?? []) {
		if (minimatch(filePath, pattern, { dot: true })) {
			return true;
		}
	}
	return false;
}
