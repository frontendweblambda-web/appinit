import { AppinitConfig } from "@appinit/types";

import { runPromptEngine } from "@appinit/prompt";
import { normalizeAnswers } from "../utils/common";

/**
 * resolve answers
 * @param config
 * @returns
 */
export async function resolveAnswers(
	config: AppinitConfig,
): Promise<AppinitConfig> {
	const interactive = config.interactive;
	// 2️⃣ Apply previous config (if enabled)
	// if (!ctx.flags.ignoreConfig && ctx.config) {
	// 	merge(ctx.answers!, ctx.config);
	// }

	// 3️⃣ Apply template defaults
	// if (ctx.templateMeta?.prompts) {
	// 	merge(ctx.answers!, extractDefaultsFromMeta(ctx.templateMeta));
	// }

	// 4️⃣ Prompt only missing values
	if (interactive) {
		const result = await runPromptEngine(config);
		// console.log("RE", ctx, result);
		config.promptResult = { ...config.promptResult, ...result };
	}

	// console.log("MERGE CTX AND RESULT", ctx);
	// 5️⃣ Validate answers (non-interactive must error)
	// validateRequiredAnswers(ctx, interactive);
	console.log("CONFIG", config);
	config.promptResult = normalizeAnswers(config.promptResult!);

	// Store back to ctx so other systems use normalized values

	// 6️⃣ Normalize final shape
	return config;
}

// function validateRequiredAnswers(config: AppinitConfig, interactive: boolean) {
// 	const type = (config.projectMeta.projectName &&
// 		config.promptResult?.projectType) as keyof typeof REQUIRED_BY_TYPE;
// 	if (!type) {
// 		throw new Error(`projectType is required but missing`);
// 	}
// 	const required = REQUIRED_BY_TYPE[type];
// 	const missing = required.filter(
// 		(key) => config.promptResult?.projectType![key] === undefined,
// 	);
// 	if (!interactive && missing.length > 0) {
// 		throw new Error(
// 			`Missing required values: ${missing.join(", ")}\n` +
// 				`Provide them via flags or run in interactive mode.`,
// 		);
// 	}
// }
