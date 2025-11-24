import { getPackageManager } from "@appinit/core";
import type { AppEngineContext } from "@appinit/types";

export async function installDependencies(ctx: AppEngineContext) {
	const pm = ctx.variables.packageManager || "npm";
	const cwd = ctx.paths.targetRoot;
	const logger = ctx.logger;

	logger.info(`📦 Installing dependencies using ${pm}...`);

	try {
		const pkg = await getPackageManager(pm, cwd);

		logger.message(`⏳ Running "${pm} install" in ${cwd}...`);

		await pkg.install(); // ✅ THIS ALONE INSTALLS EVERYTHING

		logger.success("✅ Dependencies installed successfully!");
	} catch (err: any) {
		logger.error("❌ Failed to install dependencies.");
		logger.error(err?.message || String(err));
		logger.error(
			"You may install manually: npm install / pnpm install / yarn / bun install",
		);
	}
}
