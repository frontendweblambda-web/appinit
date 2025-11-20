// packages/engine
import { setupGracefulExit } from "./common/exit";

import { PromptContext, ResolvedTemplate } from "@appinit/types";
import { spinner } from "@clack/prompts";
import path from "path";
import { runAfterHooks } from "./after-hook";
import { applyFilters } from "./apply-filters";
import { applyRename } from "./apply-rename";
import { runBeforeHooks } from "./before-hook";
import { applyVariable } from "./compute-variables";
import { engineContext } from "./context";
import { renderTemplates } from "./render-template";
import { runPackageInstall } from "./run-package-manager";
import { transformFiles } from "./transform";
import { writeFilesToDisk } from "./write-to-disk";

/**
 * Start engine
 * @param answers
 */
export async function startEngine(
	targetDir: string,
	ctx: PromptContext,
	template: ResolvedTemplate,
): Promise<void> {
	setupGracefulExit();

	const eCtx = await engineContext(targetDir, ctx, template);
	const { files, answers, ...rest } = eCtx;
	const projectName = answers.projectName;
	const projectDir = targetDir ?? path.resolve(process.cwd(), projectName!);

	// Template pipeline
	applyFilters(eCtx);
	await applyVariable(eCtx);
	applyRename(eCtx);
	await transformFiles(eCtx);
	await renderTemplates(eCtx);
	await runBeforeHooks(eCtx);

	// ---------------------------
	// 🟦 SPINNER #1 – Writing Files
	// ---------------------------
	const writeSpin = spinner();
	writeSpin.start("Writing project files...");
	await writeFilesToDisk(eCtx);
	writeSpin.stop("Files written.");

	// -------------------------------
	// 🟩 SPINNER #2 – Installing Deps
	// -------------------------------
	const installSpin = spinner();
	installSpin.start("Installing dependencies...");
	await runPackageInstall(eCtx);
	installSpin.stop("Dependencies installed.");

	// Run final hooks
	await runAfterHooks(eCtx);
}
