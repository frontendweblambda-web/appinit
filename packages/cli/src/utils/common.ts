import { PromptResult } from "@appinit/types";

export function normalizeAnswers(input: PromptResult) {
	const out: PromptResult = { ...input };

	console.log("INput", input);
	// Example normalizations:
	if (out.language === "typescript") out.language = "typescript";
	if (out.language === "javascript") out.language = "javascript";

	if (!out.projectName) throw new Error("projectName is required");

	return out;
}
