import { EngineContext, TemplateContext } from "@appinit/types";
import { minimatch } from "minimatch";

/**
 * Apply filters
 * @param ctx
 * @returns
 */
export function applyFilters(engine: EngineContext) {
	const filters = engine.template.templateModule?.filters;
	if (!filters) return;

	const tctx = toTemplateCtx(engine);

	for (const [file] of engine.template.files!) {
		for (const pattern of Object.keys(filters)) {
			if (minimatch(file, pattern)) {
				const include = filters[pattern](tctx, file);
				if (!include) engine.template.files!.delete(file);
			}
		}
	}
}

export function toTemplateCtx(engine: EngineContext): TemplateContext {
	return {
		targetDir: engine.targetDir,
		projectName: engine.answers.projectName!,
		language: engine.answers.language!,
		answers: engine.answers,
		variables: engine.variables,
		files: engine.template.files!,
		log: engine.log,
		framework: engine.answers.framework!,
		ui: engine.answers.ui,
		inlineVariables: engine.template.inlineVariables ?? {},
		tempDir: engine.template.tempDir,
		templateDir: engine.template.templateDir,
		meta: engine.template.meta!,
		utils: engine.utils!,
	};
}
