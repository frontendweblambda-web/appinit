import { PromptResult, TemplateMeta } from "@appinit/types";

export function normalizeAnswers(input: PromptResult) {
	const out: PromptResult = { ...input };

	// Example normalizations:
	if (out.language === "typescript") out.language = "typescript";
	if (out.language === "javascript") out.language = "javascript";

	if (!out.projectName) throw new Error("projectName is required");

	return out;
}

export function extractDefaultsFromMeta(
	meta: TemplateMeta,
): Partial<PromptResult> {
	if (!meta.prompts) return {};

	const out: Record<string, any> = {};
	for (const q of meta.prompts) {
		if (q.default !== undefined) {
			out[q.name] = q.default;
		}
	}
	return out;
}
