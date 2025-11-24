import { AppEngineContext } from "@appinit/types";

export async function runBeforeHook(
	ctx: AppEngineContext,
	beforeHook?: (ctx: AppEngineContext) => any | Promise<any>,
) {
	const logger = ctx.logger;

	if (!beforeHook) {
		logger.info("⏭️ No before hook to run.");
		return;
	}

	logger.info("🚀 Running before hook...");

	try {
		console.log("CTX-HOOK", ctx);
		await beforeHook(ctx);
		logger.info("✅ Before hook completed.");
	} catch (err: any) {
		logger.error("❌ Error in before hook:");

		// display message safely
		if (err?.message) logger.error(err.message);
		else logger.error(String(err));

		// stop engine
		throw new Error("Before hook failed. Aborting project generation.");
	}
}
