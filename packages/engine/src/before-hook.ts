import { EngineContext } from "@appinit/types";

export async function runBeforeHooks(ctx: EngineContext) {
	console.log("HOOK before", ctx.template.hooks);
	if (!ctx.template.hooks?.before) return;
	await ctx.template.hooks.before?.(ctx);
}
