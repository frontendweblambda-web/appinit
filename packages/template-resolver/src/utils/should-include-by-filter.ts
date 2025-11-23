import { TemplateContext } from "@appinit/types";
import { minimatch } from "minimatch";

/**
 *
 * @param filePath
 * @param filters
 * @param ctx
 * @returns
 */
export function shouldIncludeByFilters(
	filePath: string,
	filters: Record<string, (ctx: TemplateContext, file: string) => boolean>,
	ctx: any,
): boolean {
	if (!filters || typeof filters !== "object") return true;

	for (const [pattern, fn] of Object.entries(filters)) {
		if (!fn || typeof fn !== "function") continue;

		if (minimatch(filePath, pattern, { dot: true })) {
			// 🚀 Correct ATS signature: fn(ctx, filePath)
			const ok = fn(ctx, filePath);
			if (!ok) return false;
		}
	}

	return true;
}
