import { EngineContext } from "@appinit/types";

export async function runBeforeHooks(ctx: EngineContext) {
	console.log("BEFORE", typeof ctx.template.hooks?.before);
	if (!ctx.template.hooks?.before) return;
	await ctx.template.hooks.before?.(ctx);
}
