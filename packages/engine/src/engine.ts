// packages/engine
import { setupGracefulExit } from "./common/exit";

import { AppinitConfig, ResolvedTemplate } from "@appinit/types";
import { applyFilters } from "./apply-filters";
import { engineContext } from "./context";

/**
 * Start engine
 * @param answers
 */
export async function startEngine(
	config: AppinitConfig,
	template: ResolvedTemplate,
): Promise<void> {
	setupGracefulExit();
	const { answers, targetDir } = config;

	const eCtx = await engineContext(targetDir!, answers!, template);

	// console.log("--------------", config, eCtx);
	// // Template pipeline
	applyFilters(eCtx);
	// await applyVariable(eCtx);
	// applyRename(eCtx);
	// await transformFiles(eCtx);
	// await renderTemplates(eCtx);
	// await runBeforeHooks(eCtx);

	// // ---------------------------
	// // 🟦 SPINNER #1 – Writing Files
	// // ---------------------------
	// const writeSpin = spinner();
	// writeSpin.start("Writing project files...");
	// await writeFilesToDisk(eCtx);
	// writeSpin.stop("Files written.");

	// // -------------------------------
	// // 🟩 SPINNER #2 – Installing Deps
	// // -------------------------------
	// const installSpin = spinner();
	// installSpin.start("Installing dependencies...");
	// await runPackageInstall(eCtx);
	// installSpin.stop("Dependencies installed.");

	// // Run final hooks
	// await runAfterHooks(eCtx);
}
