import { askText, askSelect, askConfirm, askMulti } from "./helpers";

import type { PromptQuestion, PromptResult } from "@appinit/types";
/**
 * Runs an array of question objects and returns a Partial<Answers>.
 * Compatible with:
 *   - Built-in packs (metaPack, gitPack, etc.)
 *   - Template JSON-based packs (dynamic-loader)
 *   - Plugin-provided packs
 *   - Validation, formatting, conditional prompts
 */
export async function askAnswers(
	questions: PromptQuestion[],
	initial: PromptResult = {},
): Promise<PromptResult> {
	const result: PromptResult = { ...initial };

	for (const q of questions) {
		const {
			type,
			name,
			message,
			initial: initialValue,
			validate,
			format,
			when,
			choices,
			options,
		} = q;

		// Handle conditional execution
		if (typeof when === "function") {
			const shouldRun = await when(result);
			if (!shouldRun) continue;
		}

		let value: any;

		switch (type) {
			case "text": {
				value = await askText(message, initialValue);

				if (typeof validate === "function") {
					const v = await validate(value);
					if (v !== true) {
						// TODO: re-ask or warning
					}
				}

				if (typeof format === "function") {
					value = format(value);
				}
				break;
			}

			case "select":
				value = await askSelect(message, choices ?? options ?? []);
				break;

			case "confirm":
			case "toggle":
				value = await askConfirm(message, initialValue ?? true);
				break;

			case "multiselect":
				value = await askMulti(message, choices ?? options ?? []);
				break;

			default:
				throw new Error(`Unsupported prompt type "${type}"`);
		}

		// FIX: Safe dynamic assignment
		(result as Record<string, any>)[name] = value;
	}

	return result;
}
