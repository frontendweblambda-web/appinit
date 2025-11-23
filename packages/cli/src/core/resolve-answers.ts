import { AppinitConfig } from "@appinit/types";

import { runPromptEngine } from "@appinit/prompt";
import { joinPath } from "@appinit/utils";
import { formatError } from "../../../core/src/utils/format-error";
import { normalizeAnswers } from "../utils/common";
import { projectMetaValidation } from "../validation/project-meta.validation";

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
		config.answers = { ...config.answers, ...result };
	}

	// console.log("MERGE CTX AND RESULT", ctx);
	// 5️⃣ Validate answers (non-interactive must error)
	const parsed = projectMetaValidation.safeParse({
		projectName: config.answers?.projectName,
		projectType: config.answers?.projectType,
		template: config.answers?.template,
	});

	if (!parsed.success) {
		config.log?.error(formatError(parsed.error));
		process.exit(1);
	}

	config.answers = normalizeAnswers(config.answers!);
	config.targetDir = joinPath(config.cwd, config.answers?.projectName!);

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
