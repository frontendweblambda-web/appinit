import { EngineContext } from "@appinit/types";

import { toTemplateCtx } from "./apply-filters";

export async function transformFiles(
	ctx: EngineContext,
	vars: Record<string, any>,
) {
	if (!ctx.template.templateConfig?.variables?.transform) return;

	const tctx = toTemplateCtx(ctx);

	await ctx.template.templateConfig?.variables.transform(vars, tctx);
}
