import { Answers, PromptResult, TemplateMeta } from "@appinit/types";

export function normalizeAnswers(input: PromptResult): Answers {
	const out: any = { ...input };

	// Example normalizations:
	if (out.language === "ts") out.language = "typescript";
	if (out.language === "js") out.language = "javascript";

	if (!out.projectName) throw new Error("projectName is required");

	return out as Answers;
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
