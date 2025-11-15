import { askText, askSelect, askConfirm, askMulti } from "./helpers";

import type {
	PromptQuestion,
	PromptResult,
	PromptContext,
} from "@appinit/types";

/**
 * Runs an array of question objects and returns a Partial<Answers>.
 */
export async function askAnswers(
	questions: PromptQuestion[],
	initial: PromptResult = {},
	ctx?: PromptContext,
): Promise<PromptResult> {
	const result: PromptResult = { ...initial };

	for (const q of questions) {
		// Conditional prompt
		if (typeof q.when === "function") {
			const shouldAsk = await q.when(result);
			if (!shouldAsk) continue;
		}

		let value: any;

		switch (q.type) {
			case "text":
				value = await askText(q);
				break;

			case "select":
				value = await askSelect(q, result);
				break;

			case "confirm":
			case "toggle":
				value = await askConfirm(q);
				break;

			case "multiselect":
				value = await askMulti(q, result);
				break;

			default:
				throw new Error(`Unsupported prompt type "${q ? q.type : ""}"`);
		}

		// Validation
		if (typeof q.validate === "function") {
			const v = await q.validate(value);
			if (v !== true) {
				throw new Error(`Validation failed for "${q.name}": ${v}`);
			}
		}

		// Format value
		if (typeof q.format === "function") {
			value = q.format(value);
		}

		// SAFE ASSIGNMENT
		result[q.name] = value;
	}

	return result;
}
