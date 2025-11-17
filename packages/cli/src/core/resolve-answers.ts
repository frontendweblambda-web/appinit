import { Answers, PromptContext, PromptResult } from "@appinit/types";

import { REQUIRED_BY_TYPE } from "../data";
import { runPromptEngine } from "@appinit/prompt";
import { getValuesFromFlags } from "../utils/value-from-flags";
import { isInteractive, merge } from "@appinit/utils";
import { extractDefaultsFromMeta, normalizeAnswers } from "../utils/common";

/**
 * resolve answers
 * @param ctx
 * @returns
 */
export async function resolveAnswers(ctx: PromptContext): Promise<Answers> {
	const interactive = await isInteractive(ctx.flags);

	// console.log("RESOLVE ANSWERS START", ctx);
	// 1️⃣ Apply flags directly
	merge(ctx.answers!, getValuesFromFlags(ctx.flags));

	// 2️⃣ Apply previous config (if enabled)
	if (!ctx.flags.ignoreConfig && ctx.config) {
		merge(ctx.answers!, ctx.config);
	}

	// 3️⃣ Apply template defaults
	if (ctx.templateMeta?.prompts) {
		merge(ctx.answers!, extractDefaultsFromMeta(ctx.templateMeta));
	}

	// 4️⃣ Prompt only missing values
	if (interactive) {
		const result = await runPromptEngine(ctx);
		merge(ctx.answers!, result.answers);
	}

	// console.log("MERGE CTX AND RESULT", ctx);
	// 5️⃣ Validate answers (non-interactive must error)
	validateRequiredAnswers(ctx.answers!, interactive);
	const finalAnswers = normalizeAnswers(ctx.answers!) as Answers;

	// Store back to ctx so other systems use normalized values
	ctx.answers = finalAnswers;
	console.log("RESOLVE ANSWERS END", finalAnswers);
	// 6️⃣ Normalize final shape
	return finalAnswers;
}

function validateRequiredAnswers(answers: PromptResult, interactive: boolean) {
	const type = (answers.projectName &&
		answers.projectType) as keyof typeof REQUIRED_BY_TYPE;
	if (!type) {
		throw new Error(`projectType is required but missing`);
	}
	const required = REQUIRED_BY_TYPE[type];
	const missing = required.filter((key) => answers[key] === undefined);
	if (!interactive && missing.length > 0) {
		throw new Error(
			`Missing required values: ${missing.join(", ")}\n` +
				`Provide them via flags or run in interactive mode.`,
		);
	}
}
