import { EngineContext } from "@appinit/types";
import { toTemplateCtx } from "./apply-filters";
export async function applyVariable(engine: EngineContext) {
	const { defaults, schema, transform } = engine.template.variables!;

	// 1. defaults
	let vars = defaults.default ?? {};

	// 2. user answers
	vars = { ...vars, ...engine.answers };

	// 3. template logic variables()
	if (engine.template.templateModule?.variables) {
		const tctx = toTemplateCtx(engine);
		vars = {
			...vars,
			...(await engine.template.templateModule.variables(tctx)),
		};
	}

	// 4. inline command-line overrides
	if (engine.template.inlineVariables) {
		vars = { ...vars, ...engine.template.inlineVariables };
	}

	// 5. custom transform.ts
	if (transform?.transform) {
		vars = await transform.transform(vars, engine);
	}

	engine.variables = vars;
}
