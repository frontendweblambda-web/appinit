import { AppEngineContext } from "@appinit/types";

export async function runAfterHook(
	ctx: AppEngineContext,
	afterHook?: (ctx: AppEngineContext) => any | Promise<any>,
) {
	const logger = ctx.logger;

	if (!afterHook) {
		logger.info("⏭️ No after hook to run.");
		return;
	}

	logger.info("✨ Running after hook...");

	try {
		await afterHook(ctx);
		logger.success?.("🎉 After hook completed.");
	} catch (err: any) {
		logger.error("❌ Error in after hook:");
		logger.error(err?.message ?? String(err));
		// Do NOT abort — afterHook is optional
	}
}
