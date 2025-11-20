export async function runAfterWrite(ctx) {
	if (ctx.templateModule?.afterWrite) {
		await ctx.templateModule.afterWrite(ctx);
	}
}
