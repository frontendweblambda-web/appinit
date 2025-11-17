import { Flags, PromptResult } from "@appinit/types";
import { camel } from "@appinit/utils";

const FLAG_TO_ANSWER_MAP: Record<string, string> = {
	framework: "framework",
	f: "framework",
	stack: "backend",
	lang: "language",
	language: "language",
	template: "templateId",
	"package-manager": "packageManager",
	pm: "packageManager",
	"non-interactive": "nonInteractive",
	"skip-install": "autoInstall", // inverted later
};

export function getValuesFromFlags(flags: Flags): Partial<PromptResult> {
	const out: Partial<PromptResult> = {};

	for (const [flagKey, answerKey] of Object.entries(FLAG_TO_ANSWER_MAP)) {
		// flag already camelized in your parser -> adjust if needed
		const key = camel(flagKey);
		if (flags[key] !== undefined) {
			out[answerKey] = flags[key];
		}
	}

	console.log("OUT", out);

	return out;
}
