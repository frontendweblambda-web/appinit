import { EngineContext } from "@appinit/types";

import { toTemplateCtx } from "./apply-filters";
export async function transformFiles(ctx: EngineContext) {
	if (!ctx.template.templateModule?.transform) return;

	const tctx = toTemplateCtx(ctx);

	await ctx.template.templateModule.transform(tctx);
}
