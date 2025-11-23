import { getPackageManager, runCommand } from "@appinit/core";
import { EngineContext, PromptResult, ResolvedTemplate } from "@appinit/types";

/**
 * Engine context
 * @param targetDir
 * @param ctx
 * @param template
 * @returns
 */
export async function engineContext(
	targetDir: string,
	ctx: PromptResult,
	template: ResolvedTemplate,
): Promise<EngineContext> {
	// user selected package manager OR default to npm
	const pmName = ctx.packageManager ?? "npm";

	const packageManager = await getPackageManager(pmName, targetDir);

	return {
		targetDir,
		files: template.files,
		template,
		pkg: packageManager,
		answers: ctx,
		run: runCommand,
	};
}
