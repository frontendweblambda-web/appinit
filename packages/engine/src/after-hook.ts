import { EngineContext } from "@appinit/types";

export async function runAfterHooks(ctx: EngineContext) {
	if (!ctx.template.hooks?.after) return;
	await ctx.template.hooks.after?.(ctx);
}
