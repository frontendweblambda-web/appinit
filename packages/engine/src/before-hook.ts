import { EngineContext } from "@appinit/types";

export async function runBeforeHooks(ctx: EngineContext) {
	if (!ctx.template.hooks?.before) return;
	await ctx.template.hooks.before?.(ctx);
}
