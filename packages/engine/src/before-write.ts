export async function runBeforeWrite(ctx: any) {
	if (ctx.templateModule?.beforeWrite) {
		await ctx.templateModule.beforeWrite(ctx);
	}
}
